import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
const root=resolve('dist');
async function list(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?list(resolve(dir,e.name)):resolve(dir,e.name)))).flat();}
const files=(await list(root)).filter(p=>!['sw.js','offline-manifest.json'].includes(relative(root,p))).sort();
const hash=createHash('sha256');for(const file of files)hash.update(await readFile(file));
const version=hash.digest('hex').slice(0,16),urls=files.map(file=>'/'+relative(root,file).replaceAll('\\','/'));
const worker=`const VERSION=${JSON.stringify(version)};
const CACHE='china-closer-offline-'+VERSION;
const FILES=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})));await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('china-closer-offline-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type!=='CHINA_OFFLINE_STATUS')return;event.waitUntil((async()=>{const cache=await caches.open(CACHE);const ready=(await Promise.all(FILES.map(url=>cache.match(url)))).every(Boolean);event.ports[0]?.postMessage({type:'CHINA_OFFLINE_STATUS',ready,version:VERSION,files:FILES.length});})());});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(request.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok)return response;}catch{}return (await (await caches.open(CACHE)).match('/index.html'))||new Response('Offline kit unavailable. Reconnect and save again.',{status:503});})());return;}
 if(FILES.includes(url.pathname))event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(url.pathname))||fetch(request);})());
});`;
await writeFile(resolve(root,'sw.js'),worker);
await writeFile(resolve(root,'offline-manifest.json'),JSON.stringify({version,files:urls}));
console.log(`Offline shell ${version}: ${urls.length} local files. No API or remote assets cached.`);
