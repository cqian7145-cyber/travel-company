import {test} from 'node:test';
import assert from 'node:assert/strict';
import {matchAdventure,validDiscovery,discoveryFields} from '../shared/micro-adventures.mjs';
import {experiences,stories} from '../shared/story-catalog.mjs';
import {venues} from '../shared/verification.mjs';
import {validateCulture} from '../scripts/validate-stories.mjs';

const now='2026-11-08';
test('interests match existing experiences deterministically at 45 and 90 minutes',()=>{
 for(const [interest,id] of [['food','breakfast-observation'],['history','lane-observation'],['perspectives','park-observation']])for(const minutes of [45,90]){
  const result=matchAdventure(interest,minutes,{now});assert.equal(result.kind,'direction');assert.equal(result.experience.id,id);assert.equal(result.needsChecks,true);assert.ok(result.experience.discovery.maxMinutes<=minutes);
 }
});
test('15 minutes offers reading for every interest, never a guaranteed on-site activity',()=>{
 for(const interest of ['food','history','perspectives']){const result=matchAdventure(interest,15,{now});assert.equal(result.kind,'reading');assert.ok(result.story.slug);assert.match(result.reason,/No full activity fits/);}
});
test('invalid inputs, unpublished content and missing conditions cannot yield an outing',()=>{
 assert.equal(matchAdventure('unknown',45).kind,'empty');assert.equal(matchAdventure('food',16).kind,'empty');
 for(const change of [e=>e.status='draft',e=>e.conditions=[],e=>e.discovery.maxMinutes=0,e=>e.storyIds=['missing']]){
  const records=structuredClone(experiences);change(records.find(e=>e.id==='breakfast-observation'));assert.equal(matchAdventure('food',45,{records,now}).kind,'empty');
 }
});
test('unknown evidence stays a direction requiring checks; missing venue blocks outing',()=>{
 const result=matchAdventure('history',45,{now});assert.equal(result.kind,'direction');assert.equal(result.needsChecks,true);
 assert.equal(matchAdventure('history',45,{venueRecords:[],now}).kind,'reading');
 const breakfast=matchAdventure('food',45,{now});assert.equal(breakfast.venues.length,0);assert.equal(breakfast.needsChecks,true);
});
test('conflicting or overdue access evidence falls back to a story rather than an outing',()=>{
 for(const field of discoveryFields){
  const venueRecords=structuredClone(venues),fact=venueRecords.find(v=>v.id==='xintiandi').facts[field];fact.status='conflicting';
  assert.equal(matchAdventure('history',45,{venueRecords,now}).kind,'reading');
 }
 const venueRecords=structuredClone(venues),v=venueRecords.find(v=>v.id==='xintiandi');
 const source=venues.find(v=>v.id==='museum').facts.opening_hours;
 // Use a genuine registered source snapshot solely as a fixture for expiry behavior.
 v.facts.opening_hours={...source,next_review_at:'2026-11-14'};
 assert.equal(matchAdventure('history',45,{venueRecords,now:'2026-11-14'}).kind,'reading');
});
test('no matching story produces an honest empty state and matching never mutates data',()=>{
 const before=JSON.stringify({experiences,venues,stories});assert.equal(matchAdventure('food',45,{storyRecords:[],now}).kind,'empty');matchAdventure('food',90,{now});assert.equal(JSON.stringify({experiences,venues,stories}),before);
});
test('discovery metadata validation rejects invalid ranges and unsupported interests',()=>{
 assert.equal(validDiscovery({interest:'food',minMinutes:45,maxMinutes:30,summary:'Bad range'}),false);
 const records=structuredClone(experiences);records[0].discovery.interest='invented';assert.ok(validateCulture(stories,records,{},[],now).some(e=>e.includes('invalid discovery')));
});
