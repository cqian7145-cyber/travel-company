import guangzhou from '../data/guangzhou.json' with {type:'json'};
import {cityById} from './cities.mjs';
import {htmlEscape as escape, renderCityCulture} from './highlight-render.mjs';


const photoPath = (cityId, photo, size) => `/${cityId}-photography/${photo.image}-${size}.webp`;

function photoSourceSet(cityId, photo) {
 return `${photoPath(cityId, photo, 640)} ${photo.width}w, ${photoPath(cityId, photo, 1600)} ${photo.largeWidth}w`;
}

function renderPhoto(cityId, photo, columns, solo) {
 const desktopWidth = solo ? (photo.width > photo.height ? 66 : 46) : Math.round(100 * (photo.width / photo.height) / columns);
 const sizes = `(max-width: 760px) calc(100vw - 32px), (max-width: 1340px) ${desktopWidth}vw, ${Math.round(desktopWidth * 12.8)}px`;
 return `<figure style="--photo-width:${photo.width / photo.height}">
  <a href="${photoPath(cityId, photo, 1600)}" data-photo-city-image="${photo.image}" aria-label="Enlarge photo: ${escape(photo.caption)}">
   <img src="${photoPath(cityId, photo, 640)}" srcset="${photoSourceSet(cityId, photo)}" sizes="${sizes}" alt="${escape(photo.caption)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
   <span class="beijing-photo-expand" aria-hidden="true">↗</span>
  </a>
  <figcaption>${escape(photo.caption)}</figcaption>
 </figure>`;
}

function renderPlace(cityId, place) {
 const keyword = Object.hasOwn(place, 'mapKeyword') ? place.mapKeyword : place.zh;
 const map = keyword ? 'https://uri.amap.com/search?keyword='+encodeURIComponent(cityById(cityId).zh+' '+keyword)+'&view=map&callnative=0' : null;
 const columns = place.photos.reduce((sum, photo) => sum + photo.width / photo.height, 0);
 const solo = place.photos.length === 1;
 const layout = !solo ? 'spread' : place.photos[0].width > place.photos[0].height ? 'landscape' : 'portrait';
 return `<article class="beijing-place" data-layout="${layout}" id="${place.id}">
  <div class="beijing-place-heading">
   <div><h3>${escape(place.name)} <small lang="zh-Hans">${escape(place.zh)}</small></h3>
   <p>${escape(place.description)}</p></div>
   ${map ? `<a class="text-link" href="${escape(map)}" target="_blank" rel="noreferrer">Search on Amap ↗</a>` : ''}
  </div>
  <div class="beijing-photos">${place.photos.map(photo => renderPhoto(cityId, photo, columns, solo)).join('')}</div>
 </article>`;
}

export function renderGuangzhouPage(data=guangzhou) {
 const cityId=data.id;
 const city=cityById(cityId);
 const heroPlace=data.places.find(place=>place.photos.some(photo=>photo.image===data.coverImage)) || data.places[0];
 const heroPhoto=heroPlace.photos.find(photo=>photo.image===data.coverImage) || heroPlace.photos[0];
 const culture=renderCityCulture(cityId);

 return `<header class="beijing-intro">
  <div class="beijing-intro-copy">
   <a class="text-link" href="/cities">All cities</a>
   <h1>${escape(city.name)} <span lang="zh-Hans">${escape(city.zh)}</span></h1>
   <p class="beijing-tagline">${escape(city.tagline)}</p>
   <p>${escape(city.intro)}</p>
   <a class="primary-button" href="#places">Explore ${escape(city.name)} →</a>
  </div>
  <figure class="beijing-cover">
   <img src="${city.image}" srcset="${photoSourceSet(cityId, heroPhoto)}" sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1340px) 40vw, 480px" alt="${escape(city.imageAlt)}" width="${heroPhoto.width}" height="${heroPhoto.height}" fetchpriority="high">
   <figcaption>${escape(heroPlace.name)} <span lang="zh-Hans">${escape(heroPlace.zh)}</span></figcaption>
  </figure>
 </header>
 <nav class="city-section-nav" aria-label="${escape(city.name)} sections"><a href="#places">Places to explore</a>${culture ? `<a href="#${cityId}-culture">Culture highlights</a>` : ''}<a href="#city-plan">Practical information</a></nav>
 <section id="places" class="beijing-gallery" aria-labelledby="guangzhou-places-title">
  <div class="section-heading"><h2 id="guangzhou-places-title">Places to explore</h2></div>
  <div class="beijing-places">${data.places.map(place=>renderPlace(cityId, place)).join('')}</div>
 </section>
 ${culture}
 <section id="city-plan" class="city-content-zone">
  <h2>Practical information</h2>
  <p>Guangzhou itinerary planning (9 curated stops including Canton Tower, Chen Clan Ancestral Hall, Shamian Island &amp; Xiguan Yum Cha) and Baiyun Airport (CAN) arrival guides are ready.</p>
  <div class="partner-links"><a class="primary-button" href="/trip">Plan a Guangzhou trip →</a><a class="outline-button" href="/arrival">CAN Airport First 90 Minutes →</a><a class="text-link" href="/cities">Explore our cities →</a></div>
 </section>`;
}
