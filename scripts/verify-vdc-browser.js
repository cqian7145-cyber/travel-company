(async (page,fixture)=>{
 const context=await page.context().browser().newContext({viewport:{width:1440,height:1000},acceptDownloads:true,reducedMotion:'reduce'});
 const p=await context.newPage();p.setDefaultTimeout(10000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 async function nav(name,width=1440){if(width<900)await p.getByRole('button',{name:'Open navigation',exact:true}).click();await p.getByRole('button',{name,exact:true}).click();}
 const checks=[];
 try{
  await p.clock.install({time:new Date('2026-11-08T04:00:00Z')});
  await context.addInitScript(f=>{if(!localStorage.getItem('vdc-seeded')){localStorage.setItem('closer-plan-v1',JSON.stringify(f.plan));localStorage.setItem('closer-include-rail-v1','true');localStorage.setItem('closer-booking-confirmations-v1',JSON.stringify(Object.fromEntries(f.keys.filter(k=>k.id!=='hotel').map(k=>[k.key,'2026-11-08T03:00:00Z']))));localStorage.setItem('vdc-seeded','true');}},fixture);
  await p.goto('http://127.0.0.1:8788',{waitUntil:'domcontentloaded'});
  await nav('Booking Assistant');if(await p.locator('.booking-state.confirmed').count()!==4)throw Error('Legacy user confirmations lost');checks.push('Four legacy venue/rail confirmations preserved in UI');
  await nav('Explore Shanghai');await p.getByRole('button',{name:'Yu Garden豫园',exact:true}).click();
  const dialog=p.getByRole('dialog');await dialog.getByText('Opening hours',{exact:true}).click();await dialog.getByText('Ticket / information link',{exact:true}).click();
  if(!(await dialog.innerText()).includes('No verified ticket checkout'))throw Error('Unknown checkout misrepresented');
  for(const width of [375,390,1440]){await p.setViewportSize({width,height:1000});const overflow=await dialog.evaluate(e=>e.scrollWidth>e.clientWidth);if(overflow)throw Error('Evidence overflow '+width);await p.screenshot({path:'D:/旅游/output/playwright/vdc-detail-'+width+'.png'});}
  await p.keyboard.press('Tab');if(!(await dialog.evaluate(e=>e.contains(document.activeElement))))throw Error('Focus escaped dialog');await p.keyboard.press('Escape');checks.push('Field statuses, source dates, guide link type and 375/390/1440 responsive detail');
  await p.setViewportSize({width:1440,height:1000});await nav('Connectivity');
  await p.getByRole('button',{name:'Save offline kit',exact:true}).click();await p.getByText('Offline app files checked',{exact:false}).waitFor({timeout:30000});
  let info=await p.getByLabel('Offline data version',{exact:true}).innerText();if(!info.includes('2026-11-08.vdc1')||info.includes('Saved offline at: Not recorded'))throw Error('Offline metadata absent');
  await p.route('**/offline-manifest.json',r=>r.fulfill({json:{dataVersion:'future-test-version'}}));await p.getByRole('button',{name:'Check data version online',exact:true}).click();await p.getByText('Newer or different data is available.',{exact:false}).waitFor();await p.unroute('**/offline-manifest.json');checks.push('Online version mismatch warning');
  const download=p.waitForEvent('download');await p.getByRole('button',{name:/Download HTML backup/}).click();await(await download).saveAs('D:/旅游/output/playwright/vdc-offline.html');
  await p.evaluate(async()=>{for(const name of await caches.keys())if(name.startsWith('china-closer-offline-'))await(await caches.open(name)).delete('/__china_closer_offline_metadata__');});
  await nav('Speak Local');if(!(await p.getByLabel('Offline data version',{exact:true}).innerText()).includes('Saved data: Unknown'))throw Error('Legacy metadata treated as current');checks.push('Old cache without data metadata is unknown');
  await p.getByRole('button',{name:'Refresh offline kit',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.offline-data-info')?.textContent.includes('Saved offline at: 2026'));
  await p.getByLabel('Complete Chinese hotel address').fill('上海市黄浦区测试路123号');await p.getByLabel('I checked this complete Chinese address').check();
  await p.clock.setSystemTime(new Date('2026-11-15T04:00:00Z'));await context.setOffline(true);await p.reload({waitUntil:'domcontentloaded'});await nav('Speak Local');
  await p.getByText('Some venue evidence is due for review.',{exact:false}).waitFor();await p.getByRole('button',{name:'Show driver',exact:true}).click();if(!(await p.getByRole('dialog').innerText()).includes('测试路123号'))throw Error('Expired evidence blocked driver address');await p.keyboard.press('Escape');
  await nav('Booking Assistant');if(await p.locator('.booking-state.confirmed').count()!==3)throw Error('Overdue museum evidence did not reset only its confirmation');checks.push('Expired offline evidence warning; hotel remains usable; only affected confirmation reset');
  await p.goto('file:///D:/%E6%97%85%E6%B8%B8/output/playwright/vdc-offline.html',{waitUntil:'domcontentloaded'});const body=await p.locator('body').innerText();if(!body.includes('Data version: 2026-11-08.vdc1')||!body.includes('cannot detect future updates'))throw Error('Standalone metadata absent');checks.push('Script-free standalone backup opens offline with version/review warnings');
  if(errors.length)throw Error(errors.join('; '));return{checks,pageErrors:errors};
 }finally{await context.close();}
})
