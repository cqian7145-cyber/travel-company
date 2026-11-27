// Legacy source snapshots. Field-level airport/telecom migration is deferred to P2.
export const travelSources={
 pvg:{name:'Shanghai Government · Pudong arrival services',url:'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260424/88cde5e96ef242daa534102069450a03.html',updated:'24 Apr 2026',reviewed:'2026-11-07'},
 transport:{name:'Shanghai Government · airport transport',url:'https://english.shanghai.gov.cn/en-Individuals-Transportation-PublicTransport/20260813/7366238930024ac8b22e5adf82217bd8.html',updated:'Page states 4 Jun 2026; URL dated 13 Aug 2026',reviewed:'2026-11-07'},
 shaWifi:{name:'Hongqiao Airport · official Wi-Fi information',url:'https://www.shanghaiairport.com/enhq/fuwusheshi/index_lcid_444.html',updated:'See operator page',reviewed:'2026-11-07'},
 pek:{name:'Beijing Capital Airport (PEK) · official passenger guide',url:'https://en.bcia.com.cn/',updated:'See operator page',reviewed:'2026-11-27'},
 pkx:{name:'Beijing Daxing Airport (PKX) · official passenger guide',url:'https://daxing-pkx-airport.com/',updated:'See operator page',reviewed:'2026-11-27'},
 can:{name:'Guangzhou Baiyun Airport (CAN) · official passenger guide',url:'https://www.baiyunairport.com/en/',updated:'See operator page',reviewed:'2026-11-27'},
 apple:{name:'Apple Support · international travel eSIM',url:'https://support.apple.com/en-us/118227',updated:'22 Oct 2026',reviewed:'2026-11-07'},
 chinaEsim:{name:'Apple Support · mainland China eSIM',url:'https://support.apple.com/en-us/123879',updated:'See current support page',reviewed:'2026-11-07'},
 allergy:{name:'FARE · avoiding allergen cross-contact',url:'https://www.foodallergy.org/resources/avoiding-cross-contact',updated:'Not stated',reviewed:'2026-11-07'}
};
export const defaultArrival={airport:'PVG',terminal:'unknown',time:'day',luggage:'light',area:'other'};
export function validArrival(v){return !!v&&['PVG','SHA','PEK','PKX','CAN'].includes(v.airport)&&['T1','T2','T3','main','unknown'].includes(v.terminal)&&['day','evening','late'].includes(v.time)&&['light','heavy'].includes(v.luggage)&&['other','peoples-square'].includes(v.area);}
export function arrivalCard(input){
 if(!validArrival(input))throw new Error('Select valid airport, terminal, arrival period, luggage, and destination area.');
 const code=input.airport,late=input.time==='late',preferred=late||input.time==='evening'||input.luggage==='heavy'?'taxi':'metro';
 if(['PEK','PKX','CAN'].includes(code)){
  const meta={
   PEK:{
    name:'Beijing Capital (PEK) · 北京首都国际机场',
    pickup:input.terminal==='T2'?'Beijing Capital T2: follow signed official taxi queue outside Arrivals Floor Gate 5–9, or Airport Express signage inside the terminal.':input.terminal==='T3'?'Beijing Capital T3: follow official taxi queue signage outside Arrivals Floor (Level 1), or walk via the covered bridge to the Capital Airport Express station.':'Confirm whether you land at PEK Terminal 2 or Terminal 3 before following pickup signage.',
    connectivity:'Join the official airport Wi-Fi network (usually AIRPORT-FREE-WiFi-SECURE) and use the passport scanning kiosk near arrivals if you do not have a Chinese SMS number.',
    connectivityBackup:'Look for the Beijing Service international arrivals counter in the arrivals hall for SIM cards, transport cards, and payment help. Confirm counter hours on site.',
    rail:{id:'metro',name:'Capital Airport Express (首都机场线)',description:'Direct express rail from PEK T2/T3 to Sanyuanqiao (Line 10), Dongzhimen (Lines 2/13), and Beixinqiao (Line 5).',estimate:'Typical flat fare around ¥25; check onward subway transfer to your hotel.',condition:'Operating hours and last departures are NOT VERIFIED for your arrival. Confirm before entering.'},
    source:travelSources.pek
   },
   PKX:{
    name:'Beijing Daxing (PKX) · 北京大兴国际机场',
    pickup:'Beijing Daxing uses one integrated terminal: follow signed Taxi queues on the Arrivals level, or take elevators directly down to B1/B2 for the Daxing Airport Express rail.',
    connectivity:'Join the official Daxing Airport free Wi-Fi network and use the passport-scan Wi-Fi kiosk in the arrivals hall if SMS login is unavailable.',
    connectivityBackup:'Visit the International Arrivals Service Center near baggage exit for local SIMs, currency exchange, and BEIJING PASS transport card inquiries.',
    rail:{id:'metro',name:'Daxing Airport Express (大兴机场线)',description:'High-speed rail from PKX B1 directly to Caoqiao (Line 10/19) in about 20 minutes, then transfer to city metro or taxi.',estimate:'Typical fare around ¥35 (standard class) to Caoqiao; onward transfer extra.',condition:'Operating hours and last departures are NOT VERIFIED for your arrival. Confirm before entering.'},
    source:travelSources.pkx
   },
   CAN:{
    name:'Guangzhou Baiyun (CAN) · 广州白云国际机场',
    pickup:input.terminal==='T1'?'Guangzhou Baiyun T1: follow official taxi ranks outside Arrivals Area A/B, or head downstairs to Metro Line 3 (Airport South · 机场南站).':input.terminal==='T2'?'Guangzhou Baiyun T2: follow signed official taxi queues outside the Ground Transportation Center (GTC), or take Metro Line 3 (Airport North · 机场北站).':'Confirm whether you arrive at Baiyun T1 (Airport South) or T2 (Airport North) before heading to pickup or metro.',
    connectivity:'Connect to the official Baiyun Airport free Wi-Fi network; look for passport self-service Wi-Fi kiosks in the international arrivals area if SMS verification does not work.',
    connectivityBackup:'Check the International Arrivals Tourist Service Desk for SIM cards, Yang Cheng Tong transit cards, and Alipay/WeChat setup help. Confirm hours on site.',
    rail:{id:'metro',name:'Guangzhou Metro Line 3 (地铁3号线)',description:'Direct subway from Airport South (T1) / Airport North (T2) to Tiyu Xilu and Zhujiang New Town in central Guangzhou.',estimate:'Typical metro fare around ¥7–¥10 depending on station; allow 45–60 min to Tianhe/Yuexiu.',condition:'Operating hours and last departures are NOT VERIFIED for your arrival. Confirm before entering.'},
    source:travelSources.can
   }
  }[code];
  const taxi={id:'taxi',name:'Licensed airport taxi',description:'Follow the signed official taxi queue only. Decline unsolicited drivers inside the terminal. Confirm destination in Chinese and meter use.',estimate:'Fare and travel time depend on traffic, tolls, and hotel district. Ask the official taxi desk for an estimate.',condition:'Night surcharges, expressway tolls, and queue times affect the actual trip.'};
  const bus={id:'bus',name:'Airport express bus',description:'Check the airport bus counter in the arrivals hall for current city-center routes and drop-off stops.',estimate:'Route, fare, and last-bus departures require an on-site timetable check.',condition:'No late-night bus availability is assumed.'};
  return {
   airport:meta.name,pickup:meta.pickup,preferred,late,
   connectivity:meta.connectivity,connectivityBackup:meta.connectivityBackup,
   options:preferred==='taxi'?[taxi,meta.rail,bus]:[meta.rail,taxi,bus],
   timeWarning:late?'Late-night arrival: do not rely on airport rail or metro being open. Use the official taxi queue as your primary fallback; queue times vary.':'Arrival period is a planning input, not a live transport timetable. Check same-day operations after immigration and baggage claim.',
   sources:[meta.source,travelSources.apple]
  };
 }
 const pvg=code==='PVG',reference=input.area==='peoples-square';
 const pickup=input.terminal==='unknown'?'Confirm your terminal on your arrival documents or with airport staff before following a pickup instruction.':pvg?(input.terminal==='T1'?'Pudong T1: official taxi rank outside Arrivals Gate 12.':'Pudong T2: official taxi rank outside Arrivals Gate 25.'):(input.terminal==='T1'?'Hongqiao T1: official taxi rank outside Gate 1 on the arrivals floor.':'Hongqiao T2: official taxi rank outside Gate 4 on the arrivals floor.');
 const taxi={id:'taxi',name:'Licensed airport taxi',description:'Follow the signed official taxi queue. Confirm destination, meter and payment method with the driver.',estimate:pvg&&reference?'Official People’s Square reference: about ¥180 / 50 minutes. Not a live fare or your hotel quote.':'Fare and travel time to your property are not verified. Ask the official taxi desk.',condition:'Traffic, tolls, night charges, queueing and destination affect the actual trip.'};
 const metro={id:'metro',name:pvg?'Metro Line 2':input.terminal==='T1'?'Metro Line 10':input.terminal==='T2'?'Metro Lines 2 / 10':'Metro · confirm terminal first',description:'Check the exact destination station and last-mile route to your hotel.',estimate:pvg&&reference?'Official People’s Square reference: about ¥7 / 1 hour. Not a hotel-specific quote.':'Check the actual route, fare and transfers in the operator’s journey planner.',condition:'Operating hours and last departures are NOT VERIFIED for your arrival. Confirm before purchasing or entering.'};
 const maglev={id:'maglev',name:'Maglev + onward transfer',description:'PVG to Longyang Road; an onward metro or taxi connection is needed.',estimate:'Fare, departure and onward connection not verified for your arrival.',condition:'Check both services before choosing. Not a direct hotel transfer.'};
 const bus={id:'bus',name:'Airport bus',description:'Ask airport staff which current route serves your destination.',estimate:'Route, fare, stop and departure times require an official timetable check.',condition:'No night-bus or last-bus availability is assumed.'};
 return {airport:pvg?'Shanghai Pudong (PVG) · 浦东机场':'Shanghai Hongqiao (SHA) · 虹桥机场',pickup,preferred,late,
  connectivity:pvg?'Join the airport network identified on official signage, open its login page and use passport photo-page verification if offered. Ask staff to verify the portal before sharing any document.':'Follow Hongqiao’s official Wi-Fi login instructions or ask the information desk. Do not assume the Pudong passport workflow is available here.',
  connectivityBackup:pvg?'Baggage-claim integrated service zone: SIM sales and portable Wi-Fi rental. Public arrivals: International Services Shanghai center for communication support. Exact counter and opening hours need an on-site check.':'Ask the staffed arrivals information desk for the current mobile-communications counter and its hours; exact terminal location is not verified.',
  options:preferred==='taxi'?[taxi,metro,...(pvg?[maglev]:[]),bus]:[metro,taxi,...(pvg?[maglev]:[]),bus],
  timeWarning:late?'Late-night arrival: do not rely on metro, maglev or bus being open. Use the official taxi desk as a fallback; availability and queue time still need checking.':'Arrival period is a planning input, not a flight or transport timetable. Check same-day operations after immigration and baggage collection.',
  sources:[pvg?travelSources.pvg:travelSources.shaWifi,travelSources.transport]};
}
export const connectivityFlows=[
 {id:'internet',title:'No Mobile Internet',intro:'A signal icon does not guarantee an active data connection.',steps:['Confirm the intended SIM/eSIM is enabled and selected for mobile data. Check signal, airplane mode and remaining allowance.','Check your provider’s activation date, mainland China coverage and any required roaming setting. Roaming can incur charges; read your plan terms first.','Compare the APN with your provider’s exact official setup instructions. Do not invent an APN, install unknown profiles or delete the eSIM.','Use trusted Wi-Fi to contact your carrier if service is still unavailable. Keep your hotel address available offline.'],phrase:'我的手机无法使用移动数据。请帮我联系运营商，或告诉我哪里可以连接无线网络。',source:travelSources.apple},
 {id:'apps',title:"Foreign Apps Won’t Load",intro:'Internet access, a phone number, and access to a particular overseas service are separate capabilities.',steps:['Test whether a local website or another app loads. If nothing works, use No Mobile Internet first.','If only specific services fail, check their official status and your provider’s supported services/network conditions. A local connection or travel eSIM does not guarantee overseas-app access.','Prepare locally usable alternatives: Amap or Baidu Maps for directions; WeChat and a working hotel telephone contact for coordination. Availability, language and account verification vary.','Ask the service and carrier for supported options. Do not assume a SIM type bypasses restrictions or buy an unverified workaround.'],phrase:'这个应用无法打开。请问可以使用其他方式查看地址或联系酒店吗？',source:travelSources.apple},
 {id:'sms',title:"Can’t Receive SMS",intro:'A data-only travel eSIM does not receive codes sent to a different home number.',steps:['Check that the original phone-number line is enabled and registered with a network. Verify the app’s country code and registered number.','Ask the home carrier whether roaming SMS and the specific sender’s messages are supported on your plan. Data roaming and SMS reception are different settings/services.','Check blocked messages, spam filters and resend limits. Keep the correct SIM active if using dual SIM; check possible roaming charges before changing settings.','Use only alternative verification or recovery methods offered by the bank/app itself. Never share verification codes or use rented SMS inboxes.'],phrase:'我收不到原手机号的短信验证码。请问有其他官方验证方式吗？',source:travelSources.apple},
 {id:'wifi',title:'Airport Wi-Fi Failed',intro:'Choose airport-specific help; no passport document is collected by this app.',steps:['Check the network name against airport signage or ask uniformed staff. Open the airport’s own login page; do not upload a passport to an unsolicited QR page.','At Pudong, the official April 2026 guide describes scanning the passport photo page on the Wi-Fi login portal as a verification option. Ask airport staff if it is unavailable.','Pudong backup: ask for the baggage-claim integrated service zone (SIM / portable Wi-Fi) or the International Services Shanghai center in public arrivals. Counter hours and exact positions are not verified.','At Hongqiao, use its own Wi-Fi guide and arrivals information desk. Do not assume Pudong’s procedure or counter locations apply.'],phrase:'机场无线网络无法登录。请问在哪里可以通过官方方式验证护照，或咨询手机上网服务？',source:travelSources.pvg}
];
export const defaultConnectivity={device:'iphone',model:'',region:'',carrier:'',plan:'unsure',sms:'yes'};
export function validConnectivity(v){return !!v&&['iphone','android'].includes(v.device)&&['roaming','esim','local','unsure'].includes(v.plan)&&['yes','no'].includes(v.sms)&&['model','region','carrier'].every(k=>typeof v[k]==='string'&&v[k].length<=120);}
export function connectivityPriorities(v){
 if(!validConnectivity(v))throw new Error('Complete the connectivity check.');
 return [v.plan==='unsure'?'Compare home-carrier roaming, a travel eSIM and a local SIM before departure.':v.plan==='roaming'?'Confirm mainland China data coverage, price limits and activation with your home carrier.':v.plan==='esim'?'Check whether your travel eSIM is data-only, when it activates, and whether it must be installed before departure.':'Confirm your phone’s physical SIM / carrier compatibility and passport registration requirements with the local carrier.',
 v.sms==='yes'?'Keep your home number available for SMS verification. A data-only travel eSIM will not receive messages addressed to your home number; confirm roaming SMS support and charges with that carrier.':'Keep an official alternative recovery method for your banking and travel accounts even if you do not expect SMS codes.',
 'Device family alone cannot confirm eSIM compatibility. Check the exact model, sales region, carrier lock and chosen provider. Mainland carrier eSIM and worldwide travel eSIM are different products.',
 'Ask your provider about specific overseas services you need. No connection type guarantees that every foreign app will load.',
 'Save and test the offline kit before your flight; keep a complete Chinese hotel address available.'];
}
