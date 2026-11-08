import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import http from 'node:http';
import {createHandler as nodeHandler} from '../server.mjs';
import {createHandler as deepseekHandler} from '../server-deepseek.mjs';

test('both existing Node launchers serve the new local image format correctly',async()=>{
 for(const handler of [nodeHandler,deepseekHandler]){
  const server=http.createServer(handler());await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{const response=await fetch(`http://127.0.0.1:${server.address().port}/photography/bund-dusk-640.webp`);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');const bytes=Buffer.from(await response.arrayBuffer());assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');}finally{await new Promise(resolve=>server.close(resolve));}
 }
});
test('all supplied photos have bounded local renditions, honest provenance and offline coverage',async()=>{
 const records=JSON.parse(await readFile('public/photography/provenance.json','utf8')),manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));assert.equal(records.length,8);let total=0;
 for(const record of records){assert.match(record.originalSha256,/^[a-f0-9]{64}$/);assert.equal(record.rightsStatus,'unverified-user-supplied-local-preview');assert.equal(record.renditions.length,2);for(const image of record.renditions){assert.ok(image.width<=1600&&image.height<=2000);const bytes=await readFile('public'+image.src);assert.equal(bytes.length,image.bytes);assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(manifest.files.includes(image.src));total+=image.bytes;}}
 assert.ok(total<3_000_000,'Keep the optional photo set below 3 MB.');
});
