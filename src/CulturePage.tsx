import {useState,type MouseEvent} from 'react';
import {cultureRoute,experiences,addVenueToDay} from '../shared/story-catalog.mjs';
import {highlightById} from '../shared/culture-highlights.mjs';
import {renderCultureBody} from '../shared/culture-render.mjs';
import {useLocalState,isHotel,isTravelDetails,type Plan,type Hotel,type TravelDetails} from './companion-state';
import {Modal} from './ui';
import OfflineTools from './OfflineTools';
import {usePageMotion} from './usePageMotion';
import ContentDirectory from './ContentDirectory';
import CultureHighlights from './CultureHighlights';
import {SiteHeader,MobileNavigation} from './SiteNavigation';
const validPlan=(v:unknown):v is Plan|null=>v===null||Boolean(v&&typeof v==='object'&&Array.isArray((v as Plan).days)&&(v as Plan).days.every(d=>typeof d.date==='string'&&Array.isArray(d.stops)&&d.stops.every(s=>typeof s.placeId==='string')));
export default function CulturePage(){
 const route=cultureRoute(window.location.pathname)||{kind:'not-found',path:window.location.pathname};
 usePageMotion('.culture-page',route.path);
 const [plan,setPlan]=useLocalState<Plan|null>('closer-plan-v1',null,validPlan);
 const [hotel]=useLocalState<Hotel>('closer-hotel-v1',{name:'',address:'',url:''},isHotel);
 const [details]=useLocalState<TravelDetails>('closer-travel-details-v1',{trainNumber:'',destinationId:'',confirmedAddress:'',confirmedDestination:''},isTravelDetails);
 const [notice,setNotice]=useState(''),[phraseId,setPhraseId]=useState<string|null>(null),[target,setTarget]=useState<string|null>(null),[day,setDay]=useState(0);
 const phrase=experiences.find(e=>e.id===phraseId)?.phrase,item='item'in route?route.item:null;
 const highlight=['story','highlight'].includes(route.kind)?highlightById(item?.id):null;
 async function actions(event:MouseEvent<HTMLDivElement>){
  const button=(event.target as Element).closest<HTMLButtonElement>('button[data-culture-action]');if(!button)return;
  const {cultureAction:action,id=''}=button.dataset;
  if(action==='speak'&&experiences.some(e=>e.id===id))setPhraseId(id);
  if(action==='plan'){setTarget(id);setDay(0);}
  if(action==='copy'){const x=experiences.find(e=>e.id===id);if(x)try{await navigator.clipboard.writeText(x.phrase.zh);setNotice('Chinese copied.');}catch{setNotice('Copy unavailable. Show the large card and select its text.');}}
 }
 function add(){if(!target||!plan)return;try{const updated=addVenueToDay(plan,target,day,crypto.randomUUID());setPlan(updated);setNotice(updated===plan?'This place is already on that day.':'Place added. Check access and adjust the 16:00 placeholder time in your itinerary.');setTarget(null);}catch{setNotice('The itinerary could not be updated. Check your saved trip.');}}
 return <div className="culture-page is-interactive"><a className="skip-link" href="#culture-main">Skip to content</a><SiteHeader active="/culture" cityId={item?.cityId||'all'}/>
  {route.kind==='culture'?<ContentDirectory/>:highlight?<main id="culture-main"><CultureHighlights items={[highlight]} detail/></main>:<div onClick={event=>void actions(event)} dangerouslySetInnerHTML={{__html:renderCultureBody(route,undefined,true,false)}}/>}
  <div className="culture-tools"><p role="status" className="culture-notice">{notice}</p><div id="offline-kit"><OfflineTools hotel={hotel} details={details}/></div></div>
  <MobileNavigation active="/culture"/>
  {phrase&&<Modal title="Visit guide Chinese card" fullScreen onClose={()=>setPhraseId(null)}><div className="speak-display"><p className="eyebrow">PLEASE SHOW THIS TO STAFF</p><h2 lang="zh-Hans">{phrase.zh}</h2><p>{phrase.pinyin}</p><p>{phrase.en}</p><button className="outline-button" onClick={()=>setPhraseId(null)}>Close card</button></div></Modal>}
  {target&&<Modal title="Add cultural place to itinerary" onClose={()=>setTarget(null)}><div className="culture-plan-dialog"><h2>Make room in your itinerary.</h2>{plan?.days.length?<><label>Choose a day<select value={day} onChange={e=>setDay(Number(e.target.value))}>{plan.days.map((d,i)=><option key={d.date} value={i}>Day {i+1} · {d.date}</option>)}</select></label><p>A 16:00 placeholder will be added. Check access and adjust it in your Shanghai itinerary. This makes no booking.</p><button className="primary-button" onClick={add}>Add place</button></>:<><p>Create a Shanghai itinerary first, then return to choose a day.</p><a className="primary-button" href="/trip">Open My Trip</a></>}</div></Modal>}
 </div>;
}
