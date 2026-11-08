import {useEffect} from 'react';

// Progressive enhancement: nothing is hidden if animation APIs are unavailable.
export function usePageMotion(scope: string, identity: string){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>(scope);
  if(!root||!('IntersectionObserver' in window))return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Set<Animation>();
  let observer:IntersectionObserver|undefined,frame=0;
  const photo=root.querySelector<HTMLElement>('.welcome-photo img, .hangzhou-cover img');
  const onScroll=()=>{
   if(reduced.matches||!photo||frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;const box=photo.parentElement!.getBoundingClientRect();
    if(box.bottom<0||box.top>innerHeight)return;
    const progress=Math.min(1,Math.max(0,-box.top/box.height));
    photo.style.transform=`scale(${1+progress*.035})`;
   });
  };
  const stop=()=>{observer?.disconnect();animations.forEach(a=>a.cancel());animations.clear();cancelAnimationFrame(frame);frame=0;photo?.style.removeProperty('transform');};
  const start=()=>{
   stop();if(reduced.matches)return;
   observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){
     observer?.unobserve(entry.target);
     if(document.activeElement?.matches(':focus-visible'))continue;
     const a=entry.target.animate?.([{opacity:.35,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});
     if(a){animations.add(a);a.onfinish=()=>animations.delete(a);}
    }
   },{threshold:.08});
   root.querySelectorAll('[data-reveal]').forEach(e=>observer?.observe(e));
  };
  start();reduced.addEventListener('change',start);window.addEventListener('scroll',onScroll,{passive:true});
  return()=>{stop();reduced.removeEventListener('change',start);window.removeEventListener('scroll',onScroll);};
 },[scope,identity]);
}
