import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {seoGuides,guideRoute,guideRoutes} from '../shared/seo-guides.mjs';
import {buildOfflineHtml} from '../shared/offline-pack.mjs';
import {buildPlan} from '../shared/planner.mjs';
import worker from '../workers/index.mjs';

test('Programmatic SEO guides prerender with valid FAQPage JSON-LD, canonical URLs, sitemap and offline coverage',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 const manifest=JSON.parse(await readFile('dist/offline-manifest.json','utf8'));
 assert.equal(guideRoutes().length,7);
 assert.equal(guideRoute('/guides')?.kind,'guides-index');
 assert.equal(guideRoute('/guides/missing-guide')?.kind,'not-found');

 for(const path of guideRoutes()){
  const route=guideRoute(path);
  const html=await readFile('dist'+route.file,'utf8');
  assert.equal((html.match(/<title>/g)||[]).length,1,path);
  assert.equal((html.match(/name="description"/g)||[]).length,1,path);
  assert.ok(html.includes(`https://china-closer.xizimist.com${path}`),path);
  assert.ok(sitemap.includes(`https://china-closer.xizimist.com${path}`),path);
  assert.ok(manifest.files.includes(route.file),route.file);
  if(route.kind==='guide'){
   const match=html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
   assert.ok(match,`${path} missing FAQPage JSON-LD`);
   const schema=JSON.parse(match[1]);
   assert.equal(schema['@type'],'FAQPage');
   assert.equal(schema.mainEntity.length,route.guide.faqs.length);
  }
 }
 assert.equal(seoGuides.length,6);
});

test('Workers dispatches SEO guides, returns 404 for unknown guide slugs, and validates /api/event telemetry',async()=>{
 let fetched='';
 const env={ASSETS:{fetch:async r=>{fetched=new URL(r.url).pathname;return new Response('guide-html');}},PLAN_RATE_LIMITER:{limit:async()=>({success:true})}};
 for(const path of guideRoutes()){
  const res=await worker.fetch(new Request('https://china-closer.xizimist.com'+path),env);
  assert.equal(res.status,200);
  assert.equal(fetched,guideRoute(path).file);
 }
 assert.equal((await worker.fetch(new Request('https://china-closer.xizimist.com/guides/unknown-slug'),env)).status,404);

 const okEvt=await worker.fetch(new Request('https://china-closer.xizimist.com/api/event',{
  method:'POST',
  headers:{'Content-Type':'application/json',Origin:'https://china-closer.xizimist.com'},
  body:JSON.stringify({event:'partner_link_clicked',target:'esim-airalo'})
 }),env);
 assert.equal(okEvt.status,204);

 const badEvt=await worker.fetch(new Request('https://china-closer.xizimist.com/api/event',{
  method:'POST',
  headers:{'Content-Type':'application/json',Origin:'https://china-closer.xizimist.com'},
  body:JSON.stringify({event:'unlisted_event'})
 }),env);
 assert.equal(badEvt.status,400);
});

test('Complete personal survival HTML pack embeds Beijing/Guangzhou itinerary and AI advice safely offline',()=>{
 const plan=buildPlan({city:'beijing',days:2,budget:2600,pace:'balanced',interests:['Culture'],date:'2026-12-01'});
 plan.aiSummary='Two-day Beijing cultural loop.';
 plan.days[0].advice={
  day:1,
  routeLogic:'Central axis walk.',
  diningTip:'Try roast duck or hutong noodles nearby.',
  pitfallTip:'Bring your physical passport for security checks.',
  rainyBackup:'Spend extra time inside museum galleries.'
 };
 const html=buildOfflineHtml({
  hotel:{name:'',address:'',url:''},
  details:{trainNumber:'',destinationId:'',confirmedAddress:'',confirmedDestination:''},
  plan
 });
 assert.match(html,/Saved Itinerary · Beijing/);
 assert.match(html,/Two-day Beijing cultural loop/);
 assert.match(html,/Central axis walk/);
 assert.match(html,/Rain backup:/);
 assert.doesNotMatch(html,/<script/i);
});

test('CSS architecture is consolidated from 17 scattered files to 4 layered stylesheets',async()=>{
 const cssFiles=(await readdir('src')).filter(f=>f.endsWith('.css')).sort();
 assert.deepEqual(cssFiles,['matcha.css','styles-cities.css','styles-core.css','styles-editorial.css']);
});
