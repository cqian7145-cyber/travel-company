import {renderSiteHeader,renderMobileNavigation} from './site-navigation.mjs';

const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');

export const seoGuides=[
 {
  slug:'pvg-pudong-airport-late-night',
  path:'/guides/pvg-pudong-airport-late-night',
  file:'/guides/pvg-pudong-airport-late-night/index.html',
  city:'Shanghai',
  eyebrow:'SHANGHAI ARRIVAL GUIDE · PVG',
  title:'Shanghai Pudong Airport (PVG) Late-Night Arrival Guide: Taxi vs. Metro | China, closer',
  description:'Landing at Shanghai Pudong (PVG) after 22:30? Practical checklist for official taxi queues, night surcharges, passport Wi-Fi kiosks, and offline Chinese hotel cards.',
  h1:'Landing at Shanghai Pudong (PVG) late at night.',
  summary:'When Maglev and Metro Line 2 wind down for the night, your calmest path into central Shanghai is the signed official airport taxi queue—paired with a confirmed Chinese hotel address offline.',
  updatedAt:'2026-11-27',
  primaryCta:{label:'Build my PVG First 90 Minutes card',href:'/arrival'},
  secondaryCta:{label:'Open taxi Chinese cards',href:'/speak'},
  steps:[
   'Do not assume Metro Line 2 or the Maglev is still running if you clear immigration and baggage after 22:30. Check live terminal boards first.',
   'Need Wi-Fi before leaving arrivals? Join the official airport Wi-Fi and look for passport photo-page verification on the portal or kiosk—never hand documents to touts.',
   'Follow overhead signs to the official licensed taxi queue (T1: outside Arrivals Gate 12; T2: outside Arrivals Gate 25). Decline anyone offering a "private taxi" inside the hall.',
   'Show your driver the full Chinese property name and street address—never rely on an English hotel name alone.',
   'Keep Alipay/WeChat Pay ready plus a backup bank card or modest CNY cash in case terminal signal is weak.'
  ],
  pitfalls:[
   'Unlicensed solicitors inside arrivals often quote inflated flat fares.',
   'Drop-off pins on overseas map apps can be shifted by hundreds of meters—verify in Amap or with your hotel.'
  ],
  faqs:[
   {q:'How do I get from Pudong Airport (PVG) to central Shanghai after midnight?',a:'After regular Metro Line 2 and Maglev services close, use the signed official licensed taxi rank outside Arrivals (T1 Gate 12 or T2 Gate 25) or check the official night-bus counter on site. Always show your hotel address in Chinese.'},
   {q:'Can I get Wi-Fi at Pudong Airport without a Chinese phone number?',a:'Shanghai Pudong provides official airport Wi-Fi with passport verification options on its login portal or self-service kiosks, plus staffed international service counters in arrivals.'},
   {q:'How much is a late-night taxi from PVG to People’s Square?',a:'Daytime official reference to People’s Square is roughly ¥180 / 50 minutes, while late-night meter rates include night surcharges and traffic variance. Always insist on the meter.'}
  ]
 },
 {
  slug:'pek-pkx-beijing-airport-transfer',
  path:'/guides/pek-pkx-beijing-airport-transfer',
  file:'/guides/pek-pkx-beijing-airport-transfer/index.html',
  city:'Beijing',
  eyebrow:'BEIJING ARRIVAL GUIDE · PEK & PKX',
  title:'Beijing Capital (PEK) vs. Daxing (PKX) Airport to City Transfer Guide | China, closer',
  description:'Flying into Beijing Capital (PEK) or Beijing Daxing (PKX)? Compare Airport Express rail, licensed taxi queues, passport Wi-Fi kiosks, and late-night fallbacks.',
  h1:'Beijing Capital (PEK) & Daxing (PKX) to your hotel.',
  summary:'Beijing operates two major international hubs: Capital (PEK) northeast of the center and Daxing (PKX) to the south. Confirm your three-letter airport code before planning your transfer.',
  updatedAt:'2026-11-27',
  primaryCta:{label:'Open PEK / PKX Arrival Assistant',href:'/arrival'},
  secondaryCta:{label:'Plan a Beijing itinerary',href:'/trip'},
  steps:[
   'Double-check your ticket for PEK (Capital, T2/T3) vs. PKX (Daxing, single starfish terminal)—they are over 60 km apart.',
   'At PEK daytime: Capital Airport Express connects T3/T2 to Sanyuanqiao (Line 10), Dongzhimen (Lines 2/13), and Beixinqiao (Line 5) for around ¥25.',
   'At PKX daytime: take elevators down to B1 for the Daxing Airport Express to Caoqiao (Line 10/19) in ~20 minutes (around ¥35), then transfer to metro or taxi.',
   'With heavy luggage or late-night arrivals: follow official floor signage to the licensed taxi queue and show your hotel’s full Chinese address (including district, e.g., 东城区 or 朝阳区).'
  ],
  pitfalls:[
   'Many Beijing hutong hotels sit inside narrow alleys where cars cannot stop directly at the door—confirm the nearest main-road drop-off with your hotel.',
   'Express rail lines stop well before midnight; always keep a taxi fallback for evening flights.'
  ],
  faqs:[
   {q:'Which Beijing airport is closer to the Forbidden City and Dongcheng?',a:'Beijing Capital (PEK) is generally closer to northeast/central districts like Dongcheng, Sanlitun, and Guomao, while Daxing (PKX) connects quickly via high-speed express rail to southern Beijing (Caoqiao).'},
   {q:'Do PEK and PKX have passport Wi-Fi kiosks for foreign travelers?',a:'Yes, both Beijing Capital and Beijing Daxing provide free airport Wi-Fi with passport-scanning kiosks and international service desks in arrivals.'}
  ]
 },
 {
  slug:'can-guangzhou-baiyun-airport-guide',
  path:'/guides/can-guangzhou-baiyun-airport-guide',
  file:'/guides/can-guangzhou-baiyun-airport-guide/index.html',
  city:'Guangzhou',
  eyebrow:'GUANGZHOU ARRIVAL GUIDE · CAN',
  title:'Guangzhou Baiyun Airport (CAN) Arrival Guide: Metro Line 3, Taxi & Transit | China, closer',
  description:'Step-by-step arrival guide for Guangzhou Baiyun Airport (CAN) T1 & T2: Metro Line 3 to Tianhe/Zhujiang New Town, licensed taxi queues, and 240-hour transit prep.',
  h1:'Arriving at Guangzhou Baiyun (CAN): T1 & T2 made simple.',
  summary:'Whether landing for Canton Fair, dim sum in Liwan, or a Pearl River stopover, knowing T1 (Airport South) vs. T2 (Airport North) saves immediate confusion.',
  updatedAt:'2026-11-27',
  primaryCta:{label:'Open CAN First 90 Minutes card',href:'/arrival'},
  secondaryCta:{label:'Explore Guangzhou & plan trip',href:'/cities/guangzhou'},
  steps:[
   'Check your terminal: Terminal 1 connects to Metro Line 3 at Airport South (机场南); Terminal 2 connects at Airport North (机场北) via the Ground Transportation Center (GTC).',
   'Daytime with light bags: Metro Line 3 runs directly south to Tiyu Xilu and Zhujiang New Town (Tianhe) in roughly 45–60 minutes.',
   'Heavy bags or late arrival: follow GTC / Arrivals signs to the official metered taxi queue—never accept rides offered inside the walkway.',
   'Have your hotel’s Chinese address (including 区 district such as 天河区, 越秀区, or 荔湾区) saved offline before landing.'
  ],
  pitfalls:[
   'Metro Line 3 gets crowded during rush hour—if carrying two large suitcases, an official metered taxi is much easier.',
   'Guangzhou has many similarly named streets; always show the full Chinese address rather than a translated English name.'
  ],
  faqs:[
   {q:'How do I take the metro from Guangzhou Baiyun Airport to downtown?',a:'Take Metro Line 3 from Airport North (Terminal 2) or Airport South (Terminal 1) directly toward Tiyu Xilu / Zhujiang New Town. Check last-train times on site if landing in the evening.'},
   {q:'Where do I catch an official taxi at Guangzhou Baiyun T2?',a:'Follow signs from T2 Arrivals into the Ground Transportation Center (GTC) official taxi queue, confirm the driver uses the meter, and show your Chinese hotel card.'}
  ]
 },
 {
  slug:'alipay-foreign-card-failed-fix',
  path:'/guides/alipay-foreign-card-failed-fix',
  file:'/guides/alipay-foreign-card-failed-fix/index.html',
  city:'All China',
  eyebrow:'CHINA PAYMENT SOS · ALIPAY & WECHAT PAY',
  title:'Alipay or WeChat Pay Foreign Card Failed in China? 6 Calm Fixes | China, closer',
  description:'What to do when Alipay or WeChat Pay declines your international Visa/Mastercard in China: bank 3DS blocks, SMS codes, per-transaction caps, and polite Chinese cards.',
  h1:'When Alipay or WeChat Pay declines your foreign card.',
  summary:'Foreign-card payment failures in China are common—usually triggered by home-bank fraud blocks, missing 3DS SMS codes, or merchant QR type limits. Don’t tap pay five times in a row.',
  updatedAt:'2026-11-27',
  primaryCta:{label:'Open interactive Payment SOS flow',href:'/sos'},
  secondaryCta:{label:'Check SMS & eSIM settings',href:'/connectivity'},
  steps:[
   'Pause before retrying: check your Alipay/WeChat "Bills / Transactions" list first so you do not accidentally double-pay.',
   'Switch between "Scan merchant QR" and "Show my payment QR code"—some small personal static QR codes do not accept international credit cards.',
   'Check whether your home bank sent a 3D Secure prompt, app push notification, or SMS code (make sure your home SIM line is active for roaming SMS).',
   'Try your linked backup card inside WeChat Pay if Alipay fails (or vice versa)—linking both apps before departure gives two independent rails.',
   'For larger bills (hotels, electronics, hospital deposits), ask to pay with a physical card or cash, as international wallet transactions have single-tx and annual caps.'
  ],
  pitfalls:[
   'Using a data-only eSIM while turning off your home SIM prevents bank 3DS SMS codes from arriving.',
   'Waiting until you are at a busy subway gate or café counter to verify your identity inside Alipay.'
  ],
  faqs:[
   {q:'Why did Alipay decline my Visa or Mastercard at a small shop in China?',a:'Small vendors sometimes use personal transfer QR codes rather than merchant codes, which cannot charge foreign bank cards, or your home bank may have blocked the overseas charge awaiting 3DS/SMS confirmation.'},
   {q:'Should I still carry cash in China if I set up Alipay?',a:'Yes. Keep a modest backup of CNY cash (including smaller ¥10–¥50 notes) plus a secondary card linked in WeChat Pay in case of phone battery loss, network drops, or card blocks.'}
  ]
 },
 {
  slug:'china-240-hour-visa-free-transit',
  path:'/guides/china-240-hour-visa-free-transit',
  file:'/guides/china-240-hour-visa-free-transit/index.html',
  city:'All China',
  eyebrow:'PRE-DEPARTURE CHECKLIST · ENTRY & TRANSIT',
  title:'China 240-Hour Visa-Free Transit Checklist: Official Rules & Mistakes to Avoid | China, closer',
  description:'Researching China’s visa-free transit or ordinary visa-free entry? Source-linked checklist for A→China→C routing, confirmed onward tickets, hotel registration, and official verification.',
  h1:'Preparing for China visa-free transit without surprises.',
  summary:'Transit exemptions have strict routing and port rules—especially the "Country/Region A → Mainland China → Country/Region C" requirement. Always verify directly with official authorities.',
  updatedAt:'2026-11-27',
  primaryCta:{label:'Open China Ready checklist',href:'/ready'},
  secondaryCta:{label:'Prepare hotel & booking confirmations',href:'/trip'},
  steps:[
   'Verify your exact passport nationality, entry port, permitted stay area, and current policy on the official National Immigration Administration (NIA) website.',
   'Understand A → Mainland China → C routing for transit exemptions: a round-trip ticket (e.g., US → Shanghai → US without a third country/region) does NOT qualify as transit.',
   'Print physical copies of your confirmed onward ticket (with seat/ticket number, not standby) and hotel reservations before going to your departure airport check-in desk.',
   'Ensure your passport validity meets official minimums and has blank pages for inspection stamps.'
  ],
  pitfalls:[
   'Confusing unilateral ordinary visa-free entry with 240-hour visa-free transit—they have different nationality lists, stay limits, and routing rules.',
   'Relying on outdated blog posts or social media comments instead of checking NIA and airline Timatic rules for your travel date.'
  ],
  faqs:[
   {q:'Does a round-trip flight qualify for China visa-free transit?',a:'No. Transit exemptions require traveling from Country/Region A through Mainland China directly onward to a third Country/Region C (Hong Kong, Macao, and Taiwan count as separate regions for transit routing, subject to official port rules). Always confirm with the National Immigration Administration.'},
   {q:'What documents should I print for airline check-in?',a:'Print your confirmed onward flight/ferry ticket showing departure within the allowed window, your accommodation bookings, and official NIA policy reference in case departure-airport staff verify eligibility.'}
  ]
 },
 {
  slug:'china-food-allergy-card-printable',
  path:'/guides/china-food-allergy-card-printable',
  file:'/guides/china-food-allergy-card-printable/index.html',
  city:'All China',
  eyebrow:'SPEAK LOCAL · FOOD ALLERGY SAFETY',
  title:'Offline & Printable Chinese Food Allergy Cards (Peanut, Tree Nut, Gluten, Seafood) | China, closer',
  description:'Clear, high-contrast Simplified Chinese food allergy cards that explicitly warn about hidden sauces, cooking oils, broths, and shared-wok cross-contact. Works offline.',
  h1:'Showing food allergies clearly in Chinese.',
  summary:'A literal one-word translation like "no peanuts" is risky in Chinese kitchens where peanut oil, sesame paste, oyster sauce, or shared woks are routine. Show explicit cross-contact wording and verify verbally.',
  updatedAt:'2026-11-27',
  primaryCta:{label:'Open full-screen Chinese allergy cards',href:'/speak'},
  secondaryCta:{label:'Download standalone offline HTML kit',href:'/connectivity'},
  steps:[
   'Open Speak Local and select the specific allergy card (Peanut, Tree Nut, Seafood/Shellfish, Gluten/Wheat, Dairy/Egg) before sitting down.',
   'Show the full-screen Chinese card to both the server taking your order and a manager if unsure—our wording explicitly mentions ingredients, sauces/oils, and shared cookware.',
   'Never assume a dish is safe from photos or English menu titles alone (e.g., vegetable dishes may use oyster sauce, chicken bouillon, or peanut oil).',
   'Carry your prescribed emergency medication (such as epinephrine) at all times and know how to request medical help in Chinese (120).'
  ],
  pitfalls:[
   'Showing tiny English/translated text on a dim screen instead of large-print Chinese specifying sauces and shared equipment.',
   'Treating any translation card as a clinical guarantee—if a busy kitchen cannot confirm ingredients, choose a safer option.'
  ],
  faqs:[
   {q:'Why isn’t saying "no peanuts" enough in China?',a:'Cooking oils (like peanut oil), compound sauces, chili oils, and shared woks can introduce severe allergens even when whole nuts are omitted. Cards must explicitly ask staff to check oils, sauces, and cross-contact.'},
   {q:'Can I save these Chinese allergy cards for offline use without VPN or data?',a:'Yes. Save the China, closer offline kit or download the standalone script-free HTML backup file before your flight so all 24 communication and allergy cards open in airplane mode.'}
  ]
 }
];

export const guideRoutes=()=>['/guides',...seoGuides.map(g=>g.path)];

export function guideRoute(pathname){
 const clean=pathname.replace(/\/index\.html$/,'').replace(/\/+$/,'')||'/';
 if(clean==='/guides')return {kind:'guides-index',path:'/guides',file:'/guides/index.html'};
 if(clean.startsWith('/guides/')){
  const slug=clean.slice(8);
  const guide=seoGuides.find(g=>g.slug===slug);
  return guide?{kind:'guide',guide,path:guide.path,file:guide.file}:{kind:'not-found',path:clean};
 }
 return null;
}

export function buildGuideJsonLd(guide,origin){
 return JSON.stringify({
  '@context':'https://schema.org',
  '@type':'FAQPage',
  mainEntity:guide.faqs.map(f=>({
   '@type':'Question',
   name:f.q,
   acceptedAnswer:{'@type':'Answer',text:f.a}
  }))
 }).replaceAll('<','\\u003c');
}

export function renderGuidesBody(route){
 if(route.kind==='guides-index'){
  const cards=seoGuides.map(g=>`<article class="survival-card"><span class="eyebrow">${esc(g.eyebrow)}</span><h2><a href="${esc(g.path)}">${esc(g.h1)}</a></h2><p>${esc(g.summary)}</p><a class="text-link" href="${esc(g.path)}">Read practical guide →</a></article>`).join('');
  return `<div class="app-shell"><div class="workspace">${renderSiteHeader('/')}<main id="main"><section class="page-intro"><div><p class="eyebrow">PRACTICAL CHINA GUIDES · OFFLINE-READY</p><h1>Solve the hard parts before you land.</h1><p>Straightforward, source-aware checklists for Beijing, Shanghai, and Guangzhou arrivals, payments, transit rules, and food allergies.</p></div></section><div class="survival-kit-grid">${cards}</div></main></div>${renderMobileNavigation('/')}</div>`;
 }
 const g=route.guide;
 const steps=g.steps.map(s=>`<li>${esc(s)}</li>`).join('');
 const pitfalls=g.pitfalls.map(p=>`<li>${esc(p)}</li>`).join('');
 const faqs=g.faqs.map(f=>`<details class="evidence-field" open><summary><strong>${esc(f.q)}</strong></summary><div class="evidence-field-body"><p>${esc(f.a)}</p></div></details>`).join('');
 return `<div class="app-shell"><div class="workspace">${renderSiteHeader('/')}<main id="main"><article class="seo-guide-article"><nav aria-label="Breadcrumb"><a class="text-link" href="/guides">← All practical guides</a></nav><header class="page-intro"><div><p class="eyebrow">${esc(g.eyebrow)} · REVIEWED ${esc(g.updatedAt)}</p><h1>${esc(g.h1)}</h1><p>${esc(g.summary)}</p><div class="partner-links"><a class="primary-button" href="${esc(g.primaryCta.href)}">${esc(g.primaryCta.label)} →</a><a class="outline-button" href="${esc(g.secondaryCta.href)}">${esc(g.secondaryCta.label)} →</a></div></div></header><section class="partner-options-card"><h2>Step-by-step action plan</h2><ol>${steps}</ol></section><section class="partner-options-card"><h2>Common pitfalls to avoid</h2><ul>${pitfalls}</ul></section><section class="partner-options-card"><h2>Frequently asked questions</h2>${faqs}</section><p class="module-disclaimer">Practical preparation summary, not official immigration, medical, or live transport certification. Always verify current operator rules before departure.</p></article></main></div>${renderMobileNavigation('/')}</div>`;
}
