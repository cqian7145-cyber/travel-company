import {readFile} from 'node:fs/promises';
import {cultureRecords,cultureSources,validateHighlights} from '../shared/culture-highlights.mjs';
const errors=validateHighlights(cultureRecords,cultureSources);
for(const x of cultureRecords)if(x.status==='published'&&x.image)try{await readFile('public'+x.image.src);}catch{errors.push(x.id+': local image missing');}
for(const e of errors)console.error(e);
console.log('Culture Highlights: '+cultureRecords.length+' records, '+errors.length+' errors.');
if(errors.length)process.exitCode=1;
