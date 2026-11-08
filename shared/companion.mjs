import {places,reviewed} from './catalog.mjs';
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
export const bookingRules={
 museum:{title:'Check museum admission requirements',passport:'Bring your original passport or another accepted original ID.',requirement:'Individual general admission currently needs no reservation. Interactive spaces require special reservations; paid exhibitions have separate arrangements.',verified:reviewed,caution:'Use the museum’s own reservation channels. Tuesday closures generally apply except national holidays. Recheck your visit date.'},
 yuyuan:{title:'Check Yu Garden tickets',passport:'Passport / accepted ID requirements: confirm with the operator.',requirement:'Confirm ticket purchase, date-specific hours, and whether advance booking is needed. The bazaar and the paid garden are separate.',verified:null,caution:'This is an official city guide handoff, not a verified checkout. Avoid treating a third-party ticket offer as the official operator.'},
 jingan:{title:'Check Jing’an Temple admission',passport:'Passport / accepted ID requirements: confirm with the operator.',requirement:'Check admission, current ticket channels, and ceremony-related restrictions directly before visiting.',verified:null,caution:'Do not assume a timed reservation is required or that a ticket is available. The itinerary price is only an estimate.'}
};
export function bookingTasks(plan,includeRail=false){
 const tasks=[];
 if(plan){
  const scheduled=plan.days.flatMap(day=>day.stops.map((stop,index)=>({date:day.date,...stop,identity:stopKey(plan,day,stop,index)})));
  for(const [placeId,rule] of Object.entries(bookingRules)){
   const stops=scheduled.filter(s=>s.placeId===placeId);if(!stops.length)continue;
   const place=places.find(p=>p.id===placeId);
   tasks.push({id:`venue:${placeId}`,title:rule.title,passport:rule.passport,requirement:rule.requirement,caution:rule.caution,verified:rule.verified,reviewed,url:place.booking,source:placeId==='museum'?'Official museum operator':'Official city visitor guide',dates:[...new Set(stops.map(s=>s.date))],fingerprint:stops.map(s=>s.identity).sort().join('|')});
  }
 }
 if(includeRail)tasks.push({id:'rail',title:'Confirm your train booking',passport:'Valid passport used for booking; identity verification may be required.',requirement:'Check your identity-verification status and actual ticket order in Railway 12306. Match your name, station, date, and train.',caution:'A search result, payment attempt, or checklist tick is not an issued ticket. Check the operator order status and carry the original booking document.',verified:reviewed,reviewed,url:'https://www.12306.cn/en/index.html',source:'China Railway · official English booking',dates:[],fingerprint:plan?JSON.stringify(plan.input):'no-plan'});
 tasks.push({id:'hotel',title:"Save your hotel’s Chinese address",passport:'Accommodation document requirements: confirm with your hotel.',requirement:'Get the exact Chinese property name, full address, and official hotel website from your accommodation confirmation.',caution:'Match the specific property and map pin. User-entered addresses and links are not verified by this app.',verified:null,reviewed:null,url:null,source:'Your hotel’s official website · add below',dates:[],fingerprint:''});
 return tasks;
}
export function taskKey(plan,task,extra=''){return JSON.stringify([plan?.createdAt||'no-plan',task.id,task.fingerprint,task.requirement,task.passport,task.verified,task.url,extra]);}
export function safeOperatorUrl(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}}
