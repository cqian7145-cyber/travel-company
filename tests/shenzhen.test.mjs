import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {shenzhen,shenzhenMap,shenzhenPhoto} from '../shared/shenzhen.mjs';
import {cityRoute} from '../shared/cities.mjs';
import {renderShenzhenPage} from '../shared/shenzhen-render.mjs';
import {highlights} from '../shared/culture-highlights.mjs';

test('Shenzhen preserves nine supplied images and does not invent map locations',async()=>{
 const provenance=JSON.parse(await readFile('public/shenzhen-photography/november-17-provenance.json','utf8'));
 assert.deepEqual(provenance.map(x=>x.uploadIndex),[3,4,5,6,7,8,9,10,11]);
 const photos=shenzhen.places.flatMap(p=>p.photos.map(x=>x.image));
 assert.equal(photos.length,9);assert.equal(new Set(photos).size,9);
 assert.deepEqual(new Set(photos),new Set(provenance.map(x=>x.id)));
 assert.equal(shenzhen.places.length,8);
 assert.equal(shenzhen.places.find(x=>x.id==='sz-bay').photos.length,2);
 for(const p of shenzhen.places){
  const url=shenzhenMap(p);
  if(p.mapLabel){assert.equal(new URL(url).hostname,'uri.amap.com');assert.equal(new URL(url).searchParams.get('keyword'),'深圳 '+p.mapLabel);}
  else assert.equal(url,null);
 }
 assert.throws(()=>shenzhenMap({id:'invented'}));
 assert.equal(shenzhen.scope.operationalFactsStatus,'unknown');
});

test('Shenzhen route, static text, sitemap and all photo sizes are available offline',async()=>{
 const route=cityRoute('/cities/shenzhen'),html=await readFile('dist'+route.file,'utf8');
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.ok(html.includes(renderShenzhenPage()));assert.match(html,/<title>Shenzhen/);
 assert.ok(manifest.files.includes(route.file));assert.equal(manifest.shenzhenVersion,shenzhen.version);
 assert.match(await readFile('dist/sitemap.xml','utf8'),/\/cities\/shenzhen<\/loc>/);
 for(const p of shenzhen.places)for(const image of p.photos)for(const large of [false,true]){
  const path=shenzhenPhoto(image.image,large);assert.ok(manifest.files.includes(path));assert.ok((await readFile('dist'+path)).length>0);
 }
 assert.match(html,/Exact location unconfirmed/);assert.doesNotMatch(renderShenzhenPage(),/Sanya|SANYA|三亚/);
});

test('Shanghai culture photos are assigned only to the requested park and breakfast cards',async()=>{
 for(const [id,name]of [['shanghai-park-001','fuxing-park'],['shanghai-breakfast-001','breakfast']]){
  const card=highlights.find(x=>x.id===id);assert.equal(card.cityId,'shanghai');
  assert.equal(card.image.src,`/shanghai-photography/${name}-1600.webp`);
  assert.ok(card.image.alt);assert.match(card.image.caption,/not independently verified/);
  assert.ok((await readFile('public'+card.image.src)).length>0);
 }
});
