import {useEffect,useRef,useState} from 'react';
import {ArrowRight,BookOpen,Clock} from 'lucide-react';
import {discoveryInterests,discoveryTimes,matchAdventure} from '../shared/micro-adventures.mjs';

export default function MicroAdventureFinder(){
 const [interest,setInterest]=useState('food'),[minutes,setMinutes]=useState(45),resultRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)'),element=resultRef.current;const stop=()=>{if(reduced.matches)element?.getAnimations().forEach(a=>a.cancel());};reduced.addEventListener('change',stop);return()=>{reduced.removeEventListener('change',stop);element?.getAnimations().forEach(a=>a.cancel());};},[]);
 function choose(change:()=>void,keyboard:boolean){
  resultRef.current?.getAnimations().forEach(a=>a.cancel());
  change();
  if(!keyboard&&!matchMedia('(prefers-reduced-motion: reduce)').matches)resultRef.current?.animate([{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.22,1,.36,1)'});
 }
 const result=matchAdventure(interest,minutes),experience='experience' in result?result.experience:undefined,story='story' in result?result.story:undefined,related='venues' in result?result.venues:[];
 return <section className="micro-discover" aria-labelledby="discover-heading" data-reveal>
  <div className="micro-intro"><span className="eyebrow">CHINA, CLOSER · DISCOVER</span><h2 id="discover-heading">Go beyond sightseeing.</h2><p>Not sure what to do? Find a small experience that helps you get closer to everyday China.</p><a href="/experiences">Browse all micro adventures <ArrowRight size={15}/></a></div>
  <div className="micro-finder">
   <fieldset><legend>What interests you?</legend><div className="micro-choices">{discoveryInterests.map(i=><label key={i.id}><input type="radio" name="discovery-interest" value={i.id} checked={interest===i.id} onChange={e=>choose(()=>setInterest(i.id),e.currentTarget.matches(':focus-visible'))}/><span>{i.label}</span></label>)}</div></fieldset>
   <fieldset><legend>How much time do you have?</legend><div className="micro-choices micro-times">{discoveryTimes.map(time=><label key={time}><input type="radio" name="discovery-time" value={time} checked={minutes===time} onChange={e=>choose(()=>setMinutes(time),e.currentTarget.matches(':focus-visible'))}/><span>{time} min</span></label>)}</div></fieldset>
   <div className="micro-result" ref={resultRef} aria-live="polite" aria-atomic="true">
    <span className="micro-kicker">{result.kind==='direction'?'Suggested direction · check before going':result.kind==='reading'?'Start with a story':'More to discover'}</span>
    <h3>{result.kind==='direction'?experience?.title:story?.title||'Find a story that draws you in'}</h3>
    {result.kind==='direction'&&experience?<><p>{experience.discovery.summary}</p><div className="micro-duration"><Clock size={14}/>{experience.discovery.minMinutes}–{experience.discovery.maxMinutes} min · activity estimate</div><p className="micro-detail"><strong>Where</strong> {related.length?related.map(v=>v?.facts.name.value).join(', ')+' · access and address need checking.':'Choose a public-facing breakfast shop; no verified vendor is listed.'}</p><p className="micro-detail"><strong>Cost</strong> {experience.costNature}</p><a className="micro-open" href={'/experiences/'+experience.slug}>See steps & Chinese card <ArrowRight size={16}/></a></>:<><p>{result.reason}</p><a className="micro-open" href={story?'/stories/'+story.slug:'/stories'}><BookOpen size={16}/>{story?'Read the story':'Browse stories'}<ArrowRight size={16}/></a></>}
    {interest==='perspectives'&&<p className="micro-detail">An observation activity, with historical context. Local introductions and personal interviews are not available yet.</p>}
   </div>
   <p className="micro-footnote">Matched from three editorial experiences, not field-tested outings. Estimates exclude travel and queues. Check current access; completion times are not guaranteed.</p>
  </div>
 </section>;
}
