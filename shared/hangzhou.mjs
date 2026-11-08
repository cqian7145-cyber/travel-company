import data from '../data/hangzhou.json' with {type:'json'};

export const hangzhou=data;
export const hangzhouCategories=['All places',...new Set(data.places.map(p=>p.category))];
export function hangzhouMap(place){
 if(!data.places.some(p=>p.id===place.id))throw new Error('Unknown Hangzhou place.');
 return 'https://uri.amap.com/search?keyword='+encodeURIComponent(place.zh+' '+place.facts.address.value)+'&city=杭州&view=map&callnative=0';
}
export function validHangzhouSaved(value){return Array.isArray(value)&&value.every(id=>typeof id==='string'&&data.places.some(p=>p.id===id));}
export function auditHangzhou(records=data){
 const errors=[],ids=new Set();
 for(const place of records.places){
  if(ids.has(place.id)||!place.id.startsWith('hz-'))errors.push('Invalid or duplicate city place ID');ids.add(place.id);
  if(!records.sources[place.source_id])errors.push(place.id+': missing context source');
  for(const field of ['address','opening_hours','admission','reservation','identity_requirements','booking_link']){
   const fact=place.facts[field];
   if(!fact||fact.field!==field||!records.sources[fact.source_id]){errors.push(place.id+': missing fact/source '+field);continue;}
   // This pilot has context sources only. Operational facts must not inherit a verified badge.
   if(fact.status!=='unknown'||fact.verified_at!==null)errors.push(place.id+': operational claim requires a separate verification workflow');
   if(!/^\d{4}-\d{2}-\d{2}$/.test(fact.reviewed_at))errors.push(place.id+': missing field review date');
   if(field==='booking_link'&&fact.value!==null)errors.push(place.id+': city guides are not ticket checkout links');
  }
 }
 for(const source of Object.values(records.sources)){
  try{const u=new URL(source.url);if(u.protocol!=='https:'||u.hostname!=='www.ehangzhou.gov.cn'||source.kind!=='official_city_guide')errors.push('Invalid Hangzhou source');}catch{errors.push('Invalid source URL');}
 }
 return errors;
}
