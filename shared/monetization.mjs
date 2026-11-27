// Centralized affiliate & contact configuration.
// Replace affiliate URLs or partner IDs here once approved—every component updates automatically.
export const SUPPORT_EMAIL='hello@xizimist.com';

export const PARTNER_LINKS={
 esimTrip:{
  id:'esim-trip',
  label:'Trip.com China eSIM',
  category:'esim',
  url:'https://www.trip.com/things-to-do/list?keyword=China+eSIM&utm_source=china-closer&utm_medium=connectivity'
 },
 esimAiralo:{
  id:'esim-airalo',
  label:'Airalo China eSIM',
  category:'esim',
  url:'https://www.airalo.com/china-esim?utm_source=china-closer&utm_medium=connectivity'
 },
 esimNomad:{
  id:'esim-nomad',
  label:'Nomad China eSIM',
  category:'esim',
  url:'https://www.getnomad.app/china-eSIM?utm_source=china-closer&utm_medium=connectivity'
 },
 railTrip:{
  id:'rail-trip',
  label:'Trip.com China Trains',
  category:'rail',
  url:'https://www.trip.com/trains/china/?utm_source=china-closer&utm_medium=booking'
 },
 klookShanghai:{
  id:'klook-shanghai',
  label:'Klook China Tickets & Transfers',
  category:'tickets',
  url:'https://www.klook.com/city/16-shanghai-things-to-do/?utm_source=china-closer&utm_medium=booking'
 }
};

export function mailtoCorrection(pageUrl){
 return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('China, closer · Fact correction')}&body=${encodeURIComponent('Page: '+pageUrl+'\n\nWhat changed or looks outdated:\n')}`;
}

export function mailtoHumanCheck(){
 return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('China Trip Double-Check Request')}&body=${encodeURIComponent('Arrival city (Beijing/Shanghai/Guangzhou):\nDates:\nWhat you want double-checked (tickets, 12306, airport transfer, allergy cards):\n')}`;
}
