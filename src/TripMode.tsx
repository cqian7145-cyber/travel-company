import {useEffect,useState} from 'react';
import {ArrowRight,ArrowUpRight,Check,CheckCircle2,Clock,Compass,Languages,MapPin,Navigation,RotateCcw,SkipForward} from 'lucide-react';
import {places} from '../shared/catalog.mjs';
import {dayStops,mapUrl,nearbyPlaces,nextStop,shanghaiDate} from '../shared/companion.mjs';
import {isProgress,useLocalState,type Hotel,type Plan} from './companion-state';
import {ChineseCard,External} from './ui';

type Place=typeof places[number];
type Props={plan:Plan|null;onPlanChange:(plan:Plan)=>void;onPlan:()=>void;onBookings:()=>void;onSOS:()=>void;onPlace:(place:Place)=>void;hotel:Hotel};
const dayLabel=(date:string)=>new Date(date+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
export default function TripMode({plan,onPlanChange,onPlan,onBookings,onSOS,onPlace,hotel}:Props){
 const [today,setToday]=useState(shanghaiDate),[selectedDate,setSelectedDate]=useState('');
 const [progress,setProgress,storageError]=useLocalState('closer-progress-v1',{},isProgress);
 const [chinese,setChinese]=useState<Place|'hotel'|null>(null),[notice,setNotice]=useState('');
 useEffect(()=>{const timer=setInterval(()=>setToday(shanghaiDate()),30000);return()=>clearInterval(timer);},[]);
 const day=plan?.days.find(d=>d.date===selectedDate)||plan?.days.find(d=>d.date===today)||plan?.days[0];
 const stops=plan&&day?dayStops(plan,day,progress):[],next=plan&&day?nextStop(plan,day,progress):null;
 const nearby=next&&day?nearbyPlaces(next.stop.placeId,day.stops.map(s=>s.placeId)):[];
 function setStatus(key:string,status:'done'|'skipped'|'pending',name:string){
  setProgress(previous=>{const updated={...previous};if(status==='pending')delete updated[key];else updated[key]=status;return updated;});
  setNotice(`${name}: ${status==='pending'?'back on your route':status==='done'?'marked done by you':'skipped for now'}.`);
 }
 function replaceNext(placeId:string){
  if(!plan||!day||!next)return;
  onPlanChange({...plan,days:plan.days.map(d=>d.date===day.date?{...d,stops:d.stops.map((s,i)=>i===next.index?{...s,id:crypto.randomUUID(),placeId,note:''}:s)}:d)});
  setNotice('Next stop replaced. Your itinerary and booking checklist have been updated.');
 }
 return <>
  <div className="page-intro companion-intro"><div><div className="eyebrow">01 / TRIP MODE</div><h1>Your day in Shanghai<span>.</span></h1><p>Less switching apps. More being here.</p></div><span className="module-mark"><Navigation size={24}/>On the go</span></div>
  {!plan||!day?<section className="empty-state large-empty"><Compass size={40}/><h2>A plan to take with you.</h2><p>Create your itinerary first. Your next stop and Chinese addresses will appear here.</p><button className="primary-button" onClick={onPlan}>Create an itinerary <ArrowRight size={16}/></button></section>:<>
   <div className="trip-day-bar"><div className="day-tabs" aria-label="Choose itinerary day">{plan.days.map((d,i)=><button key={d.date} className={d.date===day.date?'selected':''} aria-pressed={d.date===day.date} onClick={()=>setSelectedDate(d.date)}><strong>Day {i+1}</strong><span>{dayLabel(d.date)}</span>{d.date===today&&<small>Today</small>}</button>)}</div></div>
   <div className={`trip-date-context ${day.date===today?'is-today':''}`}><span className="status-tag">{day.date===today?'Today in Shanghai':`Preview · ${dayLabel(day.date)}`}</span><span>{day.date===today?'All times are planned, in China Standard Time.':`Today in Shanghai is ${today}. You are viewing another itinerary date.`}</span></div>
   <div className="execution-layout"><div>
    {next?<section className="next-stop-panel" aria-label="Next stop"><div className="next-stop-top"><span className="eyebrow">NEXT STOP</span><span>{stops.filter(s=>s.status==='done').length} / {stops.length} done</span></div>
     <h2>{next.place!.name}<span lang="zh-Hans">{next.place!.zh}</span></h2><p className="next-address" lang="zh-Hans">{next.place!.address}</p>
     <div className="next-meta"><span><Clock size={16}/>{next.stop.time||'Time unset'} <small>Planned</small></span><span>¥{next.place!.cost} <small>Admission estimate</small></span></div>
     <div className="execution-primary"><External className="primary-button" href={mapUrl(next.place)}><Navigation size={17}/>Open navigation</External><button className="outline-button" onClick={()=>setChinese(next.place!)}><Languages size={17}/>Show Chinese</button></div>
     <p className="execution-transit">{next.place!.transit}</p><p className="module-disclaimer">Navigation opens a map search. No live location, traffic, travel time, or ticket availability. Verify the destination and entrance.</p>
     {next.place!.closedDay===new Date(day.date+'T12:00:00Z').getUTCDay()&&<p className="warning">This is a usual closure day for this venue. Recheck before setting off.</p>}
     <div className="execution-status-actions"><button onClick={()=>setStatus(next.key,'done',next.place!.name)}><CheckCircle2 size={17}/>Mark done</button><button onClick={()=>setStatus(next.key,'skipped',next.place!.name)}><SkipForward size={17}/>Skip for now</button><button className="text-link" onClick={onBookings}>Check bookings <ArrowUpRight size={15}/></button></div>
    </section>:<section className="day-finished"><CheckCircle2 size={35}/><h2>{stops.length?'No pending stops. Room to wander.':'An open day, at your pace.'}</h2><p>{stops.length?'Done and skipped stops stay below. You can undo either action.':'This day has no scheduled stops. Add one in your itinerary.'}</p><button className="outline-button" onClick={onPlan}>Edit itinerary <ArrowRight size={16}/></button></section>}
    <div role="status" className="execution-notice">{notice}</div>
    <section className="execution-timeline"><div className="section-heading"><div><div className="eyebrow">THE REST OF YOUR DAY</div><h2>Your route, one stop at a time</h2></div><button className="text-link" onClick={onPlan}>Edit plan <ArrowUpRight size={15}/></button></div>
     {stops.map(item=><article key={item.key} className={`execution-stop ${item.status}`}><div className="execution-stop-icon">{item.status==='done'?<Check size={18}/>:item.status==='skipped'?<SkipForward size={18}/>:<MapPin size={18}/>}</div><div className="execution-stop-body"><div className="execution-stop-title"><h3><button onClick={()=>onPlace(item.place!)}>{item.place!.name}</button></h3><span className={`stop-state ${item.status}`}>{item.status==='done'?'Done · by you':item.status==='skipped'?'Skipped · by you':'Planned'}</span></div><p><span>{item.stop.time||'Time unset'}</span> · <span lang="zh-Hans">{item.place!.zh}</span></p>{item.stop.note&&<p>{item.stop.note}</p>}<div className="execution-stop-controls">{item.status==='pending'?<><External href={mapUrl(item.place)}>Navigate</External><button onClick={()=>setStatus(item.key,'done',item.place!.name)}>Mark done</button><button onClick={()=>setStatus(item.key,'skipped',item.place!.name)}>Skip</button></>:<button aria-label={`Undo ${item.status==='done'?'completion':'skip'} for ${item.place!.name}`} onClick={()=>setStatus(item.key,'pending',item.place!.name)}><RotateCcw size={13}/>Undo</button>}<button aria-label={`Show Chinese for ${item.place!.name}`} onClick={()=>setChinese(item.place!)}>Show Chinese</button></div></div></article>)}
     {!stops.length&&<p className="module-disclaimer">No scheduled stops on this date.</p>}
    </section>
   </div><aside className="execution-aside"><section className="nearby-section"><div className="eyebrow">ROOM FOR A DETOUR</div><h2>Nearby alternatives</h2><p className="module-disclaimer">Within approximately 3 km of your next planned stop, in a straight line. Not from your current location. Check walking distance, opening hours, and availability.</p>{nearby.map(place=><article className="nearby-place" key={place.id}><span>{place.area} · approx. {place.distanceKm.toFixed(1)} km</span><h3>{place.name}</h3><p lang="zh-Hans">{place.zh}</p><div><button className="text-link" onClick={()=>onPlace(place)}>Details <ArrowUpRight size={14}/></button><button className="text-link" aria-label={`Replace next stop with ${place.name}`} onClick={()=>replaceNext(place.id)}>Use instead <ArrowRight size={14}/></button></div></article>)}{!nearby.length&&<p className="nearby-empty">{next?'No other nearby options in our small collection.':'Choose or restore a pending stop to see alternatives.'}</p>}</section><section className="trip-help-block"><Languages size={23}/><h3>Your hotel, in Chinese</h3>{hotel.address.trim()?<><p lang="zh-Hans">{hotel.address}</p><button className="text-link" onClick={()=>setChinese('hotel')}>Show hotel address <ArrowUpRight size={14}/></button></>:<><p>Keep your exact Chinese hotel address ready for the ride back.</p><button className="text-link" onClick={onBookings}>Add hotel address <ArrowRight size={14}/></button></>}</section><button className="sos-shortcut" onClick={onSOS}><span>Something not going to plan?</span><strong>Open China SOS <ArrowRight size={16}/></strong></button></aside></div>
  </>}
  {storageError&&<p role="alert" className="warning">Browser storage is unavailable. Progress works for this visit but may not survive reload.</p>}
  {chinese&&<ChineseCard title={chinese==='hotel'?'Hotel address in Chinese':'Destination in Chinese'} text={chinese==='hotel'?(hotel.name||'请送我到这个地址，谢谢。'):chinese.zh} address={chinese==='hotel'?hotel.address:chinese.address} translation={chinese==='hotel'?'Please take me to this address.':chinese.name} onClose={()=>setChinese(null)}/>}
 </>;
}
