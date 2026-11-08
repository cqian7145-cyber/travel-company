import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arrivalCard,defaultArrival,connectivityFlows,defaultConnectivity,connectivityPriorities,validConnectivity} from '../shared/arrival.mjs';
import {phraseCards,renderPhrase,addressFingerprint,allergyWarning} from '../shared/phrases.mjs';
import {buildOfflineHtml} from '../shared/offline-pack.mjs';
const hotel={name:'测试酒店',address:'上海市静安区示例路123号',url:'https://example.com',phone:'+86 21 12345678'};
const details={trainNumber:'G123',destinationId:'bund',confirmedAddress:addressFingerprint(hotel),confirmedDestination:JSON.stringify(['bund','上海市黄浦区中山东一路'])};
test('arrival airport/terminal mappings remain distinct and unknown terminal never invents a gate',()=>{
 assert.match(arrivalCard({...defaultArrival,terminal:'T1'}).pickup,/Gate 12/);
 assert.match(arrivalCard({...defaultArrival,terminal:'T2'}).pickup,/Gate 25/);
 assert.match(arrivalCard({...defaultArrival,airport:'SHA',terminal:'T1'}).pickup,/Gate 1 /);
 assert.match(arrivalCard({...defaultArrival,airport:'SHA',terminal:'T2'}).pickup,/Gate 4 /);
 assert.doesNotMatch(arrivalCard(defaultArrival).pickup,/Gate \d/);
 assert.throws(()=>arrivalCard({...defaultArrival,airport:'LHR'}));
});
test('late-night and heavy-luggage plans prioritize taxi and never promise rail availability',()=>{
 for(const patch of [{time:'late'},{time:'evening'},{luggage:'heavy'}])assert.equal(arrivalCard({...defaultArrival,...patch}).preferred,'taxi');
 const late=arrivalCard({...defaultArrival,time:'late'});assert.match(late.timeWarning,/do not rely/);
 assert.match(late.options.find(o=>o.id==='metro').condition,/NOT VERIFIED/);
 assert.equal(arrivalCard(defaultArrival).preferred,'metro');
});
test('People’s Square reference fares are never applied to arbitrary hotels or Hongqiao',()=>{
 assert.doesNotMatch(JSON.stringify(arrivalCard(defaultArrival)),/¥180|¥7/);
 const reference=arrivalCard({...defaultArrival,area:'peoples-square'});assert.match(JSON.stringify(reference),/¥180/);assert.match(JSON.stringify(reference),/¥7/);
 assert.doesNotMatch(JSON.stringify(arrivalCard({...defaultArrival,airport:'SHA',area:'peoples-square'})),/¥180|¥7/);
});
test('connectivity distinguishes data, home-number SMS and app access without certifying device compatibility',()=>{
 const priorities=connectivityPriorities({...defaultConnectivity,plan:'esim'}).join(' ');
 assert.match(priorities,/data-only/);assert.match(priorities,/home number/);assert.match(priorities,/cannot confirm eSIM compatibility/);assert.match(priorities,/No connection type guarantees/);
 assert.equal(validConnectivity({...defaultConnectivity,device:'generic'}),false);
 assert.equal(connectivityFlows.length,4);assert.ok(connectivityFlows.find(f=>f.id==='wifi').steps.join(' ').includes('passport'));
 assert.ok(connectivityFlows.find(f=>f.id==='internet').steps.join(' ').includes('APN'));
});
test('24 unique scenarios cover all six categories; personalized data are required',()=>{
 assert.equal(phraseCards.length,24);assert.equal(new Set(phraseCards.map(c=>c.id)).size,24);
 assert.equal(new Set(phraseCards.map(c=>c.group)).size,6);
 const taxi=phraseCards.find(c=>c.id==='taxi-hotel');assert.equal(renderPhrase(taxi,hotel,{...details,confirmedAddress:''}).ready,false);
 assert.equal(renderPhrase(taxi,{...hotel,address:'changed address'},details).ready,false);
 const complete=renderPhrase(taxi,hotel,details);assert.equal(complete.ready,true);assert.match(complete.address,/123/);
});
test('itinerary destinations and train numbers must be explicitly usable; old confirmations are not reused',()=>{
 const place=phraseCards.find(c=>c.id==='taxi-place');assert.equal(renderPhrase(place,hotel,{...details,confirmedDestination:''}).ready,false);
 assert.equal(renderPhrase(place,hotel,details).ready,true);
 const gate=phraseCards.find(c=>c.id==='train-gate');assert.equal(renderPhrase(gate,hotel,{...details,trainNumber:'<bad>'}).ready,false);
 assert.match(renderPhrase(gate,hotel,details).zh,/G123/);
});
test('allergy wording explicitly addresses allergy, ingredients, sauces and shared-equipment risks',()=>{
 for(const card of phraseCards.filter(c=>c.kind==='allergy')){assert.match(card.zh,/过敏/);assert.match(card.zh,/食材和酱料/);assert.match(card.zh,/交叉接触/);assert.match(card.zh,/如果无法确认/);}
 assert.match(allergyWarning,/not a food-safety guarantee/);assert.match(allergyWarning,/not been clinically certified/);
});
test('offline HTML is standalone, escapes personal fields, and contains all four recovery flows',()=>{
 const malicious={...hotel,name:'<script>alert(1)</script>'};
 const html=buildOfflineHtml({hotel:malicious,details:{...details,confirmedAddress:addressFingerprint(malicious)},arrival:defaultArrival,connectivity:defaultConnectivity});
 assert.doesNotMatch(html,/<script|<img|<link|<iframe/i);assert.match(html,/&lt;script&gt;/);
 for(const flow of connectivityFlows)assert.ok(html.includes(flow.title.replaceAll('&','&amp;')));
 assert.match(html,/Content-Security-Policy/);assert.match(html,/default-src 'none'/);assert.match(html,/SHOW|Speak Local/);
});
test('offline backup never prints a personalized destination when the address is unconfirmed',()=>{
 const html=buildOfflineHtml({hotel,details:{...details,confirmedAddress:'',confirmedDestination:''}});
 assert.doesNotMatch(html,/示例路123号/);assert.match(html,/Requires your confirmed complete details/);
});
