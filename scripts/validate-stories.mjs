import {readFile,readdir} from 'node:fs/promises';
import {venues,validDate,safeEvidenceUrl} from '../shared/verification.mjs';
import {validDiscovery} from '../shared/micro-adventures.mjs';
import {cityById} from '../shared/cities.mjs';
import {riskPriorities} from '../shared/experience-journey.mjs';
export function validateCulture(records,experiences,sources,voices,now=new Date().toISOString().slice(0,10)){
 const errors=[],ids=new Set(),slugs=new Set(),venueIds=new Set(venues.map(v=>v.id));
 for(const [id,s]of Object.entries(sources))if(s.id!==id||!safeEvidenceUrl(s.url)||!validDate(s.accessedAt)||s.accessedAt>now)errors.push(`source:${id}: invalid URL/date/identity`);
 for(const s of records){
  const prefix=`story:${s.id}`;
  if(!s.id||ids.has(s.id)||!s.slug||slugs.has(s.slug)||!/^[a-z0-9-]+$/.test(s.slug))errors.push(`${prefix}: invalid/duplicate ID or slug`);ids.add(s.id);slugs.add(s.slug);
  if(s.status!=='published')continue;
  if(!cityById(s.cityId)||!['discoveryQuestion','shortPromise','firstObservation'].every(k=>typeof s[k]==='string'&&s[k].trim()&&s[k].length<=600)||!Number.isInteger(s.estimatedReadMinutes)||s.estimatedReadMinutes<1||s.estimatedReadMinutes>5)errors.push(`${prefix}: missing city/discovery metadata`);
  if(!s.experienceIds?.includes(s.relatedExperienceId)||!experiences.some(e=>e.id===s.relatedExperienceId&&e.cityId===s.cityId))errors.push(`${prefix}: related experience must belong to the same city`);
  if(s.language!=='en'||!validDate(s.editorialReviewedAt)||s.editorialReviewedAt>now||s.rights?.text!=='original-editorial-synthesis')errors.push(`${prefix}: editorial review / text rights missing`);
  if(!Array.isArray(s.blocks)||s.blocks.length!==5){errors.push(`${prefix}: five story sections required`);continue;}
  const count=s.blocks.map(b=>b.text).join(' ').trim().split(/\s+/).length;if(count<200||count>350)errors.push(`${prefix}: needs 200–350 English words`);
  for(const [i,b]of s.blocks.entries()){
   if(b.heading!==['Hook','Context','Human perspective','Look closer','Go deeper'][i])errors.push(`${prefix}: section order mismatch`);
   if(!['fact','interpretation','oral_history','folklore'].includes(b.kind)||typeof b.text!=='string')errors.push(`${prefix}: invalid content kind`);
   if(b.kind==='fact'&&!b.sourceIds?.length)errors.push(`${prefix}: sourced fact has no evidence`);
   if(b.sourceIds?.some(id=>!sources[id]))errors.push(`${prefix}: unresolved source`);
   if(b.kind==='oral_history')errors.push(`${prefix}: oral history requires the separate authorized Voice publication workflow`);
  }
  if(s.relatedVenueIds?.some(id=>!venueIds.has(id)))errors.push(`${prefix}: unknown venue ID`);
  if(!s.experienceIds?.length||s.experienceIds.some(id=>!experiences.some(e=>e.id===id)))errors.push(`${prefix}: missing related experience`);
  if(s.voiceIds?.length)errors.push(`${prefix}: voice reference cannot be published without an authorized portrait`);
  if(s.image&&(!s.image.src.startsWith('/culture/')||!safeEvidenceUrl(s.image.sourceUrl)||!safeEvidenceUrl(s.image.licenseUrl)||!s.image.creator||!s.image.license||!validDate(s.image.checkedAt)))errors.push(`${prefix}: media rights or attribution incomplete`);
 }
 const experienceIds=new Set();
 for(const e of experiences){
  if(experienceIds.has(e.id)||!/^[a-z0-9-]+$/.test(e.slug))errors.push(`experience:${e.id}: invalid/duplicate ID`);experienceIds.add(e.id);
  if(!e.storyIds?.length||e.storyIds.some(id=>!ids.has(id))||e.relatedVenueIds?.some(id=>!venueIds.has(id)))errors.push(`experience:${e.id}: broken relation`);
  if(!e.steps?.length||!e.duration||!e.costNature||!e.alternative||!e.phrase?.zh||!e.phrase?.en||!e.risks?.length||!e.conditions?.length)errors.push(`experience:${e.id}: missing action/cost/alternative/safety/communication`);
  if(!validDate(e.editorialReviewedAt)||e.editorialReviewedAt>now)errors.push(`experience:${e.id}: invalid editorial date`);
  if(e.verified||e.openingHours||e.admissionPrice)errors.push(`experience:${e.id}: operational facts must resolve through VDC`);
  if(!validDiscovery(e.discovery))errors.push(`experience:${e.id}: invalid discovery interest or duration range`);
  if(!cityById(e.cityId)||!riskPriorities[e.riskType]||!e.format||!e.languageSupport||!e.shortPromise)errors.push(`experience:${e.id}: missing city/decision metadata`);
  if(!Array.isArray(e.observations)||e.observations.length!==2||new Set(e.observations?.map(o=>o.id)).size!==2||e.observations?.some(o=>!o.id||!['Notice','Compare','Try'].includes(o.kind)||!o.title||!o.prompt))errors.push(`experience:${e.id}: two distinct optional observations required`);
 }
 for(const voice of voices){if(voice.status==='published')errors.push(`voice:${voice.id}: publication is not enabled in V0.1; supply actual consent, media rights, withdrawal handling and a reviewed publishing implementation first`);}
 return errors;
}
export async function loadCulture(){const read=async p=>JSON.parse(await readFile(p,'utf8'));return {records:await Promise.all((await readdir('content/stories')).filter(f=>f.endsWith('.json')).map(f=>read('content/stories/'+f))),experiences:await read('content/experiences.json'),sources:await read('content/story-sources.json'),voices:await read('content/voices.json')};}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/validate-stories.mjs')){const d=await loadCulture(),errors=validateCulture(d.records,d.experiences,d.sources,d.voices);for(const error of errors)console.error(error);for(const s of d.records)if(s.image)await readFile('public'+s.image.src);console.log(`Culture: ${d.records.length} stories, ${d.experiences.length} experiences, ${d.voices.length} voices, ${errors.length} errors.`);if(errors.length)process.exitCode=1;}
