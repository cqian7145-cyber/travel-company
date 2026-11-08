import {dataVersion,evidenceSources,factStatus,fieldLabels,linkKindLabel,safeEvidenceUrl,statusLabel,venueById} from '../shared/verification.mjs';
import {External} from './ui';
type Props={placeId:string;fields?:string[]};
export default function VenueEvidence({placeId,fields}:Props){
 const venue=venueById(placeId);if(!venue)return null;
 const entries=Object.entries(venue.facts).filter(([key])=>!fields||fields.includes(key));
 return <section className="venue-evidence" aria-label={`Field verification for ${placeId}`}><h3>Sources &amp; verification</h3><p>Each field has its own evidence. A dated snapshot does not guarantee access on your visit date. “Reviewed” is not the same as “verified.”</p>
  <small className="evidence-version">Data {dataVersion.version} · Static snapshot</small>
  {entries.map(([key,fact])=>{
   const status=factStatus(fact),source=evidenceSources[fact.source_id as keyof typeof evidenceSources],url=safeEvidenceUrl(source?.url);
   const value=key==='booking_link'?linkKindLabel(fact.value.kind):key==='admission'?`¥${fact.value} · planning estimate`:key==='coordinates'?`${fact.value.lat}, ${fact.value.lng}`:fact.value===null?'No field-specific information recorded':String(fact.value);
   return <details className="evidence-field" key={key}><summary><span>{fieldLabels[key as keyof typeof fieldLabels]||key}</span><span className={`evidence-state evidence-${status}`}>{statusLabel(status)}</span></summary><div className="evidence-field-body"><p>{value}</p>
    {key==='booking_link'&&<p className="evidence-link-notice">{['ticket_checkout','reservation_portal'].includes(fact.value.kind)?'Confirm the live operator page before purchase.':'Information handoff only. No verified ticket checkout is recorded.'}</p>}
    <dl><div><dt>Field verified</dt><dd>{fact.verified_at||'Not recorded'}</dd></div><div><dt>Field reviewed</dt><dd>{fact.reviewed_at||'Not recorded'}</dd></div><div><dt>Next review</dt><dd>{fact.next_review_at||'Not scheduled'}</dd></div><div><dt>Source accessed</dt><dd>{source?.last_accessed_at||'Not recorded'}</dd></div></dl><p>{fact.evidence_note}</p>
    {url?<External href={url}>{source.name} · {linkKindLabel(source.kind)}</External>:<p>Source unavailable · manual review needed</p>}
   </div></details>;
  })}
 </section>;
}
