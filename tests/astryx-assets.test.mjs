import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {cityRoutes,cityRoute} from '../shared/cities.mjs';
import {cultureRoutes,cultureRoute} from '../shared/story-catalog.mjs';

test('Matcha fonts are licensed, intact and available in the offline kit',async()=>{
 const base='public/fonts/astryx-matcha/';
 const records=JSON.parse(await readFile(base+'provenance.json','utf8'));
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 const css=await readFile(base+'fonts.css','utf8');
 assert.ok(records.length>0);
 for(const record of records){
  const bytes=await readFile(base+record.file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);
  assert.ok(manifest.files.includes('/fonts/astryx-matcha/'+record.file));
  assert.ok(css.includes('/fonts/astryx-matcha/'+record.file));
 }
 for(const family of ['dmsans','jetbrainsmono','playwriteustrad'])
  assert.match(await readFile(base+family+'-OFL.txt','utf8'),/SIL OPEN FONT LICENSE/);
 assert.doesNotMatch(css,/https?:\/\//);
});

test('compiled Matcha styles never request third-party font hosts',async()=>{
 const files=(await readdir('dist/assets')).filter(name=>name.endsWith('.css'));
 const css=(await Promise.all(files.map(name=>readFile('dist/assets/'+name,'utf8')))).join('\n');
 assert.doesNotMatch(css,/fonts\.(googleapis|gstatic)\.com/);
 assert.match(css,/\/fonts\/astryx-matcha\//);
});

test('every standalone city and culture route has Matcha at first paint without JavaScript',async()=>{
 for(const [routes,route] of [[cityRoutes,cityRoute],[cultureRoutes,cultureRoute]]) {
  for(const path of routes()) {
   const html=await readFile('dist'+route(path).file,'utf8');
   assert.match(html,/<html[^>]*data-astryx-theme="matcha"/);
   assert.match(html,/<body class="matcha-site">/);
   assert.match(html,/assets\/matcha-[^" ]+\.css/);
   assert.match(html,/<h1[\s>]/);
  }
 }
});
