import data from '../data/shenzhen.json' with {type:'json'};
export const shenzhen=data;
export const shenzhenPhoto=(id,large=false)=>`/shenzhen-photography/${id}-${large?1600:640}.webp`;
export function shenzhenMap(place){
 const record=data.places.find(p=>p.id===place.id);
 if(!record)throw Error('Unknown Shenzhen place.');
 if(!record.mapLabel)return null;
 return `https://uri.amap.com/search?keyword=${encodeURIComponent('深圳 '+record.mapLabel)}&city=Shenzhen&view=map&callnative=0`;
}
