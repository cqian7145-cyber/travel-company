import {Button as AstryxButton} from '@astryxdesign/core/Button';
import {Card as AstryxCard} from '@astryxdesign/core/Card';
import {ArrowUpRight,Clock,Compass,Copy,Download,Leaf,Plus,Sparkles,TrainFront,Trash2} from 'lucide-react';
import {places} from '../shared/catalog.mjs';
import {placesForCity,placeById,plannerCities} from '../shared/bsg-catalog.mjs';
import {buildPlan,estimate} from '../shared/planner.mjs';
import {buildOfflineHtml} from '../shared/offline-pack.mjs';
import type {ArrivalSettings,Hotel,TravelDetails} from './companion-state';
import {External} from './ui';
import {trackEvent} from './telemetry';

type Place=typeof places[number];
type Plan=ReturnType<typeof buildPlan>;

const money=(n:number)=>`¥${n.toLocaleString('en-US')}`;

type Props={
 plan:Plan|null;
 onPlanChange:(plan:Plan)=>void;
 onOpenModal:()=>void;
 onSaved:()=>void;
 onTripMode:()=>void;
 onBookings:()=>void;
 onCopy:(text:string)=>void;
 onNotify:(msg:string)=>void;
 onOpenDetail:(p:Place)=>void;
 hotel:Hotel;
 details:TravelDetails;
 arrival:ArrivalSettings;
};

export default function PlannerView({plan,onPlanChange,onOpenModal,onSaved,onTripMode,onBookings,onCopy,onNotify,onOpenDetail,hotel,details,arrival}:Props){
 const costs=plan?estimate(plan):null;
 const planCity=plan?.input?.city||'shanghai';
 const planCityName=plannerCities.find(c=>c.id===planCity)?.name||'Shanghai';
 const planCatalog=placesForCity(planCity);

 function updateStop(dayIndex:number,stopIndex:number,field:'note'|'time'|'placeId',value:string){
  if(!plan)return;
  onPlanChange({...plan,days:plan.days.map((day,i)=>i===dayIndex?{...day,stops:day.stops.map((stop,j)=>j===stopIndex?{...stop,[field]:value,...(field==='placeId'?{id:crypto.randomUUID()}:{})}:stop)}:day)});
 }

 function exportPlan(){
  if(!plan||!costs)return;
  const text=[
   `CHINA, CLOSER — ${planCityName.toUpperCase()}`,
   `Mode: ${plan.mode==='ai'?'AI-assisted (DeepSeek)':'Curated planner'}`,
   `Planning budget: ${money(plan.input.budget)} · Estimate: ${money(costs.total)} per person`,
   ...(plan.aiSummary?['',`Overview: ${plan.aiSummary}`]:[]),
   ...plan.days.flatMap(d=>[
    '',d.date,
    ...d.stops.flatMap(s=>{
     const p=placeById(s.placeId);if(!p)return [];
     return [`${s.time} ${p.name} / ${p.zh}`,p.address,p.transit,`Admission estimate ${money(p.cost)}. ${p.hours}`,`Official information: ${p.source}`,s.note];
    }),
    ...(d.advice?[
     d.advice.routeLogic?`Route logic: ${d.advice.routeLogic}`:'',
     d.advice.diningTip?`Dining pairing: ${d.advice.diningTip}`:'',
     d.advice.pitfallTip?`Practical tip: ${d.advice.pitfallTip}`:'',
     d.advice.rainyBackup?`Rain backup: ${d.advice.rainyBackup}`:''
    ].filter(Boolean):[]),
    d.note
   ]),
   '','All costs are estimates; recheck opening hours and booking requirements. Flights and intercity travel excluded.'
  ].join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=`${planCity}-itinerary.txt`;a.click();URL.revokeObjectURL(url);
 }

 function exportSurvivalPack(){
  const html=buildOfflineHtml({hotel,details,arrival,plan});
  const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=`china-closer-${planCity}-survival-pack.html`;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  trackEvent('offline_html_downloaded',planCity);
  onNotify('Downloaded standalone offline HTML survival pack');
 }

 return <section className="trip-theme-content" aria-label="My Trip">
  <nav className="trip-view-tabs" aria-label="My Trip views"><span aria-current="page">Itinerary</span><button className="text-link" onClick={onSaved}>Saved</button><a href="/cities/hangzhou#hangzhou-places">Hangzhou bookmarks</a></nav>
  <div className="page-intro"><div><div className="eyebrow">BEIJING · SHANGHAI · GUANGZHOU PLANNER</div><h1>Your {plan?planCityName:'China'} trip, day by day<span>.</span></h1><p>Make it yours. Switch cities, edit a time, swap a stop, or export an offline survival pack.</p></div><AstryxButton variant="primary" size="lg" label={plan?'Replan my trip':'Plan my trip'} onClick={onOpenModal}/></div>
  {!plan?<AstryxCard className="matcha-empty"><div className="empty-state large-empty"><Compass size={40}/><h2>Good trips start with a little curiosity.</h2><p>Choose Beijing, Shanghai, or Guangzhou—then set your interests, budget, and pace.</p><AstryxButton variant="primary" size="lg" label="Create my itinerary" onClick={onOpenModal}/></div></AstryxCard>:<>
   <div className="plan-summary">
    <div>
     <span className="status-tag"><Sparkles size={13}/>{plan.mode==='ai'?'AI-assisted plan · DeepSeek':'Curated plan · no live AI'}</span>
     <h2>{plan.input.days} days in {planCityName}</h2>
     <p>{plan.input.interests.join(' · ')} &nbsp; / &nbsp; {plan.input.pace} pace</p>
     {plan.aiSummary&&<p className="ai-summary-banner"><Sparkles size={15}/><span>{plan.aiSummary}</span></p>}
    </div>
    <div className="partner-links">
     <AstryxButton size="lg" label="Export .txt" onClick={exportPlan}/>
     <button className="outline-button" onClick={exportSurvivalPack}><Download size={16}/> Offline HTML survival pack</button>
    </div>
   </div>
   <div className="plan-companion-actions"><AstryxButton size="lg" variant="primary" label="Start Trip Mode" onClick={onTripMode}/><AstryxButton size="lg" label="Check booking tasks" onClick={onBookings}/></div>
   <div className="planner-layout">
    <div className="day-list">{plan.days.map((day,di)=><section className="day-section" key={day.date}>
     <div className="day-heading"><span>0{di+1}</span><div><h2>Day {di+1}</h2><p>{new Date(day.date+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</p></div>
      <button className="text-link" onClick={()=>{const available=planCatalog.find(p=>!day.stops.some(s=>s.placeId===p.id)&&p.closedDay!==new Date(day.date+'T12:00:00Z').getUTCDay());if(available)onPlanChange({...plan,days:plan.days.map((d,i)=>i===di?{...d,stops:[...d.stops,{id:crypto.randomUUID(),placeId:available.id,time:'16:00',note:''}]}:d)});else onNotify('All curated places are already on this day.');}}><Plus size={14}/> Add stop</button>
     </div>
     {day.advice&&<div className="ai-day-advice">
      <p className="eyebrow"><Sparkles size={13}/> AI ROUTE ADVISOR · DAY {di+1}</p>
      {day.advice.routeLogic&&<p><strong>Route rhythm:</strong> {day.advice.routeLogic}</p>}
      {day.advice.diningTip&&<p><strong>Food pairing:</strong> {day.advice.diningTip}</p>}
      {day.advice.pitfallTip&&<p><strong>Heads-up:</strong> {day.advice.pitfallTip}</p>}
      {day.advice.rainyBackup&&<p><strong>Rain backup:</strong> {day.advice.rainyBackup}</p>}
     </div>}
     {day.stops.map((stop,si)=>{
      const p=placeById(stop.placeId);if(!p)return null;
      return <AstryxCard className="matcha-stop" key={`${di}-${si}`}><article className="itinerary-stop">
       <div className="stop-time"><label><span className="sr-only">Time for {p.name}</span><input type="time" value={stop.time} onChange={e=>updateStop(di,si,'time',e.target.value)}/></label><span className="timeline-dot"/></div>
       <div className="stop-content">
        <div className="stop-top"><span className="eyebrow">{p.category} · {p.area}</span><button className="icon-button" aria-label={`Remove ${p.name}`} onClick={()=>onPlanChange({...plan,days:plan.days.map((d,i)=>i===di?{...d,stops:d.stops.filter((_,j)=>j!==si)}:d)})}><Trash2 size={15}/></button></div>
        <h3>{planCity==='shanghai'?<button onClick={()=>onOpenDetail(p as Place)}>{p.name} <ArrowUpRight size={16}/></button>:<span>{p.name}</span>}</h3>
        <div className="chinese-name">{p.zh}</div>
        <button className="address-copy" onClick={()=>onCopy(p.address)}>{p.address}<Copy size={13}/></button>
        <p className="transit"><TrainFront size={15}/>{p.transit}</p>
        <p className="hours-note"><Clock size={14}/>{p.hours}</p>
        {p.closedDay===new Date(day.date+'T12:00:00Z').getUTCDay()&&<p className="warning">Scheduled on a usual closure day. Change this stop.</p>}
        <div className="stop-actions"><span>{money(p.cost)} admission estimate</span><External href={p.booking}>{p.bookingLabel}</External></div>
        <label className="swap-label">Swap stop<select value={stop.placeId} onChange={e=>updateStop(di,si,'placeId',e.target.value)} aria-label={`Swap ${p.name}`}>{planCatalog.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <input className="note-input" aria-label={`Notes for ${p.name}`} placeholder="Add a personal note…" maxLength={500} value={stop.note} onChange={e=>updateStop(di,si,'note',e.target.value)}/>
       </div>
      </article></AstryxCard>;
     })}
     {day.note&&<p className="free-time"><Leaf size={16}/>{day.note}</p>}
     {!day.stops.length&&<p className="free-time">An open day. Add a stop when you’re ready.</p>}
    </section>)}</div>
    <aside className="budget-panel">
     <div className="eyebrow">A LITTLE CLARITY</div><h2>Your budget, unpacked</h2><p>Estimates per person in CNY</p>
     {[['Stay',costs!.lodging],['Food & coffee',costs!.food],['Local transport',costs!.transport],['Admission',costs!.admission],['15% contingency',costs!.buffer]].map(([label,value])=><div className="budget-row" key={label}><span>{label}</span><strong>{money(Number(value))}</strong></div>)}
     <div className="budget-total"><span>Estimated total</span><strong>{money(costs!.total)}</strong></div>
     <p>Your budget: {money(plan.input.budget)}</p>
     {costs!.overBudget&&<p className="warning">This estimate exceeds your budget by {money(costs!.total-plan.input.budget)}. Adjust your budget, accommodation, or trip length.</p>}
     <div className="budget-footnote">Illustrative rates: ¥350 per night, ¥120 for meals and ¥40 for local transport per day. Includes one night per trip day. Flights, intercity travel, shopping, and special exhibitions excluded. Actual prices and transfer times must be checked.</div>
    </aside>
   </div>
  </>}
 </section>;
}
