import {CheckCircle2,ChevronDown,Globe,MapPin,ShieldCheck,TrainFront,Wallet,Wifi} from 'lucide-react';
import {guides,sources} from '../shared/catalog.mjs';
import {External} from './ui';

type Props={
 nationality:string;
 onNationality:(v:string)=>void;
 departure:string;
 onDeparture:(v:string)=>void;
 checked:string[];
 onToggleChecked:(id:string)=>void;
 openGuide:string;
 onOpenGuide:(id:string)=>void;
};

export default function ChinaReadyView({nationality,onNationality,departure,onDeparture,checked,onToggleChecked,openGuide,onOpenGuide}:Props){
 return <>
  <div className="page-intro"><div><div className="eyebrow">LAND WITH A LITTLE MORE CONFIDENCE</div><h1>Let’s get you China Ready<span>.</span></h1><p>The practical bits, in one place. Official sources, always within reach.</p></div><ShieldCheck size={38}/></div>
  <section className="traveler-panel">
   <label>Passport nationality<input placeholder="e.g. Australia" maxLength={80} value={nationality} onChange={e=>onNationality(e.target.value)}/></label>
   <label>Departure date<input type="date" value={departure} onChange={e=>onDeparture(e.target.value)}/></label>
   <div className="readiness-score"><strong>{checked.length}<span> / {guides.length}</span></strong><p>essentials checked</p><div className="progress-track"><span style={{width:`${checked.length/guides.length*100}%`}}/></div></div>
  </section>
  <div className="policy-notice"><ShieldCheck size={22}/><div><strong>{nationality?`Entry research for a ${nationality} passport`:'Start with your entry requirements'}</strong><p>{departure?`For departure on ${departure}, `:'Before departure, '}confirm the rules with the National Immigration Administration and your Chinese embassy. Passport type, purpose, route, and dates all matter. This tool does not confirm entry eligibility.</p><External href={sources.immigration.url}>Official entry policies</External><small>Policy listing updated: 20 Aug 2026 · Source reviewed: {sources.immigration.reviewed} · Recheck for your travel dates</small></div></div>
  <div className="guide-list">{guides.map((guide,i)=>{
   const source=sources[guide.source as keyof typeof sources],Icon=[Globe,Wallet,Wifi,TrainFront,MapPin][i];
   return <section className={`guide ${openGuide===guide.id?'expanded':''}`} key={guide.id}>
    <button className="guide-heading" aria-expanded={openGuide===guide.id} aria-controls={`guide-${guide.id}`} onClick={()=>onOpenGuide(openGuide===guide.id?'':guide.id)}>
     <span className="guide-icon"><Icon size={23}/></span><span><strong>{guide.title}</strong><small>{guide.subtitle}</small></span>{checked.includes(guide.id)&&<CheckCircle2 size={19} className="checked-icon"/>}<ChevronDown size={19}/>
    </button>
    {openGuide===guide.id&&<div className="guide-body" id={`guide-${guide.id}`}>
     <ol>{guide.steps.map(step=><li key={step}>{step}</li>)}</ol>
     <p className="guide-note">{guide.note}</p>
     <div className="source-line"><External href={source.url}>{source.name}</External><small>Source update: {source.published} · Reviewed {source.reviewed}</small></div>
     <label className="check-label"><input type="checkbox" checked={checked.includes(guide.id)} onChange={()=>onToggleChecked(guide.id)}/>{guide.id==='entry'?'I have checked my requirements with the official authority':'I have reviewed and completed these steps'}</label>
    </div>}
   </section>;
  })}</div>
  <p className="privacy-note">Your checklist and trip preferences stay in this browser. No passport number or payment details are collected. Nationality and departure date are not sent to AI.</p>
 </>;
}
