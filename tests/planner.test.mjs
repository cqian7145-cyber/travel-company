import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildPlan,estimate,validateInput,validateAiOrder} from '../shared/planner.mjs';
import {places} from '../shared/catalog.mjs';
import {generate,createHandler} from '../server.mjs';
import http from 'node:http';
const base={days:3,budget:2400,pace:'balanced',interests:['Culture'],date:'2026-11-09'};
test('input boundaries reject invalid days, budgets, interests, paces and dates',()=>{
 for(const patch of [{days:0},{days:8},{days:1.5},{budget:99},{budget:Infinity},{interests:[]},{interests:['unknown']},{pace:'run'},{date:'2026-02-30'},{date:'invalid'}])assert.throws(()=>validateInput({...base,...patch}));
});
test('planner honors duration and pace without repeating places',()=>{
 for(const [pace,count] of [['relaxed',1],['balanced',2],['packed',3]]){const plan=buildPlan({...base,pace});assert.equal(plan.days.length,3);assert.equal(plan.days[0].stops.length,count);const ids=plan.days.flatMap(d=>d.stops.map(s=>s.placeId));assert.equal(new Set(ids).size,ids.length);}
});
test('museum is never assigned on its normal Tuesday closure',()=>{
 const plan=buildPlan({...base,date:'2026-11-10',days:7,pace:'packed',interests:['Art']});
 for(const day of plan.days)if(new Date(day.date+'T12:00:00Z').getUTCDay()===2)assert.ok(day.stops.every(s=>s.placeId!=='museum'));
});
test('small catalog produces explicit free time instead of invented places',()=>{
 const plan=buildPlan({...base,days:7,pace:'packed'});assert.ok(plan.days.some(d=>d.note.includes('Free time')));assert.ok(plan.days.flatMap(d=>d.stops).every(s=>places.some(p=>p.id===s.placeId)));
});
test('interests, budget, and AI ordering affect selection',()=>{
 assert.equal(buildPlan({...base,days:1,interests:['Art']}).days[0].stops[0].placeId,'museum');
 assert.equal(buildPlan({...base,days:1,budget:100,interests:['Culture']}).days[0].stops[0].placeId,'museum');
 assert.equal(buildPlan({...base,days:1},['jingan','museum']).days[0].stops[0].placeId,'jingan');
});
test('budget totals include buffer and flag infeasible budgets',()=>{
 const plan=buildPlan({...base,budget:100}),result=estimate(plan);assert.equal(result.total,result.admission+result.food+result.transport+result.lodging+result.buffer);assert.equal(result.overBudget,true);
 plan.days[0].stops=[];assert.ok(estimate(plan).admission<=result.admission);
});
test('AI IDs are constrained to catalog and deduplicated',()=>{
 assert.throws(()=>validateAiOrder(['invented']));assert.deepEqual(validateAiOrder(['bund','bund']),['bund']);
});
test('no key is explicit curated mode and never calls provider',async()=>{
 const plan=await generate(base,{apiKey:'',fetcher:()=>assert.fail('provider must not be called')});assert.equal(plan.mode,'curated');
});
test('mocked provider uses structured selection and rejects invalid output',async()=>{
 const fetcher=async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert.equal(body.store,false);assert.equal(body.text.format.type,'json_schema');assert.ok(!JSON.stringify(body).includes('nationality'));return {ok:true,json:async()=>({output:[{content:[{type:'output_text',text:'{"placeIds":["museum"]}'}]}]})};};
 assert.equal((await generate(base,{apiKey:'test-key',fetcher})).mode,'ai');
 await assert.rejects(()=>generate(base,{apiKey:'test-key',fetcher:async()=>({ok:true,json:async()=>({output:[{content:[{type:'output_text',text:'{"placeIds":["invented"]}'}]}]})})}));
});
test('HTTP rejects foreign origins, invalid data, oversized bodies and missing content type',async()=>{
 const server=http.createServer(createHandler());await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
 try{
 assert.equal((await fetch(url+'/api/plan',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:JSON.stringify(base)})).status,403);
 assert.equal((await fetch(url+'/api/plan',{method:'POST',body:'{}'})).status,415);
 assert.equal((await fetch(url+'/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,400);
 assert.equal((await fetch(url+'/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({padding:'x'.repeat(9000)})})).status,413);
 const response=await fetch(url+'/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...base,curated:true})});assert.equal(response.status,200);assert.equal((await response.json()).mode,'curated');
 }finally{await new Promise(r=>server.close(r));}
});
