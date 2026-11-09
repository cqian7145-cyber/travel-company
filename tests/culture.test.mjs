import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stories,experiences,storySources,cultureRoute,cultureRoutes,wordCount,storyForVenue,isCultureState,emptyCultureState,addVenueToDay} from '../shared/story-catalog.mjs';
import {validateCulture} from '../scripts/validate-stories.mjs';
import {renderCultureBody} from '../shared/culture-render.mjs';
import {cultureOfflineHtml} from '../shared/culture-offline.mjs';
import worker from '../workers/index.mjs';
import {createHandler as nodeHandler} from '../server.mjs';
import {createHandler as deepseekHandler} from '../server-deepseek.mjs';
import http from 'node:http';
import {dataVersion} from '../shared/verification.mjs';
test('three short stories have distinct editorial evidence, five sections and valid relations',()=>{
 assert.equal(stories.length,3);assert.equal(experiences.length,3);assert.deepEqual(validateCulture(stories,experiences,storySources,[],'2026-11-08'),[]);assert.ok(stories.every(s=>wordCount(s)>=200&&wordCount(s)<=350));assert.equal(storyForVenue('xintiandi')[0].id,'shanghai-shikumen-001');assert.equal(storyForVenue('missing').length,0);
});
test('story validation rejects unsourced assertions, unsupported venue IDs and unlicensed imagery',()=>{
 const bad=structuredClone(stories);bad[0].blocks[1].sourceIds=[];bad[0].relatedVenueIds=['invented'];bad[0].image.licenseUrl='javascript:bad()';const errors=validateCulture(bad,experiences,storySources,[],'2026-11-08');for(const phrase of ['no evidence','unknown venue','media rights'])assert.ok(errors.some(e=>e.includes(phrase)));
});
test('oral history and published portraits cannot bypass permission/publication gates',()=>{
 const bad=structuredClone(stories);bad[0].blocks[2].kind='oral_history';assert.ok(validateCulture(bad,experiences,storySources,[{id:'fake',status:'published'}],'2026-11-08').some(e=>e.includes('oral history')));assert.ok(validateCulture(stories,experiences,storySources,[{id:'fake',status:'published'}],'2026-11-08').some(e=>e.includes('publication is not enabled')));
});
test('experience rules need alternatives and cannot substitute their own operational verification',()=>{
 const bad=structuredClone(experiences);bad[0].alternative='';bad[1].verified=true;const errors=validateCulture(stories,bad,storySources,[],'2026-11-08');assert.ok(errors.some(e=>e.includes('alternative')));assert.ok(errors.some(e=>e.includes('VDC')));
});
test('culture routes resolve canonical pages, trailing slash and true unknown content',()=>{
 assert.equal(cultureRoute('/stories/').file,'/stories/index.html');assert.equal(cultureRoute('/stories/'+stories[0].slug).item.id,stories[0].id);assert.equal(cultureRoute('/experiences/'+experiences[0].slug).item.id,experiences[0].id);assert.equal(cultureRoute('/stories/not-published').kind,'not-found');assert.equal(cultureRoute('/api/status'),null);assert.equal(cultureRoutes().length,9);
});
test('pre-rendered story HTML contains real text, unique metadata, canonical and source links',async()=>{
 const titles=new Set();for(const story of stories){const html=await readFile('dist/stories/'+story.slug+'/index.html','utf8');assert.ok(html.includes(story.blocks[1].text.replaceAll('&','&amp;')));assert.ok(html.includes('rel="canonical"'));assert.ok(html.includes('property="og:title"'));assert.ok(html.includes('name="description"'));assert.ok(html.includes('SOURCED CONTEXT'));assert.ok(html.includes(storySources[story.blocks[1].sourceIds[0]].url));assert.ok(!html.includes('<!--CULTURE_CONTENT-->'));titles.add(html.match(/<title>(.*?)<\/title>/)[1]);}assert.equal(titles.size,3);
});
test('both original Node launchers serve clean culture paths and preserve API errors',async()=>{
 for(const handler of [nodeHandler,deepseekHandler]){const server=http.createServer(handler());await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));try{const base=`http://127.0.0.1:${server.address().port}`;const story=await fetch(base+'/stories/'+stories[0].slug);assert.equal(story.status,200);assert.ok((await story.text()).includes('SOURCED CONTEXT'));assert.equal((await fetch(base+'/stories/not-published')).status,404);assert.equal((await fetch(base+'/api/missing')).status,404);}finally{await new Promise(resolve=>server.close(resolve));}}
});
test('static-only controls are hidden without JS and folklore labels stay distinct from fact',()=>{
 const html=renderCultureBody({kind:'story',item:stories[0]});assert.match(html,/data-js-only hidden/);assert.doesNotMatch(renderCultureBody({kind:'story',item:stories[0]},emptyCultureState,true),/data-js-only hidden/);const s=structuredClone(stories[0]);s.blocks[2].kind='folklore';assert.match(renderCultureBody({kind:'story',item:s}),/FOLKLORE · NOT ESTABLISHED HISTORY/);
});
test('all public culture URLs appear in sitemap and offline manifest; local photo has provenance',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8'),manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 for(const path of cultureRoutes()){assert.ok(sitemap.includes(path));assert.ok(manifest.files.includes(cultureRoute(path).file));}
 assert.ok(manifest.files.includes('/culture/xintiandi-2006.jpg'));assert.ok(!manifest.files.includes('/_headers'));assert.equal(manifest.cultureVersion,'2026-11-09.culture2');assert.equal(stories[0].image.license,'CC BY 2.0');assert.ok((await readFile('public/culture/xintiandi-2006.jpg')).length>10000);
});
test('Workers maps clean culture routes to prerendered HTML and returns 404 for unpublished slugs',async()=>{
 let path;const env={ASSETS:{fetch:async r=>{path=new URL(r.url).pathname;return new Response('static');}}};assert.equal((await worker.fetch(new Request('https://travel.example/stories/'+stories[0].slug),env)).status,200);assert.equal(path,'/stories/'+stories[0].slug+'/index.html');assert.equal((await worker.fetch(new Request('https://travel.example/stories/private-draft'),env)).status,404);
});
test('local cultural state rejects unknown IDs, oversized notes and nonboolean progress',()=>{
 assert.equal(isCultureState(emptyCultureState),true);assert.equal(isCultureState({...emptyCultureState,saved:['unknown']}),false);assert.equal(isCultureState({...emptyCultureState,notes:{[stories[0].id]:'x'.repeat(501)}}),false);assert.equal(isCultureState({...emptyCultureState,steps:{[experiences[0].id+':0']:'verified'}}),false);assert.equal(isCultureState({...emptyCultureState,steps:{[experiences[0].id+':0']:true}}),true);
});
test('adding a cultural place preserves legacy stops, prevents duplicates and rejects invented places',()=>{
 const plan={createdAt:'original',days:[{date:'2026-11-09',stops:[{placeId:'bund',time:'10:00',note:'keep'}]}]};const added=addVenueToDay(plan,'xintiandi',0,'new-stop');assert.equal(added.days[0].stops[0],plan.days[0].stops[0]);assert.equal(added.createdAt,plan.createdAt);assert.equal(added.days[0].stops[1].id,'new-stop');assert.equal(addVenueToDay(added,'xintiandi',0,'duplicate'),added);assert.throws(()=>addVenueToDay(plan,'invented',0,'bad'));assert.equal(plan.days[0].stops.length,1);
});
test('story renderer escapes content; voices empty state does not impersonate interviewees',()=>{
 const s=structuredClone(stories[0]);s.title='<script>alert(1)</script>';const html=renderCultureBody({kind:'story',item:s});assert.ok(html.includes('&lt;script&gt;'));assert.doesNotMatch(html,/<script/);const voices=renderCultureBody({kind:'voices'});assert.match(voices,/No interviews, profiles, recordings or transcripts/);assert.doesNotMatch(voices,/<audio|<video/);
});
test('standalone culture backup stays script-free and separates editorial from VDC confidence',()=>{
 const html=cultureOfflineHtml();for(const s of stories)assert.ok(html.includes(s.title));assert.match(html,/not a food-safety guarantee/);assert.match(html,/No interviews are published/);assert.doesNotMatch(html,/<script|<img|<audio|<video/);assert.equal(dataVersion.version,'2026-11-08.vdc1');
});
