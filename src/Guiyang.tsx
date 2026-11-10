import {ArrowRight,ArrowUpRight,MapPin} from 'lucide-react';
import {guiyang,guiyangMap} from '../shared/guiyang.mjs';
import {CityContentSections} from './CityDiscovery';

const photo=(id:string,large=false)=>`/guiyang-photography/${id}-${large?1600:640}.webp`;
export default function Guiyang(){
 return <div className="guiyang-page">
  <header className="city-editorial-intro guiyang-intro" data-reveal>
   <div><p className="eyebrow">CITIES / 贵阳 · CHAPTER 03</p><h1>Guiyang <span lang="zh-Hans">贵阳</span></h1><p className="city-tagline">River light. Mountain greens. Seven ways into the city.</p><p>A first photo-led look at Guiyang, using the seven places identified with the supplied photographs.</p><a className="primary-button" href="#places">Explore the photo set <ArrowRight size={18}/></a></div>
   <figure className="guiyang-cover"><img src={photo('eco-center',true)} alt="Green park and bridge with a city skyline, supplied as the National Ecological Conference Center photo" width="640" height="850"/><figcaption>GUIYANG, THROUGH SEVEN SUPPLIED PHOTOGRAPHS.<small>Place labels follow the contributor’s order · current conditions not shown</small></figcaption></figure>
  </header>
  <CityContentSections cityId="guiyang"/>
  <section id="places" className="guiyang-places" aria-labelledby="guiyang-places-title">
   <div className="section-heading"><div><p className="eyebrow">A PHOTO-LED FIRST LOOK</p><h2 id="guiyang-places-title">Seven frames of Guiyang.</h2><p>In the order you supplied, with separate places for each photograph.</p></div></div>
   <div className="guiyang-grid">{guiyang.places.map((place,index)=><article className={`guiyang-card guiyang-card-${index+1}`} key={place.id} data-reveal>
    <a className="guiyang-image" href={photo(place.image,true)} target="_blank" rel="noreferrer" aria-label={`Open larger photo: ${place.name}`}><img src={photo(place.image)} alt={`${place.name} (${place.zh}), ${place.timeOfDay.toLowerCase()} photograph supplied by the contributor`} loading={index<2?'eager':'lazy'} decoding="async" width="640" height="850"/><span className="guiyang-number">0{index+1}</span><span className="guiyang-time">{place.timeOfDay}</span></a>
    <div className="guiyang-card-copy"><p className="eyebrow">GUIYANG · {place.timeOfDay.toUpperCase()}</p><h3>{place.name}<small lang="zh-Hans">{place.zh}</small></h3><p>{place.description}</p><a className="text-link" href={guiyangMap(place)} target="_blank" rel="noreferrer"><MapPin size={16}/> Search this name on Amap <ArrowUpRight size={16}/></a><p className="guiyang-map-note">Area search only. Confirm the result and entrance locally.</p></div>
   </article>)}</div>
   <p className="guiyang-provenance">Photo order and place labels were supplied by the contributor on 9 November 2026. Exact photo locations, current access, operating details and image-use rights have not been independently verified.</p>
  </section>
  <section id="city-plan" className="guiyang-plan"><p className="eyebrow">PLAN YOUR VISIT</p><h2>A starting point, not a live travel guide.</h2><p>This collection focuses on contemporary places and photography. Cultural highlights and a Guiyang itinerary have not been published. Check current opening and access information with official venue channels before setting out.</p><a className="outline-button" href="/cities">Compare city guides <ArrowRight size={17}/></a></section>
 </div>;
}
