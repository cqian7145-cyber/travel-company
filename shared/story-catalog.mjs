import shikumen from '../content/stories/shikumen.json' with {type:'json'};
import breakfast from '../content/stories/breakfast.json' with {type:'json'};
import park from '../content/stories/park.json' with {type:'json'};
import experienceRecords from '../content/experiences.json' with {type:'json'};
import sourceRecords from '../content/story-sources.json' with {type:'json'};
import version from '../content/version.json' with {type:'json'};
import {venues} from './verification.mjs';
export const stories=[shikumen,breakfast,park].filter(s=>s.status==='published');
export const experiences=experienceRecords.filter(e=>e.status==='published');
export const storySources=sourceRecords;
export const cultureVersion=version;
export const storyForVenue=id=>stories.filter(s=>s.relatedVenueIds.includes(id));
export const storyBySlug=slug=>stories.find(s=>s.slug===slug);
export const experienceBySlug=slug=>experiences.find(e=>e.slug===slug);
export const wordCount=story=>story.blocks.map(b=>b.text).join(' ').trim().split(/\s+/).length;
export function cultureRoute(pathname){
 const path=pathname.replace(/\/index\.html$/,'').replace(/\/+$/,'')||'/';
 if(path==='/stories')return{kind:'stories',path,file:'/stories/index.html'};
 if(path==='/experiences')return{kind:'experiences',path,file:'/experiences/index.html'};
 if(path==='/voices')return{kind:'voices',path,file:'/voices/index.html'};
 if(path.startsWith('/stories/')){const item=storyBySlug(path.slice(9));return item?{kind:'story',path,file:path+'/index.html',item}:{kind:'not-found',path};}
 if(path.startsWith('/experiences/')){const item=experienceBySlug(path.slice(13));return item?{kind:'experience',path,file:path+'/index.html',item}:{kind:'not-found',path};}
 return path.startsWith('/voices/')?{kind:'not-found',path}:null;
}
export function cultureRoutes(){return['/stories','/experiences','/voices',...stories.map(s=>'/stories/'+s.slug),...experiences.map(e=>'/experiences/'+e.slug)];}
export function isCultureState(v){return !!v&&typeof v==='object'&&!Array.isArray(v)&&Array.isArray(v.saved)&&v.saved.every(id=>stories.some(s=>s.id===id))&&v.saved.length<=stories.length&&v.steps&&typeof v.steps==='object'&&!Array.isArray(v.steps)&&Object.entries(v.steps).every(([key,value])=>experiences.some(e=>e.steps.some((_,i)=>key===`${e.id}:${i}`))&&typeof value==='boolean')&&v.notes&&typeof v.notes==='object'&&!Array.isArray(v.notes)&&Object.entries(v.notes).every(([key,value])=>[...stories,...experiences].some(item=>item.id===key)&&typeof value==='string'&&value.length<=500);}
export const emptyCultureState={saved:[],steps:{},notes:{}};
export function addVenueToDay(plan,venueId,dayIndex,stopId){
 if(!venues.some(v=>v.id===venueId)||typeof stopId!=='string'||!stopId)throw Error('Choose an existing venue and a stop identity.');
 if(!plan||!Array.isArray(plan.days)||!Number.isInteger(dayIndex)||!plan.days[dayIndex]||!Array.isArray(plan.days[dayIndex].stops))throw Error('Choose a valid itinerary day.');
 if(plan.days[dayIndex].stops.some(s=>s.placeId===venueId))return plan;
 return {...plan,days:plan.days.map((day,index)=>index===dayIndex?{...day,stops:[...day.stops,{id:stopId,placeId:venueId,time:'16:00',note:'Added from Discover China. Recheck VDC access and adjust time.'}]}:day)};
}
