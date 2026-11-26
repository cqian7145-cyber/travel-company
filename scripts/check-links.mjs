import {readFile} from 'node:fs/promises';
import {travelSources} from '../shared/arrival.mjs';

const live=process.argv.includes('--live');
const venuesData=JSON.parse(await readFile(new URL('../data/venues.json',import.meta.url),'utf8'));
const sourcesData=JSON.parse(await readFile(new URL('../data/sources.json',import.meta.url),'utf8'));

const today=new Date();
const todayStr=today.toISOString().slice(0,10);
const soonCutoff=new Date(today.getTime()+14*86400000).toISOString().slice(0,10);

const overdue=[];
const dueSoon=[];
const unknownCount={total:0};

const venuesList=Array.isArray(venuesData)?venuesData:venuesData.venues||[];
for(const venue of venuesList){
 for(const [field,fact] of Object.entries(venue.facts)){
  if(fact.status==='unknown')unknownCount.total++;
  if(!fact.next_review_at)continue;
  if(fact.next_review_at<=todayStr)overdue.push({venue:venue.id,field,due:fact.next_review_at,status:fact.status});
  else if(fact.next_review_at<=soonCutoff)dueSoon.push({venue:venue.id,field,due:fact.next_review_at,status:fact.status});
 }
}

console.log(`=== China, closer · Freshness Audit (${todayStr}) ===`);
console.log(`Venues: ${venuesList.length} | Overdue fields: ${overdue.length} | Due within 14d: ${dueSoon.length} | Unknown fields: ${unknownCount.total}`);
if(overdue.length){
 console.log('\n[Overdue review fields — top 15]');
 for(const row of overdue.slice(0,15))console.log(` - ${row.venue}.${row.field} (${row.status}) · due ${row.due}`);
 if(overdue.length>15)console.log(` ... and ${overdue.length-15} more`);
}
if(dueSoon.length){
 console.log('\n[Due within 14 days]');
 for(const row of dueSoon)console.log(` - ${row.venue}.${row.field} (${row.status}) · due ${row.due}`);
}

if(live){
 const urls=new Map();
 for(const [id,src] of Object.entries(sourcesData.sources||sourcesData))if(src?.url)urls.set(`source:${id}`,src.url);
 for(const [id,src] of Object.entries(travelSources))if(src?.url)urls.set(`arrival:${id}`,src.url);
 console.log(`\n=== Live Link Check (${urls.size} unique URLs) ===`);
 let broken=0;
 await Promise.all([...urls.entries()].map(async([label,url])=>{
  try{
   const res=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(8000),headers:{'User-Agent':'ChinaCloserLinkChecker/1.0'}});
   if(res.status>=400&&res.status!==403&&res.status!==405){broken++;console.log(` [FAIL ${res.status}] ${label} -> ${url}`);}
   else console.log(` [OK ${res.status}] ${label}`);
  }catch(err){
   broken++;console.log(` [ERR] ${label} -> ${url} (${err.name||err.message})`);
  }
 }));
 console.log(`\nLive check complete. Broken/unreachable: ${broken}/${urls.size}`);
 if(broken>0)process.exitCode=1;
}else{
 console.log('\nTip: run `npm run data:freshness -- --live` to verify external official URLs over HTTP.');
}
