import {useEffect,useRef,type ReactNode,type KeyboardEvent} from 'react';
import {ArrowUpRight,X} from 'lucide-react';
export function External({href,children,className=''}:{href:string;children:ReactNode;className?:string}){
 return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15}/></a>;
}
export function Modal({title,onClose,children,fullScreen=false,className=''}:{title:string;onClose:()=>void;children:ReactNode;fullScreen?:boolean;className?:string}){
 const dialog=useRef<HTMLDialogElement>(null),closeRef=useRef(onClose);closeRef.current=onClose;
 function keepFocus(event:KeyboardEvent<HTMLDialogElement>){
  if(event.key!=='Tab')return;
  const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]')).filter(e=>e.tabIndex>=0&&e.getClientRects().length>0&&!e.closest('[inert]'));
  const first=items[0],last=items.at(-1);
  if(!first){event.preventDefault();event.currentTarget.focus();return;}
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===event.currentTarget)){event.preventDefault();first.focus();}
 }
 useEffect(()=>{const previous=document.activeElement as HTMLElement;if(previous?.matches(':focus-visible'))dialog.current?.setAttribute('data-instant','true');dialog.current?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;previous?.focus();};},[]);
 return <dialog ref={dialog} className={`modal ${fullScreen?'fullscreen-card':''} ${className}`} aria-label={title} onKeyDown={keepFocus} onCancel={e=>{e.preventDefault();closeRef.current();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeRef.current();}}}>
  <button className="modal-close icon-button" aria-label="Close dialog" onClick={onClose}><X size={21}/></button>{children}
 </dialog>;
}
export function ChineseCard({title,text,translation,address,onClose}:{title:string;text:string;translation?:string;address?:string;onClose:()=>void}){
 return <Modal title={title} onClose={onClose}><div className="chinese-card">
  <div className="eyebrow">PLEASE SHOW THIS TO STAFF · 请出示此页面</div>
  <h2 lang="zh-Hans">{text}</h2>{address&&<p className="chinese-address" lang="zh-Hans">{address}</p>}
  {translation&&<p className="chinese-translation">{translation}</p>}
  <button className="primary-button" onClick={onClose}>Close Chinese card</button>
 </div></Modal>;
}
