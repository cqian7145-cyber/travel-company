import {useState} from 'react';
import {ArrowRight,CheckCircle2,ClipboardList,ExternalLink,Languages,TrainFront} from 'lucide-react';
import {bookingTasks,taskKey,safeOperatorUrl} from '../shared/companion.mjs';
import {isConfirmations,useLocalState,type Hotel,type Plan} from './companion-state';
import {ChineseCard,External} from './ui';
import VenueEvidence from './VenueEvidence';

type Props={plan:Plan|null;hotel:Hotel;onHotelChange:(hotel:Hotel)=>void;hotelStorageError:boolean;onPlan:()=>void;onTrip:()=>void};
export default function BookingAssistant({plan,hotel,onHotelChange,hotelStorageError,onPlan,onTrip}:Props){
 const [confirmed,setConfirmed,storageError]=useLocalState('closer-booking-confirmations-v1',{},isConfirmations);
 const [includeRail,setIncludeRail,railStorageError]=useLocalState('closer-include-rail-v1',false,(v):v is boolean=>typeof v==='boolean');
 const [showHotel,setShowHotel]=useState(false);
 const tasks=bookingTasks(plan,includeRail),hotelUrl=safeOperatorUrl(hotel.url),hotelReady=Boolean(hotel.name.trim()&&hotel.address.trim()&&hotelUrl);
 const keyFor=(task:typeof tasks[number])=>taskKey(plan,task,task.id==='hotel'?JSON.stringify(hotel):'');
 const count=tasks.filter(task=>confirmed[keyFor(task)]).length;
 return <>
  <div className="page-intro companion-intro"><div><div className="eyebrow">02 / BOOKING ASSISTANT</div><h1>A little checking. A smoother trip<span>.</span></h1><p>Your reservation followups, gathered from your itinerary.</p></div><span className="module-mark"><ClipboardList size={24}/>Before you go</span></div>
  <div className="booking-overview"><div><span className="eyebrow">BOOKING CHECKLIST</span><h2>{count} <span>/ {tasks.length}</span> user-confirmed</h2><p>Checks and reminders — no tickets are sold or reserved here.</p></div><button className="outline-button" onClick={plan?onTrip:onPlan}>{plan?'Open Trip Mode':'Create itinerary'} <ArrowRight size={16}/></button></div>
  <div className="booking-honesty"><CheckCircle2 size={20}/><p><strong>“User confirmed” means you checked it.</strong> It does not mean this app booked, paid for, or verified a ticket. Check the operator’s order confirmation before travel. Changing a relevant stop resets its checklist confirmation.</p></div>
  {!plan&&<div className="module-empty-inline"><ClipboardList size={21}/><div><strong>No itinerary yet</strong><p>Create a trip to detect venue followups. Hotel preparation and the optional train task are available below.</p></div><button className="text-link" onClick={onPlan}>Plan a trip <ArrowRight size={15}/></button></div>}
  <label className="rail-option"><TrainFront size={21}/><span><strong>I have an intercity train journey</strong><small>Add a Railway 12306 booking check. The city itinerary does not assume you are taking a train.</small></span><input type="checkbox" checked={includeRail} onChange={e=>setIncludeRail(e.target.checked)}/></label>
  <div className="booking-task-list">{tasks.map(task=>{
   const key=keyFor(task),timestamp=confirmed[key],isHotelTask=task.id==='hotel';
   const url=isHotelTask?hotelUrl:task.url,canConfirm=!isHotelTask||hotelReady;
   return <article className={`booking-task ${timestamp?'user-confirmed':''}`} key={task.id}>
    <div className="booking-task-heading"><span className="task-index">{timestamp?<CheckCircle2 size={21}/>:<ClipboardList size={21}/>}</span><div><h2>{task.title}</h2>{task.dates.length>0&&<p>In your itinerary: {task.dates.join(' · ')}</p>}</div><span className={`booking-state ${timestamp?'confirmed':''}`}>{timestamp?'User confirmed':'Not confirmed'}</span></div>
    <div className="booking-task-body"><p className="booking-requirement">{task.requirement}</p><dl className="booking-facts"><div><dt>Passport / ID</dt><dd>{task.passport}</dd></div><div><dt>Last rule verification</dt><dd>{task.verified||'Not verified · check with the operator'}</dd></div><div><dt>Source reviewed</dt><dd>{task.reviewed||'Not verified · user-provided information'}</dd></div></dl><p className="booking-caution">{task.caution}</p>{task.id.startsWith('venue:')&&<VenueEvidence placeId={task.id.slice(6)} fields={['reservation','identity_requirements','booking_link']}/> }
     {isHotelTask&&<div className="hotel-form"><label>Chinese hotel name<input lang="zh-Hans" maxLength={120} placeholder="酒店中文名称" value={hotel.name} onChange={e=>onHotelChange({...hotel,name:e.target.value})}/></label><label>Full Chinese address<textarea lang="zh-Hans" maxLength={300} placeholder="酒店完整中文地址" value={hotel.address} onChange={e=>onHotelChange({...hotel,address:e.target.value})}/></label><label>Official hotel website (HTTPS)<input type="url" maxLength={1000} placeholder="https://…" value={hotel.url} onChange={e=>onHotelChange({...hotel,url:e.target.value})} aria-invalid={Boolean(hotel.url&&!hotelUrl)} aria-describedby="hotel-url-help"/></label><small id="hotel-url-help">{hotel.url&&!hotelUrl?'Enter an HTTPS URL without a username or password.':'User-provided link. Confirm it belongs to your exact property; this app does not verify hotel websites.'}</small>{hotel.address.trim()&&<button className="outline-button" onClick={()=>setShowHotel(true)}><Languages size={16}/>Show hotel address in Chinese</button>}</div>}
     <div className="booking-source">{url?<External href={url}>{isHotelTask?'Open hotel website · user-provided':task.source}</External>:<span><ExternalLink size={14}/>Official booking link not provided</span>}{!isHotelTask&&<small>{task.id==='rail'?'Use the live 12306 website for ticket availability and order status.':'Operator rules override this dated checklist. Recheck your exact visit and ticket type.'}</small>}</div>
     {task.id==='rail'&&<External className="rail-verification-link" href="https://english.www.gov.cn/news/202311/28/content_WS6565e903c6d0868f4e8e1b58.html">Government background · foreign-passport online verification (28 Nov 2023)</External>}
     <div className="booking-confirm-control"><label><input type="checkbox" checked={Boolean(timestamp)} disabled={!canConfirm&&!timestamp} onChange={e=>setConfirmed(previous=>{const updated={...previous};if(e.target.checked)updated[key]=new Date().toISOString();else delete updated[key];return updated;})}/>I have checked this with the operator / my booking</label>{timestamp?<small>User-confirmed {new Date(timestamp).toLocaleString('en-GB',{timeZone:'Asia/Shanghai'})} (Shanghai time). Not system-verified.</small>:!canConfirm?<small>Add the Chinese property name, address, and valid website before confirming.</small>:<small>Not confirmed. Opening the link does not change this status.</small>}</div>
    </div>
   </article>;
  })}</div>
  {(storageError||railStorageError||hotelStorageError)&&<p role="alert" className="warning">Browser storage is unavailable. These changes may not survive reload.</p>}
  <p className="privacy-note">Stored on this browser only. No passport number, payment information, or booking reference is collected. Keep the operator’s actual ticket or confirmation separately.</p>
  {showHotel&&<ChineseCard title="Hotel address in Chinese" text={hotel.name||'请送我到这个地址，谢谢。'} address={hotel.address} translation="Please take me to this address." onClose={()=>setShowHotel(false)}/>}
 </>;
}
