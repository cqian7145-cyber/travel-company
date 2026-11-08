import {createHash} from 'node:crypto';
export function dataHash(venues,sources){return createHash('sha256').update(JSON.stringify({venues,sources})).digest('hex');}
