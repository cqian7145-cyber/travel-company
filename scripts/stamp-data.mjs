import {readFile,writeFile} from 'node:fs/promises';
import {dataHash} from './data-hash.mjs';
const [venues,sources,previous]=await Promise.all(['data/venues.json','data/sources.json','data/version.json'].map(async path=>JSON.parse(await readFile(path,'utf8'))));
const version=process.argv[2];
if(!version||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}\.[A-Za-z0-9._-]+$/.test(version)||version===previous.version)throw new Error('Supply a new dated data version, for example npm run data:version -- 2026-11-09.vdc2. This never updates fact verification dates.');
await writeFile('data/version.json',JSON.stringify({...previous,version,prepared_at:new Date().toISOString().slice(0,10),content_hash:dataHash(venues,sources)},null,2)+'\n');
console.log(`Prepared dataset ${version}. Field verification dates were not changed. Run data:check and review the audit before release.`);
