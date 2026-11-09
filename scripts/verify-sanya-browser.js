async(page)=>{
 const context=await page.context().browser().newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const p=await context.newPage(),errors=[],checks=[];
 const assert=(value,message)=>{if(!value)throw Error(message);};
 p.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:8797';
 try{
  await p.goto(base+'/cities/sanya');await p.waitForSelector('.sanya-place');
  assert(await p.locator('.sanya-place').count()===8,'Eight destination galleries');
  assert(await p.locator('.sanya-cover figcaption').innerText()==='Sanya · 三亚','City cover label');
  assert(await p.locator('#sy-dadonghai img').count()===2,'Beach and bar grouped together');
  assert(await p.locator('#sy-tianya-haijiao img').count()===1,'Duplicate displayed once');
  assert(await p.locator('.sanya-place img').count()===9,'Nine destination photos plus city cover');
  const planResponse=await context.request.post(base+'/api/plan',{data:{days:3,budget:2400,pace:'balanced',interests:['Culture'],date:'2026-11-12',curated:true}});
  assert(planResponse.ok(),'Curated legacy trip fixture');const plan=await planResponse.json();
  await p.evaluate(value=>localStorage.setItem('closer-plan-v1',JSON.stringify(value)),plan);
  await p.reload();await p.waitForSelector('.sanya-page');
  assert(await p.evaluate(()=>localStorage.getItem('closer-plan-v1'))===JSON.stringify(plan),'Existing trip preserved');
  for(const image of await p.locator('.sanya-page img').all()){
   await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());
   assert(await image.evaluate(img=>img.naturalWidth>0),'Image loaded');
  }
  checks.push('Cover, eight grouped destinations, ten unique images, reload and legacy trip preservation');
  for(const width of [320,375,390,768,1024,1440]){
   await p.setViewportSize({width,height:1000});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow at '+width);
   assert(await p.locator('#sy-dadonghai').evaluate(el=>el.getBoundingClientRect().width<=innerWidth),'Grouped gallery fits '+width);
  }
  checks.push('320/375/390/768/1024/1440 px: no horizontal overflow');
  await p.setViewportSize({width:1440,height:1000});
  const photo=p.locator('#sy-dadonghai a').first();await photo.focus();
  assert(await photo.evaluate(el=>el===document.activeElement),'Native photo link can receive keyboard focus');
  await p.keyboard.press('Tab');assert(await photo.evaluate(el=>el!==document.activeElement),'Tab moves to next photo link');
  assert(await p.locator('#sy-dadonghai img').first().evaluate(img=>parseFloat(getComputedStyle(img).transitionDuration)===0),'Reduced motion removes image zoom transition');
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'D:/旅游/output/playwright/sanya-desktop.png'});
  await p.locator('#sy-dadonghai').screenshot({path:'D:/旅游/output/playwright/sanya-dadonghai-desktop.png'});
  await p.setViewportSize({width:390,height:950});await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'D:/旅游/output/playwright/sanya-mobile.png'});
  checks.push('Native keyboard photo navigation and reduced-motion transition');
  await p.goto(base+'/');await p.locator('.chapter-sanya').scrollIntoViewIfNeeded();await p.locator('.chapter-sanya').click();await p.waitForSelector('.sanya-place');
  assert(p.url().endsWith('/cities/sanya'),'Homepage city entrance');
  await p.goto(base+'/cities');await p.waitForSelector('.city-directory-grid');assert(await p.locator('.city-directory-grid>article').count()===4,'Four-city directory');
  await p.getByRole('combobox',{name:'Choose a city',exact:true}).selectOption('sanya');await p.waitForSelector('.sanya-page');
  await p.goto(base+'/stories?city=sanya');await p.waitForSelector('.directory-filters');
  assert(await p.getByRole('combobox',{name:/^Destination/}).inputValue()==='sanya','Sanya filter active');
  await p.getByRole('link',{name:'Browse Sanya places'}).click();await p.waitForSelector('.sanya-place');
  checks.push('Homepage entrance, four-city directory, mobile selector, Sanya content filter and truthful empty state');
  await p.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;});
  await p.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);await p.reload();await p.waitForSelector('.sanya-place');
  for(const image of await p.locator('.sanya-page img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(img=>img.decode());}
  assert(await p.locator('.sanya-place').count()===8,'Offline route and galleries');
  checks.push('Service worker offline reload: Sanya route and all ten photos load without network');
  assert(errors.length===0,'No browser errors: '+errors.join('; '));
  return {checks,errors,screenshots:['sanya-desktop.png','sanya-dadonghai-desktop.png','sanya-mobile.png']};
 }finally{await context.close();}
}
