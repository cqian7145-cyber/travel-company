import {test} from 'node:test';
import assert from 'node:assert/strict';
import legacyPlaces from './fixtures/catalog-v1.json' with {type:'json'};
import legacyBookings from './fixtures/bookings-v1.json' with {type:'json'};
import {places} from '../shared/catalog.mjs';
import {bookingTasks,taskKey} from '../shared/companion.mjs';
import {buildPlan} from '../shared/planner.mjs';
import {auditData,venues,evidenceSources,dataVersion,factStatus,venueById,bookingEvidenceChange,offlineDataState,validDate} from '../shared/verification.mjs';
import {buildOfflineHtml} from '../shared/offline-pack.mjs';
import {dataHash} from '../scripts/data-hash.mjs';
const date='2026-11-08';
test('dataset fingerprint detects unversioned evidence changes without altering verification dates',()=>{
 assert.equal(dataHash(venues,evidenceSources),dataVersion.content_hash);const changed=structuredClone(venues);changed[0].facts.address.value+=' Updated';assert.notEqual(dataHash(changed,evidenceSources),dataVersion.content_hash);
});
test('VDC preserves all nine stable IDs and legacy flat catalog values',()=>{
 assert.equal(places.length,9);for(const old of legacyPlaces){const current=places.find(p=>p.id===old.id);for(const [key,value]of Object.entries(old))if(key!=='hoursVerified')assert.deepEqual(current[key],value,`${old.id}.${key}`);}
});
test('unchanged venue, railway and hotel confirmation keys survive migration',()=>{
 const tasks=bookingTasks(legacyBookings.plan,true,new Date(date));
 for(const old of legacyBookings.keys){const task=tasks.find(t=>t.id===old.id);assert.ok(task);assert.equal(taskKey(legacyBookings.plan,task),old.key,old.id);}
});
test('field status never equates source presence, source review or an estimate to verification',()=>{
 assert.equal(factStatus(venueById('yuyuan').facts.opening_hours,date),'unknown');
 assert.equal(factStatus(venueById('museum').facts.admission,date),'estimated');
 assert.equal(factStatus({...venueById('museum').facts.opening_hours,source_id:'missing'},date),'unknown');
 assert.equal(factStatus({...venueById('museum').facts.opening_hours,verified_at:null},date),'unknown');
 assert.equal(factStatus({...venueById('museum').facts.opening_hours,verified_at:'2099-01-01'},date),'unknown');
});
test('legacy global review stamps are not copied into unsupported field or source dates',()=>{
 for(const venue of venues){for(const fact of Object.values(venue.facts))if(fact.status!=='verified'){assert.equal(fact.verified_at,null);assert.equal(fact.reviewed_at,null);}const source=evidenceSources[venue.facts.opening_hours.source_id];if(venue.id!=='museum')assert.equal(source.last_accessed_at,null);}
});
test('verified snapshots expire on review date without hiding the recorded value',()=>{
 const f=venueById('museum').facts.opening_hours;
 assert.equal(factStatus(f,'2026-11-13'),'verified');assert.equal(factStatus(f,'2026-11-14'),'expired');assert.equal(factStatus(f,'2027-01-01'),'expired');assert.match(f.value,/10:00/);
 assert.equal(validDate('2026-02-30'),false);
});
test('booking evidence changes reset confirmations for requirements, ID, link kind, dates, caution and expiry',()=>{
 const original=venueById('museum');assert.equal(bookingEvidenceChange(original,date),null);
 for(const mutate of [v=>v.facts.reservation.value+=' Changed rule.',v=>v.facts.opening_hours.value='Changed opening hours',v=>v.facts.identity_requirements.status='conflicting',v=>v.facts.booking_link.value.kind='reservation_portal',v=>v.facts.reservation.next_review_at='2026-11-15',v=>v.booking_task.caution+=' Changed caution.']){
  const v=structuredClone(original);mutate(v);assert.ok(bookingEvidenceChange(v,date));
 }
 assert.ok(bookingEvidenceChange(original,'2026-11-14'));
 const editorial=structuredClone(original);editorial.description+=' Editorial change.';assert.equal(bookingEvidenceChange(editorial,date),null);
 const task=bookingTasks(legacyBookings.plan).find(t=>t.id==='venue:museum');assert.notEqual(taskKey(legacyBookings.plan,task),taskKey(legacyBookings.plan,{...task,evidenceChange:'new-evidence'}));
});
test('unified booking tasks resolve the canonical field and source references',()=>{
 for(const task of bookingTasks(legacyBookings.plan).filter(t=>t.id.startsWith('venue:'))){const v=venueById(task.id.slice(6));assert.equal(task.requirement,v.facts.reservation.value);assert.equal(task.passport,v.facts.identity_requirements.value);assert.equal(task.url,v.facts.booking_link.value.url);assert.equal(task.facts,v.facts);}
});
test('quality audit reports unknowns, conflicts and expiry while failing structural problems',()=>{
 const current=auditData(venues,evidenceSources,date);assert.deepEqual(current.errors,[]);assert.equal(current.warnings.length,88);
 const broken=structuredClone(venues);delete broken[0].facts.address;broken[1].facts.opening_hours.source_id='missing';broken[2].facts.opening_hours.verified_at='2026-02-30';broken[3].facts.reservation.status='conflicting';broken[4].id=broken[0].id;
 const result=auditData(broken,evidenceSources,'2026-11-14');assert.ok(result.errors.some(e=>e.includes('missing required fact')));assert.ok(result.errors.some(e=>e.includes('missing source')));assert.ok(result.errors.some(e=>e.includes('duplicate')));assert.ok(result.warnings.some(e=>e.includes('conflicting')));assert.ok(result.warnings.some(e=>e.includes('overdue')));
});
test('quality audit rejects falsely typed transactional links and mismatched sources',()=>{
 const broken=structuredClone(venues);broken[0].facts.booking_link.value.kind='ticket_checkout';broken[1].facts.booking_link.value.url='javascript:alert(1)';const result=auditData(broken,evidenceSources,date);assert.ok(result.errors.some(e=>e.includes('transactional')));assert.ok(result.errors.some(e=>e.includes('link conflicts')));assert.ok(result.errors.some(e=>e.includes('invalid link')));
});
test('offline version states distinguish unknown, old and overdue snapshots and never block access',()=>{
 const saved={dataVersion:dataVersion.version,savedAt:'2026-11-08T00:00:00Z',reviewDueAt:'2026-11-14'};
 assert.equal(offlineDataState(null,dataVersion,date).state,'unknown');assert.equal(offlineDataState({...saved,dataVersion:'old'},dataVersion,date).state,'outdated');assert.equal(offlineDataState(saved,dataVersion,'2026-11-14').state,'expired');assert.equal(offlineDataState(saved,dataVersion,date).state,'snapshot');
 const html=buildOfflineHtml({hotel:{name:'',address:'',url:''},details:{trainNumber:'',destinationId:'',confirmedAddress:'',confirmedDestination:''}});assert.ok(html.includes(dataVersion.version));assert.match(html,/cannot detect future updates/);assert.match(html,/Older addresses, phrases and plans remain readable/);assert.doesNotMatch(html,/<script/i);
});
test('legacy itinerary structure stays compatible after data migration',()=>{
 const p=buildPlan(legacyBookings.plan.input);assert.deepEqual(Object.keys(p).sort(),['createdAt','days','input','mode']);assert.ok(p.days.every(d=>d.stops.every(s=>places.some(x=>x.id===s.placeId))));assert.deepEqual(Object.keys(p.days[0].stops[0]).sort(),['id','note','placeId','time']);
});
