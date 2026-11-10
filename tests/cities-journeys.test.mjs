import {highlights} from '../shared/culture-highlights.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {cities,cityRoute,cityRoutes,filterCityContent} from '../shared/cities.mjs';
import {stories,experiences,emptyCultureState,isCultureState} from '../shared/story-catalog.mjs';
import {experienceReadiness,experienceFacts,emptyJourney,transitionJourney,validJourneys,riskPriorities} from '../shared/experience-journey.mjs';
import {venues,evidenceSources} from '../shared/verification.mjs';
import {renderDiscoveryCards,renderExperienceDecision} from '../shared/discovery-render.mjs';
import {primaryNavigation} from '../shared/site-navigation.mjs';
import worker from '../workers/index.mjs';
import {cultureOfflineHtml} from '../shared/culture-offline.mjs';
import http from 'node:http';
import {createHandler as nodeHandler} from '../server.mjs';
import {createHandler as deepseekHandler} from '../server-deepseek.mjs';

test('city routes are canonical, scoped and reject unsupported cities',()=>{
 assert.equal(cities.length,4);
 for(const id of ['shanghai','hangzhou','guiyang','sanya'])for(const suffix of ['','/','/index.html'])assert.equal(cityRoute('/cities/'+id+suffix).city.id,id);
 assert.equal(cityRoute('/cities').kind,'cities');assert.equal(cityRoute('/cities/beijing').kind,'not-found');assert.equal(cityRoute('/stories'),null);
 assert.deepEqual(primaryNavigation.map(n=>n.href),['/','/cities','/culture','/trip']);
});
test('Guiyang photo pilot has seven distinct contributor-labeled places and matching image assets',async()=>{
 const data=JSON.parse(await readFile('data/guiyang.json','utf8'));
 const expected=['太平路','国家生态会议中心','白宫','甲秀楼','海豚广场','黔灵山公园','花溪公园'];
 assert.equal(data.version,'2026-11-09.guiyang2');assert.deepEqual(data.places.map(p=>p.zh),expected);
 assert.equal(new Set(data.places.map(p=>p.id)).size,7);assert.equal(new Set(data.places.map(p=>p.image)).size,7);
 for(const place of data.places)for(const width of [640,1600])assert.ok(await readFile(`public/guiyang-photography/${place.image}-${width}.webp`));
});
test('city and topic filters use published canonical records without manufacturing Hangzhou content',()=>{
 for(const records of [stories,experiences]){
  const before=JSON.stringify(records);assert.equal(filterCityContent(records,{cityId:'shanghai'}).length,3);
  assert.equal(filterCityContent(records,{cityId:'hangzhou'}).length,0);
  assert.equal(filterCityContent(records,{cityId:'invented'}).length,0);
  assert.equal(filterCityContent(records,{cityId:'shanghai',topic:'Food'}).length,1);
  assert.equal(filterCityContent(records.map(x=>({...x,status:'draft'}))).length,0);assert.equal(JSON.stringify(records),before);
 }
 assert.match(renderDiscoveryCards('stories',{cityId:'hangzhou'}),/No published stories/);
 assert.match(renderDiscoveryCards('experiences',{cityId:'hangzhou'}),/No published Experience Journeys/);
});
test('all three experiences have six decision facts, two observations and explicit access uncertainty',()=>{
 for(const x of experiences){assert.equal(x.observations.length,2);assert.deepEqual(experienceFacts(x).map(f=>f.label),['Duration','Cost','Format','Access','Language','Limitations']);assert.match(experienceFacts(x)[3].value,/not confirmed/);assert.match(renderExperienceDecision(x),/does not confirm access, a booking or food safety/);assert.equal(x.cityId,'shanghai');}
 assert.equal(Object.keys(riskPriorities).length,5);
});
test('departure evidence retains field-level confidence, dates and missing-rule uncertainty',()=>{
 const x=experiences.find(x=>x.relatedVenueIds.length),v=structuredClone(venues.find(v=>v.id===x.relatedVenueIds[0]));
 const sourceId=Object.keys(evidenceSources)[0];
 v.facts.address={value:'Test address',status:'verified',source_id:sourceId,verified_at:'2026-11-07',next_review_at:'2026-11-10'};
 assert.equal(experienceReadiness(x,'2026-11-09',[v])[0].status,'verified');
 assert.equal(experienceReadiness(x,'2026-11-10',[v])[0].status,'expired');
 assert.equal(experienceReadiness(x,'2026-11-09',[v],{})[0].status,'unknown');
 for(const status of ['estimated','conflicting','unknown']){v.facts.address.status=status;assert.equal(experienceReadiness(x,'2026-11-09',[v])[0].status,status);}
 delete v.facts.address;assert.equal(experienceReadiness(x,'2026-11-09',[v])[0].status,'unknown');
 const food=experiences.find(x=>x.riskType==='self_selected_food');assert.ok(experienceReadiness(food).every(r=>r.status==='unknown'&&r.verifiedAt===null));
});
test('journeys pause, resume, reflect and store an optional self-report without changing legacy state',()=>{
 const x=experiences[0],legacy=JSON.stringify(emptyCultureState),now='2026-11-09T08:00:00Z';
 let s=transitionJourney(null,{type:'start'},x,now);assert.equal(s.phase,'active');
 s=transitionJourney(s,{type:'pause'},x,now);assert.equal(s.phase,'paused');
 assert.throws(()=>transitionJourney(s,{type:'next'},x,now));
 s=transitionJourney(s,{type:'resume'},x,now);s=transitionJourney(s,{type:'next'},x,now);assert.equal(s.observation,1);
 s=transitionJourney(s,{type:'next'},x,now);assert.equal(s.phase,'reflecting');
 assert.throws(()=>transitionJourney(s,{type:'report',report:'booking_confirmed'},x,now));
 for(const report of ['tried','read_only','stopped']){const done=transitionJourney(s,{type:'report',report},x,now);assert.equal(done.phase,'reported');assert.equal(validJourneys({[x.id]:done}),true);assert.deepEqual(transitionJourney(done,{type:'reset'},x,now),emptyJourney());}
 assert.equal(JSON.stringify(emptyCultureState),legacy);assert.equal(isCultureState(emptyCultureState),true);
});
test('journey storage rejects corrupt entries, unknown IDs and false confirmation states',()=>{
 const x=experiences[0],s=emptyJourney();assert.equal(validJourneys({}),true);
 for(const value of [null,[],{unknown:s},{[x.id]:{...s,phase:'booked'}},{[x.id]:{...s,observation:2}},{[x.id]:{...s,report:'tried'}},{[x.id]:{...s,updatedAt:'invalid'}}])assert.equal(Boolean(validJourneys(value)),false);
});
test('city prerenders have distinct SEO, readable content, sitemap and offline coverage',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8'),manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 for(const path of cityRoutes()){
  const route=cityRoute(path),html=await readFile('dist'+route.file,'utf8');
  assert.equal((html.match(/<title>/g)||[]).length,1);assert.equal((html.match(/name="description"/g)||[]).length,1);
  assert.ok(html.includes('rel="canonical"'));assert.ok(html.includes(path));assert.ok(sitemap.includes(path));assert.ok(manifest.files.includes(route.file));
  if(route.city){assert.ok(html.includes(route.city.name));const regions=['guiyang','sanya'].includes(route.city.id)?['places','city-plan']:[route.city.id+'-culture','city-places','city-plan'];for(const region of regions)assert.ok(html.includes('id="'+region+'"'));}
 }
});
test('Workers dispatches city HTML and returns a true 404 for unknown cities',async()=>{
 let fetched;const env={ASSETS:{fetch:async r=>{fetched=new URL(r.url).pathname;return new Response('city');}}};
 for(const path of cityRoutes()){assert.equal((await worker.fetch(new Request('https://example.com'+path),env)).status,200);assert.equal(fetched,cityRoute(path).file);}
 assert.equal((await worker.fetch(new Request('https://example.com/cities/missing'),env)).status,404);
});
test('both Node launchers serve city prerenders, unknown-city 404s and the legacy trip route',async()=>{
 for(const handler of [nodeHandler,deepseekHandler]){
  const server=http.createServer(handler());await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{const base='http://127.0.0.1:'+server.address().port;for(const path of cityRoutes()){const r=await fetch(base+path);assert.equal(r.status,200);assert.match(await r.text(),/rel="canonical"/);}assert.equal((await fetch(base+'/cities/missing')).status,404);assert.equal((await fetch(base+'/trip')).status,200);}
  finally{await new Promise(resolve=>server.close(resolve));}
 }
});
test('Beishan photo attribution cannot become a Gongchen place photograph',async()=>{
 const data=JSON.parse(await readFile('data/hangzhou.json','utf8')),provenance=await readFile('public/hangzhou-photography/provenance.json','utf8');
 assert.equal(data.places.find(p=>p.id==='hz-gongchen').image,null);assert.match(provenance,/Beishan/);assert.match(await readFile('src/Hangzhou.tsx','utf8'),/Beishan Street, in afternoon light/);
});
test('standalone backup keeps cultural text, sources and phrases without task mechanics',()=>{
 const html=cultureOfflineHtml();for(const x of highlights){assert.ok(html.includes(x.summary.replaceAll('&','&amp;')));for(const section of x.sections)assert.ok(html.includes(section.text.replaceAll('&','&amp;')));}
 assert.match(html,/Folklore, not documented history/);assert.match(html,/Access remains unconfirmed/);
 assert.doesNotMatch(html,/<script|<button|<img|Reflection:|Two optional observations|Starting or checking/);
});
