import {useEffect,useRef,useState,type MouseEvent} from 'react';
import {highlights,highlightById,highlightPath,initialHighlightState,validHighlightState} from '../shared/culture-highlights.mjs';
import {renderHighlightCard,renderHighlightDetail} from '../shared/highlight-render.mjs';
import {useLocalState} from './companion-state';
import {Modal} from './ui';
type SavedState={saved:string[]};
function read(key:string){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
export default function CultureHighlights({items=highlights,detail=false,savedOnly=false}:{items?:typeof highlights;detail?:boolean;savedOnly?:boolean}){
 const [initial]=useState<SavedState>(()=>initialHighlightState(read('closer-culture-highlights-v1'),read('closer-culture-v1')));
 const [state,setState,error]=useLocalState<SavedState>('closer-culture-highlights-v1',initial,(v):v is SavedState=>Boolean(validHighlightState(v)));
 const [notice,setNotice]=useState(''),[phraseId,setPhraseId]=useState<string|null>(null);
 const root=useRef<HTMLDivElement>(null),visible=savedOnly?items.filter(x=>state.saved.includes(x.id)):items;
 // A stable HTML string preserves native details and focus when a bookmark changes.
 const html=detail?renderHighlightDetail(visible[0],false,true):visible.map(x=>renderHighlightCard(x,false,true)).join('');
 useEffect(()=>{root.current?.querySelectorAll<HTMLButtonElement>('[data-highlight-action="save"]').forEach(b=>{const saved=state.saved.includes(b.dataset.id||''),item=highlightById(b.dataset.id);b.setAttribute('aria-pressed',String(saved));b.textContent=b.classList.contains('highlight-save')?(saved?'Saved':'Save'):(saved?'Saved culture highlight':'Save culture highlight');b.setAttribute('aria-label',(saved?'Unsave ':'Save ')+(item?.title||'culture highlight'));});},[state,html]);
 async function actions(event:MouseEvent<HTMLDivElement>){
  const b=(event.target as Element).closest<HTMLButtonElement>('button[data-highlight-action]');if(!b)return;
  const item=highlightById(b.dataset.id);if(!item)return;
  if(b.dataset.highlightAction==='save'){setState(s=>({...s,saved:s.saved.includes(item.id)?s.saved.filter(id=>id!==item.id):[...s.saved,item.id]}));setNotice('Culture collection updated in this browser. Save the offline kit to read without a connection.');}
  if(b.dataset.highlightAction==='speak')setPhraseId(item.id);
  if(b.dataset.highlightAction==='copy'&&item.phrase)try{await navigator.clipboard.writeText(item.phrase.zh);setNotice('Chinese copied.');}catch{setNotice('Copy unavailable. Open the large card and select the text.');}
  if(b.dataset.highlightAction==='share'){try{const url=new URL(highlightPath(item),location.origin).href;if(navigator.share)await navigator.share({title:item.title,url});else{await navigator.clipboard.writeText(url);setNotice('Highlight link copied.');}}catch(e){setNotice(e instanceof DOMException&&e.name==='AbortError'?'Sharing cancelled.':'Share unavailable. Copy this page’s address from your browser.');}}
 }
 const phrase=highlightById(phraseId)?.phrase;
 return <><div ref={root} className={detail?'highlight-detail-surface':'highlights-grid'} onClick={e=>void actions(e)} dangerouslySetInnerHTML={{__html:html}}/>{!visible.length&&<div className="discovery-empty"><h2>{savedOnly?'Your culture collection starts here.':'A city, before the stories.'}</h2><p>{savedOnly?'Save a highlight to find it here.':'There are no published cultural highlights in this view yet. The city’s photographs remain available.'}</p><a className="text-link" href="/culture">Explore culture highlights →</a></div>}<p className="highlight-status" role="status">{notice}</p>{error&&<p role="alert">Browser storage is unavailable. Your collection may not persist; reading and sharing links remain available.</p>}{phrase&&<Modal title="Culture Chinese card" fullScreen onClose={()=>setPhraseId(null)}><div className="speak-display"><p className="eyebrow">SHOW OR READ ALOUD</p><h2 lang="zh-Hans">{phrase.zh}</h2><p>{phrase.pinyin}</p><p>{phrase.en}</p><button className="outline-button" onClick={()=>setPhraseId(null)}>Close card</button></div></Modal>}</>;
}
export function EarlierCultureNotes(){
 const [notes]=useState(()=>{const old=read('closer-culture-v1');if(!old?.notes||typeof old.notes!=='object'||Array.isArray(old.notes))return [];return Object.entries(old.notes).filter(([,text])=>typeof text==='string'&&text.length>0&&text.length<=500);});
 if(!notes.length)return null;
 return <details className="earlier-notes"><summary>Earlier private notes ({notes.length})</summary><p>Kept in this browser from the previous edition. No new reflection is required.</p>{notes.map(([id,text])=><article key={id}><h3>{highlightById(id)?.title||'Earlier visit note'}</h3><p>{String(text)}</p></article>)}</details>;
}
