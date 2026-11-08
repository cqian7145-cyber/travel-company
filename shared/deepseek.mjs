import {places} from './catalog.mjs';
import {buildPlan,validateInput,validateAiOrder} from './planner.mjs';

// Additive DeepSeek adapter. The original OpenAI server is intentionally untouched.
export async function generate(input,{apiKey=process.env.DEEPSEEK_API_KEY,model=process.env.DEEPSEEK_MODEL||'deepseek-flash',fetcher=fetch}={}){
 const clean=validateInput(input);
 if(!apiKey?.trim())return buildPlan(clean);
 let response;
 try{
  response=await fetcher('https://api.deepseek.com/chat/completions',{
   method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${apiKey.trim()}`},signal:AbortSignal.timeout(25000),
   body:JSON.stringify({model,stream:false,thinking:{type:'disabled'},max_tokens:700,response_format:{type:'json_object'},
    messages:[{role:'system',content:'Rank the supplied Shanghai place IDs for this traveler. Consider interests, budget, pace and neighborhood proximity. Return only IDs from the catalog as JSON, for example {"placeIds":["museum"]}. Never invent travel facts, visa advice, prices or opening hours.'},
     {role:'user',content:JSON.stringify({trip:clean,places:places.map(({id,tags,area,cost})=>({id,tags,area,estimatedAdmission:cost}))})}]
   })
  });
 }catch{throw new Error('DeepSeek could not be reached. Try the curated planner instead.');}
 if(!response.ok)throw new Error('DeepSeek is unavailable. Check your key and account privately, or try the curated planner.');
 let order;
 try{
  const result=await response.json(),choice=result.choices?.[0];
  if(choice?.finish_reason!=='stop'||typeof choice.message?.content!=='string'||!choice.message.content.trim())throw new Error();
  order=validateAiOrder(JSON.parse(choice.message.content).placeIds);
 }catch{throw new Error('DeepSeek returned an invalid plan. Try the curated planner instead.');}
 const plan=buildPlan(clean,order);plan.mode='ai';return plan;
}
