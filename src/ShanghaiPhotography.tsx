import {useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Plus} from 'lucide-react';
import {Modal} from './ui';

function Photo({id,alt,hero=false,large=false}:{id:string;alt:string;hero?:boolean;large?:boolean}){
 const [failed,setFailed]=useState(false);
 return failed?<div className="photo-unavailable" role="img" aria-label={alt+' · photograph unavailable'}>Photograph unavailable.<br/>Your travel tools are still available.</div>:<img src={'/photography/'+id+(hero||large?'-1600.webp':'-640.webp')} {...(hero?{srcSet:`/photography/${id}-640.webp 640w, /photography/${id}-1600.webp 1600w`,sizes:'100vw',fetchPriority:'high' as const}:{loading:'lazy' as const,decoding:'async' as const})} width={hero?1600:640} height={hero?898:850} alt={alt} onError={()=>setFailed(true)}/>;
}

const frames=[
 {id:'shanghai-greeting',title:'A little everyday Shanghai.',caption:'Brick, doorways and a city at street level.',alt:'Red brick street corner with Shanghai lettering'},
 {id:'pudong-blue-hour',title:'Stay for the blue hour.',caption:'The riverfront, as day gives way to night.',alt:'Pudong skyline and the Bund promenade at blue hour'},
 {id:'shanghai-street',title:'Take the slower street.',caption:'There is more to a city than its skyline.',alt:'Afternoon light falling between Shanghai street buildings'},
 {id:'bund-clocktower',title:'Look up. Look closer.',caption:'A different view from the pavement.',alt:'Illuminated Bund clock tower viewed from a street'},
 {id:'pudong-night',title:'The other side of the river.',caption:'Light and reflection along the Huangpu.',alt:'Oriental Pearl Tower and illuminated buildings across the river'},
 {id:'bund-night-street',title:'After the lights come on.',caption:'An evening city, still on the move.',alt:'Night traffic below illuminated Bund buildings'},
 {id:'riverside-evening',title:'Make room to pause.',caption:'An unhurried moment by the water.',alt:'People on a riverside promenade facing the Shanghai skyline'},
];
export function ShanghaiWelcome({onPlan}:{onPlan:()=>void}){
 return <section className="welcome" aria-labelledby="welcome-heading">
  <div className="welcome-copy" data-reveal><p className="eyebrow">SHANGHAI IS JUST THE BEGINNING.</p><h1 id="welcome-heading">China, Closer<span>.</span></h1><p className="welcome-deck">Less guesswork.<br/>More getting to know a place.</p><div className="welcome-actions"><a className="primary-button" href="#discover-heading">Find a small adventure <ArrowRight size={16}/></a><button className="text-link" onClick={onPlan}>Plan my trip <ArrowRight size={16}/></button></div></div>
  <figure className="welcome-photo"><Photo id="bund-dusk" alt="The Bund waterfront at dusk, seen across the Huangpu River" hero/><figcaption><span>ONE CITY. SO MANY WAYS IN.</span><span>Shanghai · 上海</span></figcaption></figure>
 </section>;
}
export default function ShanghaiPhotography(){
 const rail=useRef<HTMLDivElement>(null),[selected,setSelected]=useState<number|null>(null),[position,setPosition]=useState(0);
 function move(direction:number,keyboard:boolean){const r=rail.current;if(!r)return;const card=r.querySelector('article')!;r.scrollBy({left:direction*(card.getBoundingClientRect().width+20),behavior:keyboard||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 return <section className="photo-essay" aria-labelledby="photo-essay-heading">
  <div className="essay-heading" data-reveal><div><p className="eyebrow">A CLOSER LOOK · SHANGHAI</p><h2 id="photo-essay-heading">A city of contrasts.</h2><p>Start with a view. Follow your curiosity.</p></div><div className="essay-controls"><button aria-label="Previous photographs" disabled={position===0} onClick={e=>move(-1,e.detail===0)}><ArrowLeft size={19}/></button><button aria-label="Next photographs" disabled={position===frames.length-1} onClick={e=>move(1,e.detail===0)}><ArrowRight size={19}/></button></div></div>
  <div className="photo-rail" ref={rail} onScroll={()=>{const r=rail.current;if(r){const size=r.querySelector('article')!.getBoundingClientRect().width+20;setPosition(r.scrollLeft+r.clientWidth>=r.scrollWidth-3?frames.length-1:Math.round(r.scrollLeft/size));}}}>
   {frames.map((photo,index)=><article className="essay-frame" key={photo.id}><button className="essay-image" aria-label={'Enlarge photograph: '+photo.title} onClick={()=>setSelected(index)}><Photo id={photo.id} alt={photo.alt}/><span className="essay-enlarge"><Plus size={20}/></span></button><h3>{photo.title}</h3><p>{photo.caption}</p></article>)}
  </div><p className="essay-counter" aria-live="polite">{Math.min(position+1,frames.length)} / {frames.length} · Photography, not live travel conditions</p>
  {selected!==null&&<Modal title="Shanghai photograph" className="photo-dialog" onClose={()=>setSelected(null)}><figure><Photo key={frames[selected].id} id={frames[selected].id} alt={frames[selected].alt} large/><figcaption><h2>{frames[selected].title}</h2><p>{frames[selected].caption}</p></figcaption></figure><div className="photo-dialog-controls"><button className="outline-button" disabled={selected===0} onClick={()=>setSelected(selected-1)}><ArrowLeft size={17}/>Previous</button><span>{selected+1} / {frames.length}</span><button className="outline-button" disabled={selected===frames.length-1} onClick={()=>setSelected(selected+1)}>Next<ArrowRight size={17}/></button></div></Modal>}
 </section>;
}
