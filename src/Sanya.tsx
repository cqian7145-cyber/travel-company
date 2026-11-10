import {renderSanyaPage} from '../shared/sanya-render.mjs';
export default function Sanya(){return <div className="sanya-page" dangerouslySetInnerHTML={{__html:renderSanyaPage()}}/>;}
