export const toolPages=[
 {
  page:'arrival',
  path:'/arrival',
  file:'/arrival/index.html',
  title:'First 90 Minutes: Shanghai Airport (PVG/SHA) to Hotel Guide | China, closer',
  description:'Step-by-step arrival plan for Shanghai Pudong (PVG) and Hongqiao (SHA): passport Wi-Fi, Alipay backup, late-night taxi vs. Maglev/metro, and offline Chinese hotel cards.',
  eyebrow:'ARRIVAL ASSISTANT · OFFLINE-READY',
  h1:'Your first 90 minutes in China.',
  lead:'Choose your airport terminal, arrival time, and luggage to get a practical, offline-ready plan from baggage claim to hotel check-in.',
  bullets:[
   'Pudong (PVG) & Hongqiao (SHA) terminal-specific transport & pickup guidance',
   'Explicit late-night transit warnings when Maglev and metro services stop',
   'Passport-based airport Wi-Fi fallback and one-tap Chinese hotel address card'
  ]
 },
 {
  page:'speak',
  path:'/speak',
  file:'/speak/index.html',
  title:'Speak Local: 24 Offline Chinese Phrase & Allergy Cards | China, closer',
  description:'24 full-screen bilingual Chinese communication cards for taxis, hotels, trains, payment issues, and food allergies (including cross-contact warnings). Works completely offline.',
  eyebrow:'SPEAK LOCAL · 24 BILINGUAL CARDS',
  h1:'Full-screen Chinese cards that work offline.',
  lead:'Show clear, large-type Chinese to taxi drivers, hotel reception, train staff, and restaurants—with your confirmed hotel address inserted automatically.',
  bullets:[
   '24 fixed scenarios covering airport, taxi, hotel check-in, trains, payment, and emergencies',
   'Food allergy cards with explicit ingredient, sauce, and cross-contact warnings',
   'One-tap copy, full-screen display, and downloadable standalone HTML backup'
  ]
 },
 {
  page:'sos',
  path:'/sos',
  file:'/sos/index.html',
  title:'China SOS: Offline Fixes for Alipay, WeChat, SMS & Data | China, closer',
  description:'Guided offline troubleshooting when Alipay foreign cards fail, SMS verification codes do not arrive, mobile data drops, or you need immediate Chinese help.',
  eyebrow:'CHINA SOS · GUIDED TROUBLESHOOTING',
  h1:'Calm fixes when something stops working.',
  lead:'Six step-by-step offline troubleshooting flows for payment failures, missing SMS codes, navigation, rail tickets, mobile data, and getting help in Chinese.',
  bullets:[
   'Payment failure checklist for Alipay & WeChat Pay international cards',
   'Home-number SMS verification and roaming troubleshooting without panic',
   'Large-type Chinese help cards and official escalation links'
  ]
 },
 {
  page:'connectivity',
  path:'/connectivity',
  file:'/connectivity/index.html',
  title:'China Connectivity: eSIM, Roaming, SMS & Airport Wi-Fi Guide | China, closer',
  description:'Plan your China mobile internet, home-number SMS codes, and overseas app access before departure—plus four offline recovery guides if your connection fails after landing.',
  eyebrow:'CHINA CONNECTIVITY · eSIM, SMS & WI-FI',
  h1:'A connection plan, beyond the SIM.',
  lead:'Separate mobile data, home-number SMS verification, and overseas app access before you fly, with four offline recovery flows if things break on arrival.',
  bullets:[
   'Device-aware preparation checklist for iPhone & Android travelers',
   'Clear breakdown of travel eSIM vs. home roaming vs. local SIM',
   'Sourced Pudong Airport passport Wi-Fi kiosk recovery steps'
  ]
 },
 {
  page:'ready',
  path:'/ready',
  file:'/ready/index.html',
  title:'China Ready: Entry Rules, Alipay, 12306 & Pre-Arrival Checklist | China, closer',
  description:'Source-linked pre-departure checklist for visiting China: visa & transit research, Alipay/WeChat Pay setup, eSIM connectivity, Railway 12306, and maps/taxis.',
  eyebrow:'CHINA READY · PRE-DEPARTURE CHECKLIST',
  h1:'Land in China with confidence.',
  lead:'Track the five essentials every international visitor needs before flying to Beijing, Shanghai, or Guangzhou—backed by official sources and review dates.',
  bullets:[
   'Official National Immigration Administration entry & transit policy links',
   'Alipay, WeChat Pay, Railway 12306, Amap, and DiDi setup walkthroughs',
   'Saved privately in your browser—no account, no passport number collected'
  ]
 }
];

export const toolRoutes=()=>toolPages.map(t=>t.path);

export function toolRoute(pathname){
 const clean=pathname.replace(/\/index\.html$/,'').replace(/\/+$/,'')||'/';
 const match=toolPages.find(t=>t.path===clean);
 return match?{kind:'tool',...match}:null;
}

export function renderToolFallback(tool,escapeHtml){
 const items=tool.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('');
 return `<main class="tool-prerender" style="max-width:780px;margin:48px auto;padding:0 20px"><p class="eyebrow">${escapeHtml(tool.eyebrow)}</p><h1>${escapeHtml(tool.h1)}</h1><p>${escapeHtml(tool.lead)}</p><ul>${items}</ul><p><a href="/">Back to China, closer</a> · <a href="/cities">Explore Beijing, Shanghai &amp; Guangzhou</a></p></main>`;
}
