import {cultureRoute} from './shared/story-catalog.mjs';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {generate} from './shared/deepseek.mjs';
import {validateInput} from './shared/planner.mjs';
export {generate} from './shared/deepseek.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
const limits=new Map();let active=0;
export function createHandler(vite){return async(req,res)=>{
 const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 const path=new URL(req.url,'http://localhost').pathname;
 if(path.startsWith('/api/')){
  if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)return send(403,{error:'Origin not allowed.'});
  if(path==='/api/status'&&req.method==='GET')return send(200,{aiConfigured:Boolean(process.env.DEEPSEEK_API_KEY?.trim()),aiProvider:'DeepSeek'});
  if(path!=='/api/plan'||req.method!=='POST')return send(404,{error:'Not found.'});
  if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'Send JSON trip details.'});
  const now=Date.now();for(const [ip,value] of limits){if(now-value.at>60000)limits.delete(ip);}
  const ip=req.socket.remoteAddress||'local',entry=limits.get(ip)||{at:now,count:0};entry.count++;limits.set(ip,entry);
  if(entry.count>10||active>=2)return send(429,{error:'Planner is busy. Please try again in a minute.'});
  let body='';try{
   for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192)return send(413,{error:'Request is too large.'});}
   let input;try{input=validateInput(JSON.parse(body));}catch(e){return send(400,{error:e.message});}
   active++;try{const plan=await generate(input,{apiKey:JSON.parse(body).curated?'':process.env.DEEPSEEK_API_KEY});return send(200,plan);}finally{active--;}
  }catch{return send(502,{error:'The planner could not finish. Please try the curated planner.'});}
 }
 const culture=cultureRoute(path);
 if(culture?.kind==='not-found')return send(404,{error:'Story or experience not found.'});
 if(vite){if(culture)req.url='/culture.html';return vite.middlewares(req,res);}
 try{
  const base=resolve(root,'dist'),file=resolve(base,'.'+decodeURIComponent(culture?.file||path));
  if(!file.startsWith(base+sep)&&file!==base)return send(403,{error:'Forbidden'});
  let data;let extension=extname(file);try{data=await readFile(file);}catch{if(extension)return send(404,{error:'Not found'});data=await readFile(resolve(base,'index.html'));extension='.html';}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.json':'application/json','.png':'image/png','.ico':'image/x-icon'};
  res.writeHead(200,{'Content-Type':types[extension]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});res.end(data);
 }catch{send(500,{error:'Build the app with npm run build before starting.'});}
};}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{process.loadEnvFile(resolve(root,'.env.deepseek'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const vite=process.argv.includes('--dev')?await(await import('vite')).createServer({server:{middlewareMode:true},appType:'spa'}):null;
 const server=http.createServer(createHandler(vite));
 server.requestTimeout=30000;
 server.listen(Number(process.env.DEEPSEEK_PORT||5176),'127.0.0.1',()=>console.log(`China, closer (DeepSeek): http://localhost:${process.env.DEEPSEEK_PORT||5176} (${vite?'development':'production build'}; ${process.env.DEEPSEEK_API_KEY?.trim()?'AI enabled':'curated mode'})`));
}
