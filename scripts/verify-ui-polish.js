(async(page)=>{
 const base='http://127.0.0.1:8789',browser=page.context().browser(),checks=[],errors=[];
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),p=await context.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto(base,{waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'China, Closer.',exact:true}).waitFor();
  const menu=p.getByRole('button',{name:'Open navigation',exact:true});await menu.focus();await p.keyboard.press('Enter');const dialog=p.getByRole('dialog',{name:'Travel tools'});await dialog.waitFor();
  if(await dialog.evaluate(d=>getComputedStyle(d).animationName)!=='none')throw Error('Keyboard navigation animated');
  for(let i=0;i<20;i++){await p.keyboard.press('Tab');if(!await dialog.evaluate(d=>d.contains(document.activeElement)))throw Error('Navigation focus escaped');}
  await p.keyboard.press('Escape');if(!await menu.evaluate(e=>e===document.activeElement))throw Error('Navigation focus not restored');
  for(const name of ['Explore Shanghai','First 90 Minutes','Trip Mode','Speak Local','Connectivity','My itinerary','Booking Assistant','China SOS','China Ready','Saved places']){
   await menu.click();await dialog.getByRole('button',{name,exact:true}).click();if(await dialog.count())throw Error('Tools sheet did not close');if(!(await p.locator('#main').innerText()).trim())throw Error('Empty tool '+name);
  }
  checks.push('all ten tools retained; modal navigation focus trap/Escape/return; no keyboard entrance animation');
  await p.getByRole('button',{name:'China closer home',exact:true}).click();
  await p.getByRole('link',{name:'Find a small adventure'}).click();await p.getByRole('region',{name:'Go beyond sightseeing.'}).waitFor();
  await p.getByRole('button',{name:'Next photographs',exact:true}).focus();await p.keyboard.press('Enter');if(!await p.locator('.photo-rail').evaluate(e=>e.scrollLeft>0))throw Error('Gallery did not advance');
  await p.getByRole('button',{name:'Enlarge photograph: Stay for the blue hour.',exact:true}).click();const photo=p.getByRole('dialog',{name:'Shanghai photograph'});await photo.getByRole('heading',{name:'Stay for the blue hour.',exact:true}).waitFor();await photo.getByRole('button',{name:'Next',exact:true}).click();await photo.getByRole('heading',{name:'Take the slower street.',exact:true}).waitFor();await p.keyboard.press('Escape');checks.push('discovery anchor and manual gallery/enlarged photograph controls');
  const views=[375,390,768,1440];
  for(const width of views){
   await p.setViewportSize({width,height:1000});await p.goto(base,{waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'China, Closer.',exact:true}).waitFor();
   if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1))throw Error('Home overflow '+width);
   await p.locator('.photo-essay').scrollIntoViewIfNeeded();await p.locator('.essay-image img').first().evaluate(img=>img.decode());
   if(await p.locator('.essay-image').first().evaluate(e=>e.getBoundingClientRect().height)<300)throw Error('Gallery collapsed');
   await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'D:/旅游/output/playwright/polish-viewport-'+width+'.png'});
   for(const target of ['arrival','planner','ready']){await p.goto(base+'/?page='+target,{waitUntil:'domcontentloaded'});await p.locator('#main').waitFor();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1))throw Error(target+' overflow '+width);}
  }
  checks.push('home/arrival/planner/ready at 375/390/768/1440; photography loaded, no horizontal document overflow');
  await p.goto(base,{waitUntil:'domcontentloaded'});await p.getByLabel('Search places',{exact:true}).fill('no-such-shanghai-place');await p.getByRole('heading',{name:'No places found',exact:true}).waitFor();await p.getByRole('button',{name:'Clear filters',exact:false}).click();await p.getByRole('button',{name:'Explore The Bund',exact:true}).click();await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');checks.push('search empty/recovery and existing venue modal');
  await p.goto(base+'/?page=connectivity',{waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Save offline kit',exact:true}).click();await p.getByText('Offline app files checked',{exact:false}).waitFor({timeout:30000});
  const manifest=await p.evaluate(async()=>await(await fetch('/offline-manifest.json')).json());if(manifest.files.filter(f=>f.startsWith('/photography/')&&f.endsWith('.webp')).length!==16)throw Error('Missing offline photo renditions');
  await context.setOffline(true);await p.goto(base,{waitUntil:'domcontentloaded'});await p.locator('.welcome-photo img').evaluate(img=>img.decode());await p.getByRole('button',{name:'Enlarge photograph: A little everyday Shanghai.',exact:true}).click();await p.getByRole('dialog').locator('img').evaluate(img=>img.decode());await p.keyboard.press('Escape');checks.push('all 16 responsive photo assets saved; hero and enlarged photo load offline');
  if(errors.length)throw Error(errors.join('\n'));
 }finally{await context.close();}
 const normal=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),n=await normal.newPage();
 try{
  await n.addInitScript(()=>{window.__motionCalls=[];const original=Element.prototype.animate;Element.prototype.animate=function(frames,options){window.__motionCalls.push({target:this.className,duration:options?.duration});return original.call(this,frames,options);};});
  await n.goto(base,{waitUntil:'domcontentloaded'});await n.getByRole('heading',{name:'China, Closer.',exact:true}).waitFor();await n.waitForTimeout(100);
  if(!await n.evaluate(()=>window.__motionCalls.some(c=>c.target==='welcome-copy')))throw Error('No welcome entrance');
  await n.evaluate(()=>scrollTo(0,600));await n.waitForTimeout(60);const transform=await n.locator('.welcome-photo img').evaluate(e=>getComputedStyle(e).transform);if(transform==='none')throw Error('No bounded image depth effect');
  await n.locator('.micro-discover label').filter({hasText:'History & hidden stories'}).click();await n.waitForTimeout(50);if(!await n.evaluate(()=>window.__motionCalls.some(c=>c.target==='micro-result')))throw Error('No recommendation crossfade');
  await n.emulateMedia({reducedMotion:'reduce'});await n.waitForTimeout(50);if(await n.locator('.welcome-photo img').evaluate(e=>getComputedStyle(e).transform)!=='none')throw Error('Reduced motion failed');if(await n.evaluate(()=>document.getAnimations().some(a=>a.playState==='running')))throw Error('Animation remains running after reduced motion');checks.push('normal welcome/depth/result motion and live reduced-motion cancellation');
 }finally{await normal.close();}
 const broken=await browser.newContext(),b=await broken.newPage();try{await b.route('**/photography/*.webp',r=>r.abort());await b.goto(base,{waitUntil:'domcontentloaded'});await b.locator('.welcome-photo .photo-unavailable').waitFor();await b.getByRole('link',{name:'Find a small adventure'}).click();checks.push('failed photograph has a readable fallback; discovery remains usable');}finally{await broken.close();}
 return {status:'PASS',checks,pageErrors:errors};
})
