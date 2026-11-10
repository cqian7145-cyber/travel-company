import {highlightsForPlace,highlightPath,cultureTypes} from '../shared/culture-highlights.mjs';
export function RelatedCultureLinks({placeId}:{placeId:string}){const items=highlightsForPlace(placeId);if(!items.length)return null;return <section className="venue-story-links"><p className="eyebrow">THE CULTURE BEHIND THIS PLACE</p><h3>A little context changes the view.</h3>{items.map(x=><a href={highlightPath(x)} key={x.id}>{x.title} · {cultureTypes[x.type as keyof typeof cultureTypes]} →</a>)}</section>;}
export default RelatedCultureLinks;
