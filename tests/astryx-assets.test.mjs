import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';

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
 const files=(await readdir('dist/assets')).filter(name=>name.startsWith('AstryxTripPilot-')&&name.endsWith('.css'));
 assert.equal(files.length,1);
 const css=await readFile('dist/assets/'+files[0],'utf8');
 assert.doesNotMatch(css,/fonts\.(googleapis|gstatic)\.com/);
 assert.match(css,/\/fonts\/astryx-matcha\//);
});
