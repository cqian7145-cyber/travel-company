import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {hangzhou,auditHangzhou,hangzhouMap,validHangzhouSaved} from '../shared/hangzhou.mjs';

test('Hangzhou city facts have stable separate IDs, valid sources and honest unknown operational fields',()=>{
 assert.deepEqual(auditHangzhou(),[]);
 assert.equal(hangzhou.places.length,3);
 const changed=structuredClone(hangzhou);changed.places[0].facts.opening_hours.status='verified';changed.places[0].facts.opening_hours.verified_at='2026-11-08';
 assert.ok(auditHangzhou(changed).length>0,'Context-source access must not confer operational verification');
});
test('a general city guide cannot silently become a booking link',()=>{
 const changed=structuredClone(hangzhou);changed.places[0].facts.booking_link.value=changed.sources.hz_lake.url;
 assert.ok(auditHangzhou(changed).some(e=>e.includes('checkout')));
});
test('Hangzhou bookmarks and map links stay within the known city catalog',()=>{
 assert.ok(validHangzhouSaved(['hz-west-lake']));assert.ok(validHangzhouSaved([]));
 assert.equal(validHangzhouSaved(['bund']),false);assert.equal(validHangzhouSaved(null),false);
 const place=hangzhou.places[0],url=new URL(hangzhouMap(place));assert.equal(url.hostname,'uri.amap.com');assert.equal(url.searchParams.get('city'),'杭州');assert.ok(url.searchParams.get('keyword').includes(place.zh));assert.throws(()=>hangzhouMap({id:'bund'}));
});
test('Hangzhou upload renditions have provenance, bounds and complete offline coverage',async()=>{
 const records=JSON.parse(await readFile('public/hangzhou-photography/provenance.json','utf8'));
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.equal(records.length,9);assert.equal(manifest.hangzhouVersion,hangzhou.version);
 let total=0;
 for(const record of records){assert.match(record.originalSha256,/^[a-f0-9]{64}$/);assert.equal(record.locationStatus,'illustrative-not-location-verified');assert.equal(record.rightsStatus,'unverified-user-supplied');
  for(const image of record.renditions){const bytes=await readFile('public'+image.src);assert.ok(image.width<=1600&&image.height<=1800);assert.equal(bytes.length,image.bytes);assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(manifest.files.includes(image.src));total+=bytes.length;}
 }assert.ok(total<5_000_000,'Keep the optional Hangzhou photograph set bounded');
});
