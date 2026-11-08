import {experiences,stories} from './story-catalog.mjs';
import {venues,factStatus} from './verification.mjs';

export const discoveryInterests=[
 {id:'food',label:'Everyday life & food'},
 {id:'history',label:'History & hidden stories'},
 {id:'perspectives',label:'People & local perspectives'},
];
export const discoveryTimes=[15,45,90];
export const discoveryFields=['address','opening_hours','usual_closed_day','admission','reservation','identity_requirements','booking_link'];

export function validDiscovery(d){
 return !!d&&discoveryInterests.some(i=>i.id===d.interest)&&Number.isInteger(d.minMinutes)&&Number.isInteger(d.maxMinutes)&&d.minMinutes>0&&d.maxMinutes>=d.minMinutes&&typeof d.summary==='string'&&!!d.summary.trim();
}

// Match editorial directions, never live availability. Travel and queues are not estimated.
export function matchAdventure(interest,minutes,{records=experiences,venueRecords=venues,storyRecords=stories,now=new Date()}={}){
 if(!discoveryInterests.some(i=>i.id===interest)||!discoveryTimes.includes(minutes))return {kind:'empty',reason:'Choose an interest and an available time.'};
 const candidates=records.filter(e=>e.status==='published'&&validDiscovery(e.discovery)&&e.discovery.interest===interest&&e.conditions?.length&&e.steps?.length&&e.alternative&&e.costNature&&e.phrase?.zh)
  .map(experience=>({experience,story:storyRecords.find(s=>s.status==='published'&&experience.storyIds?.includes(s.id))}))
  .filter(c=>c.story)
  .sort((a,b)=>a.experience.id.localeCompare(b.experience.id,'en'));
 const eligible=candidates.flatMap(({experience,story})=>{
  const related=experience.relatedVenueIds?.map(id=>venueRecords.find(v=>v.id===id));
  if(!related||related.some(v=>!v))return [];
  const statuses=related.flatMap(v=>discoveryFields.map(field=>factStatus(v.facts?.[field],now)));
  if(statuses.some(status=>status==='conflicting'||status==='expired'))return [];
  return [{experience,story,venues:related,needsChecks:!related.length||statuses.some(s=>s!=='verified')||!experience.fieldTestedAt}];
 });
 const fit=eligible.find(c=>c.experience.discovery.maxMinutes<=minutes);
 if(fit)return {kind:'direction',...fit};
 const preview=candidates[0];
 return preview?{kind:'reading',...preview,reason:eligible.length?'No full activity fits this time estimate. Start with a short story; plan the outing separately.':'An outing cannot be suggested with the current access evidence. Read the story while details are checked.'}:{kind:'empty',reason:'No matching experience is available yet. Browse the stories instead.'};
}
