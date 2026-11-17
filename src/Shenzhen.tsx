import {renderShenzhenPage} from '../shared/shenzhen-render.mjs';
export default function Shenzhen(){return <div className="shenzhen-page" dangerouslySetInnerHTML={{__html:renderShenzhenPage()}}/>;}
