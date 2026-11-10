import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {cultureRoutes,cultureRoute} from '../shared/story-catalog.mjs';
import {escape,renderCultureBody,routeMeta} from '../shared/culture-render.mjs';
const origin=new URL(process.env.PUBLIC_SITE_URL||'https://china-closer.cqian7145.workers.dev');
if(origin.protocol!=='https:'||origin.username||origin.password)throw Error('PUBLIC_SITE_URL must be a public HTTPS origin without credentials.');
const template=await readFile('dist/culture.html','utf8');
for(const path of cultureRoutes()){
 const route=cultureRoute(path),meta=routeMeta(route),canonical=new URL(meta.canonical||path,origin).href;
 const tags=`<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"><link rel="canonical" href="${escape(canonical)}"><meta property="og:type" content="${['story','highlight'].includes(route.kind)?'article':'website'}"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${escape(canonical)}">${route.item?.image?`<meta property="og:image" content="${escape(new URL(route.item.image.src,origin).href)}"><meta property="og:image:alt" content="${escape(route.item.image.alt)}">`:''}`;
 const html=template.replace('<!--CULTURE_META-->',tags).replace('<!--CULTURE_CONTENT-->',()=>renderCultureBody(route));
 const file=resolve('dist','.'+route.file);await mkdir(dirname(file),{recursive:true});await writeFile(file,html);
}
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/',...cultureRoutes()].map(p=>`<url><loc>${escape(new URL(p,origin).href)}</loc></url>`).join('')+'</urlset>');
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml',origin).href}\n`);
await unlink('dist/culture.html');
console.log(`Pre-rendered ${cultureRoutes().length} culture routes with full text and individual metadata.`);
