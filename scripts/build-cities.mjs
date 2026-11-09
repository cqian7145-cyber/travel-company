import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {cityRoutes,cityRoute} from '../shared/cities.mjs';
import {cityMeta,renderCityBody} from '../shared/city-render.mjs';
import {escape} from '../shared/culture-render.mjs';
const origin=new URL(process.env.PUBLIC_SITE_URL||'https://china-closer.cqian7145.workers.dev');
if(origin.protocol!=='https:'||origin.username||origin.password)throw Error('Use a public HTTPS origin.');
const template=await readFile('dist/index.html','utf8');
for(const path of cityRoutes()){
 const route=cityRoute(path),meta=cityMeta(route),canonical=new URL(path,origin).href;
 const tags=`<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${canonical}">`;
 const html=template.replace(/<title>.*?<\/title>/,tags).replace(/<meta name="description" content="[^"]*"\s*\/?>(?!<link rel="canonical")/,'').replace('<div id="root"></div>',()=>`<div id="root">${renderCityBody(route)}</div>`);
 const file=resolve('dist','.'+route.file);await mkdir(dirname(file),{recursive:true});await writeFile(file,html);
}
const sitemap=await readFile('dist/sitemap.xml','utf8');await writeFile('dist/sitemap.xml',sitemap.replace('</urlset>',cityRoutes().map(p=>`<url><loc>${new URL(p,origin).href}</loc></url>`).join('')+'</urlset>'));
console.log(`Pre-rendered city directory and ${cityRoutes().length-1} city entrances with standalone text and metadata.`);
