import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import http from 'node:http';
import {cultureRecords,cultureSources,highlights,highlightsForCity,highlightsForPlace,highlightPath,highlightMap,initialHighlightState,validHighlightState,validateHighlights} from '../shared/culture-highlights.mjs';
import {cultureRoute,cultureRoutes,stories,experiences} from '../shared/story-catalog.mjs';
import {renderCultureBody} from '../shared/culture-render.mjs';
import {renderHighlightDetail} from '../shared/highlight-render.mjs';
import {hangzhou} from '../shared/hangzhou.mjs';
import worker from '../workers/index.mjs';
import {createHandler as nodeHandler} from '../server.mjs';
import {createHandler as deepseekHandler} from '../server-deepseek.mjs';

test('West Lake has four sourced cultural distinctions, linked to existing places without claiming operational verification',()=>{
 assert.deepEqual(validateHighlights(),[]);
 const items=highlightsForCity('hangzhou');assert.equal(items.length,4);
 assert.deepEqual(items.map(x=>x.type),['history','legend','literature','intangible_heritage']);
 assert.equal(highlightsForPlace('hz-west-lake').length,3);assert.equal(highlightsForPlace('hz-longjing').length,1);
 assert.equal(highlightsForCity('guiyang').length,0);assert.equal(highlightsForCity('sanya').length,0);
 assert.ok(items.every(x=>x.summary.split(/\s+/).length>=50&&x.summary.split(/\s+/).length<=90));
 assert.ok(items.every(x=>x.placeIds.every(id=>hangzhou.places.some(p=>p.id===id))));
 assert.ok(items.every(x=>!('openingHours' in x)&&!('verified' in x)));
 assert.ok(hangzhou.places.every(p=>Object.values(p.facts).every(f=>f.status==='unknown'&&f.verified_at===null)));
 assert.match(items.find(x=>x.slug==='su-xiaoxiao').zhPlace,/西泠桥/);
 assert.match(items.find(x=>x.slug==='su-causeway').sections[0].text,/1090/);
 for(const x of items){const map=new URL(highlightMap(x));assert.equal(map.hostname,'uri.amap.com');assert.equal(map.searchParams.get('keyword'),'杭州 '+x.zhPlace);}
});
test('publication validation rejects missing evidence, false place links, factual legends and unsafe sources',()=>{
 for(const change of [x=>x.sourceIds=[],x=>x.sections[0].sourceIds=['unknown'],x=>x.summary='Too short.',x=>x.placeIds=['hz-invented'],x=>x.placeIds=['bund'],x=>x.editorialReviewedAt='2099-01-01',x=>x.editorialReviewedAt=null]){
  const records=structuredClone(cultureRecords);change(records[0]);assert.ok(validateHighlights(records,cultureSources).length);
 }
 const records=structuredClone(cultureRecords);records.find(x=>x.type==='legend').sections[0].kind='fact';assert.ok(validateHighlights(records,cultureSources).some(e=>e.includes('legend')));
 const sources=structuredClone(cultureSources);sources.hz_icomos.url='javascript:alert(1)';assert.ok(validateHighlights(cultureRecords,sources).some(e=>e.includes('invalid cultural source')));
 const draft=structuredClone(cultureRecords[0]);draft.id='draft';draft.slug='draft';draft.status='draft';draft.sourceIds=[];assert.deepEqual(validateHighlights([draft],cultureSources),[]);
});
test('bookmark import preserves legacy notes and progress and does not reimport intentionally unsaved items',()=>{
 const legacy={saved:[stories[0].id,'unknown',stories[0].id],steps:{'lane-observation:0':true},notes:{[stories[0].id]:'Keep my private note'}};
 const before=JSON.stringify(legacy),migrated=initialHighlightState(null,legacy);assert.deepEqual(migrated,{saved:[stories[0].id]});assert.equal(JSON.stringify(legacy),before);
 assert.deepEqual(initialHighlightState({saved:[]},legacy),{saved:[]});
 assert.equal(Boolean(validHighlightState({saved:['unknown']})),false);assert.equal(Boolean(validHighlightState({saved:[stories[0].id,stories[0].id]})),false);
 assert.deepEqual(initialHighlightState({saved:'corrupt'},legacy),migrated);
});
test('new reading surfaces contain no journey controls while legacy article text and URLs stay available',()=>{
 for(const s of stories){const route=cultureRoute('/stories/'+s.slug);assert.equal(route.item.id,s.id);const html=renderCultureBody(route);for(const b of s.blocks)assert.ok(html.includes(b.text.replaceAll('&','&amp;')));assert.match(html,/Earlier long-form edition/);}
 for(const x of experiences){const html=renderCultureBody(cultureRoute('/experiences/'+x.slug),undefined,true);assert.match(html,/OPTIONAL VISIT GUIDE/);assert.match(html,/Show large Chinese card/);assert.doesNotMatch(html,/Start experience|Pause experience|Continue experience|What will you take away|experience-session|experience-steps|type="checkbox"/);}
 const html=renderHighlightDetail(highlightsForCity('hangzhou')[1]);assert.match(html,/Folklore · not documented history/);assert.match(html,/<details class="highlight-sources"/);assert.match(html,/<details class="highlight-visit"/);assert.doesNotMatch(html,/data-culture-action="step"|Reflection:/);
});
test('Cloudflare and both Node launchers redirect retired indexes without breaking assets, details or queries',async()=>{
 const requestEnv={ASSETS:{fetch:async r=>new Response(new URL(r.url).pathname)}};
 for(const path of ['/stories','/experiences','/voices','/stories/']){const r=await worker.fetch(new Request('https://example.com'+path+'?city=hangzhou&type=legend'),requestEnv);assert.equal(r.status,308);assert.equal(r.headers.get('Location'),'https://example.com/culture?city=hangzhou&type=legend');}
 assert.equal(cultureRoute('/culture/xintiandi-2006.jpg'),null);
 const image=await worker.fetch(new Request('https://example.com/culture/xintiandi-2006.jpg'),requestEnv);assert.equal(await image.text(),'/culture/xintiandi-2006.jpg');
 for(const handler of [nodeHandler,deepseekHandler]){
  const server=http.createServer(handler());await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{const base='http://127.0.0.1:'+server.address().port;
   for(const alias of ['/voices','/stories','/experiences']){const r=await fetch(base+alias+'?city=hangzhou',{redirect:'manual'});assert.equal(r.status,308);assert.equal(r.headers.get('Location'),'/culture?city=hangzhou');}
   for(const x of highlights)assert.equal((await fetch(base+highlightPath(x))).status,200);
   assert.equal((await fetch(base+'/culture/unpublished')).status,404);assert.match((await fetch(base+'/culture/xintiandi-2006.jpg')).headers.get('Content-Type'),/image\/jpeg/);
  }finally{await new Promise(resolve=>server.close(resolve));}
 }
});
test('canonical culture pages, source text, phrases and images are included offline; retired indexes leave sitemap',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8'),manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.doesNotMatch(sitemap,/<loc>[^<]+\/(voices|stories|experiences)<\/loc>/);
 for(const path of cultureRoutes()){const route=cultureRoute(path),html=await readFile('dist'+route.file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.ok(sitemap.includes('>'+new URL(path,'https://china-closer.cqian7145.workers.dev').href+'<'));assert.ok(manifest.files.includes(route.file));}
 for(const x of highlights){const html=await readFile('dist'+cultureRoute(highlightPath(x)).file,'utf8');assert.ok(html.includes(x.summary.replaceAll('&','&amp;')));for(const id of x.sourceIds)assert.ok(html.includes(cultureSources[id].url.replaceAll('&','&amp;')));if(x.phrase)assert.ok(html.includes(x.phrase.zh));if(x.image)assert.ok(manifest.files.includes(x.image.src));}
 const sw=await readFile('dist/sw.js','utf8');assert.match(sw,/cities\|culture\|stories/);assert.match(sw,/Response.redirect/);
});
