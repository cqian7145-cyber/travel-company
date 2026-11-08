import venueRecords from '../data/venues.json' with {type:'json'};
import sourceRecords from '../data/sources.json' with {type:'json'};
import dataset from '../data/version.json' with {type:'json'};

export const venues=venueRecords;
export const evidenceSources=sourceRecords;
export const dataVersion=dataset;
export const requiredFields=['name','chinese_name','address','opening_hours','admission','usual_closed_day','transport','coordinates','booking_link','reservation','identity_requirements'];
export const linkKinds=['general_city_portal','official_city_guide','operator_visit_guide','official_guidance','reservation_portal','ticket_checkout'];
export const fieldLabels={name:'English name',chinese_name:'Chinese name',address:'Chinese address',opening_hours:'Opening hours',admission:'Admission estimate',usual_closed_day:'Usual closure day',transport:'Transport suggestion',coordinates:'Map coordinates',booking_link:'Ticket / information link',reservation:'Reservation requirements',identity_requirements:'Passport / ID requirements'};
export function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;}
export function dateOnly(now=new Date()){return typeof now==='string'&&validDate(now)?now:new Date(now).toISOString().slice(0,10);}
export function safeEvidenceUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function factStatus(fact,now=new Date()){
 if(!fact||!['verified','unknown','estimated','conflicting'].includes(fact.status))return 'unknown';
 if(fact.status!=='verified')return fact.status;
 const today=dateOnly(now);
 if(fact.value===null||fact.value===undefined||!validDate(fact.verified_at)||fact.verified_at>today||!evidenceSources[fact.source_id]||!safeEvidenceUrl(evidenceSources[fact.source_id].url))return 'unknown';
 if(fact.next_review_at!==null&&(!validDate(fact.next_review_at)||fact.next_review_at<=fact.verified_at))return 'unknown';
 return fact.next_review_at&&today>=fact.next_review_at?'expired':'verified';
}
export function statusLabel(status){return ({verified:'Verified snapshot',unknown:'Not verified',estimated:'Estimate',conflicting:'Conflicting evidence',expired:'Review overdue'})[status]||'Not verified';}
export function linkKindLabel(kind){return ({general_city_portal:'General city portal',official_city_guide:'Official city guide',operator_visit_guide:'Operator visit guide',official_guidance:'Official guidance',reservation_portal:'Reservation portal',ticket_checkout:'Ticket checkout'})[kind]||'Unknown link type';}
export function venueById(id){return venues.find(v=>v.id===id);}
export function bookingEvidenceSignature(venue,now=new Date()){
 return JSON.stringify(['opening_hours','usual_closed_day','reservation','identity_requirements','booking_link'].map(key=>{const f=venue.facts[key],s=evidenceSources[f.source_id];return [key,f.value,f.status,factStatus(f,now),f.verified_at,f.next_review_at,f.reviewed_at,f.source_id,s?.url];}).concat([venue.booking_task?.caution]));
}
// Deterministic compatibility checksum, not an authentication or security primitive.
export function compatibilityChecksum(value){let n=14695981039346656037n;for(const c of value){n^=BigInt(c.codePointAt(0));n=BigInt.asUintN(64,n*1099511628211n);}return n.toString(16);}
export function bookingEvidenceChange(venue,now=new Date()){
 const signature=bookingEvidenceSignature(venue,now);
 return compatibilityChecksum(signature)===venue.booking_task?.confirmation_baseline?null:signature;
}
export function offlineDataState(saved,current=dataVersion,now=new Date()){
 if(!saved)return {state:'unknown',message:'Data version or last sync is unknown. Keep this backup readable and recheck when online.'};
 if(saved.dataVersion!==current.version)return {state:'outdated',message:'Saved data differs from this app’s data version. Reconnect and refresh; your saved addresses remain available.'};
 if(!saved.savedAt||!Number.isFinite(Date.parse(saved.savedAt)))return {state:'unknown',message:'Last offline save time is unknown. Recheck when online.'};
 if(saved.reviewDueAt&&(!validDate(saved.reviewDueAt)||dateOnly(now)>=saved.reviewDueAt))return {state:'expired',message:'Some venue evidence is due for review. Older information remains readable; confirm with official operators.'};
 return {state:'snapshot',message:'Dated offline snapshot. Same version does not confirm current opening, prices or availability.'};
}
export function nextDataReview(records=venues){return records.flatMap(v=>Object.values(v.facts).map(f=>f.next_review_at)).filter(validDate).sort()[0]||null;}

export function auditData(records=venues,registry=evidenceSources,now=new Date()){
 const errors=[],warnings=[],seen=new Set(),today=dateOnly(now);
 for(const [id,source]of Object.entries(registry)){
  if(source.id!==id||!safeEvidenceUrl(source.url)||!linkKinds.includes(source.kind))errors.push(`source:${id}: invalid ID, URL or link kind`);
  if(source.last_accessed_at!==null&&(!validDate(source.last_accessed_at)||source.last_accessed_at>today))errors.push(`source:${id}: invalid access date`);
 }
 for(const venue of records){
  if(!venue.id||seen.has(venue.id))errors.push(`venue:${venue.id}: duplicate or missing stable ID`);seen.add(venue.id);
  for(const key of requiredFields){
   const f=venue.facts?.[key],prefix=`${venue.id}.${key}`;
   if(!f){errors.push(`${prefix}: missing required fact`);continue;}
   if(f.field!==key||!['verified','unknown','estimated','conflicting'].includes(f.status))errors.push(`${prefix}: invalid field/status`);
   if(!registry[f.source_id])errors.push(`${prefix}: missing source reference`);
   for(const date of ['verified_at','reviewed_at','next_review_at'])if(f[date]!==null&&!validDate(f[date]))errors.push(`${prefix}: invalid ${date}`);
   if(f.verified_at&&f.verified_at>today)errors.push(`${prefix}: future verification`);
   if(f.reviewed_at&&f.reviewed_at>today)errors.push(`${prefix}: future review`);
   if(f.status==='verified'&&(f.value===null||!validDate(f.verified_at)||!f.evidence_note))errors.push(`${prefix}: verified fact lacks value/date/evidence`);
   if(f.status==='verified'&&(!validDate(f.reviewed_at)||f.reviewed_at<f.verified_at))errors.push(`${prefix}: verification needs a corresponding field review`);
   if(f.status!=='verified'&&f.verified_at!==null)errors.push(`${prefix}: unverified fact carries verified_at`);
   if(f.status==='verified'&&['opening_hours','reservation'].includes(key)&&!validDate(f.next_review_at))errors.push(`${prefix}: volatile verified fact needs next_review_at`);
   if(f.next_review_at&&f.verified_at&&f.next_review_at<=f.verified_at)errors.push(`${prefix}: review must follow verification`);
   if(key==='admission'&&(typeof f.value!=='number'||f.value<0||!Number.isFinite(f.value)))errors.push(`${prefix}: invalid amount`);
   if(['name','chinese_name','address','opening_hours','transport'].includes(key)&&(typeof f.value!=='string'||!f.value.trim()))errors.push(`${prefix}: missing text value`);
   if(key==='usual_closed_day'&&f.value!==null&&(!Number.isInteger(f.value)||f.value<0||f.value>6))errors.push(`${prefix}: invalid weekday`);
   if(key==='coordinates'&&(!f.value||!Number.isFinite(f.value.lat)||!Number.isFinite(f.value.lng)||Math.abs(f.value.lat)>90||Math.abs(f.value.lng)>180))errors.push(`${prefix}: invalid coordinates`);
   if(key==='booking_link'){
    const source=registry[f.source_id];
    if(!f.value||!safeEvidenceUrl(f.value.url)||!linkKinds.includes(f.value.kind))errors.push(`${prefix}: invalid link or link type`);
    else if(source&&(f.value.url!==source.url||f.value.kind!==source.kind))errors.push(`${prefix}: link conflicts with source reference`);
    if(['ticket_checkout','reservation_portal'].includes(f.value?.kind)&&f.status!=='verified')errors.push(`${prefix}: unverified link must not claim transactional status`);
   }
   if(f.status==='conflicting')warnings.push(`${prefix}: conflicting evidence requires manual resolution`);
   if(f.status==='unknown')warnings.push(`${prefix}: not verified${f.value===null?' / no rule recorded':''}`);
   if(f.next_review_at&&today>=f.next_review_at)warnings.push(`${prefix}: review overdue`);
  }
  if(venue.booking_task&&!venue.booking_task.confirmation_baseline)errors.push(`${venue.id}: missing legacy confirmation baseline`);
 }
 return {errors,warnings};
}
