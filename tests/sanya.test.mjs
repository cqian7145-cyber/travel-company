import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sanya,sanyaMap,sanyaPhoto} from '../shared/sanya.mjs';
import {cityRoute} from '../shared/cities.mjs';
import {renderSanyaPage} from '../shared/sanya-render.mjs';
import {renderDiscoveryCards} from '../shared/discovery-render.mjs';

test('Sanya groups destination views and preserves the approved duplicate mapping',async()=>{
 const provenance=JSON.parse(await readFile('public/sanya-photography/provenance.json','utf8'));
 assert.equal(provenance.length,11);assert.equal(provenance.filter(p=>p.renditions.length).length,10);
 const duplicate=provenance.find(p=>p.uploadIndex===10),original=provenance.find(p=>p.uploadIndex===6);
 assert.equal(duplicate.duplicateOf,original.id);assert.equal(duplicate.originalSha256,original.originalSha256);assert.deepEqual(duplicate.renditions,[]);
 assert.equal(sanya.cover.label,'Sanya · 三亚');assert.equal(sanya.cover.image,'sanya-cover');
 assert.deepEqual(sanya.places.map(p=>p.zh),['南山寺','西岛','大东海','椰梦长廊','天涯海角','太阳湾','海棠湾','蜈支洲岛']);
 assert.deepEqual(sanya.places.find(p=>p.zh==='大东海').photos.map(p=>p.image),['dadonghai-bar','dadonghai-beach']);
 const used=[sanya.cover.image,...sanya.places.flatMap(p=>p.photos.map(p=>p.image))];
 assert.equal(new Set(used).size,10);assert.ok(used.every(id=>provenance.some(p=>p.id===id&&p.renditions.length===2)));
 assert.equal(sanya.scope.operationalFactsStatus,'unknown');assert.throws(()=>sanyaMap({id:'invented'}));
 for(const place of sanya.places){const url=new URL(sanyaMap(place));assert.equal(url.hostname,'uri.amap.com');assert.equal(url.searchParams.get('keyword'),'三亚 '+place.zh);}
});
test('Sanya has readable prerendered galleries, an honest empty state and complete offline assets',async()=>{
 const route=cityRoute('/cities/sanya'),html=await readFile('dist'+route.file,'utf8');
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.equal(manifest.sanyaVersion,sanya.version);assert.ok(manifest.files.includes(route.file));
 assert.ok(html.includes(renderSanyaPage()));assert.match(html,/<title>Sanya/);assert.match(html,/https:\/\/china-closer.cqian7145.workers.dev\/cities\/sanya/);
 for(const p of sanya.places)for(const photo of p.photos)for(const large of [false,true]){const path=sanyaPhoto(photo.image,large);assert.ok(manifest.files.includes(path));assert.ok(await readFile('dist'+path));}
 assert.match(renderDiscoveryCards('stories',{cityId:'sanya'}),/Browse Sanya places/);
 assert.match(html,/Sanya stories, self-guided experiences and itinerary planning are not available yet/);
});
