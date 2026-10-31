import fs from 'node:fs';
import assert from 'node:assert/strict';
import {resources,stages, videos} from './dist/math_prep/data.js';
const html=fs.readFileSync('dist/math_prep/index.html','utf8');
for(const file of ['app.js','data.js','problems.js','styles.css'])assert.ok(fs.existsSync('dist/math_prep/'+file));
assert.ok(html.includes('/math_prep/app.js')&&html.includes('/math_prep/styles.css'));
assert.equal(stages.length,6);assert.ok(resources.length>=20);assert.equal(videos.length,5);
for(const f of ['index.html','app.js','data.js','problems.js','styles.css']){const text=fs.readFileSync('dist/math_prep/'+f,'utf8');assert.ok(!/TODO|TBD|INSERT_HERE/.test(text),f);}
console.log(`Content checks passed: ${resources.length} resources, ${stages.length} stages, ${videos.length} creator videos.`);
