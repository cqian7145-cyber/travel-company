import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import http from 'node:http';
import {createHandler as nodeHandler} from '../server.mjs';
import {createHandler as deepseekHandler} from '../server-deepseek.mjs';

test('self-hosted fonts have recorded hashes, redistribution licences and offline coverage',async()=>{
 const fonts=JSON.parse(await readFile('public/fonts/provenance.json','utf8'));
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.equal(fonts.length,2);
 for(const font of fonts){
  const bytes=await readFile('public/fonts/'+font.file);
  assert.equal(bytes.toString('ascii',0,4),'wOF2');assert.equal(createHash('sha256').update(bytes).digest('hex'),font.sha256);
  assert.ok(manifest.files.includes('/fonts/'+font.file));assert.ok(bytes.length<100_000);
  const license=font.file.replace('-latin.woff2','-OFL.txt');
  assert.match(await readFile('public/fonts/'+license,'utf8'),/SIL OPEN FONT LICENSE/);
  assert.ok(manifest.files.includes('/fonts/'+license));
 }
});
test('both Node launchers return a usable WOFF2 MIME type with nosniff',async()=>{
 for(const handler of [nodeHandler,deepseekHandler]){
  const server=http.createServer(handler());await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{const r=await fetch(`http://127.0.0.1:${server.address().port}/fonts/inter-latin.woff2`);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'font/woff2');assert.equal(r.headers.get('x-content-type-options'),'nosniff');}
  finally{await new Promise(resolve=>server.close(resolve));}
 }
});
