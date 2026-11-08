import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {generate,createHandler} from '../server-deepseek.mjs';
const trip={days:3,budget:2400,pace:'balanced',interests:['Culture'],date:'2026-11-09'};
const completion=(content,finish_reason='stop')=>({ok:true,json:async()=>({choices:[{finish_reason,message:{content}}]})});
test('DeepSeek blank key never calls a provider',async()=>{
 assert.equal((await generate(trip,{apiKey:' ',fetcher:()=>assert.fail('No provider call')})).mode,'curated');
});
test('DeepSeek uses official endpoint and JSON contract with only validated trip/catalog data',async()=>{
 const plan=await generate({...trip,nationality:'private',passport:'never-send'},{apiKey:'fake-test-key',model:'test-model',fetcher:async(url,options)=>{
  assert.equal(url,'https://api.deepseek.com/chat/completions');assert.equal(options.headers.Authorization,'Bearer fake-test-key');
  const body=JSON.parse(options.body);assert.equal(body.model,'test-model');assert.deepEqual(body.response_format,{type:'json_object'});assert.equal(body.thinking.type,'disabled');assert.equal(body.stream,false);
  assert.ok(!options.body.includes('private'));assert.ok(!options.body.includes('passport'));assert.ok(options.signal instanceof AbortSignal);
  return completion('{"placeIds":["museum"]}');
 }});assert.equal(plan.mode,'ai');assert.ok(plan.days.flatMap(d=>d.stops).some(s=>s.placeId==='museum'));
});
test('DeepSeek rejects empty, malformed, truncated and noncatalog results without inventing facts',async()=>{
 for(const [content,finish] of [['','stop'],['  ','stop'],['not-json','stop'],['{"placeIds":["invented"]}','stop'],['{"placeIds":["museum"]}','length']]){
  await assert.rejects(()=>generate(trip,{apiKey:'fake',fetcher:async()=>completion(content,finish)}),/invalid plan/);
 }
});
test('DeepSeek errors never echo provider diagnostics or credentials; no automatic paid retries',async()=>{
 let calls=0;await assert.rejects(()=>generate(trip,{apiKey:'fake',fetcher:async()=>{calls++;return{ok:false,json:()=>assert.fail('Do not read provider error bodies')};}}),/unavailable/);assert.equal(calls,1);
 await assert.rejects(()=>generate(trip,{apiKey:'fake',fetcher:async()=>{throw Error('sensitive diagnostic');}}),error=>!error.message.includes('sensitive'));
});
test('separate DeepSeek HTTP launcher retains origin checks, curated bypass and local app serving',async()=>{
 const server=http.createServer(createHandler());await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const url=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(url+'/api/status',{headers:{Origin:'https://evil.example'}})).status,403);
 const status=await(await fetch(url+'/api/status')).json();assert.deepEqual(Object.keys(status),['aiConfigured','aiProvider']);assert.equal(status.aiProvider,'DeepSeek');
 const response=await fetch(url+'/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...trip,curated:true})});assert.equal(response.status,200);assert.equal((await response.json()).mode,'curated');
 assert.equal((await fetch(url+'/')).status,200);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
