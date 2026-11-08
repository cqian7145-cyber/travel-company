import {places,interests} from './catalog.mjs';
export function validateInput(input){
 if(!input || typeof input!=='object') throw new Error('Trip details are required.');
 if(!Number.isInteger(input.days)||input.days<1||input.days>7) throw new Error('Choose between 1 and 7 days.');
 if(!Number.isInteger(input.budget)||input.budget<100||input.budget>100000) throw new Error('Budget must be between ¥100 and ¥100,000.');
 if(!['relaxed','balanced','packed'].includes(input.pace)) throw new Error('Choose a valid travel pace.');
 if(!Array.isArray(input.interests)||!input.interests.length||input.interests.some(x=>!interests.includes(x))) throw new Error('Choose at least one listed interest.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||Number.isNaN(Date.parse(input.date))||new Date(input.date+'T12:00:00Z').toISOString().slice(0,10)!==input.date) throw new Error('Choose a valid start date.');
 return {days:input.days,budget:input.budget,pace:input.pace,interests:[...new Set(input.interests)],date:input.date};
}
export function buildPlan(raw, preferredIds=[]){
 const input=validateInput(raw), used=new Set(), count={relaxed:1,balanced:2,packed:3}[input.pace];
 const allowance=Math.max(0,input.budget/input.days/1.15-510);
 const score=p=>p.tags.filter(t=>input.interests.includes(t)).length*10+(preferredIds.includes(p.id)?(preferredIds.length-preferredIds.indexOf(p.id))*3:0)-(p.cost>allowance?100:0);
 const sorted=[...places].sort((a,b)=>score(b)-score(a));
 const days=Array.from({length:input.days},(_,i)=>{
  const date=new Date(input.date+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+i);
  const available=sorted.filter(p=>!used.has(p.id)&&p.closedDay!==date.getUTCDay());
  const first=available[0];
  const grouped=first?[first,...available.filter(p=>p.id!==first.id).sort((a,b)=>(score(b)+(b.cluster===first.cluster?15:0))-(score(a)+(a.cluster===first.cluster?15:0)))]:[];
  const stops=grouped.slice(0,count).map((p,j)=>{used.add(p.id);return {id:crypto.randomUUID(),placeId:p.id,time:['10:00','14:00','16:00'][j],note:''};});
  return {date:date.toISOString().slice(0,10),stops,note:stops.length<count?'Free time: the curated collection is small. Add a personal activity or revisit a favorite.':''};
 });
 return {input,days,mode:'curated',createdAt:new Date().toISOString()};
}
export function estimate(plan){
 const admission=plan.days.flatMap(d=>d.stops).reduce((sum,s)=>sum+(places.find(p=>p.id===s.placeId)?.cost||0),0);
 const food=plan.input.days*120,transport=plan.input.days*40,lodging=plan.input.days*350;
 const subtotal=admission+food+transport+lodging,buffer=Math.ceil(subtotal*.15);
 return {admission,food,transport,lodging,buffer,total:subtotal+buffer,overBudget:subtotal+buffer>plan.input.budget};
}
export function validateAiOrder(value){
 if(!Array.isArray(value)||value.some(x=>typeof x!=='string'||!places.some(p=>p.id===x)))throw new Error('AI returned an invalid place selection.');
 return [...new Set(value)];
}
