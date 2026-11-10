import {cityRoute} from './shared/cities.mjs';
import {cultureRoute} from './shared/story-catalog.mjs';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {places} from './shared/catalog.mjs';
import {buildPlan,validateInput,validateAiOrder} from './shared/planner.mjs';
try{process.loadEnvFile();}catch(error){if(error.code!=='ENOENT')throw error;}
const root=fileURLToPath(new URL('.',import.meta.url));
const limits=new Map();let active=0;
export async function generate(input, {apiKey=process.env.OPENAI_API_KEY, fetcher=fetch}={}){
 const clean=validateInput(input);
 if(!apiKey)return buildPlan(clean);
 const response=await fetcher('https://api.openai.com/v1/responses',{
  method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey}`},signal:AbortSignal.timeout(25000),
  body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',store:false,max_output_tokens:700,
   instructions:'Rank the supplied Shanghai place IDs for this traveler. Consider interests, budget, pace and neighborhood proximity. Return only IDs from the catalog. Never invent travel facts, visa advice, prices or opening hours.',
   input:JSON.stringify({trip:clean,places:places.map(({id,tags,area,cost})=>({id,tags,area,estimatedAdmission:cost}))}),
   text:{format:{type:'json_schema',name:'place_order',strict:true,schema:{type:'object',properties:{placeIds:{type:'array',items:{type:'string',enum:places.map(p=>p.id)}}},required:['placeIds'],additionalProperties:false}}}})
 });
 if(!response.ok)throw new Error('AI provider unavailable. Try the curated planner instead.');
 const result=await response.json();
 const output=result.output?.flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('');
 let order;try{order=validateAiOrder(JSON.parse(output).placeIds);}catch{throw new Error('AI returned an invalid plan. Try the curated planner instead.');}
 const plan=buildPlan(clean,order);plan.mode='ai';return plan;
}
export function createHandler(vite){return async(req,res)=>{
 const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 const path=new URL(req.url,'http://localhost').pathname;
 if(path.startsWith('/api/')){
  if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)return send(403,{error:'Origin not allowed.'});
  if(path==='/api/status'&&req.method==='GET')return send(200,{aiConfigured:Boolean(process.env.OPENAI_API_KEY)});
  if(path!=='/api/plan'||req.method!=='POST')return send(404,{error:'Not found.'});
  if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'Send JSON trip details.'});
  const now=Date.now();for(const [ip,value] of limits){if(now-value.at>60000)limits.delete(ip);}
  const ip=req.socket.remoteAddress||'local',entry=limits.get(ip)||{at:now,count:0};entry.count++;limits.set(ip,entry);
  if(entry.count>10||active>=2)return send(429,{error:'Planner is busy. Please try again in a minute.'});
  let body='';try{
   for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192)return send(413,{error:'Request is too large.'});}
   let input;try{input=validateInput(JSON.parse(body));}catch(e){return send(400,{error:e.message});}
   active++;try{const plan=await generate(input,{apiKey:JSON.parse(body).curated?'':process.env.OPENAI_API_KEY});return send(200,plan);}finally{active--;}
  }catch{return send(502,{error:'The planner could not finish. Please try the curated planner.'});}
 }
 const culture=cultureRoute(path)||cityRoute(path);
 if(culture?.kind==='redirect'){res.writeHead(308,{Location:culture.location+new URL(req.url,'http://localhost').search});return res.end();}
 if(culture?.kind==='not-found')return send(404,{error:'Story or experience not found.'});
 if(vite){if(culture)req.url=culture.kind==='city'||culture.kind==='cities'?'/index.html':'/culture.html';return vite.middlewares(req,res);}
 try{
  const base=resolve(root,'dist'),file=resolve(base,'.'+decodeURIComponent(culture?.file||path));
  if(!file.startsWith(base+sep)&&file!==base)return send(403,{error:'Forbidden'});
  let data;let extension=extname(file);try{data=await readFile(file);}catch{if(extension)return send(404,{error:'Not found'});data=await readFile(resolve(base,'index.html'));extension='.html';}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.json':'application/json','.png':'image/png','.ico':'image/x-icon'};
  res.writeHead(200,{'Content-Type':types[extension]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});res.end(data);
 }catch{send(500,{error:'Build the app with npm run build before starting.'});}
};}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const vite=process.argv.includes('--dev')?await(await import('vite')).createServer({server:{middlewareMode:true},appType:'spa'}):null;
 const server=http.createServer(createHandler(vite));
 server.requestTimeout=30000;
 server.listen(Number(process.env.PORT||5173),'127.0.0.1',()=>console.log(`China, closer: http://localhost:${process.env.PORT||5173} (${vite?'development':'production build'}; ${process.env.OPENAI_API_KEY?'AI enabled':'curated mode'})`));
}
