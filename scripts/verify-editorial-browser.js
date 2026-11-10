(async(page)=>{
 const browser=page.context().browser(),base='http://127.0.0.1:8793',checks=[],errors=[];
 const c=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),p=await c.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(String(e)));
 const assert=(v,label)=>{if(!v)throw Error(label);};
 try{
  await p.goto(base,{waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'China, Closer.',exact:true}).waitFor();await p.evaluate(()=>document.fonts.ready);await p.locator('.welcome-photo img').evaluate(img=>img.decode());
  const fonts=await p.evaluate(()=>({editorial:document.fonts.check('500 84px "Closer Editorial"'),body:document.fonts.check('400 16px "Closer Sans"'),nav:parseFloat(getComputedStyle(document.querySelector('.header-links')).fontSize),paper:getComputedStyle(document.documentElement).getPropertyValue('--paper').trim()}));
  assert(fonts.editorial&&fonts.body&&fonts.nav>=17&&fonts.paper==='#f7f5f0','Font/colour/navigation contract '+JSON.stringify(fonts));
  await p.getByRole('link',{name:'Read the story',exact:true}).click();await p.getByRole('heading',{name:'A doorway between two worlds',exact:true}).waitFor();assert((await p.title()).includes('A doorway between two worlds'),'Story metadata');checks.push('licensed local fonts loaded, readable navigation, warm palette, story invitation opens real story');
  for(const width of [375,390,768,1440]){
   await p.setViewportSize({width,height:1000});
   for(const route of ['','?page=hangzhou','?page=ready','?page=planner','?page=bookings','?page=arrival','?page=speak','?page=connectivity','?page=trip','?page=sos','?page=saved','stories','stories/shanghai-shikumen-doorways','experiences/breakfast-observation']){
    await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});await p.locator('h1').first().waitFor();await p.evaluate(()=>document.fonts.ready);
    const dimensions=await p.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert(dimensions.scroll<=dimensions.width+1,'Overflow '+width+' '+route+' '+JSON.stringify(dimensions));
    if(route===''||route==='?page=hangzhou'||route==='stories'){
     const photo=p.locator(route===''?'.welcome-photo img':route==='stories'?'.culture-photo img':'.hangzhou-cover img').first();await photo.evaluate(img=>img.decode());
     await p.screenshot({path:'D:/旅游/output/playwright/editorial-'+(route===''?'home':route==='stories'?'stories':'hangzhou')+'-'+width+'.png'});
    }
   }
  }checks.push('all tool views plus story/experience routes at 375/390/768/1440 without horizontal overflow');
  await p.setViewportSize({width:390,height:844});await p.goto(base,{waitUntil:'domcontentloaded'});const bottom=p.getByRole('navigation',{name:'Mobile quick navigation'});assert(await bottom.isVisible(),'Mobile navigation absent');await bottom.getByRole('button',{name:'My trip',exact:true}).click();await p.locator('#main h1').first().waitFor();assert(new URL(p.url()).searchParams.get('page')==='planner','Mobile itinerary action');
  await bottom.getByRole('button',{name:'Open travel tools',exact:true}).click();const modal=p.getByRole('dialog');await modal.waitFor();await p.keyboard.press('Escape');assert(await bottom.getByRole('button',{name:'Open travel tools',exact:true}).evaluate(e=>e===document.activeElement),'Bottom tools focus return');checks.push('mobile bottom navigation and tools dialog focus restoration');
  await p.goto(base+'/?page=connectivity',{waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Save offline kit',exact:true}).click();await p.getByText('Offline app files checked',{exact:false}).waitFor({timeout:45000});await c.setOffline(true);
  await p.goto(base,{waitUntil:'domcontentloaded'});await p.locator('.welcome-photo img').evaluate(img=>img.decode());await p.evaluate(()=>document.fonts.ready);assert(await p.evaluate(()=>document.fonts.check('500 62px "Closer Editorial"')),'Offline font');await p.goto(base+'/stories/shanghai-shikumen-doorways',{waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'A doorway between two worlds',exact:true}).waitFor();checks.push('offline kit restores editorial homepage/fonts and standalone story');
  assert(errors.length===0,'Page errors '+errors.join(';'));
 }finally{await c.close();}
 const normal=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),n=await normal.newPage();n.on('pageerror',e=>errors.push(String(e)));
 try{
  await n.goto(base,{waitUntil:'domcontentloaded'});await n.locator('.chapter-hangzhou img').scrollIntoViewIfNeeded();await n.locator('.chapter-hangzhou img').evaluate(img=>img.decode());
  const supported=await n.evaluate(()=>!!document.startViewTransition);
  if(supported){await n.evaluate(()=>{window.__transitionCalls=0;const start=document.startViewTransition.bind(document);document.startViewTransition=(...args)=>{window.__transitionCalls++;window.__cityTransition=start(...args);return window.__cityTransition;};});}
  await n.locator('.chapter-hangzhou').click();await n.getByRole('heading',{name:/A little blue/}).waitFor();
  if(supported){const ready=await n.evaluate(()=>window.__cityTransition.ready.then(()=>true,()=>false));assert(ready,'Native shared-image transition failed');await n.evaluate(()=>window.__cityTransition.finished);assert(await n.evaluate(()=>window.__transitionCalls===1&&!document.documentElement.dataset.sharedTransition),'Transition cleanup');}
  await n.locator('.lake-adventure').scrollIntoViewIfNeeded();await n.waitForTimeout(30);const moving=await n.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length);assert(moving>0,'Scroll reveal was not running before reduced-motion change');await n.emulateMedia({reducedMotion:'reduce'});await n.waitForTimeout(50);assert(await n.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length===0),'Reduced-motion active animations');
  await n.emulateMedia({reducedMotion:'no-preference'});await n.goto(base,{waitUntil:'domcontentloaded'});await n.evaluate(()=>Object.defineProperty(document,'startViewTransition',{value:undefined,configurable:true}));await n.locator('.chapter-hangzhou').click();await n.getByRole('heading',{name:/A little blue/}).waitFor();checks.push('native shared image transition'+(supported?' ready/finished verified':' unavailable on this browser')+'; reduced-motion cancellation and unsupported-API navigation fallback');
 }finally{await normal.close();}
 assert(errors.length===0,'Page errors '+errors.join(';'));return {checks,pageErrors:errors};
})
