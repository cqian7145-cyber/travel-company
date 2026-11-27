import beijing from '../data/beijing.json' with {type:'json'};
import {cityById} from './cities.mjs';
import {htmlEscape as escape, renderCityCulture} from './highlight-render.mjs';

const city = cityById('beijing');
export const beijingPhotos = beijing.places.flatMap(place => place.photos);
const heroPhoto = beijing.places.find(place => place.id === 'forbidden-city').photos[0];
export const photoPath = (photo, size) => `/beijing-photography/${photo.image}-${size}.webp`;

function photoSourceSet(photo) {
 return `${photoPath(photo, 640)} ${photo.width}w, ${photoPath(photo, 1600)} ${photo.largeWidth}w`;
}

function renderPhoto(photo, columns, solo) {
 const desktopWidth = solo ? (photo.width > photo.height ? 66 : 46) : Math.round(100 * (photo.width / photo.height) / columns);
 const sizes = `(max-width: 760px) calc(100vw - 32px), (max-width: 1340px) ${desktopWidth}vw, ${Math.round(desktopWidth * 12.8)}px`;
 return `<figure style="--photo-width:${photo.width / photo.height}">
  <a href="${photoPath(photo, 1600)}" data-beijing-photo="${photo.image}" aria-label="Enlarge photo: ${escape(photo.caption)}">
   <img src="${photoPath(photo, 640)}" srcset="${photoSourceSet(photo)}" sizes="${sizes}" alt="${escape(photo.caption)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
   <span class="beijing-photo-expand" aria-hidden="true">↗</span>
  </a>
  <figcaption>${escape(photo.caption)}</figcaption>
 </figure>`;
}

function renderPlace(place) {
 const map = `https://uri.amap.com/search?keyword=${encodeURIComponent('北京 '+place.zh)}&city=Beijing&view=map&callnative=0`;
 const columns = place.photos.reduce((sum, photo) => sum + photo.width / photo.height, 0);
 const solo = place.photos.length === 1;
 const layout = !solo ? 'spread' : place.photos[0].width > place.photos[0].height ? 'landscape' : 'portrait';
 return `<article class="beijing-place" data-layout="${layout}" id="${place.id}">
  <div class="beijing-place-heading">
   <div><h3>${escape(place.name)} <small lang="zh-Hans">${escape(place.zh)}</small></h3>
   <p>${escape(place.description)}</p></div>
   <a class="text-link" href="${escape(map)}" target="_blank" rel="noreferrer">Search on Amap ↗</a>
   ${place.id === 'forbidden-city' ? '<a class="text-link" href="/culture/forbidden-city">Read the Forbidden City story ↗</a>' : ''}
  </div>
  <div class="beijing-photos">${place.photos.map(photo => renderPhoto(photo, columns, solo)).join('')}</div>
 </article>`;
}

export function renderBeijingPage() {
 return `<header class="beijing-intro">
  <div class="beijing-intro-copy">
   <a class="text-link" href="/cities">All cities</a>
   <h1>${escape(city.name)} <span lang="zh-Hans">${escape(city.zh)}</span></h1>
   <p class="beijing-tagline">${escape(city.tagline)}</p>
   <p>${escape(city.intro)}</p>
   <a class="primary-button" href="#places">Explore Beijing →</a>
  </div>
  <figure class="beijing-cover">
   <img src="${city.image}" srcset="${photoSourceSet(heroPhoto)}" sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1340px) 64vw, 820px" alt="${escape(city.imageAlt)}" width="1071" height="607" fetchpriority="high">
   <figcaption>Forbidden City <span lang="zh-Hans">故宫</span></figcaption>
  </figure>
 </header>
 <nav class="city-section-nav" aria-label="Beijing sections"><a href="#places">Places to explore</a><a href="#beijing-culture">Culture highlights</a><a href="#city-plan">Practical information</a></nav>
 <section id="places" class="beijing-gallery" aria-labelledby="beijing-places-title">
  <div class="section-heading"><h2 id="beijing-places-title">Places to explore</h2></div>
  <div class="beijing-places">${beijing.places.map(renderPlace).join('')}</div>
 </section>
 ${renderCityCulture('beijing')}
 <section id="city-plan" class="city-content-zone">
  <h2>Practical information</h2>
  <p>Beijing itinerary planning (10 curated stops) and Beijing Capital (PEK) / Daxing (PKX) airport arrival guides are ready. For the Great Wall, choose Mutianyu or Badaling before setting off.</p>
  <div class="partner-links"><a class="primary-button" href="/trip">Plan a Beijing trip →</a><a class="outline-button" href="/arrival">PEK / PKX First 90 Minutes →</a><a class="text-link" href="/cities">Explore our cities →</a></div>
 </section>`;
}
