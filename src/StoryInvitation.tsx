import {ArrowRight,BookOpen,Footprints,MessageCircle} from 'lucide-react';
import {stories} from '../shared/story-catalog.mjs';

export default function StoryInvitation(){
 const story=stories.find(s=>s.id==='shanghai-shikumen-001')!;
 return <section className="story-invitation" aria-labelledby="story-invitation-heading">
  <figure data-reveal><img src={story.image!.src} alt={story.image!.alt} width={564} height={800} loading="lazy"/><figcaption>Historical photograph, 2006 · {story.image!.creator} · <a href={story.image!.sourceUrl}>Source</a> · <a href={story.image!.licenseUrl}>{story.image!.license}</a> · Displayed with CSS cropping.</figcaption></figure>
  <div className="story-invitation-copy" data-reveal><p className="eyebrow">STORIES BEHIND PLACES · SHANGHAI</p><h2 id="story-invitation-heading">{story.discoveryQuestion}</h2><p>{story.shortPromise}</p><a className="primary-button" href={'/stories/'+story.slug}>Read the story <ArrowRight size={18}/></a><div className="first-observation"><strong>First thing to notice</strong><p>{story.firstObservation}</p></div><div className="story-path"><span><BookOpen size={19}/>Understand a place</span><span><Footprints size={19}/>Try a small experience</span><span><MessageCircle size={19}/>Take away a question</span></div><a className="text-link" href="/experiences">Explore self-guided experiences <ArrowRight size={17}/></a></div>
 </section>;
}
