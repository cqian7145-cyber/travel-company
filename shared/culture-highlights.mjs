import su from '../content/culture/hangzhou/su-causeway.json' with {type:'json'};
import snake from '../content/culture/hangzhou/white-snake.json' with {type:'json'};
import xiaoxiao from '../content/culture/hangzhou/su-xiaoxiao.json' with {type:'json'};
import tea from '../content/culture/hangzhou/longjing-tea.json' with {type:'json'};
import shikumen from '../content/stories/shikumen.json' with {type:'json'};
import breakfast from '../content/stories/breakfast.json' with {type:'json'};
import park from '../content/stories/park.json' with {type:'json'};
import shikumenCard from '../content/culture/shanghai/shikumen.json' with {type:'json'};
import breakfastCard from '../content/culture/shanghai/breakfast.json' with {type:'json'};
import parkCard from '../content/culture/shanghai/park.json' with {type:'json'};
import newSources from '../content/culture/sources.json' with {type:'json'};
import oldSources from '../content/story-sources.json' with {type:'json'};
import practicalGuides from '../content/experiences.json' with {type:'json'};
import {hangzhou} from './hangzhou.mjs';
import {places} from './catalog.mjs';

export const cultureTypes={history:'History',legend:'Legend',literature:'Literary heritage',intangible_heritage:'Intangible heritage',food:'Food & customs'};
export const cultureSources={...oldSources,...newSources};
const legacy=[shikumen,breakfast,park].map((s,i)=>({...s,...[shikumenCard,breakfastCard,parkCard][i],legacySlug:s.slug,guideSlug:practicalGuides.find(x=>s.experienceIds.includes(x.id))?.slug,placeIds:s.relatedVenueIds,placeLabel:['Xintiandi · Shanghai','Breakfast in Shanghai','Fuxing Park · Shanghai'][i],zhPlace:['新天地','上海早餐','复兴公园'][i],zhTitle:['石库门','上海早餐四大金刚','复兴公园'][i],sourceIds:[...new Set(s.blocks.flatMap(b=>b.sourceIds))],sections:s.blocks.filter(b=>b.kind==='fact'),archive:s.blocks,phrase:null,visitNote:'Check current access, prices and any dietary requirements separately. Historical context is not a current operational check.'}));
export const cultureRecords=[su,snake,xiaoxiao,tea,...legacy];
export const highlights=cultureRecords.filter(x=>x.status==='published');
export const highlightById=id=>highlights.find(x=>x.id===id);
export const highlightBySlug=slug=>highlights.find(x=>x.slug===slug);
export const highlightPath=item=>item.legacySlug?'/stories/'+item.legacySlug:'/culture/'+item.slug;
export const highlightsForPlace=id=>highlights.filter(x=>x.placeIds.includes(id));
export const highlightsForCity=id=>highlights.filter(x=>x.cityId===id);
export const highlightMap=x=>'https://uri.amap.com/search?keyword='+encodeURIComponent((x.cityId==='hangzhou'?'杭州 ':'上海 ')+x.zhPlace)+'&view=map&callnative=0';
export const highlightPlaceLink=(x,id=x.placeIds[0])=>id?'/cities/'+x.cityId+'?'+(x.cityId==='hangzhou'?'place':'venue')+'='+encodeURIComponent(id):'/cities/'+x.cityId;
export function selectHighlights({cityId='all',type='all'}={}){return highlights.filter(x=>(cityId==='all'||x.cityId===cityId)&&(type==='all'||x.type===type));}
export const validHighlightState=v=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Array.isArray(v.saved)&&v.saved.length<=highlights.length&&new Set(v.saved).size===v.saved.length&&v.saved.every(id=>typeof id==='string'&&highlightById(id));
// Import legacy bookmarks only when the new store does not exist. Never write to the old store.
export function initialHighlightState(current,legacy){if(validHighlightState(current))return current;return {saved:[...new Set(Array.isArray(legacy?.saved)?legacy.saved.filter(id=>highlightById(id)):[])]};}
export function validateHighlights(records=cultureRecords,sources=cultureSources,now=new Date().toISOString().slice(0,10)){
 const errors=[],ids=new Set(),slugs=new Set(),cityPlaces={hangzhou:new Set(hangzhou.places.map(p=>p.id)),shanghai:new Set(places.map(p=>p.id))};
 for(const x of records){
  if(!/^[a-z0-9-]+$/.test(x.id||'')||!/^[a-z0-9-]+$/.test(x.slug||'')||ids.has(x.id)||slugs.has(x.slug))errors.push('Invalid or duplicate highlight identity');ids.add(x.id);slugs.add(x.slug);
  if(!['draft','published'].includes(x.status))errors.push(x.id+': invalid publication state');
  if(x.status!=='published')continue;
  const words=x.summary?.trim().split(/\s+/).length||0;
  if(words<50||words>90)errors.push(x.id+': summary must be 50–90 words');
  if(!cultureTypes[x.type]||!x.title||!x.placeLabel||!['shanghai','hangzhou'].includes(x.cityId))errors.push(x.id+': invalid cultural identity');
  if(!x.placeIds?.every(id=>cityPlaces[x.cityId]?.has(id)))errors.push(x.id+': unknown or wrong-city place association');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(x.editorialReviewedAt||'')||!Number.isFinite(Date.parse(x.editorialReviewedAt))||x.editorialReviewedAt>now||!x.sourceIds?.length)errors.push(x.id+': source review required');
  if(!x.sections?.length||x.sections.some(s=>!s.text||!['fact','folklore','interpretation'].includes(s.kind)||!s.sourceIds?.length))errors.push(x.id+': sourced sections required');
  if(x.type==='legend'&&x.sections.some(s=>s.kind!=='folklore'))errors.push(x.id+': legend cannot be presented as historical fact');
  for(const id of new Set([...x.sourceIds,...(x.sections||[]).flatMap(s=>s.sourceIds||[])])){const source=sources[id];try{const u=new URL(source?.url);if(u.protocol!=='https:'||u.username||u.password||!source.scope||!source.accessedAt)throw Error();}catch{errors.push(x.id+': invalid cultural source '+id);}}
  if(x.image&&(!x.image.src.startsWith('/')||x.image.src.startsWith('//')||!x.image.alt))errors.push(x.id+': invalid local image');
 }
 return errors;
}
