import {placesForCity} from './bsg-catalog.mjs';
import {buildPlan,validateInput,validateAiOrder} from './planner.mjs';

function cleanTip(value,max=240){
 if(typeof value!=='string')return '';
 return value.replace(/\s+/g,' ').trim().slice(0,max);
}

function parseAdvice(parsed,days){
 const summary=cleanTip(parsed?.summary,260);
 const rawDays=Array.isArray(parsed?.dailyAdvice)?parsed.dailyAdvice:[];
 const dailyAdvice=[];
 for(const item of rawDays){
  if(!item||typeof item!=='object')continue;
  const day=Number(item.day);
  if(!Number.isInteger(day)||day<1||day>days)continue;
  const routeLogic=cleanTip(item.routeLogic,240);
  const diningTip=cleanTip(item.diningTip,240);
  const pitfallTip=cleanTip(item.pitfallTip,240);
  if(routeLogic||diningTip||pitfallTip)dailyAdvice.push({day,routeLogic,diningTip,pitfallTip});
 }
 return summary||dailyAdvice.length?{summary,dailyAdvice}:null;
}

// Additive DeepSeek adapter. Supports Shanghai, Beijing, and Guangzhou with structured daily advice.
export async function generate(input,{apiKey=process.env.DEEPSEEK_API_KEY,model=process.env.DEEPSEEK_MODEL||'deepseek-flash',fetcher=fetch}={}){
 const clean=validateInput(input);
 if(!apiKey?.trim())return buildPlan(clean);
 const cityPlaces=placesForCity(clean.city);
 const plan=buildPlan(clean);
 const plannedDays=plan.days.map((day,index)=>({day:index+1,date:day.date,stops:day.stops.map(stop=>{
  const place=cityPlaces.find(p=>p.id===stop.placeId);
  return {id:place.id,name:place.name,area:place.area,cluster:place.cluster,usualClosedDay:place.closedDay??null};
 })}));
 const plannedIds=plannedDays.flatMap(day=>day.stops.map(stop=>stop.id));
 let response;
 try{
  response=await fetcher('https://api.deepseek.com/chat/completions',{
   method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey.trim()}`},signal:AbortSignal.timeout(25000),
   body:JSON.stringify({model,stream:false,thinking:{type:'disabled'},max_tokens:1200,response_format:{type:'json_object'},
    messages:[{role:'system',content:`You are an expert China travel advisor for ${clean.city}. The supplied daily itinerary is final: do not reorder, add, or suggest any other attractions, even as optional stops. Return JSON with: {"placeIds":[the exact supplied stop IDs in the same order], "summary":"1 concise sentence on this itinerary", "dailyAdvice":[{"day":1,"routeLogic":"why only this day's listed stops flow well in their actual order","diningTip":"generic food pairing near these listed stops (no invented restaurant names or prices)","pitfallTip":"practical crowd, booking, or closure reminder relevant to these stops"}]}. Only mention venues on the relevant day. Never invent visa advice, ticket prices, or opening hours.`},
     {role:'user',content:JSON.stringify({trip:clean,plannedDays})}]
   })
  });
 }catch{throw new Error('DeepSeek could not be reached. Try the curated planner instead.');}
 if(!response.ok)throw new Error('DeepSeek is unavailable. Check your key and account privately, or try the curated planner.');
 let advice=null;
 try{
  const result=await response.json(),choice=result.choices?.[0];
  if(choice?.finish_reason!=='stop'||typeof choice.message?.content!=='string'||!choice.message.content.trim())throw new Error();
  const parsed=JSON.parse(choice.message.content);
  const order=validateAiOrder(parsed.placeIds,clean.city);
  if(order.length!==plannedIds.length||order.some((id,index)=>id!==plannedIds[index]))throw new Error();
  advice=parseAdvice(parsed,clean.days);
 }catch{throw new Error('DeepSeek returned an invalid plan. Try the curated planner instead.');}
 plan.days.forEach((day,index)=>{const dayAdvice=advice?.dailyAdvice?.find(item=>item.day===index+1);if(dayAdvice)day.advice=dayAdvice;});
 if(advice?.summary)plan.aiSummary=advice.summary;
 plan.mode='ai';return plan;
}
