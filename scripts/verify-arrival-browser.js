(async (page) => {
 const ctx=await page.context().browser().newContext({viewport:{width:1440,height:1000},acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
 const p=await ctx.newPage();p.setDefaultTimeout(10000);
 const checks=[];
 try {
 await p.goto('http://localhost:5175',{waitUntil:'domcontentloaded'});
 await p.getByRole('button',{name:'First 90 Minutes',exact:true}).click();
 await p.getByLabel('Chinese hotel name (optional)').fill('测试酒店');
 await p.getByLabel('Complete Chinese hotel address').fill('上海市黄浦区测试路123号');
 await p.getByLabel('I checked this complete Chinese address').check();
 await p.locator('select').nth(1).selectOption('T1');
 await p.locator('select').nth(2).selectOption('late');
 await p.getByRole('button',{name:'Build my arrival card'}).click();
 let t=await p.locator('main').innerText();if(!t.includes('Gate 12')||t.includes('¥180'))throw Error('Arrival boundary');checks.push('late arrival / terminal / no arbitrary hotel fare');
 await p.getByRole('button',{name:'Show driver',exact:true}).click();
 if(!(await p.getByRole('dialog').innerText()).includes('测试路123号'))throw Error('driver');
 await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Save offline kit',exact:true}).click();
 await p.getByText('Offline app files checked',{exact:false}).waitFor({timeout:30000});
 const cache=await p.evaluate(async()=>{const keys=await caches.keys();return(await Promise.all(keys.filter(k=>k.startsWith('china-closer')).map(async k=>(await(await caches.open(k)).keys()).map(r=>r.url)))).flat();});
 if(cache.filter(u=>!u.endsWith('/__china_closer_offline_metadata__')).length!==4||cache.some(u=>u.includes('/api/')||!u.startsWith('http://localhost:5175/')))throw Error('Cache boundary');checks.push('four local app files and offline metadata cached; no API/remote files');
 const dl=p.waitForEvent('download');await p.getByRole('button',{name:'Download HTML backup',exact:false}).click();await(await dl).saveAs('D:/旅游/output/playwright/china-closer-offline.html');
 await p.screenshot({path:'D:/旅游/output/playwright/arrival-desktop.png',fullPage:true});
 await ctx.setOffline(true);await p.reload({waitUntil:'domcontentloaded'});
 await p.getByRole('button',{name:'Connectivity',exact:true}).click();
 await p.getByRole('button',{name:/Airport Wi-Fi Failed/i}).click();
 if(!(await p.locator('main').innerText()).includes('passport'))throw Error('Offline guide');checks.push('offline reload and airport Wi-Fi guide');
 await p.getByRole('button',{name:'Speak Local',exact:true}).click();
 if(await p.locator('.phrase-card').count()!==24)throw Error('24 cards');
 await p.getByRole('button',{name:'Show driver',exact:true}).click();
 if(!(await p.getByRole('dialog').innerText()).includes('测试路123号'))throw Error('Offline driver');
 await p.getByRole('button',{name:'Copy Chinese',exact:true}).click();
 if(!(await p.evaluate(()=>navigator.clipboard.readText())).includes('测试路123号'))throw Error('Clipboard');
 await p.keyboard.press('Escape');checks.push('24 cards; offline personalized full-screen card; clipboard');
 await p.goto('file:///D:/%E6%97%85%E6%B8%B8/output/playwright/china-closer-offline.html',{waitUntil:'domcontentloaded'});
 t=await p.locator('body').innerText();if(!t.includes('测试路123号')||!t.includes('passport'))throw Error('Backup content');checks.push('downloaded standalone HTML opens offline with personal details');
 return {checks,cache};
 }finally{await ctx.close();}
})
