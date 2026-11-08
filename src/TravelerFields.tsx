import {addressFingerprint} from '../shared/phrases.mjs';
import type {Hotel,TravelDetails} from './companion-state';
export type TravelerProps={hotel:Hotel;details:TravelDetails;onHotelChange:(hotel:Hotel)=>void;onDetailsChange:(details:TravelDetails)=>void};
export default function TravelerFields({hotel,details,onHotelChange,onDetailsChange}:TravelerProps){
 const confirmed=Boolean(hotel.address.trim()&&details.confirmedAddress===addressFingerprint(hotel));
 return <div className="traveler-fields"><div className="field-grid"><label>Chinese hotel name (optional)<input lang="zh-Hans" maxLength={120} value={hotel.name} placeholder="酒店中文名称" onChange={e=>onHotelChange({...hotel,name:e.target.value})}/></label><label>Hotel telephone (optional)<input type="tel" maxLength={30} value={hotel.phone||''} placeholder="Use the number on your booking" onChange={e=>onHotelChange({...hotel,phone:e.target.value})}/></label><label className="wide-field">Complete Chinese hotel address<textarea lang="zh-Hans" maxLength={300} value={hotel.address} placeholder="Use your exact property address, including street number" onChange={e=>onHotelChange({...hotel,address:e.target.value})}/></label></div>
  <label className="address-confirm"><input type="checkbox" disabled={!hotel.address.trim()} checked={confirmed} onChange={e=>onDetailsChange({...details,confirmedAddress:e.target.checked?addressFingerprint(hotel):''})}/><span>I checked this complete Chinese address against my accommodation confirmation.<small>A street name or demo address is not enough. This is your confirmation; the app does not geocode or verify the property.</small></span></label>
 </div>;
}
