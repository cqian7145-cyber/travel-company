(async (page)=>{
 const context=await page.context().browser().newContext({viewport:{width:390,height:900}});
 const p=await context.newPage();p.setDefaultTimeout(12000);
 try{
  await p.goto('http://127.0.0.1:8787',{waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:'Plan my trip',exact:false}).first().click();
  await p.getByRole('button',{name:'Create my curated itinerary',exact:false}).click();
  await p.getByRole('heading',{name:'3 days in Shanghai'}).waitFor();
  await p.getByRole('button',{name:'Open navigation',exact:true}).click();
  await p.getByRole('button',{name:'Connectivity',exact:true}).click();
  await p.getByRole('button',{name:'Save offline kit',exact:true}).click();
  await p.getByText('Offline app files checked',{exact:false}).waitFor({timeout:30000});
  await context.setOffline(true);await p.reload({waitUntil:'domcontentloaded'});
  await p.getByRole('button',{name:'Open navigation',exact:true}).click();
  await p.getByRole('button',{name:'Connectivity',exact:true}).click();
  await p.getByRole('button',{name:/Airport Wi-Fi Failed/i}).click();
  if(!(await p.locator('main').innerText()).includes('passport'))throw Error('Offline guide missing');
  await p.screenshot({path:'D:/旅游/output/playwright/workers-offline-mobile.png',fullPage:true});
  return {workersRuntime:true,curatedPlanViaBrowser:true,savedOfflineAndReloaded:true,airportGuideOffline:true};
 }finally{await context.close();}
})
