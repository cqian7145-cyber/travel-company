import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import worker,{createWorker} from '../workers/index.mjs';
const trip={days:3,budget:2400,pace:'balanced',interests:['Culture'],date:'2026-11-09'};
const request=(path='/api/plan',body=trip,init={})=>new Request('https://travel.example'+path,{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.10'},body:JSON.stringify(body),...init});
const env=(extra={})=>({ASSETS:{fetch:async r=>new Response('asset:'+new URL(r.url).pathname)},PLAN_RATE_LIMITER:{limit:async()=>({success:true})},...extra});
test('Workers static routes delegate to assets while unknown API routes remain JSON 404',async()=>{
 assert.equal(await(await worker.fetch(new Request('https://travel.example/sw.js'),env())).text(),'asset:/sw.js');
 const response=await worker.fetch(new Request('https://travel.example/api/missing'),env());assert.equal(response.status,404);assert.match(response.headers.get('Content-Type'),/json/);assert.equal(response.headers.get('Cache-Control'),'no-store');
});
test('Workers status is secret-free and paid AI requires explicit enable, key and limiter',async()=>{
 for(const bindings of [{},{AI_ENABLED:'true'},{DEEPSEEK_API_KEY:'fake'},{AI_ENABLED:'true',DEEPSEEK_API_KEY:'fake',PLAN_RATE_LIMITER:null}]){
  const status=await(await worker.fetch(new Request('https://travel.example/api/status'),env(bindings))).json();assert.deepEqual(status,{aiConfigured:false,aiProvider:'DeepSeek'});
 }
 const status=await(await worker.fetch(new Request('https://travel.example/api/status'),env({AI_ENABLED:'true',DEEPSEEK_API_KEY:'fake'}))).json();assert.equal(status.aiConfigured,true);assert.ok(!JSON.stringify(status).includes('fake'));
});
test('Workers rejects cross-origin requests, wrong methods and non-JSON content',async()=>{
 assert.equal((await worker.fetch(request('/api/plan',trip,{headers:{'Content-Type':'application/json',Origin:'https://evil.example'}}),env())).status,403);
 assert.equal((await worker.fetch(request('/api/plan',trip,{headers:{'Content-Type':'application/json','Sec-Fetch-Site':'cross-site'}}),env())).status,403);
 assert.equal((await worker.fetch(new Request('https://travel.example/api/plan'),env())).status,405);
 assert.equal((await worker.fetch(request('/api/plan',trip,{headers:{'Content-Type':'text/plain'}}),env())).status,415);
});
test('Workers enforces streamed UTF-8 byte limits and input validation before planning',async()=>{
 const body=new TextEncoder().encode(JSON.stringify({padding:'中'.repeat(3000)}));
 const stream=new ReadableStream({start(c){c.enqueue(body);c.close();}});
 const r=new Request('https://travel.example/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:stream,duplex:'half'});
 assert.equal((await worker.fetch(r,env())).status,413);
 assert.equal((await worker.fetch(request('/api/plan',{...trip,days:8}),env())).status,400);
 assert.equal((await worker.fetch(request('/api/plan',{...trip,curated:'false'}),env())).status,400);
 assert.equal((await worker.fetch(request('/api/plan',null),env())).status,400);
});
test('Workers uses native rate limiter, never per-isolate maps, and fails closed',async()=>{
 let key;const r=await worker.fetch(request(),env({PLAN_RATE_LIMITER:{limit:async options=>{key=options.key;return{success:false};}}}));assert.equal(r.status,429);assert.equal(r.headers.get('Retry-After'),'60');assert.equal(key,'china-closer:plan:192.0.2.10');
 for(const limiter of [null,{limit:async()=>{throw Error('private');}}])assert.equal((await worker.fetch(request(),env({PLAN_RATE_LIMITER:limiter}))).status,503);
 assert.equal((await worker.fetch(request('/api/plan',trip,{headers:{'Content-Type':'application/json'}}),env())).status,503);
});
test('Workers default curated mode and explicit bypass never invoke paid provider',async()=>{
 const w=createWorker({generate:()=>assert.fail('No paid call')});
 for(const [bindings,body] of [[{DEEPSEEK_API_KEY:'fake'},trip],[{AI_ENABLED:'true',DEEPSEEK_API_KEY:'fake'},{...trip,curated:true}]]){
  const r=await w.fetch(request('/api/plan',body),env(bindings));assert.equal(r.status,200);assert.equal((await r.json()).mode,'curated');
 }
});
test('Workers passes explicit secret/model bindings and only validated preferences to DeepSeek',async()=>{
 let calls=0;const w=createWorker({generate:async(input,options)=>{calls++;assert.equal(input.hotel,undefined);assert.equal(input.passport,undefined);assert.deepEqual(options,{apiKey:'fake-secret',model:'test-model'});return{mode:'ai'};}});
 const response=await w.fetch(request('/api/plan',{...trip,hotel:'private',passport:'private'}),env({AI_ENABLED:'true',DEEPSEEK_API_KEY:'fake-secret',DEEPSEEK_MODEL:'test-model'}));assert.equal(response.status,200);assert.equal(calls,1);assert.ok(!(await response.text()).includes('fake-secret'));
 const failing=createWorker({generate:async()=>{throw Error('secret-provider-body');}});const failure=await failing.fetch(request(),env({AI_ENABLED:'true',DEEPSEEK_API_KEY:'fake'}));assert.equal(failure.status,502);assert.ok(!(await failure.text()).includes('secret-provider-body'));
});
test('Workers config keeps APIs ahead of SPA fallback and stable index URL for offline caching',async()=>{
 const config=JSON.parse(await readFile(new URL('../wrangler.jsonc',import.meta.url),'utf8'));assert.equal(config.assets.html_handling,'none');assert.deepEqual(config.assets.run_worker_first,['/api','/api/*']);assert.equal(config.vars.AI_ENABLED,'false');assert.equal(config.ratelimits[0].name,'PLAN_RATE_LIMITER');assert.ok(!JSON.stringify(config).includes('DEEPSEEK_API_KEY'));
});
