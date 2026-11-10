async (page)=>{
 const assert={ok:(v,m)=>{if(!v)throw Error(m||'Assertion failed');},equal:(a,b,m)=>{if(a!==b)throw Error((m||'Mismatch')+': '+a+' != '+b);}};
 const base='http://127.0.0.1:8798',out='D:/旅游/output/playwright/',checks=[],errors=[];
 const browser=page.context().browser(),context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(10000);
 const go=async path=>{await p.goto(base+path,{waitUntil:'domcontentloaded'});await p.waitForSelector('h1');};
 try{
 const response=await context.request.post(base+'/api/plan',{data:{days:3,budget:2400,pace:'balanced',interests:['Culture'],date:'2026-11-15',curated:true}});assert.equal(response.status(),200);const plan=await response.json();
 const fixture={'closer-culture-v1':{saved:['shanghai-shikumen-001'],steps:{'lane-observation:0':true},notes:{'shanghai-shikumen-001':'My earlier private note'}},'closer-experience-journeys-v1':{'lane-observation':{phase:'paused',observation:0,report:null,startedAt:'2026-11-09T08:00:00Z',updatedAt:'2026-11-09T08:00:00Z'}},'closer-plan-v1':plan,'closer-booking-confirmations-v1':{fixture:'2026-11-09T08:00:00Z'},'closer-hangzhou-saved-v1':['hz-west-lake'],'closer-saved-v1':['bund']};
 await context.addInitScript(fixture=>{if(!localStorage.getItem('__culture4_fixture__')){for(const[k,v]of Object.entries(fixture))localStorage.setItem(k,JSON.stringify(v));localStorage.setItem('__culture4_fixture__','true');}},fixture);
 await go('/cities/hangzhou');
 assert.equal(await p.locator('.highlight-card').count(),4);assert.equal((await p.locator('.header-links').innerText()).replace(/\s+/g,' ').trim(),'Discover Cities Culture My Trip');
 const before=await p.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(fixture));
 await p.getByRole('button',{name:'Save The poet who reshaped a lake',exact:true}).click();
 await p.locator('a[href="/culture/su-causeway"]').first().click();await p.waitForSelector('.highlight-detail');
 await p.getByText('Read more · 1 min',{exact:true}).click();await p.getByText('Sources & editorial context',{exact:true}).click();
 assert.equal(await p.locator('.highlight-more').getAttribute('open'),'');assert.equal(await p.locator('.highlight-sources').getAttribute('open'),'');
 await p.getByRole('button',{name:'Unsave The poet who reshaped a lake',exact:true}).click();await p.getByRole('button',{name:'Save The poet who reshaped a lake',exact:true}).click();
 assert.equal(await p.locator('.highlight-more').getAttribute('open'),'');assert.equal(await p.locator('.highlight-sources').getAttribute('open'),'');
 await p.evaluate(()=>Object.defineProperty(navigator,'share',{value:undefined,configurable:true}));
 await p.getByRole('button',{name:'Share this highlight'}).click();assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),base+'/culture/su-causeway');
 await p.evaluate(()=>Object.defineProperty(navigator,'share',{value:async data=>{window.__sharedHighlight=data;},configurable:true}));
 await p.getByRole('button',{name:'Share this highlight'}).click();assert.equal(await p.evaluate(()=>window.__sharedHighlight.url),base+'/culture/su-causeway');
 await p.getByText('Place & travel information',{exact:true}).click();await p.getByRole('button',{name:'Show large Chinese card'}).click();await p.getByRole('dialog').waitFor();assert.ok((await p.getByRole('dialog').innerText()).includes('苏堤'));await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Copy Chinese',exact:true}).click();assert.ok((await p.evaluate(()=>navigator.clipboard.readText())).includes('苏堤'));
 await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:out+'culture4-detail-desktop.png'});
 checks.push('Four Hangzhou cards; open reading/source details survive saving; clipboard fallback and mocked native-share handoff; Chinese copy and modal Escape');
 await go('/culture?city=hangzhou');assert.equal(await p.locator('.highlight-card').count(),4);
 await p.getByLabel('Culture type',{exact:true}).selectOption('legend');assert.equal(await p.locator('.highlight-card').count(),1);await p.reload({waitUntil:'domcontentloaded'});await p.waitForSelector('.highlight-card');assert.equal(await p.locator('.highlight-card').count(),1);
 await p.getByLabel('City',{exact:true}).selectOption('sanya');assert.equal(await p.locator('.highlight-card').count(),0);assert.ok((await p.locator('.discovery-empty').innerText()).includes('photographs'));
 await go('/voices?city=hangzhou');assert.ok(p.url().includes('/culture?city=hangzhou'));assert.equal(await p.locator('.highlight-card').count(),4);
 await go('/stories/shanghai-shikumen-doorways');assert.equal(await p.locator('h1').innerText(),'A doorway between two worlds');await p.getByText('Read more · 2 min',{exact:true}).click();assert.equal(await p.getByText('Earlier long-form edition',{exact:true}).count(),1);
 await go('/experiences/lane-observation');assert.equal(await p.locator('.experience-session,textarea,input[type=checkbox]').count(),0);await p.getByRole('button',{name:'Show large Chinese card'}).click();await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');
 await go('/?page=saved');await p.getByRole('button',{name:'Culture',exact:true}).click();assert.equal(await p.locator('.highlight-card').count(),2);await p.getByText('Earlier private notes (1)',{exact:true}).click();assert.ok((await p.locator('.earlier-notes').innerText()).includes('My earlier private note'));
 const after=await p.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(fixture));assert.equal(JSON.stringify(after),JSON.stringify(before),'Legacy data preservation');
 checks.push('Filter URL persistence, genuine Sanya empty state, Voices redirect, old article and practical guide URLs, imported saved stories and untouched legacy notes/trip/bookings/progress');
 await go('/');assert.equal(await p.locator('.home-culture .highlight-card').count(),4);assert.equal(await p.locator('.micro-adventure-finder,.story-invitation').count(),0);
 await p.getByRole('button',{name:'Open navigation',exact:true}).click();assert.equal(await p.getByRole('dialog').locator('button.tool-choice').count(),10);assert.equal(await p.getByRole('dialog').locator('.travel-tool-group').count(),4);assert.equal(await p.getByRole('dialog').getByRole('link',{name:'Offline kit & backup'}).count(),1);await p.keyboard.press('Escape');
 for(const width of [320,375,390,768,1440]){
  await p.setViewportSize({width,height:950});
  for(const path of ['/','/cities/hangzhou','/culture?city=hangzhou','/culture/white-snake','/cities/guiyang','/cities/sanya','/trip']){
   await go(path);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path+' overflow at '+width);
   assert.equal(await p.locator('h1').count(),1,path+' h1 count');
  }
  if(width<1101)assert.equal(await p.locator('.mobile-bottom-nav>a:visible').count(),4);
 }
 await p.setViewportSize({width:1440,height:1000});await go('/cities/hangzhou');await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:out+'culture4-hangzhou-top.png'});
 await p.locator('#hangzhou-culture').scrollIntoViewIfNeeded();await p.screenshot({path:out+'culture4-hangzhou-cards.png'});
 await p.setViewportSize({width:390,height:844});await go('/culture/white-snake');await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:out+'culture4-mobile.png'});
 assert.equal(await p.locator('.highlight-photo img').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 checks.push('All ten tools plus offline entry; no overflow at 320/375/390/768/1440 on seven key routes; mobile four-link navigation and reduced motion');
 await p.getByRole('button',{name:'Save offline kit',exact:true}).click();await p.locator('.offline-status').filter({hasText:'Offline app files checked'}).waitFor({timeout:30000});
 await context.setOffline(true);
 for(const path of ['/cities/hangzhou','/culture/white-snake','/culture/su-causeway','/culture/longjing-tea','/stories/shanghai-shikumen-doorways','/voices']){
  await go(path);assert.ok((await p.locator('h1').innerText()).length>0,path+' offline');
 }
 await go('/culture/white-snake');await p.getByText('Sources & editorial context',{exact:true}).click();assert.ok((await p.locator('.highlight-sources').innerText()).includes('2006'));
 await p.locator('.highlight-photo img').evaluate(img=>img.decode());
 checks.push('Explicit offline save, network disabled: new cards, legacy article, city page, alias redirect, source text and local photograph');
 await context.setOffline(false);
 const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 try{const n=await noJs.newPage();await n.goto(base+'/culture/white-snake');assert.equal(await n.locator('h1').count(),1);assert.equal(await n.locator('button[data-highlight-action]').count(),0);await n.getByText('Sources & editorial context',{exact:true}).click();assert.ok((await n.locator('.highlight-sources').innerText()).includes('2006'));await n.goto(base+'/cities/hangzhou');assert.equal(await n.locator('.highlight-card').count(),4);}finally{await noJs.close();}
 checks.push('JavaScript disabled: snapshots, native reading/source disclosures and city links remain available');
 assert.equal(errors.length,0,'Browser page errors');return {checks,errors};
 }finally{await context.close();}
}
