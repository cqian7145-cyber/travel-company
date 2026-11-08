import assert from 'node:assert/strict';
const base='http://127.0.0.1:8787';
const trip={days:3,budget:2400,pace:'balanced',interests:['Culture'],date:'2026-11-09',curated:true};
const post=(body=trip,headers={})=>fetch(base+'/api/plan',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
const home=await fetch(base+'/');assert.equal(home.status,200);assert.match(home.headers.get('Content-Type'),/text\/html/);assert.equal(home.headers.get('X-Content-Type-Options'),'nosniff');
const index=await fetch(base+'/index.html',{redirect:'manual'});assert.equal(index.status,200);
const status=await fetch(base+'/api/status');assert.equal(status.headers.get('Cache-Control'),'no-store');assert.deepEqual(await status.json(),{aiConfigured:false,aiProvider:'DeepSeek'});
const missing=await fetch(base+'/api/missing',{headers:{Accept:'text/html','Sec-Fetch-Mode':'navigate'}});assert.equal(missing.status,404);assert.match(missing.headers.get('Content-Type'),/json/);
const sw=await fetch(base+'/sw.js');assert.equal(sw.status,200);assert.equal(sw.headers.get('Cache-Control'),'no-cache');assert.match(sw.headers.get('Content-Type'),/javascript/);
const manifest=await(await fetch(base+'/offline-manifest.json')).json();assert.equal(manifest.files.length,4);assert.ok(!manifest.files.includes('/_headers'));
for(const path of manifest.files){const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,200,path);if(path.startsWith('/assets/'))assert.match(r.headers.get('Cache-Control'),/immutable/);}
const plan=await post();assert.equal(plan.status,200);assert.equal((await plan.json()).mode,'curated');
assert.equal((await post(trip,{Origin:'https://evil.example'})).status,403);
assert.equal((await post({...trip,days:99})).status,400);
assert.equal((await post({padding:'x'.repeat(9000)})).status,413);
console.log('PASS: real local Workers runtime — static headers, direct index, API-before-SPA, status, four offline assets, curated plan, origin/input/body bounds. No paid provider call.');
