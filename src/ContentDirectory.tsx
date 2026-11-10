import {useState} from 'react';
import {cities,cityById} from '../shared/cities.mjs';
import {cultureTypes,selectHighlights} from '../shared/culture-highlights.mjs';
import CultureHighlights from './CultureHighlights';
export default function ContentDirectory(){
 const params=new URLSearchParams(location.search);
 const [city,setCity]=useState(()=>cityById(params.get('city'))?params.get('city')!:'all'),[type,setType]=useState(()=>Object.hasOwn(cultureTypes,params.get('type')||'')?params.get('type')!:'all');
 function filter(nextCity:string,nextType:string){setCity(nextCity);setType(nextType);const url=new URL(location.href);for(const [k,v]of [['city',nextCity],['type',nextType]])v==='all'?url.searchParams.delete(k):url.searchParams.set(k,v);url.searchParams.delete('topic');history.replaceState(null,'',url);}
 const items=selectHighlights({cityId:city,type});
 return <main id="culture-main" className="content-directory"><header className="culture-heading"><p className="eyebrow">CHINA, CLOSER / CULTURE HIGHLIGHTS</p><h1>A place.<br/><em>A little more meaning.</em></h1><p>History, legends and living traditions. Short reads, grounded in sources, connected to the places around you.</p></header><form className="directory-filters" onSubmit={e=>e.preventDefault()}><label>City<select aria-label="City" value={city} onChange={e=>filter(e.target.value,type)}><option value="all">All cities</option>{cities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Culture type<select aria-label="Culture type" value={type} onChange={e=>filter(city,e.target.value)}><option value="all">All types</option>{Object.entries(cultureTypes).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><button type="button" className="text-link" onClick={()=>filter('all','all')}>Clear filters</button></form><p className="directory-count" role="status">{items.length} culture {items.length===1?'highlight':'highlights'}. Read a little; follow your curiosity.</p><CultureHighlights items={items}/>{items.length===0&&city!=='all'&&<a className="text-link" href={'/cities/'+city}>Explore {cityById(city)?.name} photographs →</a>}</main>;
}
