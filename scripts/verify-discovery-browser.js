(async(page)=>{
 const context=await page.context().browser().newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const p=await context.newPage(),errors=[],checks=[];p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:8789';
 try{
  await p.goto(base,{waitUntil:'domcontentloaded'});
  const finder=p.getByRole('region',{name:'Go beyond sightseeing.'});await finder.waitFor();
  for(const [label,title,path] of [
   ['Everyday life & food','A morning like a Shanghainese','breakfast-observation'],
   ['History & hidden stories','Read a doorway, respectfully','lane-observation'],
   ['People & local perspectives','Notice a shared space','park-observation'],
  ]){
   const radio=finder.getByRole('radio',{name:label,exact:true});await radio.focus();await radio.press('Space');
   for(const time of [45,90]){const t=finder.getByRole('radio',{name:time+' min',exact:true});await t.focus();await t.press('Space');await finder.getByRole('heading',{name:title,exact:true}).waitFor();if(await finder.getByRole('link',{name:'See steps & Chinese card'}).getAttribute('href')!=='/experiences/'+path)throw Error('Wrong experience target');}
   const t=finder.getByRole('radio',{name:'15 min',exact:true});await t.focus();await t.press('Space');await finder.getByText('Start with a story',{exact:true}).waitFor();if(await finder.getByRole('link',{name:'See steps & Chinese card'}).count())throw Error('15 minutes offered a full outing');if(!(await finder.getByRole('link',{name:'Read the story',exact:true}).getAttribute('href')).startsWith('/stories/'))throw Error('Missing reading fallback');
  }
  checks.push('all nine combinations; keyboard radio selection; 15-minute reading fallback');
  await finder.getByText('Local introductions and personal interviews are not available yet.',{exact:false}).waitFor();
  await finder.getByRole('radio',{name:'Everyday life & food',exact:true}).focus();await p.keyboard.press('Space');await finder.getByRole('radio',{name:'45 min',exact:true}).focus();await p.keyboard.press('Space');
  await finder.getByText('Choose a public-facing breakfast shop; no verified vendor is listed.',{exact:false}).waitFor();
  for(const width of [375,390,1440]){
   await p.setViewportSize({width,height:1000});await finder.scrollIntoViewIfNeeded();
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Page overflow at '+width);
   if(await finder.evaluate(e=>e.scrollWidth>e.clientWidth+1))throw Error('Finder overflow at '+width);
   await finder.screenshot({path:'D:/旅游/output/playwright/discovery-'+width+'.png'});
  }
  checks.push('375/390/1440 responsive layouts; uncertainty disclosures');
  await finder.getByRole('link',{name:'See steps & Chinese card'}).click();await p.getByRole('heading',{name:'A morning like a Shanghainese',exact:true}).waitFor();await p.getByRole('heading',{name:'Your mini adventure',exact:true}).waitFor();checks.push('experience handoff to executable steps');
  await p.getByRole('button',{name:'Save offline kit',exact:true}).click();await p.getByText('Offline app files checked',{exact:false}).waitFor({timeout:30000});
  await context.setOffline(true);await p.goto(base,{waitUntil:'domcontentloaded'});await finder.waitFor();
  await finder.getByRole('radio',{name:'History & hidden stories',exact:true}).focus();await p.keyboard.press('Space');await finder.getByRole('heading',{name:'Read a doorway, respectfully',exact:true}).waitFor();
  await finder.getByRole('link',{name:'See steps & Chinese card'}).click();await p.getByRole('heading',{name:'Read a doorway, respectfully',exact:true}).waitFor();checks.push('saved offline homepage matching and experience handoff');
  if(errors.length)throw Error(errors.join('\n'));
  return {status:'PASS',checks,browserErrors:errors,screenshots:'output/playwright/discovery-{375,390,1440}.png'};
 }finally{await context.close();}
})
