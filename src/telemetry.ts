export const ALLOWED_EVENTS=[
 'offline_kit_saved',
 'offline_html_downloaded',
 'chinese_card_copied',
 'ai_plan_generated',
 'curated_plan_generated',
 'partner_link_clicked',
 'amap_opened',
 'guide_opened'
] as const;

export type FunnelEvent=typeof ALLOWED_EVENTS[number];
export type FunnelSummary={counts:Record<string,number>;lastEventAt:string|null};

const STORAGE_KEY='closer-funnel-v1';

export function readFunnel():FunnelSummary{
 try{
  const raw=localStorage.getItem(STORAGE_KEY);
  if(!raw)return {counts:{},lastEventAt:null};
  const parsed=JSON.parse(raw);
  if(!parsed||typeof parsed!=='object'||typeof parsed.counts!=='object')return {counts:{},lastEventAt:null};
  return {counts:parsed.counts as Record<string,number>,lastEventAt:typeof parsed.lastEventAt==='string'?parsed.lastEventAt:null};
 }catch{
  return {counts:{},lastEventAt:null};
 }
}

export function resetFunnel():FunnelSummary{
 const empty:FunnelSummary={counts:{},lastEventAt:null};
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(empty));}catch{/* ignore */}
 return empty;
}

export function trackEvent(event:FunnelEvent,target?:string):void{
 const now=new Date().toISOString();
 try{
  const current=readFunnel();
  const key=target?`${event}:${target.slice(0,40)}`:event;
  current.counts[event]=(current.counts[event]||0)+1;
  if(target)current.counts[key]=(current.counts[key]||0)+1;
  current.lastEventAt=now;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(current));
 }catch{/* storage optional */}
 try{
  const payload=JSON.stringify({event,target:target?target.slice(0,40):undefined});
  if(typeof navigator!=='undefined'&&typeof navigator.sendBeacon==='function'){
   navigator.sendBeacon('/api/event',new Blob([payload],{type:'application/json'}));
  }
 }catch{/* network optional */}
}
