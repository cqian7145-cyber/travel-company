import {venues,evidenceSources,factStatus} from './verification.mjs';
import {experiences} from './story-catalog.mjs';

export const riskPriorities={
 public_street:['address','public_access','temporary_restrictions'],
 park:['address','opening_hours','temporary_restrictions'],
 self_selected_food:['address','opening_hours','admission','ingredients'],
 ticketed_venue:['address','admission','reservation','identity_requirements','opening_hours','last_entry'],
 reserved_activity:['address','activity_date','availability','admission','cancellation','operator']
};
const labels={address:'Starting point',public_access:'Public access & private boundaries',temporary_restrictions:'Temporary restrictions',opening_hours:'Opening & access',admission:'Cost / admission',ingredients:'Ingredients & allergy confirmation',reservation:'Reservation',identity_requirements:'Passport / identity',last_entry:'Last entry',activity_date:'Activity date',availability:'Places available',cancellation:'Cancellation rules',operator:'Actual operator'};
export function readinessLabel(status){return ({verified:'Confirmed snapshot',expired:'Needs recheck',estimated:'Estimate',conflicting:'Conflicting evidence',unknown:'Unknown'})[status]||'Unknown';}
export function experienceReadiness(experience,now=new Date(),records=venues,registry=evidenceSources){
 const keys=riskPriorities[experience.riskType]||['address','opening_hours','reservation'];
 const linked=experience.relatedVenueIds.map(id=>records.find(v=>v.id===id)).filter(Boolean);
 if(!linked.length)return keys.map(key=>({key,label:labels[key]||key,status:'unknown',statusLabel:'Unknown',value:experience.riskType==='self_selected_food'?'Choose your own public-facing shop. No specific vendor, price, hours, ingredients or booking requirement is verified.':'No linked location has current evidence for this requirement.',source:null,verifiedAt:null,reviewDueAt:null,venueId:null}));
 return linked.flatMap(v=>keys.map(key=>{
  const fact=v.facts[key],source=fact&&registry[fact.source_id];
  const status=fact?factStatus(fact,now):'unknown';
  return {key,label:labels[key]||key,status:source?status:'unknown',statusLabel:readinessLabel(source?status:'unknown'),value:fact?.value===null||fact?.value===undefined?'No field-specific rule recorded. Confirm with the official operator or signs before departure.':typeof fact.value==='object'?'Consult the linked field evidence.':String(fact.value),source:source?{url:source.url,title:source.name||source.title,kind:source.kind}:null,verifiedAt:fact?.verified_at||null,reviewDueAt:fact?.next_review_at||null,venueId:v.id};
 }));
}
export function experienceFacts(x,now=new Date()){
 const evidence=experienceReadiness(x,now),access=evidence.filter(e=>['opening_hours','public_access','temporary_restrictions'].includes(e.key));
 const current=access.length>0&&access.every(e=>e.status==='verified');
 return [{label:'Duration',value:x.duration},{label:'Cost',value:x.costNature},{label:'Format',value:x.format},{label:'Access',value:current?'Dated access evidence is available; confirm it for your travel date.':'Access is not confirmed. Read the departure checks; unknown does not mean reservation-free.'},{label:'Language',value:x.languageSupport},{label:'Limitations',value:x.risks.join(' ')}];
}

export const emptyJourneys={};
export const emptyJourney=()=>({phase:'idle',observation:0,report:null,startedAt:null,updatedAt:null});
const phases=['idle','active','paused','reflecting','reported'];
const reports=['tried','read_only','stopped'];
export function validJourneys(value){return !!value&&typeof value==='object'&&!Array.isArray(value)&&Object.entries(value).every(([id,s])=>{
 const x=experiences.find(e=>e.id===id);
 return x&&s&&phases.includes(s.phase)&&Number.isInteger(s.observation)&&s.observation>=0&&s.observation<x.observations.length&&(s.report===null||reports.includes(s.report))&&((s.phase==='reported')===(s.report!==null))&&['startedAt','updatedAt'].every(key=>s[key]===null||typeof s[key]==='string'&&Number.isFinite(Date.parse(s[key])));
});}
export function transitionJourney(current,action,experience,now=new Date().toISOString()){
 const s=current||emptyJourney();
 if(!Number.isFinite(Date.parse(now)))throw Error('Invalid journey timestamp.');
 if(action.type==='reset')return emptyJourney();
 if(action.type==='start')return {...emptyJourney(),phase:'active',startedAt:now,updatedAt:now};
 if(action.type==='pause'&&s.phase==='active')return {...s,phase:'paused',updatedAt:now};
 if(action.type==='resume'&&s.phase==='paused')return {...s,phase:'active',updatedAt:now};
 if(action.type==='next'&&s.phase==='active')return {...s,phase:s.observation+1>=experience.observations.length?'reflecting':'active',observation:Math.min(s.observation+1,experience.observations.length-1),updatedAt:now};
 if(action.type==='finish'&&['active','paused'].includes(s.phase))return {...s,phase:'reflecting',updatedAt:now};
 if(action.type==='report'&&s.phase==='reflecting'&&reports.includes(action.report))return {...s,phase:'reported',report:action.report,updatedAt:now};
 throw Error('This journey action is unavailable.');
}
