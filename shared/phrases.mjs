import {places} from './catalog.mjs';
export const phraseGroups=['All scenarios','Taxi','Dining','Station','Hotel','Shopping','Directions'];
export const phraseCards=[
 {id:'taxi-hotel',group:'Taxi',title:'Show driver · my hotel',en:'Driver, please take me to this address.',zh:'师傅，请送我到这个地址。',needs:['hotel'],kind:'hotel'},
 {id:'taxi-place',group:'Taxi',title:'Show driver · itinerary stop',en:'Please take me to this destination.',zh:'师傅，请送我到这个地点。',needs:['destination'],kind:'destination'},
 {id:'taxi-meter',group:'Taxi',title:'Use the meter',en:'Please use the meter. How can I pay?',zh:'师傅，请打表计费。请问可以使用哪些付款方式？',needs:[],kind:'plain'},
 {id:'taxi-receipt',group:'Taxi',title:'A taxi receipt',en:'Could I have a taxi receipt, please?',zh:'师傅，请给我出租车发票，谢谢。',needs:[],kind:'plain'},
 {id:'peanut',group:'Dining',title:'Peanut allergy',en:'I am allergic to peanuts. Please check all ingredients, sauces, and allergen cross-contact from shared equipment. If you cannot confirm, please tell me; do not serve the dish.',zh:'我对花生过敏。请确认所有食材和酱料是否含有花生，并核实共用锅具、餐具、砧板和食用油造成的过敏原交叉接触风险。如果无法确认，请明确告诉我，不要提供这道菜。',needs:[],kind:'allergy'},
 {id:'shellfish',group:'Dining',title:'Crustacean shellfish allergy',en:'I am allergic to shrimp, crab, and lobster. Please check ingredients, sauces, and allergen cross-contact. Tell me if you cannot confirm; do not serve the dish.',zh:'我对虾、蟹和龙虾等甲壳类海鲜过敏。请确认所有食材和酱料，并核实共用厨具、餐具和食用油造成的过敏原交叉接触风险。如果无法确认，请明确告诉我，不要提供这道菜。',needs:[],kind:'allergy'},
 {id:'no-meat',group:'Dining',title:'No meat, fish or seafood',en:'I do not eat meat, fish, or seafood. Please also check the broth and sauces.',zh:'我不吃肉、鱼和海鲜。请确认汤底和酱料中也没有这些成分。',needs:[],kind:'diet'},
 {id:'ingredients',group:'Dining',title:'Check the ingredients',en:'Could you ask the kitchen to confirm all the ingredients and sauces?',zh:'请帮我向厨房核实这道菜的全部食材和酱料，谢谢。',needs:[],kind:'diet'},
 {id:'train-gate',group:'Station',title:'Find my check-in gate',en:'Which check-in gate should I use for train {trainNumber}?',zh:'请问{trainNumber}次列车在哪个检票口检票？',needs:['train'],kind:'train'},
 {id:'train-platform',group:'Station',title:'Find my platform',en:'Which platform is train {trainNumber} using?',zh:'请问{trainNumber}次列车停靠哪个站台？',needs:['train'],kind:'train'},
 {id:'train-passport',group:'Station',title:'Passport ticket check',en:'I booked using a passport. Which staffed lane should I use?',zh:'我使用护照购票。请问应该走哪个人工检票通道？',needs:[],kind:'plain'},
 {id:'train-help',group:'Station',title:'Check my departure',en:'Could you help me check the departure time and station for train {trainNumber}?',zh:'请帮我核实{trainNumber}次列车的发车时间和乘车站，谢谢。',needs:['train'],kind:'train'},
 {id:'hotel-checkin',group:'Hotel',title:'I have a reservation',en:'Hello, I have a reservation at {hotelName}. Could you help me check in?',zh:'您好，我在{hotelName}有预订。请帮我办理入住，谢谢。',needs:['hotelName'],kind:'plain'},
 {id:'hotel-luggage',group:'Hotel',title:'Leave my luggage',en:'May I leave my luggage here? Is there a charge?',zh:'请问可以暂时寄存行李吗？是否收费？',needs:[],kind:'plain'},
 {id:'hotel-late',group:'Hotel',title:'Arriving late',en:'I will arrive late. Could you confirm how I can check in?',zh:'我会比较晚到。请问晚到后如何办理入住？',needs:[],kind:'plain'},
 {id:'hotel-contact',group:'Hotel',title:'Contact my hotel',en:'Could you help me contact {hotelName}? Telephone: {hotelPhone}.',zh:'请帮我联系酒店：{hotelName}。联系电话：{hotelPhone}。',needs:['hotelName','phone'],kind:'plain'},
 {id:'cash',group:'Shopping',title:'Can I pay cash?',en:'Can I pay in cash?',zh:'请问可以用现金付款吗？',needs:[],kind:'plain'},
 {id:'price',group:'Shopping',title:'Write down the price',en:'Could you write down the total price in Chinese yuan?',zh:'请帮我写下总价，以人民币计价，谢谢。',needs:[],kind:'plain'},
 {id:'card',group:'Shopping',title:'Can I use my card?',en:'Do you accept this bank card? Are there additional fees?',zh:'请问可以使用这张银行卡付款吗？是否有额外费用？',needs:[],kind:'plain'},
 {id:'receipt',group:'Shopping',title:'A purchase receipt',en:'Could I have a receipt, please?',zh:'请给我购物小票，谢谢。',needs:[],kind:'plain'},
 {id:'metro',group:'Directions',title:'Subway entrance',en:'Where is the nearest metro station entrance?',zh:'请问最近的地铁站入口在哪里？',needs:[],kind:'plain'},
 {id:'walk',group:'Directions',title:'Find this address',en:'How can I get to this address on foot?',zh:'请问步行去这个地址怎么走？',needs:['destination'],kind:'destination'},
 {id:'write',group:'Directions',title:'Write the directions',en:'Could you write down the directions? Left, right, or straight ahead?',zh:'请帮我写下路线。是左转、右转，还是直走？',needs:[],kind:'plain'},
 {id:'english',group:'Directions',title:'English help',en:'I do not speak Chinese. Is there an English-speaking staff member?',zh:'我不会说中文。请问有会说英语的工作人员吗？',needs:[],kind:'plain'}
];
export function addressFingerprint(hotel){return JSON.stringify([hotel.name.trim(),hotel.address.trim()]);}
export function renderPhrase(card,hotel,details){
 const place=places.find(p=>p.id===details.destinationId),isHotel=card.kind==='hotel';
 const confirmed=details.confirmedAddress===addressFingerprint(hotel);
 const missing=card.needs.filter(need=>need==='hotel'?!(hotel.address.trim()&&confirmed):need==='destination'?!place||details.confirmedDestination!==JSON.stringify([place.id,place.address]):need==='train'?!/^[A-Z]?\d{1,5}$/i.test(details.trainNumber.trim()):need==='phone'?!/^[+\d][\d ()+-]{4,29}$/.test(hotel.phone||''):!hotel.name.trim());
 const fill=text=>text.replaceAll('{trainNumber}',details.trainNumber.trim().toUpperCase()).replaceAll('{hotelName}',hotel.name.trim()).replaceAll('{hotelPhone}',hotel.phone||'');
 return {ready:missing.length===0,missing,zh:missing.length?'':fill(card.zh),en:missing.length?card.title:fill(card.en),address:isHotel&&missing.length===0?`${hotel.name}\n${hotel.address}${hotel.phone?'\n联系电话：'+hotel.phone:''}`:card.kind==='destination'&&place&&missing.length===0?`${place.zh}\n${place.address}`:'',allergy:card.kind==='allergy'};
}
export const allergyWarning='Communication aid only; not a food-safety guarantee or medical advice. Ask staff to confirm ingredients, sauces and cross-contact. This card is not clearance to eat, and has not been clinically certified.';
