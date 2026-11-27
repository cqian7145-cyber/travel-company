import {useState} from 'react';
import {Modal} from './ui';
import {MatchaButton} from './MatchaButton';
import {ALLOWED_EVENTS,readFunnel,resetFunnel} from './telemetry';

export default function FounderAnalyticsModal({onClose}:{onClose:()=>void}){
 const [summary,setSummary]=useState(readFunnel);
 const entries=Object.entries(summary.counts).sort((a,b)=>b[1]-a[1]);

 function downloadJson(){
  const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),...summary},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='china-closer-funnel-local.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }

 return <Modal title="Founder Funnel & Growth Diagnostics" onClose={onClose}>
  <div className="partner-options-card" style={{margin:0}}>
   <p className="eyebrow">ZERO-COOKIE CONVERSION TELEMETRY</p>
   <p>Tracks local browser funnel actions + sends anonymized <code>/api/event</code> beacons to Cloudflare Workers Observability logs. Combine with Cloudflare Web Analytics &amp; Google Search Console for Week 4 decisions.</p>
   <dl className="core-facts-grid">
    {ALLOWED_EVENTS.map(evt=><div key={evt}><dt>{evt.replaceAll('_',' ')}</dt><dd><strong>{summary.counts[evt]||0}</strong></dd></div>)}
   </dl>
   {entries.some(([k])=>k.includes(':'))&&<>
    <h3>Breakdown by partner / guide target</h3>
    <ul>{entries.filter(([k])=>k.includes(':')).map(([k,v])=><li key={k}><code>{k}</code>: <strong>{v}</strong></li>)}</ul>
   </>}
   <p className="module-disclaimer">Last local event: {summary.lastEventAt||'None recorded in this browser yet'}</p>
   <div className="partner-links">
    <MatchaButton className="outline-button" onClick={downloadJson}>Export JSON snapshot</MatchaButton>
    <MatchaButton className="outline-button" onClick={()=>setSummary(resetFunnel())}>Reset local counters</MatchaButton>
   </div>
  </div>
 </Modal>;
}
