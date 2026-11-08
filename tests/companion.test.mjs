import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildPlan} from '../shared/planner.mjs';
import {shanghaiDate,stopKey,dayStops,nextStop,nearbyPlaces,bookingTasks,taskKey,safeOperatorUrl} from '../shared/companion.mjs';
const input={days:3,budget:2400,pace:'balanced',interests:['Culture'],date:'2026-11-07'};
const fixture=()=>buildPlan(input);
test('Shanghai today uses local midnight rather than device timezone',()=>{
 assert.equal(shanghaiDate(new Date('2026-11-07T15:59:00Z')),'2026-11-07');
 assert.equal(shanghaiDate(new Date('2026-11-07T16:01:00Z')),'2026-11-08');
});
test('next stop follows planned time; skip/done are reversible without deleting stops',()=>{
 const p=fixture(),d=p.days[0];d.stops[0].time='16:00';d.stops[1].time='09:00';
 const first=nextStop(p,d,{});assert.equal(first.stop.time,'09:00');
 const progress={[first.key]:'skipped'};assert.equal(nextStop(p,d,progress).stop.time,'16:00');
 progress[nextStop(p,d,progress).key]='done';assert.equal(nextStop(p,d,progress),null);
 delete progress[first.key];assert.equal(nextStop(p,d,progress).stop.time,'09:00');assert.equal(d.stops.length,2);
});
test('progress is isolated across trips, repeated venues, time changes and replacements',()=>{
 const p=fixture(),d=p.days[0],a=stopKey(p,d,d.stops[0],0);
 assert.notEqual(a,stopKey({...p,createdAt:'other-trip'},d,d.stops[0],0));
 assert.notEqual(a,stopKey(p,d,{...d.stops[0],time:'23:00'},0));
 assert.notEqual(a,stopKey(p,d,{...d.stops[0],placeId:'bund'},0));
 assert.notEqual(a,stopKey(p,d,{...d.stops[0],id:'another-occurrence'},0));
 assert.equal(a,stopKey(p,d,{...d.stops[0],note:'Bring water'},0));
});
test('legacy saved plans without stop IDs remain usable and unknown places are ignored',()=>{
 const p=fixture(),d=p.days[0];delete d.stops[0].id;assert.ok(stopKey(p,d,d.stops[0],0));
 d.stops.push({placeId:'unknown',time:'08:00',note:''});assert.equal(dayStops(p,d,{}).length,2);
});
test('nearby alternatives exclude scheduled places and use a bounded distance',()=>{
 const nearby=nearbyPlaces('bund',['bund','yuyuan']);assert.ok(nearby.length>0);
 assert.ok(nearby.every(p=>!['bund','yuyuan'].includes(p.id)&&p.distanceKm<=3));
 assert.ok(nearby.every((p,i)=>!i||p.distanceKm>=nearby[i-1].distanceKm));assert.deepEqual(nearbyPlaces('missing',[]),[]);
});
test('booking tasks are derived from itinerary; train followup is opt-in',()=>{
 const p=fixture();const tasks=bookingTasks(p,false);assert.ok(tasks.some(t=>t.id==='hotel'));
 assert.ok(!tasks.some(t=>t.id==='rail'));assert.ok(bookingTasks(p,true).some(t=>t.id==='rail'));
 p.days.forEach(d=>d.stops=[]);assert.deepEqual(bookingTasks(p,false).map(t=>t.id),['hotel']);
});
test('venue confirmation changes with itinerary dates/times but not personal notes',()=>{
 const p=fixture(),task=bookingTasks(p,false).find(t=>t.id.startsWith('venue:'));assert.ok(task);
 const original=taskKey(p,task);const stop=p.days.flatMap(d=>d.stops).find(s=>task.id===`venue:${s.placeId}`);
 stop.note='new personal note';assert.equal(original,taskKey(p,bookingTasks(p,false).find(t=>t.id===task.id)));
 stop.time='23:30';assert.notEqual(original,taskKey(p,bookingTasks(p,false).find(t=>t.id===task.id)));
});
test('operator URL accepts HTTPS only and rejects credentials and executable URLs',()=>{
 assert.equal(safeOperatorUrl('javascript:alert(1)'),null);assert.equal(safeOperatorUrl('http://example.com'),null);
 assert.equal(safeOperatorUrl('https://name:secret@example.com'),null);assert.equal(safeOperatorUrl('not a url'),null);
 assert.equal(safeOperatorUrl('https://example.com/hotel'),'https://example.com/hotel');
});
test('changed booking guidance and changed hotel details invalidate user confirmations',()=>{
 const p=fixture(),task=bookingTasks(p,true).find(t=>t.id==='rail');
 assert.notEqual(taskKey(p,task),taskKey(p,{...task,requirement:'A changed operator requirement'}));
 assert.notEqual(taskKey(p,task),taskKey(p,{...task,verified:'2026-11-08'}));
 const hotel=bookingTasks(p,false).find(t=>t.id==='hotel');
 assert.notEqual(taskKey(p,hotel,'old address'),taskKey(p,hotel,'new address'));
});
test('empty days have no next stop; a repeated venue has separate occurrences',()=>{
 const p=fixture(),d=p.days[0];d.stops.push({...d.stops[0],id:'repeat',time:'18:00'});
 const items=dayStops(p,d,{});assert.equal(items.length,3);assert.notEqual(items[0].key,items[2].key);
 d.stops=[];assert.equal(nextStop(p,d,{}),null);
});
