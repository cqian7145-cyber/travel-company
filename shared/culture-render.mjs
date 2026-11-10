import {renderSiteHeader,renderMobileNavigation} from './site-navigation.mjs';
import {renderDepartureChecks} from './discovery-render.mjs';
import {stories,experiences,cultureVersion} from './story-catalog.mjs';
import {dataVersion} from './verification.mjs';
import {highlights,highlightById,highlightPath} from './culture-highlights.mjs';
import {renderHighlightCard,renderHighlightDetail,htmlEscape} from './highlight-render.mjs';
export const escape=htmlEscape;
const e=escape;
export function routeMeta(route){
 const item=route.kind==='story'?highlightById(route.item.id):route.item;
 return {title:(item?.title||(route.kind==='culture'?'Culture Highlights · A place, a little more meaning':'Page not found'))+' | China, Closer',description:item?.summary||'Discover the history, legends, literary memory and living traditions behind places in China. Short reads with sources, starting with West Lake.',canonical:route.kind==='story'?highlightPath(item):route.path};
}
export function renderPracticalGuide(x,interactive=false){
 const story=stories.find(s=>s.id===x.storyIds[0]),highlight=highlightById(story?.id);
 return `<article class="culture-article practical-guide"><header><p class="eyebrow">SHANGHAI / OPTIONAL VISIT GUIDE</p><h1>${e(x.title)}</h1><p class="culture-deck">A few practical notes, if you choose to visit. No task, completion report or reflection is required.</p>${highlight?`<a class="text-link" href="${highlightPath(highlight)}">Read the culture highlight →</a>`:''}</header><section><h2>At your own pace</h2><p>${e(x.alternative)}</p><p>${e(x.costNature)} · ${e(x.duration)} (editorial estimate)</p><ul>${[...x.conditions,...x.risks].map(t=>`<li>${e(t)}</li>`).join('')}</ul>${x.riskType==='self_selected_food'?'<p class="culture-warning">Confirm ingredients, sauces and cross-contact with staff. If they cannot confirm your requirements, skip eating. This is not a food-safety guarantee.</p>':''}</section><details class="highlight-visit"><summary>Current travel facts &amp; alternatives</summary>${renderDepartureChecks(x)}</details><section class="experience-phrase"><h2>A useful Chinese phrase</h2><p lang="zh-Hans">${e(x.phrase.zh)}</p><p>${e(x.phrase.pinyin)}</p><p>${e(x.phrase.en)}</p>${interactive?`<button type="button" class="outline-button" data-culture-action="speak" data-id="${e(x.id)}">Show large Chinese card</button><button type="button" class="text-link" data-culture-action="copy" data-id="${e(x.id)}">Copy Chinese</button>`:''}</section>${interactive?x.relatedVenueIds.map(id=>`<button class="outline-button" type="button" data-culture-action="plan" data-id="${e(id)}">Add this place to my itinerary</button>`).join(''):''}</article>`;
}
export function renderCultureBody(route,state={saved:[],steps:{},notes:{}},interactive=false,shell=true){
 let body='';
 if(route.kind==='culture')body=`<section class="culture-heading"><p class="eyebrow">CHINA, CLOSER / CULTURE HIGHLIGHTS</p><h1>A place.<br><em>A little more meaning.</em></h1><p>History, legends and living traditions. Short reads, grounded in sources, connected to the places around you.</p></section><section class="highlights-grid" aria-label="Culture highlights">${highlights.map(x=>renderHighlightCard(x,state.saved.includes(x.id),interactive)).join('')}</section>`;
 else if(route.kind==='highlight'||route.kind==='story'){const x=route.kind==='story'?highlightById(route.item.id):route.item;body=renderHighlightDetail(x,state.saved.includes(x.id),interactive);}
 else if(route.kind==='experience')body=renderPracticalGuide(route.item,interactive);
 else body='<section class="culture-heading"><h1>This highlight is not here.</h1><p>The link may be incomplete, or this content is not published.</p><a href="/culture">Explore culture highlights</a></section>';
 return (shell?renderSiteHeader('/culture'):'')+`<main id="culture-main">${body}</main><footer class="culture-footer"><span>China, Closer · ${e(cultureVersion.version)}</span><span>Travel facts: ${e(dataVersion.version)} · Cultural sources and current access are reviewed separately.</span><a href="/?tools=open">Travel Tools</a></footer>`+(shell?renderMobileNavigation('/culture'):'');
}
