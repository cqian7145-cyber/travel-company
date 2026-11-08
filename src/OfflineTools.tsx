import {useEffect,useState} from 'react';
import {CheckCircle2,Download,WifiOff} from 'lucide-react';
import {buildOfflineHtml} from '../shared/offline-pack.mjs';
import type {ArrivalSettings,Hotel,TravelDetails} from './companion-state';
type Status={ready:boolean;version:string;files:number};
export type OfflineProps={hotel:Hotel;details:TravelDetails;arrival?:ArrivalSettings;connectivity?:unknown};
async function workerStatus(worker:ServiceWorker):Promise<Status>{return new Promise((resolve,reject)=>{const channel=new MessageChannel();const timer=setTimeout(()=>{channel.port1.close();reject(new Error('Offline cache check timed out.'));},5000);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();if(event.data?.type==='CHINA_OFFLINE_STATUS')resolve(event.data);else reject(new Error('Offline cache did not respond.'));};worker.postMessage({type:'CHINA_OFFLINE_STATUS'},[channel.port2]);});}
export default function OfflineTools(props:OfflineProps){
 const [status,setStatus]=useState<Status|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[downloaded,setDownloaded]=useState(false);
 useEffect(()=>{let mounted=true;if('serviceWorker'in navigator)void navigator.serviceWorker.getRegistration('/').then(async registration=>{if(registration?.active){const result=await workerStatus(registration.active);if(mounted)setStatus(result);}}).catch(()=>{});return()=>{mounted=false;};},[]);
 async function save(){setBusy(true);setError('');try{
  if(!('serviceWorker'in navigator)||!window.isSecureContext)throw new Error('Offline app saving needs a supported browser on HTTPS or localhost. Download the standalone backup instead.');
  if(import.meta.env.DEV)throw new Error('Offline app saving is available in the built app (npm run build, then npm start). You can download the standalone backup here.');
  const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});await registration.update();
  const pending=registration.installing||registration.waiting;
  if(pending&&pending.state!=='activated')await new Promise<void>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Offline save timed out. Reconnect and try again.')),20000);const changed=()=>{if(pending.state==='activated'){clearTimeout(timer);pending.removeEventListener('statechange',changed);resolve();}if(pending.state==='redundant'){clearTimeout(timer);pending.removeEventListener('statechange',changed);reject(new Error('Offline files could not be saved. Check storage and connection.'));}};pending.addEventListener('statechange',changed);changed();});
  const ready=await navigator.serviceWorker.ready;if(!ready.active)throw new Error('Offline worker is not active.');
  const result=await workerStatus(ready.active);if(!result.ready)throw new Error('The offline kit is incomplete. Reconnect and save it again.');setStatus(result);
 }catch(e){setError(e instanceof Error?e.message:'Could not save offline.');}finally{setBusy(false);}}
 function download(){const content=buildOfflineHtml(props),url=URL.createObjectURL(new Blob([content],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='china-closer-offline.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setDownloaded(true);}
 return <section className="offline-tools" aria-label="Offline travel kit"><div className="offline-tool-heading"><WifiOff size={23}/><div><h2>Take the practical bits offline.</h2><p>Four connectivity guides, 24 communication cards, and your arrival preparation.</p></div></div><div className="offline-actions"><button className="primary-button" disabled={busy} onClick={()=>void save()}><Download size={16}/>{busy?'Saving offline kit…':status?.ready?'Refresh offline kit':'Save offline kit'}</button><button className="outline-button" onClick={download}>Download HTML backup <Download size={15}/></button></div>
  {status?.ready&&<p role="status" className="offline-status"><CheckCircle2 size={16}/>Offline app files checked · {status.files} local files · version {status.version.slice(0,8)}</p>}
  {downloaded&&<p role="status" className="offline-status">HTML backup download requested. Open the downloaded file to verify it before departure.</p>}
  {error&&<p role="alert" className="warning">{error}</p>}
  <p className="module-disclaimer">Save while online, then test with airplane mode. Browser storage may be cleared or evicted. Maps, booking links, AI and current service checks still need internet. Photos/fonts are not included. The HTML backup is a personal snapshot; download again after changing details.</p>
 </section>;
}
