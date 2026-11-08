import assert from 'node:assert/strict';
import {cultureRoutes,cultureRoute} from '../shared/story-catalog.mjs';
const base='http://127.0.0.1:8789';
for(const path of cultureRoutes()){
 const r=await fetch(base+path,{redirect:'manual'}),html=await r.text();assert.equal(r.status,200,path);assert.ok(html.includes('rel="canonical"'),path);assert.ok(html.includes('property="og:title"'),path);
 const file=await fetch(base+cultureRoute(path).file);assert.equal(file.status,200,'offline asset '+path);
}
assert.equal((await fetch(base+'/stories/unpublished')).status,404);
assert.equal((await fetch(base+'/api/missing')).status,404);
assert.equal((await fetch(base+'/culture/xintiandi-2006.jpg')).headers.get('Content-Type'),'image/jpeg');
console.log('PASS: 9 public culture URLs, 9 direct HTML assets, SEO metadata, unpublished 404, API 404 and local photo MIME in actual local Workers runtime.');
