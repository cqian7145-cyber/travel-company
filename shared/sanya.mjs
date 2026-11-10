import data from '../data/sanya.json' with {type:'json'};
export const sanya=data;
export const sanyaPhoto=(id,large=false)=>`/sanya-photography/${id}-${large?1600:640}.webp`;
export function sanyaMap(place){
 if(!data.places.some(p=>p.id===place.id))throw Error('Unknown Sanya place.');
 return `https://uri.amap.com/search?keyword=${encodeURIComponent('三亚 '+place.zh)}&city=Sanya&view=map&callnative=0`;
}
