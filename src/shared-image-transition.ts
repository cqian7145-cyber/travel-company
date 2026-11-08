import {flushSync} from 'react-dom';

let active:ViewTransition|null=null;

/** A bounded enhancement for pointer navigation. The content update never depends on it. */
export function sharedImageTransition(source:HTMLImageElement|null,targetSelector:string,commit:()=>void,keyboard=false){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(keyboard||reduced.matches||!document.startViewTransition||!source?.complete||!source.naturalWidth||active){active?.skipTransition();commit();return;}
 const name='destination-image';
 source.style.viewTransitionName=name;
 document.documentElement.dataset.sharedTransition='true';
 let target:HTMLImageElement|null=null;
 try{
  const transition=document.startViewTransition(async()=>{
   source.style.removeProperty('view-transition-name');
   // The native browser snapshot needs the new React DOM before the callback resolves.
   flushSync(commit);
   target=document.querySelector<HTMLImageElement>(targetSelector);
   if(target){target.style.viewTransitionName=name;await Promise.race([target.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,180))]);}
  });
  active=transition;
  const stop=()=>transition.skipTransition();reduced.addEventListener('change',stop);
  transition.ready.catch(()=>{});
  transition.finished.catch(()=>{}).finally(()=>{
   source.style.removeProperty('view-transition-name');target?.style.removeProperty('view-transition-name');
   reduced.removeEventListener('change',stop);
   if(active===transition){active=null;delete document.documentElement.dataset.sharedTransition;}
  });
 }catch{
  source.style.removeProperty('view-transition-name');delete document.documentElement.dataset.sharedTransition;commit();
 }
}
