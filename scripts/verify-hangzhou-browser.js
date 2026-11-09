(async(page)=>{
 const browser=page.context().browser(),context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),p=await context.newPage(),checks=[],errors=[];
 const base='http://127.0.0.1:8791';p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(String(e)));
 const assert=(value,label)=>{if(!value)throw Error(label);};
 try{
  await p.goto(base,{waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:'China, Closer.',exact:true}).waitFor();
  assert(await p.locator('.header-links').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=17),'Desktop navigation is still too small');
  await p.getByRole('link',{name:/Discover Hangzhou/}).click();await p.getByRole('heading',{name:/A little blue/}).waitFor();
  await p.getByRole('button',{name:'Save West Lake',exact:true}).click();await p.reload({waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Unsave West Lake',exact:true}).waitFor();
  await p.getByRole('button',{name:'Saved in Hangzhou (1)',exact:true}).click();assert(await p.locator('.hz-place').count()===1,'Saved filter');await p.getByRole('button',{name:'Show all places',exact:true}).click();
  await p.getByRole('button',{name:'Explore West Lake',exact:true}).click();const dialog=p.getByRole('dialog');await dialog.waitFor();
  assert(await dialog.getByText('Not verified',{exact:true}).count()===5,'Unknown operations must be visible');
  const map=dialog.getByRole('link',{name:/Search area in Amap/});assert((await map.getAttribute('href')).includes('city=杭州'),'Map city');
  await dialog.getByRole('button',{name:/Show Chinese/}).click();await dialog.getByRole('heading',{name:'您好，请问怎么去这里？'}).waitFor();
  await p.keyboard.press('Escape');assert(await p.getByRole('dialog').count()===0,'Chinese card dismissal');
  await p.getByRole('button',{name:'Tea culture',exact:true}).click();assert(await p.locator('.hz-place').count()===1,'Category filter');await p.getByRole('button',{name:'Explore Longjing village',exact:true}).waitFor();await p.getByRole('button',{name:'All places',exact:true}).click();
  await p.getByRole('button',{name:/Enlarge Hangzhou inspiration: Take the leafy way/}).click();await p.getByRole('dialog').getByRole('button',{name:'Next',exact:true}).click();await p.getByRole('dialog').getByRole('heading',{name:'Beishan Street, in afternoon light.'}).waitFor();await p.keyboard.press('Escape');
  const menu=p.getByRole('button',{name:'Open navigation',exact:true});await menu.focus();await p.keyboard.press('Enter');const nav=p.getByRole('dialog');
  assert(await nav.getByRole('button',{name:'Discover Hangzhou',exact:true}).count()===1,'City menu entry');assert(await nav.locator('.nav-item').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=17),'Drawer text size');
  for(let i=0;i<16;i++){await p.keyboard.press('Tab');assert(await nav.evaluate(e=>e.contains(document.activeElement)),'Focus escaped menu');}await p.keyboard.press('Escape');assert(await menu.evaluate(e=>e===document.activeElement),'Focus not restored');checks.push('destination entry, persisted bookmarks, filters, unknown facts, Chinese card, map, gallery, keyboard navigation');
  for(const width of [375,390,768,1440]){
   await p.setViewportSize({width,height:1000});
   for(const route of ['','?page=hangzhou','?page=ready','?page=planner','?page=bookings','?page=arrival','?page=speak','?page=connectivity','?page=trip','?page=sos','?page=saved']){
    await p.goto(base+'/'+route,{waitUntil:'domcontentloaded'});await p.locator('#main').waitFor();await p.waitForTimeout(80);
    const sizes=await p.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));assert(sizes.scroll<=sizes.width+1,'Overflow '+width+' '+route+' '+JSON.stringify(sizes));
    if(route==='?page=hangzhou'||route===''){await p.screenshot({path:'D:/旅游/output/playwright/colour-'+(route?'hangzhou':'home')+'-'+width+'.png'});}
   }
  }checks.push('home/Hangzhou/all ten travel views at 375/390/768/1440 without horizontal overflow');
  await p.goto(base+'/?page=connectivity',{waitUntil:'domcontentloaded'});await p.getByRole('button',{name:'Save offline kit',exact:true}).click();await p.getByText('Offline app files checked',{exact:false}).waitFor({timeout:60000});
  await context.setOffline(true);await p.goto(base+'/?page=hangzhou',{waitUntil:'domcontentloaded'});await p.getByRole('heading',{name:/A little blue/}).waitFor();await p.locator('.hangzhou-cover img').evaluate(img=>img.decode());await p.getByRole('button',{name:'Explore West Lake',exact:true}).click();await p.getByRole('dialog').getByText('Not verified',{exact:true}).first().waitFor();checks.push('offline kit restores Hangzhou, hero image and operational-status details');
  await context.setOffline(false);await p.goto(base+'/?page=hangzhou',{waitUntil:'domcontentloaded'});assert((await p.request.get(base+'/api/status')).ok(),'API status');
  assert(errors.length===0,'Page errors: '+errors.join(';'));return {checks,pageErrors:errors};
 }finally{await context.close();}
})
