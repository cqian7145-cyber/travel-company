import {cityRoute} from '../shared/cities.mjs';
import {buildPlan,validateInput} from '../shared/planner.mjs';
import {generate as generateDeepSeek} from '../shared/deepseek.mjs';
import {cultureRoute} from '../shared/story-catalog.mjs';

const MAX_BODY=8192;
function json(status,data,extra={}){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin',...extra}});}
function aiReady(env){return env.AI_ENABLED==='true'&&Boolean(env.DEEPSEEK_API_KEY?.trim())&&Boolean(env.PLAN_RATE_LIMITER);}
async function readJson(request){
 const reader=request.body?.getReader();if(!reader)throw new Error('invalid');
 const chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BODY){void reader.cancel().catch(()=>{});throw new Error('large');}chunks.push(value);}}
 finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}

// Dependency injection is only used by tests; production always uses the fixed official endpoint.
export function createWorker({generate=generateDeepSeek}={}){return {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname!=='/api'&&!url.pathname.startsWith('/api/')){
   const route=cultureRoute(url.pathname)||cityRoute(url.pathname);
   if(route?.kind==='redirect')return Response.redirect(new URL(route.location+url.search,url.origin),308);
   if(route?.kind==='not-found')return new Response('Story or experience not found.',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
   if(route?.file){const assetUrl=new URL(request.url);assetUrl.pathname=route.file;return env.ASSETS.fetch(new Request(assetUrl,request));}
   return env.ASSETS.fetch(request);
  }
  const origin=request.headers.get('Origin');
  if((origin&&origin!==url.origin)||request.headers.get('Sec-Fetch-Site')==='cross-site')return json(403,{error:'Origin not allowed.'});
  if(url.pathname==='/api/status'){
   if(request.method!=='GET')return json(405,{error:'Method not allowed.'},{Allow:'GET'});
   return json(200,{aiConfigured:aiReady(env),aiProvider:'DeepSeek'});
  }
  if(url.pathname!=='/api/plan')return json(404,{error:'Not found.'});
  if(request.method!=='POST')return json(405,{error:'Method not allowed.'},{Allow:'POST'});
  if(request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase()!=='application/json')return json(415,{error:'Send JSON trip details.'});
  const length=request.headers.get('Content-Length');if(length!==null&&Number(length)>MAX_BODY)return json(413,{error:'Request is too large.'});
  let raw,input;
  try{raw=await readJson(request);input=validateInput(raw);if(raw.curated!==undefined&&typeof raw.curated!=='boolean')throw new Error('invalid');}
  catch(error){return error.message==='large'?json(413,{error:'Request is too large.'}):json(400,{error:'Send valid trip preferences.'});}
  // Worker isolates are not a shared rate-limit store. Use the native binding and fail closed.
  if(!env.PLAN_RATE_LIMITER)return json(503,{error:'Planner protection is unavailable. Try again later.'});
  const ip=request.headers.get('CF-Connecting-IP')||(['localhost','127.0.0.1','[::1]'].includes(url.hostname)?'local-development':null);
  if(!ip)return json(503,{error:'Planner protection is unavailable. Try again later.'});
  try{const result=await env.PLAN_RATE_LIMITER.limit({key:`china-closer:plan:${ip}`});if(!result.success)return json(429,{error:'Too many plans. Please try again in a minute.'},{'Retry-After':'60'});}
  catch{return json(503,{error:'Planner protection is unavailable. Try again later.'});}
  if(raw.curated===true||!aiReady(env))return json(200,buildPlan(input));
  try{return json(200,await generate(input,{apiKey:env.DEEPSEEK_API_KEY,model:env.DEEPSEEK_MODEL||'deepseek-flash'}));}
  catch{return json(502,{error:'The planner could not finish. Please try the curated planner.'});}
 }
};}
export default createWorker();
