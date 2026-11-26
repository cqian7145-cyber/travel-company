import {useState, type MouseEvent} from 'react';
import {beijingPhotos, photoPath, renderBeijingPage} from '../shared/beijing-render.mjs';
import {MatchaButton} from './MatchaButton';
import {Modal} from './ui';

const page = {__html: renderBeijingPage()};

export default function Beijing(){
 const [index, setIndex] = useState<number | null>(null);
 const photo = index === null ? null : beijingPhotos[index];

 function openPhoto(event: MouseEvent<HTMLDivElement>){
  if(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element).closest<HTMLAnchorElement>('[data-beijing-photo]');
  if(!link) return;
  const next = beijingPhotos.findIndex(item => item.image === link.dataset.beijingPhoto);
  if(next < 0) return;
  event.preventDefault();
  link.focus({preventScroll: true});
  setIndex(next);
 }

 return <>
  <div className="beijing-page" onClick={openPhoto} dangerouslySetInnerHTML={page}/>
  {photo && index !== null && <Modal title="Beijing photograph" className="photo-dialog beijing-photo-dialog" onClose={() => setIndex(null)}>
   <figure>
    <img key={photo.image} src={photoPath(photo, 1600)} alt={photo.caption}/>
    <figcaption aria-live="polite">{photo.caption}</figcaption>
   </figure>
   <div className="photo-dialog-controls">
    <MatchaButton className="outline-button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</MatchaButton>
    <span>{index + 1} / {beijingPhotos.length}</span>
    <MatchaButton className="outline-button" disabled={index === beijingPhotos.length - 1} onClick={() => setIndex(index + 1)}>Next</MatchaButton>
   </div>
  </Modal>}
 </>;
}
