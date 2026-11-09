import {useState,type MouseEvent} from 'react';
import {cultureRoute,stories,experiences,isCultureState,emptyCultureState,addVenueToDay} from '../shared/story-catalog.mjs';
import {renderCultureBody} from '../shared/culture-render.mjs';
import {useLocalState,isHotel,isTravelDetails,type Plan,type Hotel,type TravelDetails} from './companion-state';
import {Modal} from './ui';
import OfflineTools from './OfflineTools';
import {usePageMotion} from './usePageMotion';
import ContentDirectory from './ContentDirectory';
import ExperienceJourney from './ExperienceJourney';
import {SiteHeader,MobileNavigation} from './SiteNavigation';
type CultureState={saved:string[];steps:Record<string,boolean>;notes:Record<string,string>};
const validPlan=(v:unknown):v is Plan|null=>v===null||Boolean(v&&typeof v==='object'&&Array.isArray((v as Plan).days)&&(v as Plan).days.every(d=>typeof d.date==='string'&&Array.isArray(d.stops)&&d.stops.every(s=>typeof s.placeId==='string')));
export default function CulturePage(){
 const route=cultureRoute(window.location.pathname)||{kind:'not-found',path:window.location.pathname};
 usePageMotion('.culture-page',route.path);
 const [state,setState,storageError]=useLocalState<CultureState>('closer-culture-v1',emptyCultureState,(v):v is CultureState=>isCultureState(v));
 const [plan,setPlan]=useLocalState<Plan|null>('closer-plan-v1',null,validPlan);
 const [hotel]=useLocalState<Hotel>('closer-hotel-v1',{name:'',address:'',url:''},isHotel);
 const [details]=useLocalState<TravelDetails>('closer-travel-details-v1',{trainNumber:'',destinationId:'',confirmedAddress:'',confirmedDestination:''},isTravelDetails);
 const [notice,setNotice]=useState(''),[phraseId,setPhraseId]=useState<string|null>(null),[target,setTarget]=useState<string|null>(null),[day,setDay]=useState(0);
 const phrase=experiences.find(e=>e.id===phraseId)?.phrase;
 async function actions(event:MouseEvent<HTMLDivElement>){
  const button=(event.target as Element).closest<HTMLButtonElement>('button[data-culture-action]');if(!button)return;
  const {cultureAction:action,id=''}=button.dataset;
  if(action==='save'&&stories.some(s=>s.id===id)){setState(s=>({...s,saved:s.saved.includes(id)?s.saved.filter(x=>x!==id):[...s.saved,id]}));setNotice('Story saved state updated in this browser. Use the offline kit to save app files.');}
  if(action==='step'){const allowed=experiences.some(e=>e.steps.some((_,i)=>id===`${e.id}:${i}`));if(allowed)setState(s=>({...s,steps:{...s.steps,[id]:!s.steps[id]}}));}
  if(action==='speak'&&experiences.some(e=>e.id===id))setPhraseId(id);
  if(action==='plan'){setTarget(id);setDay(0);}
  if(action==='copy'){const e=experiences.find(e=>e.id===id);if(e)try{await navigator.clipboard.writeText(e.phrase.zh);setNotice('Chinese copied.');}catch{setNotice('Copy unavailable. Show the large card and select its text.');}}
  if(action==='share'){const url=new URL(route.path,window.location.origin).href;try{if(navigator.share)await navigator.share({title:document.title,url});else{await navigator.clipboard.writeText(url);setNotice('Story link copied.');}}catch(error){setNotice(error instanceof DOMException&&error.name==='AbortError'?'Sharing cancelled.':'Sharing is unavailable. Copy the address from your browser.');}}
 }
 function add(){if(!target||!plan)return;try{const updated=addVenueToDay(plan,target,day,crypto.randomUUID());setPlan(updated);setNotice(updated===plan?'This place is already on that day.':`Place added to Day ${day+1}. Check access and adjust the 16:00 placeholder time in your itinerary.`);setTarget(null);}catch{setNotice('The itinerary could not be updated. Open the planner and check your saved trip.');}}
 const item='item'in route?route.item:null;
 const journey=route.kind==='experience'?experiences.find(x=>x.slug===route.path.split('/').at(-1)):undefined;
 return <div className="culture-page is-interactive"><a className="skip-link" href="#culture-main">Skip to content</a><SiteHeader active={route.kind==='experience'||route.kind==='experiences'?'/experiences':'/stories'} cityId={item?.cityId||'all'}/>
  {route.kind==='stories'||route.kind==='experiences'?<ContentDirectory kind={route.kind}/>:journey?<ExperienceJourney key={journey.id} experience={journey} steps={state.steps} onStep={i=>setState(s=>({...s,steps:{...s.steps,[journey.id+':'+i]:!s.steps[journey.id+':'+i]}}))} onSpeak={()=>setPhraseId(journey.id)} onCopy={()=>{void navigator.clipboard.writeText(journey.phrase.zh).then(()=>setNotice('Chinese copied.')).catch(()=>setNotice('Copy unavailable. Show the large card and select its text.'));}} onPlan={id=>{setTarget(id);setDay(0);}}/>:<div onClick={event=>void actions(event)} dangerouslySetInnerHTML={{__html:renderCultureBody(route,state,true,false)}}/>}
  <div className="culture-tools"><p role="status" className="culture-notice">{notice}</p>{storageError&&<p role="alert">Browser storage is unavailable. Changes may not persist.</p>}
   {item&&<Reflection key={item.id} prompt={journey?.reflection} id={item.id} initial={state.notes[item.id]||''} onSave={text=>setState(s=>({...s,notes:{...s.notes,[item.id]:text}}))}/>}
   <div id="offline-kit"><OfflineTools hotel={hotel} details={details}/></div>
  </div>
  <MobileNavigation active={route.kind==='experience'||route.kind==='experiences'?'/experiences':'/stories'}/>
  {phrase&&<Modal title="Culture experience Chinese card" fullScreen onClose={()=>setPhraseId(null)}><div className="speak-display"><div className="eyebrow">PLEASE SHOW THIS TO STAFF</div><h2 lang="zh-Hans">{phrase.zh}</h2><p>{phrase.pinyin}</p><p>{phrase.en}</p><button className="primary-button" onClick={()=>setPhraseId(null)}>Close card</button></div></Modal>}
  {target&&<Modal title="Add cultural place to itinerary" onClose={()=>setTarget(null)}><div className="culture-plan-dialog"><h2>Make room in your itinerary.</h2>{plan?.days.length?<><label>Choose a day<select value={day} onChange={e=>setDay(Number(e.target.value))}>{plan.days.map((d,i)=><option key={d.date} value={i}>Day {i+1} · {d.date}</option>)}</select></label><p>A 16:00 placeholder will be added. Confirm venue access and adjust the time in your planner. This makes no booking.</p><button className="primary-button" onClick={add}>Add place</button></>:<><p>Create an itinerary first, then return here to choose a day.</p><a className="primary-button" href="/?page=planner">Open planner</a></>}</div></Modal>}
 </div>;
}
function Reflection({id,initial,onSave,prompt}:{id:string;initial:string;prompt?:string;onSave:(text:string)=>void}){const [text,setText]=useState(initial);return <section className="culture-reflection"><h2>What will you take away?</h2><label htmlFor={'reflection-'+id}>{prompt||'One observation, one question, or something you tried'}</label><textarea id={'reflection-'+id} value={text} maxLength={500} onChange={e=>setText(e.target.value)} onBlur={()=>onSave(text)}/><button onClick={()=>onSave(text)}>Save my note</button><p>Private to this browser. Nothing is uploaded. Saving a note does not verify a fact or complete a booking.</p></section>;}
