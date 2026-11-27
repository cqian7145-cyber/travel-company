import {useState, type MouseEvent} from 'react';
import guangzhou from '../data/guangzhou.json';
import {renderGuangzhouPage} from '../shared/guangzhou-render.mjs';
const guangzhouPhotos=guangzhou.places.flatMap(place=>place.photos);
const photoPath=(photo:{image:string},size:number)=>`/guangzhou-photography/${photo.image}-${size}.webp`;
import {MatchaButton} from './MatchaButton';
import {Modal} from './ui';

const page = {__html: renderGuangzhouPage()};

export default function Guangzhou(){
 const [index, setIndex] = useState<number | null>(null);
 const photo = index === null ? null : guangzhouPhotos[index];

 function openPhoto(event: MouseEvent<HTMLDivElement>){
  if(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element).closest<HTMLAnchorElement>('[data-photo-city-image]');
  if(!link) return;
  const next = guangzhouPhotos.findIndex(item => item.image === link.dataset.photoCityImage);
  if(next < 0) return;
  event.preventDefault();
  link.focus({preventScroll: true});
  setIndex(next);
 }

 return <>
  <div className="beijing-page guangzhou-page" onClick={openPhoto} dangerouslySetInnerHTML={page}/>
  {photo && index !== null && <Modal title="Guangzhou photograph" className="photo-dialog beijing-photo-dialog" onClose={() => setIndex(null)}>
   <figure>
    <img key={photo.image} src={photoPath(photo, 1600)} alt={photo.caption}/>
    <figcaption aria-live="polite">{photo.caption}</figcaption>
   </figure>
   <div className="photo-dialog-controls">
    <MatchaButton className="outline-button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</MatchaButton>
    <span>{index + 1} / {guangzhouPhotos.length}</span>
    <MatchaButton className="outline-button" disabled={index === guangzhouPhotos.length - 1} onClick={() => setIndex(index + 1)}>Next</MatchaButton>
   </div>
  </Modal>}
 </>;
}
