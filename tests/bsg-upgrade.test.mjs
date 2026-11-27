import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arrivalCard,defaultArrival} from '../shared/arrival.mjs';
import {buildPlan,estimate} from '../shared/planner.mjs';
import {generate} from '../shared/deepseek.mjs';
import {placesForCity,placeById} from '../shared/bsg-catalog.mjs';

test('Beijing (PEK/PKX) and Guangzhou (CAN) arrival guides work cleanly with late-night taxi priority',()=>{
 const pekT3=arrivalCard({...defaultArrival,airport:'PEK',terminal:'T3',time:'day'});
 assert.match(pekT3.airport,/Beijing Capital/);
 assert.match(pekT3.pickup,/Terminal 3|T3/);
 assert.equal(pekT3.preferred,'metro');
 assert.match(pekT3.options[0].name,/Capital Airport Express/);

 const pkxLate=arrivalCard({...defaultArrival,airport:'PKX',terminal:'main',time:'late'});
 assert.match(pkxLate.airport,/Beijing Daxing/);
 assert.equal(pkxLate.preferred,'taxi');
 assert.match(pkxLate.timeWarning,/do not rely/);

 const canT2=arrivalCard({...defaultArrival,airport:'CAN',terminal:'T2',time:'day'});
 assert.match(canT2.airport,/Guangzhou Baiyun/);
 assert.match(canT2.pickup,/T2|GTC|Airport North/);
 assert.match(canT2.options[0].name,/Metro Line 3/);
});

test('Multi-city BSG planner generates valid Beijing and Guangzhou itineraries and respects Monday closures',()=>{
 // 2026-11-30 is a Monday (getUTCDay() === 1)
 const bj=buildPlan({city:'beijing',days:3,budget:3000,pace:'balanced',interests:['Culture','Architecture'],date:'2026-11-30'});
 assert.equal(bj.input.city,'beijing');
 assert.equal(bj.days.length,3);
 for(const stop of bj.days[0].stops){
  const p=placeById(stop.placeId);
  assert.ok(p);
  assert.notEqual(p.closedDay,1,'Monday should not schedule Monday-closed venues');
 }
 const bjBudget=estimate(bj);
 assert.ok(bjBudget.total>0);

 const gz=buildPlan({city:'guangzhou',days:2,budget:2200,pace:'balanced',interests:['Food','Culture'],date:'2026-12-01'});
 assert.equal(gz.input.city,'guangzhou');
 assert.equal(gz.days.length,2);
 assert.ok(placesForCity('guangzhou').length>=9);
 for(const stop of gz.days.flatMap(d=>d.stops))assert.equal(placeById(stop.placeId)?.city,'guangzhou');
});

test('DeepSeek upgraded adapter returns structured routeLogic, diningTip, and pitfallTip for Beijing/Guangzhou',async()=>{
 const input={city:'guangzhou',days:2,budget:2400,pace:'balanced',interests:['Culture','Food'],date:'2026-12-01'};
 const expected=buildPlan(input);
 const mockResponse={
  placeIds:expected.days.flatMap(day=>day.stops.map(stop=>stop.placeId)),
  summary:'Balanced two-day Guangzhou loop through the selected stops.',
  dailyAdvice:[
   {day:1,routeLogic:'The scheduled Liwan stops connect by local transit.',diningTip:'Try traditional morning dim sum around Xiguan before midday crowds.',pitfallTip:'Check Monday museum closures for scheduled venues.'}
  ]
 };
 const plan=await generate(
  input,
  {apiKey:'fake-key',fetcher:async()=>({ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(mockResponse)}}]})})}
 );
 assert.equal(plan.mode,'ai');
 assert.equal(plan.input.city,'guangzhou');
 assert.match(plan.aiSummary,/Guangzhou/);
 assert.match(plan.days[0].advice.routeLogic,/Liwan/);
 assert.match(plan.days[0].advice.diningTip,/dim sum/);
 assert.match(plan.days[0].advice.pitfallTip,/Monday/);
});
