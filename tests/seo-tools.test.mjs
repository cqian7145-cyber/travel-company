import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {toolPages,toolRoute,toolRoutes} from '../shared/tools-routes.mjs';
import worker from '../workers/index.mjs';

test('SEO tool routes resolve cleanly and have prerendered HTML, canonical domain, sitemap, and offline coverage',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.equal(toolRoutes().length,5);
 for(const tool of toolPages){
  assert.equal(toolRoute(tool.path)?.page,tool.page);
  assert.equal(toolRoute(tool.path+'/index.html')?.page,tool.page);
  const html=await readFile('dist'+tool.file,'utf8');
  assert.equal((html.match(/<title>/g)||[]).length,1);
  assert.equal((html.match(/name="description"/g)||[]).length,1);
  assert.ok(html.includes(`https://china-closer.xizimist.com${tool.path}`),tool.path);
  assert.ok(sitemap.includes(`https://china-closer.xizimist.com${tool.path}`),tool.path);
  assert.ok(manifest.files.includes(tool.file),tool.file);
 }
});

test('Workers dispatches SEO tool prerendered HTML and manifest.webmanifest exists',async()=>{
 let fetched='';
 const env={ASSETS:{fetch:async r=>{fetched=new URL(r.url).pathname;return new Response('tool-html');}}};
 for(const path of toolRoutes()){
  const res=await worker.fetch(new Request('https://china-closer.xizimist.com'+path),env);
  assert.equal(res.status,200);
  assert.equal(fetched,path+'/index.html');
 }
 const pwa=JSON.parse(await readFile('dist/manifest.webmanifest','utf8'));
 assert.equal(pwa.display,'standalone');
 assert.ok(pwa.shortcuts.some(s=>s.url==='/arrival'));
 assert.ok(pwa.shortcuts.some(s=>s.url==='/speak'));
});
