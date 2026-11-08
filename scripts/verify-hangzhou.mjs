import {hangzhou,auditHangzhou} from '../shared/hangzhou.mjs';
const errors=auditHangzhou();
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`Hangzhou pilot: ${hangzhou.places.length} stable places; source references valid; operational facts honestly unknown.`);
