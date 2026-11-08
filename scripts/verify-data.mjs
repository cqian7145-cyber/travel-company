import {writeFile} from 'node:fs/promises';
import {auditData,venues,evidenceSources,dataVersion,factStatus,fieldLabels,linkKindLabel} from '../shared/verification.mjs';
import {dataHash} from './data-hash.mjs';
const asOf=process.argv.find(a=>a.startsWith('--as-of='))?.slice(8)||new Date().toISOString().slice(0,10);
const report=auditData(venues,evidenceSources,asOf);
if(dataVersion.content_hash!==dataHash(venues,evidenceSources))report.errors.push('Dataset content hash does not match. Review changes, then prepare a new data version with npm run data:version -- YYYY-MM-DD.vdcN.');
const clean=v=>String(v??'—').replaceAll('|','\\|').replaceAll('\n',' ');
if(process.argv.includes('--report')){
 const lines=['# Nine-place field audit',`Dataset: ${dataVersion.version} · evaluated ${asOf}. This audit does not reverify official websites.`,
 'Verified means a carried-forward dated source snapshot; estimates and unknowns are explicit. No field was upgraded merely because it has an official source URL.','',
 '| Place ID | Field | Value / link type | Effective status | Verified at | Reviewed at | Next review | Source |',
 '| --- | --- | --- | --- | --- | --- | --- | --- |'];
 for(const v of venues)for(const [key,f]of Object.entries(v.facts)){
  const value=key==='booking_link'?`${f.value.url} (${linkKindLabel(f.value.kind)}; link status ${f.status})`:typeof f.value==='object'&&f.value!==null?JSON.stringify(f.value):f.value;
  lines.push(`| ${v.id} | ${fieldLabels[key]} | ${clean(value)} | ${factStatus(f,asOf)} | ${clean(f.verified_at)} | ${clean(f.reviewed_at)} | ${clean(f.next_review_at)} | ${clean(f.source_id)} |`);
 }
 lines.push('','## Source registry','');for(const s of Object.values(evidenceSources))lines.push(`- ${s.id}: [${s.name}](${s.url}) · link kind ${s.kind} · last accessed ${s.last_accessed_at||'unknown'}.`);
 lines.push('','Unknown fields need a human field-specific check. The museum hours and reservation evidence came from the previous operator review on 2026-11-07. The next review date is an internal seven-day editorial cadence, not an operator guarantee. General city portals are not ticket checkouts.');
 await writeFile('docs/VENUE-FIELD-AUDIT.md',lines.join('\n')+'\n');
}
for(const message of report.errors)console.error('ERROR '+message);
if(process.argv.includes('--details'))for(const message of report.warnings)console.warn('REVIEW '+message);
console.log(`Data ${dataVersion.version}: ${venues.length} venues, ${report.errors.length} errors, ${report.warnings.length} review notices (unknown/conflicting/overdue).`);
if(report.errors.length)process.exitCode=1;
