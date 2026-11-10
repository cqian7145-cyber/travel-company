import assert from 'node:assert/strict';
import {cultureRoutes,cultureRoute} from '../shared/story-catalog.mjs';
const base=process.argv[2]||'http://127.0.0.1:8789';
for(const path of cultureRoutes()){
 const r=await fetch(base+path,{redirect:'manual'}),html=await r.text();assert.equal(r.status,200,path);assert.ok(html.includes('rel="canonical"'),path);assert.ok(html.includes('property="og:title"'),path);
 const file=await fetch(base+cultureRoute(path).file);assert.equal(file.status,200,'offline asset '+path);
}
assert.equal((await fetch(base+'/stories/unpublished')).status,404);
assert.equal((await fetch(base+'/api/missing')).status,404);
assert.equal((await fetch(base+'/culture/xintiandi-2006.jpg')).headers.get('Content-Type'),'image/jpeg');
console.log('PASS: '+cultureRoutes().length+' culture URLs and direct HTML assets, SEO, unpublished/API 404 and local photo MIME in local runtime.');
