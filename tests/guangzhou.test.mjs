import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import data from '../data/guangzhou.json' with {type:'json'};
import {renderGuangzhouPage} from '../shared/guangzhou-render.mjs';

test('Guangzhou preserves the ten supplied photographs, their captions and uncertain locations',async()=>{
 const photos=data.places.flatMap(place=>place.photos);
 assert.equal(photos.length,10);
 assert.equal(new Set(photos.map(photo=>photo.sourceFilename)).size,10);
 assert.equal(photos.find(photo=>photo.image==='canton-tower-sunset').sourceFilename,'AI_1795707138026.png');
 assert.equal(photos.find(photo=>photo.image==='memorial-hall').sourceFilename,'AI_1795707238889.png');
 const html=renderGuangzhouPage();
 const built=await readFile('dist/cities/guangzhou/index.html','utf8');
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.match(built,/https:\/\/china-closer\.xizimist\.com\/cities\/guangzhou/);
 assert.equal(manifest.guangzhouVersion,data.version);
 for(const photo of photos){
  assert.ok(html.includes(`data-photo-city-image="${photo.image}"`));
  assert.ok(built.includes(photo.caption));
  assert.ok(Math.abs(photo.width/photo.height-photo.largeWidth/photo.largeHeight)<0.002);
  for(const size of [640,1600]){
   const url=`/guangzhou-photography/${photo.image}-${size}.webp`;
   assert.ok(manifest.files.includes(url));
   assert.equal((await readFile('public'+url)).toString('ascii',8,12),'WEBP');
  }
 }
 for(const place of data.places.filter(place=>place.mapKeyword===null)){
  const section=html.split(`id="${place.id}"`)[1].split('</article>')[0];
  assert.ok(!section.includes('uri.amap.com'));
 }
});
