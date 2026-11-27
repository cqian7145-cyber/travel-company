import {dataVersion,evidenceSources,factStatus,fieldLabels,linkKindLabel,safeEvidenceUrl,statusLabel,venueById} from '../shared/verification.mjs';
import {External} from './ui';

const DAY_NAMES=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const CORE_KEYS=['address','booking_link','opening_hours','admission'];

type Props={placeId:string;fields?:string[]};
export default function VenueEvidence({placeId,fields}:Props){
 const venue=venueById(placeId);if(!venue)return null;
 const allEntries=Object.entries(venue.facts).filter(([key])=>!fields||fields.includes(key));
 const f=venue.facts;
 const bookingSource=evidenceSources[f.booking_link.source_id as keyof typeof evidenceSources];
 const bookingUrl=safeEvidenceUrl(f.booking_link.value?.url||bookingSource?.url);
 const closedDay=f.usual_closed_day?.value;
 const closedText=typeof closedDay==='number'?`Usually closed ${DAY_NAMES[closedDay]}s`:'No fixed weekly closure recorded';

 return <section className="venue-evidence" aria-label={`Key visit facts for ${placeId}`}>
  <h3>Key visit facts</h3>
  {!fields&&<dl className="core-facts-grid">
   <div><dt>Chinese address</dt><dd lang="zh-Hans">{f.address.value}</dd></div>
   <div><dt>Official channel</dt><dd>{bookingUrl?<External href={bookingUrl}>{f.booking_link.value?.label||bookingSource?.name||'Official information'}</External>:'Check operator site'}</dd></div>
   <div><dt>Hours &amp; closure</dt><dd>{f.opening_hours.value} · <strong>{closedText}</strong></dd></div>
   <div><dt>Estimated budget</dt><dd>{f.admission.value===0?'Free entry (estimate)':`¥${f.admission.value} admission estimate`}</dd></div>
  </dl>}
  <details className="evidence-audit-drawer">
   <summary>{fields?'Source & rule verification details':'Full verification log & source dates'} ({dataVersion.version})</summary>
   <p className="evidence-drawer-note">Static snapshot {dataVersion.version}. Recheck live operator rules before departure.</p>
   {allEntries.filter(([key,fact])=>fields||CORE_KEYS.includes(key)||factStatus(fact)!=='unknown').map(([key,fact])=>{
    const status=factStatus(fact),source=evidenceSources[fact.source_id as keyof typeof evidenceSources],url=safeEvidenceUrl(source?.url);
    const value=key==='booking_link'?linkKindLabel(fact.value.kind):key==='admission'?`¥${fact.value} · planning estimate`:key==='coordinates'?`${fact.value.lat}, ${fact.value.lng}`:fact.value===null?'Confirm with operator':String(fact.value);
    return <details className="evidence-field" key={key}><summary><span>{fieldLabels[key as keyof typeof fieldLabels]||key}</span><span className={`evidence-state evidence-${status}`}>{statusLabel(status)}</span></summary><div className="evidence-field-body"><p>{value}</p>
     {key==='booking_link'&&<p className="evidence-link-notice">{['ticket_checkout','reservation_portal'].includes(fact.value.kind)?'Confirm the live operator page before purchase.':'Information handoff only.'}</p>}
     <dl><div><dt>Verified</dt><dd>{fact.verified_at||'Not recorded'}</dd></div><div><dt>Reviewed</dt><dd>{fact.reviewed_at||'Not recorded'}</dd></div><div><dt>Next review</dt><dd>{fact.next_review_at||'Not scheduled'}</dd></div></dl><p>{fact.evidence_note}</p>
     {url?<External href={url}>{source.name}</External>:<p>Source unavailable</p>}
    </div></details>;
   })}
  </details>
 </section>;
}
