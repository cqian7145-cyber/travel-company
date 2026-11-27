import {useEffect} from 'react';
import {ArrowRight,BookOpen} from 'lucide-react';
import {seoGuides} from '../shared/seo-guides.mjs';
import {trackEvent} from './telemetry';

type Props={
 slug:string|null;
 onOpenGuide:(slug:string|null)=>void;
 onNavigateHref:(href:string)=>void;
};

export default function GuidesView({slug,onOpenGuide,onNavigateHref}:Props){
 const guide=slug?seoGuides.find(g=>g.slug===slug)||null:null;

 useEffect(()=>{
  if(guide)trackEvent('guide_opened',guide.slug);
 },[guide]);

 if(!guide){
  return <section className="guides-directory">
   <div className="page-intro">
    <div>
     <p className="eyebrow">PRACTICAL CHINA GUIDES · OFFLINE-READY</p>
     <h1>Solve the hard parts before you land<span>.</span></h1>
     <p>Straightforward, source-aware checklists for Beijing, Shanghai, and Guangzhou arrivals, Alipay foreign-card fixes, 240-hour transit rules, and Chinese allergy cards.</p>
    </div>
    <BookOpen size={34}/>
   </div>
   <div className="survival-kit-grid">
    {seoGuides.map(g=><a key={g.slug} className="survival-card" href={g.path} onClick={e=>{e.preventDefault();onOpenGuide(g.slug);}}>
     <span className="eyebrow">{g.eyebrow}</span>
     <h3>{g.h1}</h3>
     <p>{g.summary}</p>
     <span>Read practical guide <ArrowRight size={14}/></span>
    </a>)}
   </div>
  </section>;
 }

 return <article className="seo-guide-article">
  <nav aria-label="Breadcrumb">
   <a className="text-link" href="/guides" onClick={e=>{e.preventDefault();onOpenGuide(null);}}>← All practical guides</a>
  </nav>
  <div className="page-intro">
   <div>
    <p className="eyebrow">{guide.eyebrow} · REVIEWED {guide.updatedAt}</p>
    <h1>{guide.h1}</h1>
    <p>{guide.summary}</p>
    <div className="partner-links">
     <a className="primary-button" href={guide.primaryCta.href} onClick={e=>{e.preventDefault();onNavigateHref(guide.primaryCta.href);}}>{guide.primaryCta.label} <ArrowRight size={16}/></a>
     <a className="outline-button" href={guide.secondaryCta.href} onClick={e=>{e.preventDefault();onNavigateHref(guide.secondaryCta.href);}}>{guide.secondaryCta.label} <ArrowRight size={16}/></a>
    </div>
   </div>
  </div>
  <section className="partner-options-card">
   <h2>Step-by-step action plan</h2>
   <ol>{guide.steps.map(s=><li key={s}>{s}</li>)}</ol>
  </section>
  <section className="partner-options-card">
   <h2>Common pitfalls to avoid</h2>
   <ul>{guide.pitfalls.map(p=><li key={p}>{p}</li>)}</ul>
  </section>
  <section className="partner-options-card">
   <h2>Frequently asked questions</h2>
   {guide.faqs.map(f=><details className="evidence-field" key={f.q} open>
    <summary><strong>{f.q}</strong></summary>
    <div className="evidence-field-body"><p>{f.a}</p></div>
   </details>)}
  </section>
  <p className="module-disclaimer">Practical preparation summary, not official immigration, medical, or live transport certification. Always verify current operator rules before departure.</p>
 </article>;
}
