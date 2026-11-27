import {MatchaButton} from './MatchaButton';
import {lazy,Suspense,useState,useEffect,useRef} from 'react';
import {Card as AstryxCard} from '@astryxdesign/core/Card';
import {
 ArrowUpRight,ArrowRight,MapPin,Compass,Sparkles,Bookmark,Check,ChevronDown,
 Search,SlidersHorizontal,Heart,X,Clock,Copy,Wifi,Download,ShieldCheck,Leaf,
 Sun,Footprints,CheckCircle2,Navigation,ClipboardList,LifeBuoy,Languages,PlaneLanding,BookOpen
} from 'lucide-react';
import {places,categories,interests} from '../shared/catalog.mjs';
import {plannerCities} from '../shared/bsg-catalog.mjs';
import {buildPlan} from '../shared/planner.mjs';
import VenueStories from './VenueStories';
import ShanghaiPhotography,{ShanghaiWelcome} from './ShanghaiPhotography';
import {usePageMotion} from './usePageMotion';
import CultureHighlights,{EarlierCultureNotes} from './CultureHighlights';
import Hangzhou,{DestinationChapters,HangzhouSavedCollection} from './Hangzhou';
import StoryInvitation from './StoryInvitation';
import {SiteHeader,MobileNavigation} from './SiteNavigation';
import {CityDirectory,CityIntro,CityContentSections} from './CityDiscovery';
import {cityById,cityRoute} from '../shared/cities.mjs';
import {toolRoute} from '../shared/tools-routes.mjs';
import {guideRoute} from '../shared/seo-guides.mjs';
import {mailtoCorrection} from '../shared/monetization.mjs';
import {sharedImageTransition} from './shared-image-transition';
import VenueEvidence from './VenueEvidence';
import {defaultArrival,validArrival} from '../shared/arrival.mjs';
import {External,Modal} from './ui';
import {isHotel,isTravelDetails,useLocalState,type Hotel,type TravelDetails,type ArrivalSettings} from './companion-state';
import {trackEvent} from './telemetry';

const TripMode=lazy(()=>import('./TripMode'));
const BookingAssistant=lazy(()=>import('./BookingAssistant'));
const ChinaSOS=lazy(()=>import('./ChinaSOS'));
const Connectivity=lazy(()=>import('./Connectivity'));
const SpeakLocal=lazy(()=>import('./SpeakLocal'));
const ArrivalAssistant=lazy(()=>import('./ArrivalAssistant'));
const Guiyang=lazy(()=>import('./Guiyang'));
const Sanya=lazy(()=>import('./Sanya'));
const Shenzhen=lazy(()=>import('./Shenzhen'));
const Beijing=lazy(()=>import('./Beijing'));
const Guangzhou=lazy(()=>import('./Guangzhou'));
const PlannerView=lazy(()=>import('./PlannerView'));
const ChinaReadyView=lazy(()=>import('./ChinaReadyView'));
const GuidesView=lazy(()=>import('./GuidesView'));
const FounderAnalyticsModal=lazy(()=>import('./FounderAnalyticsModal'));

type Place=typeof places[number];
type Plan=ReturnType<typeof buildPlan>;
type Page='explore'|'planner'|'ready'|'saved'|'trip'|'bookings'|'sos'|'connectivity'|'speak'|'arrival'|'guides'|'hangzhou'|'cities'|'shanghai'|'guiyang'|'sanya'|'shenzhen'|'beijing'|'guangzhou';
type Trip={city?:string;days:number;budget:number;pace:string;interests:string[];date:string};

function read<T>(key:string,fallback:T):T{
 try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback;}catch{return fallback;}
}
function useStored<T>(key:string,initial:T){
 const [value,setValue]=useState<T>(()=>read(key,initial));
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{/* memory fallback */}},[key,value]);
 return [value,setValue] as const;
}

const defaultTrip:Trip={city:'shanghai',days:3,budget:2400,pace:'balanced',interests:['Culture','Food'],date:new Date(Date.now()+7*86400000).toISOString().slice(0,10)};
const money=(n:number)=>`¥${n.toLocaleString('en-US')}`;

const navItems:[Page,string,typeof Compass][]=[
 ['shanghai','Explore Shanghai',Compass],
 ['arrival','First 90 Minutes',PlaneLanding],
 ['trip','Trip Mode',Navigation],
 ['speak','Speak Local',Languages],
 ['connectivity','Connectivity',Wifi],
 ['planner','My itinerary',Sparkles],
 ['bookings','Booking Assistant',ClipboardList],
 ['sos','China SOS',LifeBuoy],
 ['ready','China Ready',ShieldCheck],
 ['guides','Practical guides',BookOpen],
 ['saved','Saved places & culture',Bookmark]
];

const pageTitles:Record<Page,string>={
 cities:'Explore our cities',shanghai:'Shanghai',hangzhou:'Hangzhou',guiyang:'Guiyang',sanya:'Sanya',
 shenzhen:'Shenzhen',beijing:'Beijing',guangzhou:'Guangzhou',explore:'Discover China',planner:'My itinerary',
 ready:'China Ready',saved:'Saved collection',trip:'Trip Mode',bookings:'Booking Assistant',sos:'China SOS',
 connectivity:'China Connectivity',speak:'Speak Local',arrival:'First 90 Minutes',guides:'Practical China Guides'
};

const toolPathPages=new Set<Page>(['arrival','speak','sos','connectivity','ready']);

function resolveGuideSlug():string|null{
 const g=guideRoute(location.pathname);
 return g?.kind==='guide'?g.guide!.slug:null;
}

function resolvePage():Page{
 const route=cityRoute(location.pathname);
 if(route?.kind==='cities')return 'cities';
 if(route?.kind==='city')return route.city!.id as Page;
 const guide=guideRoute(location.pathname);
 if(guide&&(guide.kind==='guide'||guide.kind==='guides-index'))return 'guides';
 const tool=toolRoute(location.pathname);
 if(tool)return tool.page as Page;
 if(location.pathname.replace(/\/+$/,'')==='/trip')return 'planner';
 const requested=new URLSearchParams(location.search).get('page');
 return [...navItems.map(([id])=>id),'explore','hangzhou','guiyang','sanya','shenzhen','beijing','guangzhou','cities','shanghai','guides'].includes(requested||'')?requested as Page:'explore';
}

function App(){
 const [page,setPage]=useState<Page>(resolvePage);
 const [guideSlug,setGuideSlug]=useState<string|null>(resolveGuideSlug);
 const [showAnalytics,setShowAnalytics]=useState(()=>new URLSearchParams(location.search).get('analytics')==='1');
 const [mobile,setMobile]=useState(()=>new URLSearchParams(location.search).get('tools')==='open');
 const [category,setCategory]=useState('All places');
 const [search,setSearch]=useState('');
 const [showAll,setShowAll]=useState(false);
 const [savedView,setSavedView]=useState<'places'|'culture'>('places');
 const [saved,setSaved]=useStored<string[]>('closer-saved-v1',[]);
 const [checked,setChecked]=useStored<string[]>('closer-ready-v1',[]);
 const [trip,setTrip]=useStored<Trip>('closer-trip-v1',defaultTrip);
 const [plan,setPlan]=useStored<Plan|null>('closer-plan-v1',null);
 const [nationality,setNationality]=useStored('closer-nationality-v1','');
 const [departure,setDeparture]=useStored('closer-departure-v1',defaultTrip.date);
 const [detail,setDetail]=useState<Place|null>(()=>places.find(p=>p.id===new URLSearchParams(location.search).get('venue'))||null);
 const [planning,setPlanning]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [toast,setToast]=useState('');
 const [ai,setAi]=useState(false);
 const [openGuide,setOpenGuide]=useState('entry');
 const [hotel,setHotel,hotelStorageError]=useLocalState<Hotel>('closer-hotel-v1',{name:'',address:'',url:''},isHotel);
 const [details,setDetails,detailsStorageError]=useLocalState<TravelDetails>('closer-travel-details-v1',{trainNumber:'',destinationId:'',confirmedAddress:'',confirmedDestination:''},isTravelDetails);
 const [arrival,setArrival,arrivalStorageError]=useLocalState<ArrivalSettings>('closer-arrival-v1',defaultArrival,(v):v is ArrivalSettings=>validArrival(v));
 const travelerProps={hotel,details,onHotelChange:setHotel,onDetailsChange:setDetails};

 usePageMotion('#main',page);
 useEffect(()=>{document.title=pageTitles[page]+' | China, Closer';},[page]);
 useEffect(()=>{
  const onPop=()=>{setPage(resolvePage());setGuideSlug(resolveGuideSlug());};
  window.addEventListener('popstate',onPop);
  return()=>window.removeEventListener('popstate',onPop);
 },[]);

 const [aiProvider,setAiProvider]=useState('OpenAI');
 const toastTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{
  fetch('/api/status').then(r=>r.json()).then(s=>{setAi(s.aiConfigured===true);setAiProvider(s.aiProvider==='DeepSeek'?'DeepSeek':'OpenAI');}).catch(()=>{});
  return()=>{if(toastTimer.current)clearTimeout(toastTimer.current);};
 },[]);

 function notify(message:string){
  setToast(message);
  if(toastTimer.current)clearTimeout(toastTimer.current);
  toastTimer.current=setTimeout(()=>setToast(''),3500);
 }

 function navigate(next:Page,nextGuideSlug:string|null=null){
  const url=new URL(location.href);
  for(const k of ['venue','place','tools','page','analytics'])url.searchParams.delete(k);
  const isCity=Boolean(cityById(next));
  url.pathname=next==='cities'?'/cities':isCity?'/cities/'+next:next==='planner'?'/trip':next==='guides'?(nextGuideSlug?'/guides/'+nextGuideSlug:'/guides'):toolPathPages.has(next)?'/'+next:'/';
  if(!['explore','cities','planner','guides'].includes(next)&&!isCity&&!toolPathPages.has(next))url.searchParams.set('page',next);
  url.hash='';
  if(url.pathname+url.search!==location.pathname+location.search)history.pushState({page:next},'',url);
  setGuideSlug(next==='guides'?nextGuideSlug:null);
  setPage(next);
  setMobile(false);
  setSearch('');
  window.scrollTo({top:0,behavior:'instant'});
 }

 function navigateHref(href:string){
  if(href==='/trip')return navigate('planner');
  if(href==='/cities')return navigate('cities');
  if(href.startsWith('/cities/'))return navigate(href.slice(8) as Page);
  if(href==='/guides')return navigate('guides',null);
  if(href.startsWith('/guides/'))return navigate('guides',href.slice(8));
  const t=toolRoute(href);
  if(t)return navigate(t.page as Page);
  location.assign(href);
 }

 function toggleSaved(id:string){setSaved(saved.includes(id)?saved.filter(x=>x!==id):[...saved,id]);}
 async function copy(text:string){
  try{await navigator.clipboard.writeText(text);trackEvent('chinese_card_copied');notify('Chinese address copied');}
  catch{notify('Copy is unavailable. Select the address to copy it manually.');}
 }

 async function generate(curated=false){
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...trip,curated})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||'Could not create your plan.');
   setPlan(data);
   setPlanning(false);
   trackEvent(data.mode==='ai'?'ai_plan_generated':'curated_plan_generated',trip.city||'shanghai');
   navigate('planner');
   notify(data.mode==='ai'?'Your AI-assisted itinerary is ready':'Your curated itinerary is ready');
  }catch(e){setError(e instanceof Error?e.message:'Could not create your plan.');}
  finally{setBusy(false);}
 }

 const matching=places.filter(p=>(category==='All places'||p.category===category)&&`${p.name} ${p.zh} ${p.area} ${p.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
 const filtered=page==='saved'?places.filter(p=>saved.includes(p.id)&&`${p.name} ${p.zh}`.toLowerCase().includes(search.toLowerCase())):matching;
 const displayed=showAll||category!=='All places'||search||page==='saved'?filtered:filtered.slice(0,3);

 return <div className="app-shell">
  <a className="skip-link" href="#main">Skip to content</a>
  {mobile&&<Modal title="Travel tools" className="travel-tools-modal" onClose={()=>setMobile(false)}>
   <div className="travel-tools-panel">
    <p className="eyebrow">TRAVEL WITH CONFIDENCE</p>
    <h2>A little help, when you need it.</h2>
    <p>Practical travel tools in one place. Browsing another city never replaces your saved trip.</p>
    <nav aria-label="Travel tools">
     {[
      {title:'Before arrival',ids:['ready','arrival','connectivity','guides']},
      {title:'Speak Local',ids:['speak']},
      {title:'Travel planning',ids:['planner','trip','bookings','saved','shanghai']},
      {title:'Travel help',ids:['sos']}
     ].map(group=><section className="travel-tool-group" key={group.title}>
      <h3>{group.title}</h3>
      {navItems.filter(([id])=>group.ids.includes(id)).map(([id,label,Icon])=><button key={id} className="tool-choice" onClick={()=>navigate(id)}><Icon size={23}/><span>{label}</span><ArrowRight size={17}/></button>)}
      {group.title==='Travel help'&&<a className="tool-choice" href="/culture#offline-kit"><Download size={23}/><span>Offline kit &amp; backup</span><ArrowRight size={17}/></a>}
     </section>)}
    </nav>
    <a href="/cities" className="text-link">Explore our cities →</a>
   </div>
  </Modal>}
  <div className="workspace">
   <SiteHeader active={page==='cities'||cityById(page)?'/cities':page==='planner'||page==='saved'?'/trip':'/'} cityId={cityById(page)?.id||'all'} onTools={()=>setMobile(true)} onCity={id=>navigate(id==='all'?'cities':id as Page)}/>
   <main id="main">
    <Suspense fallback={<div className="page-loading" role="status">Loading…</div>}>
     {page==='cities'&&<CityDirectory/>}
     {page==='hangzhou'&&<Hangzhou/>}
     {page==='guiyang'&&<Guiyang/>}
     {page==='sanya'&&<Sanya/>}
     {page==='shenzhen'&&<Shenzhen/>}
     {page==='beijing'&&<Beijing/>}
     {page==='guangzhou'&&<Guangzhou/>}
     {page==='guides'&&<GuidesView slug={guideSlug} onOpenGuide={s=>navigate('guides',s)} onNavigateHref={navigateHref}/>}
     {(page==='explore'||page==='shanghai')&&<>
      {page==='explore'?<>
       <ShanghaiWelcome onPlan={()=>{setError('');setPlanning(true);}}/>
       <section className="survival-kit-strip" aria-labelledby="survival-kit-heading">
        <div className="section-heading"><div><p className="eyebrow">ESSENTIAL ARRIVAL &amp; SURVIVAL TOOLS</p><h2 id="survival-kit-heading">Save before you board. Use offline when you land.</h2></div><a className="text-link" href="/guides" onClick={e=>{e.preventDefault();navigate('guides',null);}}>All 6 practical guides <ArrowRight size={15}/></a></div>
        <div className="survival-kit-grid">
         <a className="survival-card" href="/arrival" onClick={e=>{e.preventDefault();navigate('arrival');}}><PlaneLanding size={22}/><h3>First 90 Minutes</h3><p>Beijing (PEK/PKX), Shanghai (PVG/SHA) &amp; Guangzhou (CAN) airport-to-hotel plans.</p><span>Build arrival card <ArrowRight size={14}/></span></a>
         <a className="survival-card" href="/speak" onClick={e=>{e.preventDefault();navigate('speak');}}><Languages size={22}/><h3>Speak Local</h3><p>24 full-screen Chinese cards for taxis, hotels, trains &amp; food allergies.</p><span>Open 24 cards <ArrowRight size={14}/></span></a>
         <a className="survival-card" href="/sos" onClick={e=>{e.preventDefault();navigate('sos');}}><LifeBuoy size={22}/><h3>China SOS</h3><p>Alipay card failed? No SMS code? Calm step-by-step offline fixes.</p><span>Fix an issue <ArrowRight size={14}/></span></a>
         <a className="survival-card" href="/connectivity" onClick={e=>{e.preventDefault();navigate('connectivity');}}><Wifi size={22}/><h3>eSIM &amp; Offline Kit</h3><p>Separate data, home SMS &amp; overseas apps—plus 1-click offline HTML backup.</p><span>Check connectivity <ArrowRight size={14}/></span></a>
        </div>
        <div className="bsg-focus-bar"><div><span className="bsg-badge">CORE FOCUS · BEIJING · SHANGHAI · GUANGZHOU</span><p><strong>Beijing, Shanghai &amp; Guangzhou</strong> all include AI-assisted itinerary planning, airport arrival guides (PEK/PKX/PVG/SHA/CAN) &amp; offline survival packs.</p></div><div className="bsg-links"><a href="/cities/beijing" onClick={e=>{e.preventDefault();navigate('beijing');}}>Beijing</a><a href="/cities/shanghai" onClick={e=>{e.preventDefault();navigate('shanghai');}}>Shanghai</a><a href="/cities/guangzhou" onClick={e=>{e.preventDefault();navigate('guangzhou');}}>Guangzhou</a><a href="/trip" onClick={e=>{e.preventDefault();navigate('planner');}}>Plan BSG trip →</a></div></div>
       </section>
       <DestinationChapters onHangzhou={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();sharedImageTransition(event.currentTarget.querySelector('img'),'.hangzhou-cover img',()=>navigate('hangzhou'),event.detail===0);}} onGuiyang={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();sharedImageTransition(event.currentTarget.querySelector('img'),'.guiyang-cover img',()=>navigate('guiyang'),event.detail===0);}} onBeijing={event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();sharedImageTransition(event.currentTarget.querySelector('img'),'.beijing-cover img',()=>navigate('beijing'),event.detail===0);}}/>
       <StoryInvitation/>
       <section className="home-travel-help"><p className="eyebrow">TRAVEL WITH CONFIDENCE</p><h2>A little help, when you need it.</h2><p>Find a phrase, read a practical airport/Alipay guide, or prepare before your flight.</p><div><a href="/speak" onClick={e=>{e.preventDefault();navigate('speak');}}>Speak Local →</a><a href="/guides" onClick={e=>{e.preventDefault();navigate('guides',null);}}>Practical Guides →</a><a href="/ready" onClick={e=>{e.preventDefault();navigate('ready');}}>Before you go →</a><button className="text-link" onClick={()=>setMobile(true)}>All Travel Tools →</button></div></section>
      </>:<><CityIntro cityId="shanghai"/><CityContentSections cityId="shanghai"/></>}
      {page==='shanghai'&&<>
       <section className="quick-plan" id="city-plan"><div className="quick-plan-title"><span className="sparkle-box"><Sparkles size={21}/></span><div><h3>A trip that feels like you</h3><p>Your pace. Your interests. Your Shanghai.</p></div></div><div className="quick-field"><span>DESTINATION</span><strong>Shanghai <ChevronDown size={13}/></strong></div><label className="quick-field"><span>DURATION</span><select aria-label="Trip duration" value={trip.days} onChange={e=>setTrip({...trip,days:Number(e.target.value)})}>{[1,2,3,4,5,6,7].map(n=><option key={n} value={n}>{n} {n===1?'day':'days'}</option>)}</select></label><MatchaButton className="primary-button" onClick={()=>{setTrip({...trip,city:'shanghai'});setError('');setPlanning(true);}}><Sparkles size={16}/> Plan my trip <ArrowRight size={16}/></MatchaButton></section>
       <section className="arrival-entry"><div className="arrival-entry-icon"><PlaneLanding size={28}/></div><div><span className="eyebrow">ARRIVAL ASSISTANT</span><h2>Your first 90 minutes</h2><p>From the airport to your hotel, with a plan you can take offline.</p></div><MatchaButton className="outline-button" onClick={()=>navigate('arrival')}>Prepare my arrival <ArrowUpRight size={17}/></MatchaButton></section>
       <ShanghaiPhotography/>
       <section className="places-section" id="places"><div className="section-heading"><div><div className="eyebrow">CURATED, NOT CROWDSOURCED</div><h2>Find your kind of place</h2><p>The classics worth seeing. The corners worth getting lost in.</p></div><button className="text-link" onClick={()=>setShowAll(!showAll)}>{showAll?'Show highlights':'View all places'} <ArrowUpRight size={16}/></button></div><div className="discovery-toolbar"><div className="filter-tabs" aria-label="Filter by category">{categories.map(c=><button className={category===c?'selected':''} key={c} onClick={()=>setCategory(c)}>{c==='All places'&&<SlidersHorizontal size={14}/>} {c}</button>)}</div><label className="search-field"><Search size={16}/><input aria-label="Search places" placeholder="Find a little something…" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button className="icon-button" aria-label="Clear search" onClick={()=>setSearch('')}><X size={14}/></button>}</label></div><div className="place-grid">{displayed.map(p=><PlaceCard key={p.id} p={p} saved={saved.includes(p.id)} onSave={()=>toggleSaved(p.id)} onOpen={()=>setDetail(p)}/>)}</div>{!displayed.length&&<div className="empty-state"><Search/><h3>No places found</h3><p>Try another name, neighborhood, or category.</p><button className="text-link" onClick={()=>{setSearch('');setCategory('All places');}}>Clear filters <ArrowRight size={15}/></button></div>}</section>
       <section className="ready-banner"><div className="ready-seal"><ShieldCheck size={31}/></div><div><div className="eyebrow">BEFORE THE ADVENTURE</div><h2>A new country. A few things to know.</h2><p>Visas, payments, getting connected — make the unfamiliar feel familiar.</p></div><MatchaButton className="outline-button" onClick={()=>navigate('ready')}>Get China Ready <ArrowUpRight size={17}/></MatchaButton></section>
      </>}
     </>}
     {page==='connectivity'&&<Connectivity hotel={hotel} details={details} arrival={arrival} plan={plan}/>}
     {page==='speak'&&<SpeakLocal {...travelerProps} plan={plan}/>}
     {page==='arrival'&&<ArrivalAssistant {...travelerProps} arrival={arrival} onArrivalChange={setArrival} onConnectivity={()=>navigate('connectivity')} onSpeak={()=>navigate('speak')}/>}
     {(detailsStorageError||arrivalStorageError)&&<p role="alert" className="warning">Travel details could not be saved in this browser. Download an HTML backup before leaving.</p>}
     {page==='trip'&&<TripMode plan={plan} onPlanChange={setPlan} onPlan={()=>navigate('planner')} onBookings={()=>navigate('bookings')} onSOS={()=>navigate('sos')} onPlace={setDetail} hotel={hotel}/>}
     {page==='bookings'&&<BookingAssistant plan={plan} hotel={hotel} onHotelChange={setHotel} hotelStorageError={hotelStorageError} onPlan={()=>navigate('planner')} onTrip={()=>navigate('trip')}/>}
     {page==='sos'&&<ChinaSOS/>}
     {page==='saved'&&<>
      <div className="page-intro"><div><p className="eyebrow">MY TRIP / SAVED</p><h1>Worth keeping close<span>.</span></h1><p>Your places and culture, kept in this browser.</p></div><Bookmark size={32}/></div>
      <nav className="saved-view-tabs" aria-label="Saved collection"><button aria-pressed={savedView==='places'} onClick={()=>setSavedView('places')}>Places</button><button aria-pressed={savedView==='culture'} onClick={()=>setSavedView('culture')}>Culture</button></nav>
      {savedView==='culture'?<><CultureHighlights savedOnly/><EarlierCultureNotes/></>:<><HangzhouSavedCollection/>{!saved.length?<div className="empty-state"><h2>Your next favourite is out there.</h2><p>Save a place to keep it here.</p><MatchaButton className="outline-button" onClick={()=>navigate('cities')}>Explore cities</MatchaButton></div>:<div className="place-grid">{displayed.map(p=><PlaceCard key={p.id} p={p} saved onSave={()=>toggleSaved(p.id)} onOpen={()=>setDetail(p)}/>)}</div>}</>}
     </>}
     {page==='planner'&&<PlannerView plan={plan} onPlanChange={setPlan} onOpenModal={()=>{setError('');setPlanning(true);}} onSaved={()=>navigate('saved')} onTripMode={()=>navigate('trip')} onBookings={()=>navigate('bookings')} onCopy={copy} onNotify={notify} onOpenDetail={setDetail} hotel={hotel} details={details} arrival={arrival}/>}
     {page==='ready'&&<ChinaReadyView nationality={nationality} onNationality={setNationality} departure={departure} onDeparture={setDeparture} checked={checked} onToggleChecked={id=>setChecked(checked.includes(id)?checked.filter(x=>x!==id):[...checked,id])} openGuide={openGuide} onOpenGuide={setOpenGuide}/>}
    </Suspense>
    <footer className="main-footer">
     <span>china, closer<span className="brand-period">.</span> <span>Beijing · Shanghai · Guangzhou.</span></span>
     <span className="footer-actions"><a href="/guides" onClick={e=>{e.preventDefault();navigate('guides',null);}}>Practical guides</a> · <a href={mailtoCorrection(location.href)}>Report an outdated fact</a> · <span>A little closer. <Leaf size={16}/></span></span>
    </footer>
   </main>
  </div>
  <MobileNavigation active={page==='planner'||page==='saved'?'/trip':page==='cities'||cityById(page)?'/cities':'/'}/>
  {detail&&<Modal title={detail.name} onClose={()=>setDetail(null)}>
   <div className="detail-photo"><img src={detail.id==='bund'?'/photography/bund-clocktower-1600.webp':detail.id==='lujiazui'?'/photography/pudong-night-1600.webp':detail.image} alt={`${detail.name} travel inspiration`}/><span>Shanghai inspiration · illustrative photography</span></div>
   <div className="detail-body">
    <span className="eyebrow">{detail.category} / {detail.area}</span>
    <h2>{detail.name}<span>{detail.zh}</span></h2>
    <p>{detail.description}</p>
    <div className="detail-facts"><span><Clock size={16}/>{detail.duration}</span><span>{money(detail.cost)} admission estimate</span></div>
    <button className="detail-address" onClick={()=>copy(detail.address)}><MapPin size={17}/><span>{detail.address}<small>Tap to copy the Chinese address</small></span><Copy size={16}/></button>
    <h3>Getting there</h3><p>{detail.transit} Transfer times depend on your starting point; check a live map.</p>
    <h3>Before you go</h3><p>{detail.hours}</p><p className="detail-tip">{detail.tip}</p>
    <VenueStories placeId={detail.id}/><VenueEvidence placeId={detail.id}/>
    <div className="detail-links">
     <a className="primary-button" href={`https://uri.amap.com/search?keyword=${encodeURIComponent(detail.zh+' '+detail.address)}&city=Shanghai&view=map&callnative=0`} target="_blank" rel="noreferrer" onClick={()=>trackEvent('amap_opened',detail.id)}>Open in Amap ↗</a>
     <External className="outline-button" href={detail.booking}>{detail.bookingLabel}</External>
    </div>
    <div className="detail-links"><button className="text-link" onClick={()=>toggleSaved(detail.id)}><Heart size={16} fill={saved.includes(detail.id)?'currentColor':'none'}/>{saved.includes(detail.id)?'Saved to your places':'Save this place'}</button><External href={detail.source}>Official information</External></div>
   </div>
  </Modal>}
  {planning&&<Modal title="Plan your China trip" onClose={()=>{if(!busy)setPlanning(false);}}>
   <form className="trip-form" onSubmit={e=>{e.preventDefault();void generate();}}>
    <span className="eyebrow">BEIJING · SHANGHAI · GUANGZHOU</span>
    <h2>A little about your adventure</h2>
    <p>Pick your city and pace. We’ll connect the dots.</p>
    <label>City<select value={trip.city||'shanghai'} onChange={e=>setTrip({...trip,city:e.target.value})}>{plannerCities.map(c=><option key={c.id} value={c.id}>{c.name} · {c.zh}</option>)}</select></label>
    <div className="form-row"><label>Start date<input type="date" required value={trip.date} onChange={e=>setTrip({...trip,date:e.target.value})}/></label><label>Number of days<select value={trip.days} onChange={e=>setTrip({...trip,days:Number(e.target.value)})}>{[1,2,3,4,5,6,7].map(n=><option value={n} key={n}>{n} {n===1?'day':'days'}</option>)}</select></label></div>
    <label>Total budget per person (CNY)<input type="number" required min={100} max={100000} step={1} value={trip.budget} onChange={e=>setTrip({...trip,budget:Number(e.target.value)})}/><small>For stays, meals, city transport, and admission. Excludes flights.</small></label>
    <fieldset><legend>What draws you in?</legend><div className="interest-options">{interests.map(interest=><button type="button" aria-pressed={trip.interests.includes(interest)} className={trip.interests.includes(interest)?'selected':''} key={interest} onClick={()=>setTrip({...trip,interests:trip.interests.includes(interest)?trip.interests.filter(x=>x!==interest):[...trip.interests,interest]})}>{trip.interests.includes(interest)&&<Check size={13}/>} {interest}</button>)}</div></fieldset>
    <fieldset><legend>Your travel rhythm</legend><div className="pace-options">{[['relaxed','Slow & easy','1 stop / day',Leaf],['balanced','A little of both','2 stops / day',Sun],['packed','See it all','3 stops / day',Footprints]].map(([value,label,description,Icon])=>{const I=Icon as typeof Leaf;return <button key={String(value)} type="button" aria-pressed={trip.pace===value} className={trip.pace===value?'selected':''} onClick={()=>setTrip({...trip,pace:String(value)})}><I size={21}/><strong>{String(label)}</strong><small>{String(description)}</small></button>;})}</div></fieldset>
    <div className="planner-mode"><Sparkles size={17}/><span>{ai?`AI-assisted planning is available (${aiProvider}). Generates route logic, neighborhood dining pairings, rainy-day tips, and practical heads-ups from our curated catalog.`:'Curated planning mode. Live AI is not configured; recommendations use your selected interests and pace.'}</span></div>
    {error&&<div role="alert" className="form-error">{error}<button type="button" onClick={()=>void generate(true)}>Use curated planner instead <ArrowRight size={14}/></button></div>}
    <MatchaButton className="primary-button full-button" disabled={busy||!trip.interests.length} type="submit"><Sparkles size={17}/>{busy?'Connecting the dots…':ai?'Create my AI-assisted itinerary':'Create my curated itinerary'}<ArrowRight size={17}/></MatchaButton>
    {!trip.interests.length&&<small role="status">Choose at least one interest to continue.</small>}
   </form>
  </Modal>}
  {showAnalytics&&<Suspense fallback={null}><FounderAnalyticsModal onClose={()=>setShowAnalytics(false)}/></Suspense>}
  {toast&&<div className="toast" role="status"><CheckCircle2 size={17}/>{toast}</div>}
 </div>;
}

function PlaceCard({p,saved,onSave,onOpen}:{p:Place;saved:boolean;onSave:()=>void;onOpen:()=>void}){
 return <AstryxCard role="article" className="place-card">
  <div className="place-image"><button className="image-open" onClick={onOpen} aria-label={`Explore ${p.name}`}><img src={p.id==='bund'?'/photography/bund-clocktower-640.webp':p.id==='lujiazui'?'/photography/pudong-night-640.webp':p.image} alt={`${p.name} · Shanghai travel inspiration`} loading="lazy"/></button><span className="place-badge">{p.category}</span><button className={`save-button ${saved?'saved':''}`} onClick={onSave} aria-label={`${saved?'Unsave':'Save'} ${p.name}`} aria-pressed={saved}><Heart size={17} fill={saved?'currentColor':'none'}/></button><span className="image-caption">SHANGHAI, THROUGH OUR LENS</span></div>
  <div className="place-meta"><span><MapPin size={12}/>{p.area}</span><span>{p.cost===0?'Free to explore':`Est. ${money(p.cost)}`}</span></div>
  <button className="place-title" onClick={onOpen}><h3>{p.name}<span>{p.zh}</span></h3><ArrowUpRight size={19}/></button>
  <p>{p.description}</p>
  <div className="place-bottom"><span><Clock size={12}/>{p.duration}</span><button className="text-link" onClick={onOpen}>Take a closer look <ArrowRight size={14}/></button></div>
 </AstryxCard>;
}

export default App;
