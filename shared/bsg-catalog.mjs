// Unified planner catalog for Beijing & Guangzhou (Shanghai lives in shared/catalog.mjs / data/venues.json).
import {places as shanghaiPlaces} from './catalog.mjs';

export const plannerCities=[
 {id:'shanghai',name:'Shanghai',zh:'上海'},
 {id:'beijing',name:'Beijing',zh:'北京'},
 {id:'guangzhou',name:'Guangzhou',zh:'广州'}
];

export const beijingPlaces=[
 {
  id:'bj-forbidden-city',city:'beijing',name:'Forbidden City (Palace Museum)',zh:'故宫博物院',
  address:'北京市东城区景山前街4号',category:'Culture & history',tags:['Culture','Architecture','Photography'],
  area:'Dongcheng · Central Axis',description:'Imperial palace complex at the heart of Beijing; enter from Meridian Gate (South) and exit via Gate of Divine Prowess (North).',
  tip:'Usually closed Mondays. Book online with your passport in advance; bring the original passport to enter.',
  hours:'Check seasonal entry slots on the official Palace Museum portal; closed Mondays.',
  cost:60,duration:'3–4 hours',transit:'Metro Line 1 to Tiananmen East or Tiananmen West, then walk to Meridian Gate.',
  cluster:'central',closedDay:1,booking:'https://bookingticket.dpm.org.cn/',bookingLabel:'Palace Museum ticket portal',
  source:'https://en.dpm.org.cn/'
 },
 {
  id:'bj-temple-of-heaven',city:'beijing',name:'Temple of Heaven Park',zh:'天坛公园',
  address:'北京市东城区天坛东里甲1号',category:'Culture & history',tags:['Culture','Architecture','Nature'],
  area:'Dongcheng · South',description:'Iconic circular Hall of Prayer for Good Harvests surrounded by ancient cypress groves and lively morning local exercise.',
  tip:'Enter via the East Gate for the shortest walk to the Hall of Prayer; inner halls usually close Mondays.',
  hours:'Park opens early morning; inner historic halls have shorter hours and usually close Mondays.',
  cost:34,duration:'2–2.5 hours',transit:'Metro Line 5 to Tiantan Dongmen (Exit A).',
  cluster:'south',booking:'https://english.beijing.gov.cn/',bookingLabel:'Beijing visitor guide',
  source:'https://english.beijing.gov.cn/'
 },
 {
  id:'bj-summer-palace',city:'beijing',name:'Summer Palace',zh:'颐和园',
  address:'北京市海淀区新建宫门路19号',category:'Iconic sights',tags:['Nature','Architecture','Photography','Culture'],
  area:'Haidian · Northwest',description:'Vast imperial lakeside garden with the Long Corridor, Longevity Hill, and sunset views across Kunming Lake.',
  tip:'Start at North Palace Gate (Beigongmen) and walk south along the lake to avoid backtracking.',
  hours:'Check seasonal opening hours; through-ticket covers inner courtyards.',
  cost:60,duration:'3–4 hours',transit:'Metro Line 4 to Beigongmen (Exit D).',
  cluster:'northwest',booking:'https://english.beijing.gov.cn/',bookingLabel:'Beijing visitor guide',
  source:'https://english.beijing.gov.cn/'
 },
 {
  id:'bj-great-wall',city:'beijing',name:'Great Wall (Mutianyu / Badaling)',zh:'慕田峪长城 / 八达岭长城',
  address:'北京市怀柔区渤海镇慕田峪村',category:'Iconic sights',tags:['Nature','Photography','Culture'],
  area:'Northern Suburbs (Half/Full Day)',description:'Restored Ming-era mountain ramparts with watchtowers and sweeping ridge views. Choose Mutianyu for lighter crowds or Badaling for high-speed rail access.',
  tip:'Allow a full morning + early afternoon; confirm shuttle or rail tickets the day before.',
  hours:'Seasonal cable car and park hours vary; confirm before departing city center.',
  cost:180,duration:'5–6 hours (incl. transit)',transit:'High-speed train from Beijing North/Qinghe (Badaling) or direct tourist bus/taxi (Mutianyu).',
  cluster:'north-excursion',booking:'https://www.12306.cn/en/index.html',bookingLabel:'Check 12306 rail (Badaling)',
  source:'https://english.beijing.gov.cn/'
 },
 {
  id:'bj-shichahai',city:'beijing',name:'Shichahai & Hutong Lanes',zh:'什刹海及胡同区',
  address:'北京市西城区地安门西大街49号',category:'Local life',tags:['Local life','Food','Photography','Culture'],
  area:'Xicheng · Old North',description:'Connected urban lakes framed by historic courtyard hutongs, willow-lined promenades, and sunset rooftops.',
  tip:'Walk from Yandai Byway toward Houhai in late afternoon for softer light and quieter side alleys.',
  hours:'Open public area; individual courtyard venues set their own hours.',
  cost:0,duration:'2 hours',transit:'Metro Line 8 to Shichahai (Exit A2).',
  cluster:'central',booking:'https://english.beijing.gov.cn/',bookingLabel:'Beijing visitor guide',
  source:'https://english.beijing.gov.cn/'
 },
 {
  id:'bj-national-museum',city:'beijing',name:'National Museum of China',zh:'中国国家博物馆',
  address:'北京市东城区东长安街16号',category:'Culture & history',tags:['Culture','Art'],
  area:'Dongcheng · Tiananmen East',description:'China’s flagship history and art museum spanning ancient bronzes, jade, calligraphy, and modern history.',
  tip:'Free admission but strict passport reservation required in advance; closed Mondays.',
  hours:'Usually 09:00–17:00; closed Mondays. Verify current reservation window.',
  cost:0,duration:'2.5–3 hours',transit:'Metro Line 1 to Tiananmen East (Exit C/D).',
  cluster:'central',closedDay:1,booking:'https://en.chnmuseum.cn/',bookingLabel:'National Museum official site',
  source:'https://en.chnmuseum.cn/'
 },
 {
  id:'bj-guomao',city:'beijing',name:'Guomao CBD & CCTV Skyline',zh:'国贸 CBD / 央视大楼',
  address:'北京市朝阳区建国门外大街1号',category:'Iconic sights',tags:['Architecture','Photography'],
  area:'Chaoyang · East',description:'Contemporary Beijing’s architectural core featuring the CCTV Headquarters, CITIC Tower, and blue-hour skyline views.',
  tip:'Best visited around dusk for illuminated towers and easy dinner options inside China World Mall.',
  hours:'Public streetscapes open all day; mall dining generally open until 22:00.',
  cost:0,duration:'1.5–2 hours',transit:'Metro Line 1 or 10 to Guomao.',
  cluster:'east',booking:'https://english.beijing.gov.cn/',bookingLabel:'Beijing visitor guide',
  source:'https://english.beijing.gov.cn/'
 },
 {
  id:'bj-sanlitun',city:'beijing',name:'Taikoo Li Sanlitun',zh:'三里屯太古里',
  address:'北京市朝阳区三里屯路19号',category:'Food & drink',tags:['Food','Architecture','Art'],
  area:'Chaoyang · East',description:'Open-air design plaza with flagship boutiques, specialty coffee, international dining, and evening atmosphere.',
  tip:'Easy pairing with Guomao CBD for an evening dinner and stroll.',
  hours:'Open-air plaza accessible all day; most shops 10:00–22:00.',
  cost:0,duration:'1.5–2 hours',transit:'Metro Line 10 to Tuanjiehu (Exit A) or Line 17 to Workers’ Stadium.',
  cluster:'east',booking:'https://english.beijing.gov.cn/',bookingLabel:'Beijing visitor guide',
  source:'https://english.beijing.gov.cn/'
 },
 {
  id:'bj-taoranting',city:'beijing',name:'Taoranting Park',zh:'陶然亭公园',
  address:'北京市西城区太平街19号',category:'Local life',tags:['Nature','Local life','Photography'],
  area:'Xicheng · South',description:'Beloved local lakeside park dotted with historic pavilions, willows, and unhurried Beijing daily life.',
  tip:'Great low-crowd morning alternative near Temple of Heaven.',
  hours:'Daily park hours vary by season.',
  cost:2,duration:'1.5 hours',transit:'Metro Line 4 to Taoranting (Exit C).',
  cluster:'south',booking:'https://english.beijing.gov.cn/',bookingLabel:'Beijing visitor guide',
  source:'https://english.beijing.gov.cn/'
 },
 {
  id:'bj-lama-temple',city:'beijing',name:'Yonghe Temple (Lama Temple) & Wudaoying',zh:'雍和宫与五道营胡同',
  address:'北京市东城区雍和宫大街12号',category:'Culture & history',tags:['Culture','Food','Architecture'],
  area:'Dongcheng · North',description:'Active Tibetan Buddhist temple famed for its sandalwood Maitreya statue, right beside coffee-lined Wudaoying Hutong.',
  tip:'Visit the temple first, then walk directly into Wudaoying Hutong for lunch and coffee.',
  hours:'Confirm current seasonal entry hours on official channels.',
  cost:25,duration:'2 hours',transit:'Metro Line 2 or 5 to Yonghegong (Exit F).',
  cluster:'north-central',booking:'https://english.beijing.gov.cn/',bookingLabel:'Beijing visitor guide',
  source:'https://english.beijing.gov.cn/'
 }
];

export const guangzhouPlaces=[
 {
  id:'gz-canton-tower',city:'guangzhou',name:'Canton Tower & Haixinsha',zh:'广州塔与海心沙',
  address:'广东省广州市海珠区阅江西路222号',category:'Iconic sights',tags:['Architecture','Photography'],
  area:'Haizhu · New Axis',description:'Guangzhou’s 600m twisted-steel landmark overlooking the Pearl River, best paired with the pedestrian Haixin Bridge at sunset.',
  tip:'Walk across Haixin Bridge (free; check reservation requirement) from Huacheng Square for the clearest skyline photos.',
  hours:'Observation deck hours vary; riverside views open all evening.',
  cost:150,duration:'2 hours',transit:'Metro Line 3 or APM Line to Canton Tower.',
  cluster:'zhujiang',booking:'https://www.cantontower.com/en/',bookingLabel:'Canton Tower official info',
  source:'https://www.cantontower.com/en/'
 },
 {
  id:'gz-chen-clan',city:'guangzhou',name:'Chen Clan Ancestral Hall',zh:'陈家祠',
  address:'广东省广州市荔湾区中山七路恩龙里34号',category:'Culture & history',tags:['Culture','Architecture','Art'],
  area:'Liwan · Old West',description:'Masterpiece of Lingnan traditional architecture packed with intricate wood, brick, stone, and ceramic roof carvings.',
  tip:'Go early morning for calmer courtyards; check Tuesday closure notices before visiting.',
  hours:'Check official opening hours and monthly maintenance closures.',
  cost:10,duration:'1.5–2 hours',transit:'Metro Line 1 or 8 to Chen Clan Academy (Exit D).',
  cluster:'liwan',booking:'https://www.gz.gov.cn/guangzhouinternational/',bookingLabel:'Guangzhou International guide',
  source:'https://www.gz.gov.cn/guangzhouinternational/'
 },
 {
  id:'gz-shamian',city:'guangzhou',name:'Shamian Island',zh:'沙面岛',
  address:'广东省广州市荔湾区沙面南街',category:'Local life',tags:['Architecture','Photography','Nature'],
  area:'Liwan · Riverfront',description:'Quiet banyan-shaded sandbank island lined with pastel 19th-century European facades and riverside cafés.',
  tip:'Easy flat walk; pair with Yongqing Fang for a half-day Old Guangzhou loop.',
  hours:'Open public island 24/7.',
  cost:0,duration:'1.5–2 hours',transit:'Metro Line 1 or 6 to Huangsha (Exit F).',
  cluster:'liwan',booking:'https://www.gz.gov.cn/guangzhouinternational/',bookingLabel:'Guangzhou International guide',
  source:'https://www.gz.gov.cn/guangzhouinternational/'
 },
 {
  id:'gz-yongqingfang',city:'guangzhou',name:'Yongqing Fang & Cantonese Opera Museum',zh:'永庆坊与粤剧艺术博物馆',
  address:'广东省广州市荔湾区恩宁路99号',category:'Culture & history',tags:['Culture','Food','Local life','Photography'],
  area:'Liwan · Enning Road',description:'Restored arcade-house (qilou) lanes blending traditional Cantonese snacks, craft studios, and a serene waterside opera museum.',
  tip:'Visit the Cantonese Opera Art Museum garden courtyard first (usually closed Mondays), then explore Enning Road snacks.',
  hours:'Street open all day; museum usually closed Mondays.',
  cost:0,duration:'2–2.5 hours',transit:'Metro Line 1 or 6 to Huangsha (Exit B) or Line 1 to Changshoulu.',
  cluster:'liwan',closedDay:1,booking:'https://www.gz.gov.cn/guangzhouinternational/',bookingLabel:'Guangzhou International guide',
  source:'https://www.gz.gov.cn/guangzhouinternational/'
 },
 {
  id:'gz-sun-yat-sen',city:'guangzhou',name:'Sun Yat-sen Memorial Hall & Yuexiu Park',zh:'中山纪念堂与越秀公园',
  address:'广东省广州市越秀区东风中路299号',category:'Culture & history',tags:['Culture','Architecture','Nature'],
  area:'Yuexiu · Historic Core',description:'Octagonal blue-tiled auditorium built in 1931, backed by Yuexiu Park’s lush hills, Five Rams statue, and Ming city wall.',
  tip:'Walk uphill from the Memorial Hall directly into Yuexiu Park for shaded paths.',
  hours:'Park open early; main hall admission has daytime hours.',
  cost:10,duration:'2 hours',transit:'Metro Line 2 to Sun Yat-sen Memorial Hall (Exit C).',
  cluster:'yuexiu',booking:'https://www.gz.gov.cn/guangzhouinternational/',bookingLabel:'Guangzhou International guide',
  source:'https://www.gz.gov.cn/guangzhouinternational/'
 },
 {
  id:'gz-guangdong-museum',city:'guangzhou',name:'Guangdong Museum & Flower City Square',zh:'广东省博物馆与花城广场',
  address:'广东省广州市天河区珠江东路2号',category:'Culture & history',tags:['Culture','Art','Architecture'],
  area:'Tianhe · Zhujiang New Town',description:'Cantilevered lacquer-box museum showcasing Maritime Silk Road porcelain, Chaozhou woodcarving, and Lingnan natural history.',
  tip:'Free entry with advance passport booking; closed Mondays. Walk out onto Flower City Square for Canton Tower views.',
  hours:'Usually 09:00–17:00; closed Mondays.',
  cost:0,duration:'2–2.5 hours',transit:'Metro Line 3/5 to Zhujiang New Town or APM to Opera House.',
  cluster:'zhujiang',closedDay:1,booking:'https://www.gdmuseum.com/en/',bookingLabel:'Guangdong Museum official site',
  source:'https://www.gdmuseum.com/en/'
 },
 {
  id:'gz-pearl-river',city:'guangzhou',name:'Pearl River Evening Promenade',zh:'珠江夜游与滨江漫步',
  address:'广东省广州市越秀区沿江东路466号（大沙头码头）',category:'Iconic sights',tags:['Photography','Nature'],
  area:'Pearl Riverfront',description:'Warm evening breeze, illuminated skyline bridges, and riverboats gliding past Canton Tower.',
  tip:'If you skip the cruise boat, the free promenade along Ersha Island and Haixinsha gives equally strong views.',
  hours:'Night cruises typically depart 19:00–22:00; promenade open all evening.',
  cost:88,duration:'1.5 hours',transit:'Metro Line 6 to Donghu (for Dashatou) or APM to Haixinsha.',
  cluster:'zhujiang',booking:'https://www.gz.gov.cn/guangzhouinternational/',bookingLabel:'Guangzhou International guide',
  source:'https://www.gz.gov.cn/guangzhouinternational/'
 },
 {
  id:'gz-beijing-road',city:'guangzhou',name:'Beijing Road & Dafo Temple',zh:'北京路步行街与大佛寺',
  address:'广东省广州市越秀区北京路步行街',category:'Food & drink',tags:['Food','Local life','Culture'],
  area:'Yuexiu · Old Center',description:'Lively pedestrian avenue with glass-covered Song/Ming dynasty road strata, Cantonese roast meats, and glowing Dafo Temple at night.',
  tip:'Best in early evening when Dafo Temple lights up and dessert/dim sum spots are in full swing.',
  hours:'Pedestrian street open all day; most shops 10:00–22:30.',
  cost:0,duration:'2 hours',transit:'Metro Line 6 to Beijing Lu (Exit B) or Line 1/2 to Gongyuanqian.',
  cluster:'yuexiu',booking:'https://www.gz.gov.cn/guangzhouinternational/',bookingLabel:'Guangzhou International guide',
  source:'https://www.gz.gov.cn/guangzhouinternational/'
 },
 {
  id:'gz-dim-sum',city:'guangzhou',name:'Xiguan Morning Tea (Yum Cha) Walk',zh:'西关早茶与骑楼老街',
  address:'广东省广州市荔湾区第十甫路 / 上下九一带',category:'Food & drink',tags:['Food','Local life'],
  area:'Liwan · Xiguan',description:'Experience Guangzhou’s signature morning dim sum ritual—har gow, siu mai, rice noodle rolls, and pu’er tea in historic Xiguan.',
  tip:'Arrive before 09:30 to beat weekend tea-house queues; point to steamer baskets or use Speak Local allergy cards.',
  hours:'Traditional tea houses typically serve morning tea from 07:30–11:30.',
  cost:80,duration:'1.5–2 hours',transit:'Metro Line 1 to Changshoulu (Exit D).',
  cluster:'liwan',booking:'https://www.gz.gov.cn/guangzhouinternational/',bookingLabel:'Guangzhou International guide',
  source:'https://www.gz.gov.cn/guangzhouinternational/'
 }
];

export function placesForCity(city='shanghai'){
 if(city==='beijing')return beijingPlaces;
 if(city==='guangzhou')return guangzhouPlaces;
 return shanghaiPlaces;
}

export const allPlannerPlaces=[...shanghaiPlaces,...beijingPlaces,...guangzhouPlaces];
export const placeById=id=>allPlannerPlaces.find(p=>p.id===id)||null;
