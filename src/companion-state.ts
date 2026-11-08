import {useEffect,useState} from 'react';
import {buildPlan} from '../shared/planner.mjs';
export type Plan=ReturnType<typeof buildPlan>;
export type Progress=Record<string,'done'|'skipped'>;
export type Confirmations=Record<string,string>;
export type Hotel={name:string;address:string;url:string;phone?:string};
export type TravelDetails={trainNumber:string;destinationId:string;confirmedAddress:string;confirmedDestination:string};
export type ArrivalSettings={airport:string;terminal:string;time:string;luggage:string;area:string};
export const isTravelDetails=(v:unknown):v is TravelDetails=>!!v&&typeof v==='object'&&['trainNumber','destinationId','confirmedAddress','confirmedDestination'].every(key=>typeof(v as Record<string,unknown>)[key]==='string');
export function useLocalState<T>(key:string,initial:T,validate:(value:unknown)=>value is T){
 const [value,setValue]=useState<T>(()=>{try{const raw=JSON.parse(localStorage.getItem(key)||'null');return validate(raw)?raw:initial;}catch{return initial;}});
 const [storageError,setStorageError]=useState(false);
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value));setStorageError(false);}catch{setStorageError(true);}},[key,value]);
 return [value,setValue,storageError] as const;
}
export const isProgress=(v:unknown):v is Progress=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.values(v).every(x=>x==='done'||x==='skipped');
export const isConfirmations=(v:unknown):v is Confirmations=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.values(v).every(x=>typeof x==='string'&&!Number.isNaN(Date.parse(x)));
export const isHotel=(v:unknown):v is Hotel=>!!v&&typeof v==='object'&&['name','address','url'].every(key=>typeof(v as Record<string,unknown>)[key]==='string')&&(!('phone' in v)||typeof(v as Record<string,unknown>).phone==='string');
