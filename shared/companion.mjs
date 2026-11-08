import {places,sources} from './catalog.mjs';
import {venues,venueById,bookingEvidenceChange} from './verification.mjs';
const reviewed=sources.rail.reviewed;
/** @typedef {ReturnType<typeof import('./planner.mjs').buildPlan>} Plan */

export function shanghaiDate(now=new Date()){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 return ['year','month','day'].map(type=>parts.find(p=>p.type===type).value).join('-');
}
export function mapUrl(place){return `https://uri.amap.com/search?keyword=${encodeURIComponent(place.zh+' '+place.address)}&city=Shanghai&view=map&callnative=0`;}
export function stopKey(plan,day,stop,index){return JSON.stringify([plan.createdAt,day.date,stop.id||`legacy-${index}`,stop.placeId,stop.time]);}
/** @param {Plan} plan @param {Plan['days'][number]} day @param {Record<string,string>} progress */
export function dayStops(plan,day,progress){
 return day.stops.map((stop,index)=>({stop,index,place:places.find(p=>p.id===stop.placeId),key:stopKey(plan,day,stop,index)}))
  .filter(item=>item.place).map(item=>({...item,status:['done','skipped'].includes(progress[item.key])?progress[item.key]:'pending'}))
  .sort((a,b)=>a.stop.time.localeCompare(b.stop.time)||a.index-b.index);
}
export function nextStop(plan,day,progress){return dayStops(plan,day,progress).find(item=>item.status==='pending')||null;}
export function nearbyPlaces(placeId,exclude=[]){
 const origin=places.find(p=>p.id===placeId);if(!origin)return [];
 const rad=v=>v*Math.PI/180;
 return places.filter(p=>p.id!==placeId&&!exclude.includes(p.id)).map(p=>{
  const a=Math.sin(rad(p.lat-origin.lat)/2)**2+Math.cos(rad(origin.lat))*Math.cos(rad(p.lat))*Math.sin(rad(p.lng-origin.lng)/2)**2;
  return {...p,distanceKm:6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))};
 }).filter(p=>p.distanceKm<=3).sort((a,b)=>a.distanceKm-b.distanceKm).slice(0,3);
}
// Compatibility export; booking facts have a single owner in data/venues.json.
export const bookingRules=Object.fromEntries(venues.filter(v=>v.booking_task).map(v=>[v.id,{title:v.booking_task.title,passport:v.facts.identity_requirements.value,requirement:v.facts.reservation.value,verified:v.facts.reservation.verified_at,caution:v.booking_task.caution}]));
export function bookingTasks(plan,includeRail=false,now=new Date()){
 const tasks=[];
 if(plan){
  const scheduled=plan.days.flatMap(day=>day.stops.map((stop,index)=>({date:day.date,...stop,identity:stopKey(plan,day,stop,index)})));
  for(const [placeId,rule] of Object.entries(bookingRules)){
   const stops=scheduled.filter(s=>s.placeId===placeId);if(!stops.length)continue;
   const place=places.find(p=>p.id===placeId);
   tasks.push({id:`venue:${placeId}`,title:rule.title,passport:rule.passport,requirement:rule.requirement,caution:rule.caution,verified:rule.verified,reviewed:place.facts.reservation.reviewed_at,evidenceChange:bookingEvidenceChange(venueById(placeId),now),facts:place.facts,url:place.booking,source:placeId==='museum'?'Official museum operator':'Official city visitor guide',dates:[...new Set(stops.map(s=>s.date))],fingerprint:stops.map(s=>s.identity).sort().join('|')});
  }
 }
 if(includeRail)tasks.push({id:'rail',title:'Confirm your train booking',passport:'Valid passport used for booking; identity verification may be required.',requirement:'Check your identity-verification status and actual ticket order in Railway 12306. Match your name, station, date, and train.',caution:'A search result, payment attempt, or checklist tick is not an issued ticket. Check the operator order status and carry the original booking document.',verified:reviewed,reviewed,url:'https://www.12306.cn/en/index.html',source:'China Railway · official English booking',dates:[],fingerprint:plan?JSON.stringify(plan.input):'no-plan'});
 tasks.push({id:'hotel',title:"Save your hotel’s Chinese address",passport:'Accommodation document requirements: confirm with your hotel.',requirement:'Get the exact Chinese property name, full address, and official hotel website from your accommodation confirmation.',caution:'Match the specific property and map pin. User-entered addresses and links are not verified by this app.',verified:null,reviewed:null,url:null,source:'Your hotel’s official website · add below',dates:[],fingerprint:''});
 return tasks;
}
export function taskKey(plan,task,extra=''){return JSON.stringify([plan?.createdAt||'no-plan',task.id,task.fingerprint,task.requirement,task.passport,task.verified,task.url,extra,...(task.evidenceChange?[task.evidenceChange]:[])]);}
export function safeOperatorUrl(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}}
