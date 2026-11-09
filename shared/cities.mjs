export const cities=[
 {id:'shanghai',name:'Shanghai',zh:'上海',tagline:'Old lanes. Modern lives. Stories of change.',intro:'Find an experience in everyday life, read the story behind a place, and use the practical tools when you need them.',image:'/photography/shanghai-greeting-1600.webp',imageAlt:'Red-brick Shanghai street corner, supplied city inspiration',travelScope:'Shanghai itinerary planning, Trip Mode and airport arrival guides are available. Opening and booking facts still require field-specific checks.'},
 {id:'hangzhou',name:'Hangzhou',zh:'杭州',tagline:'Lake landscapes. Tea traditions. Everyday poetry.',intro:'A slower rhythm, a deeper story. Begin with the curated place pilot; reviewed stories and Experience Journeys will appear here when they are ready.',image:'/hangzhou-photography/lake-blue-1600.webp',imageAlt:'Blue evening light over a lake, supplied Hangzhou inspiration',travelScope:'Hangzhou currently offers a curated place pilot. The itinerary planner and airport arrival guides cover Shanghai; they do not create a Hangzhou trip.'},
 {id:'guiyang',name:'Guiyang',zh:'贵阳',tagline:'River light. Mountain greens. Seven ways into the city.',intro:'A first photo-led look at Guiyang, using the seven places identified with the supplied photographs.',image:'/guiyang-photography/eco-center-1600.webp',imageAlt:'Green urban park and bridge with Guiyang skyline, place label supplied by the contributor',travelScope:'Guiyang currently offers a photo-led place pilot only. Place labels follow the contributor’s photo order; exact locations, entrances, hours, admission, reservations and transit details are not independently verified.'}
 ,{id:'sanya',name:'Sanya',zh:'三亚',tagline:'Sea blues. Palm shadows. A different rhythm.',intro:'A photo-led first look at eight destinations, with multiple views of the same place grouped together.',image:'/sanya-photography/sanya-cover-1600.webp',imageAlt:'Sanya waterfront at sunset, supplied city cover',travelScope:'Sanya currently offers a photo discovery collection. Exact photo locations, access, opening hours, admission, ferry services and reservations are not independently verified. Sanya itinerary planning is not available yet.'}
];
export const cityById=id=>cities.find(c=>c.id===id);
export function cityRoute(pathname){
 const path=pathname.replace(/\/index\.html$/,'').replace(/\/+$/,'')||'/';
 if(path==='/cities')return {kind:'cities',path,file:'/cities/index.html'};
 if(path.startsWith('/cities/')){const city=cityById(path.slice(8));return city?{kind:'city',city,path,file:path+'/index.html'}:{kind:'not-found',path};}
 return null;
}
export const cityRoutes=()=>['/cities',...cities.map(c=>'/cities/'+c.id)];
export function filterCityContent(items,{cityId='all',topic='all'}={}){
 if(cityId!=='all'&&!cityById(cityId))return [];
 return items.filter(item=>item.status==='published'&&(cityId==='all'||item.cityId===cityId)&&(topic==='all'||(item.category||item.topic)===topic));
}
