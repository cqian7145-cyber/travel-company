import data from '../data/guiyang.json' with {type:'json'};

export const guiyang = data;
export function guiyangMap(place) {
 if(!data.places.some(item=>item.id===place.id))throw new Error('Unknown Guiyang place.');
 return 'https://uri.amap.com/search?keyword='+encodeURIComponent(place.zh)+'&city=贵阳&view=map&callnative=0';
}
