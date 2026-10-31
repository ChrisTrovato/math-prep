import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { resources, stages, videos, sources } from './dist/math_prep/data.js';
import { concepts, missions, mistakes } from './dist/math_prep/concepts-data.js';
import { historyEntries, historySources } from './dist/math_prep/history-data.js';
import { problems } from './dist/math_prep/problems.js';
import { diagnosticDomains, diagnosticQuestions } from './dist/math_prep/diagnostic.js';

// Resolve against this script so the check also works outside the project cwd.
const site = new URL('./dist/math_prep/', import.meta.url);
const requiredFiles = [
  'index.html', 'app.js', 'data.js', 'problems.js', 'styles.css', 'atlas.css',
  'concepts-data.js', 'history-data.js', 'expansion.js', 'labs.js', 'diagnostic.js'
];
const content = new Map();
for (const name of requiredFiles) {
  const file = new URL(name, site);
  assert.ok(fs.existsSync(file), `Missing deployed asset: ${name}`);
  const text = fs.readFileSync(file, 'utf8');
  assert.ok(text.trim(), `Empty deployed asset: ${name}`);
  assert.ok(!/\b(?:TODO|TBD|INSERT_HERE)\b/.test(text), `Unfinished placeholder: ${name}`);
  content.set(name, text);
  if (!name.endsWith('.js')) continue;
  const syntax = spawnSync(process.execPath, ['--check', fileURLToPath(file)], { encoding: 'utf8' });
  assert.equal(syntax.status, 0, `Invalid JavaScript in ${name}: ${syntax.stderr || syntax.error || ''}`);
  for (const [, specifier] of text.matchAll(/\bfrom\s*['"](\.[^'"]+)['"]/g)) {
    assert.ok(fs.existsSync(new URL(specifier, file)), `Broken module import in ${name}: ${specifier}`);
  }
}

const html = content.get('index.html');
const app = content.get('app.js');
for (const asset of ['/math_prep/app.js', '/math_prep/styles.css', '/math_prep/atlas.css']) {
  assert.ok(html.includes(asset), `HTML does not load ${asset}`);
}
for (const [, pathname] of html.matchAll(/(?:src|href)=["'](\/math_prep\/[^"'?#]+)(?:[?#][^"']*)?["']/g)) {
  assert.ok(fs.existsSync(new URL(pathname.slice('/math_prep/'.length), site)), `Broken HTML asset: ${pathname}`);
}

function validIds(name, rows) {
  assert.ok(Array.isArray(rows) && rows.length, `${name} must contain records`);
  const ids = new Set();
  for (const row of rows) {
    assert.match(row.id, /^[a-z][a-z0-9-]*$/, `${name} has an invalid route/storage id`);
    assert.ok(!ids.has(row.id), `${name} has duplicate id: ${row.id}`);
    ids.add(row.id);
  }
  return ids;
}

const stageIds = validIds('stages', stages);
const resourceIds = validIds('resources', resources);
assert.equal(stageIds.size, 6, 'The learning path must expose all six stages');
for (const [name, rows] of Object.entries({ concepts, missions, mistakes, historyEntries, problems, diagnosticDomains, diagnosticQuestions })) {
  validIds(name, rows);
}
validIds('notebook topic references', [...concepts, ...missions]);
for (const stage of stages) {
  for (const field of ['book', 'practice']) {
    assert.ok(resourceIds.has(stage[field]), `${stage.id}.${field} points to a missing resource: ${stage[field]}`);
  }
}
for (const resource of resources) {
  assert.ok(Array.isArray(resource.levels) && resource.levels.length, `Missing levels for ${resource.id}`);
  for (const level of resource.levels) {
    assert.ok(level === 'all' || stageIds.has(level), `${resource.id} references unknown stage: ${level}`);
  }
}
for (const [name, rows] of Object.entries({ concepts, mistakes, problems, diagnosticQuestions })) {
  for (const row of rows) assert.ok(stageIds.has(row.stage), `${name}/${row.id} references unknown stage: ${row.stage}`);
}
assert.deepEqual(new Set(diagnosticDomains.map(x => x.id)), stageIds, 'Diagnostic domains must match learning stages');
for (const [name, rows] of Object.entries({ concepts, problems, diagnosticQuestions })) {
  for (const stage of stageIds) assert.ok(rows.some(row => row.stage === stage), `${name} leaves ${stage} empty`);
}

// Broken or executable link schemes must not reach a card or the source list.
let checkedUrls = 0;
function checkUrls(value, location = 'content') {
  if (Array.isArray(value)) return value.forEach((row, i) => checkUrls(row, `${location}[${i}]`));
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (key !== 'url') { checkUrls(child, `${location}.${key}`); continue; }
    assert.equal(typeof child, 'string', `${location}.url must be a URL string`);
    const url = new URL(child);
    assert.ok(['https:', 'http:'].includes(url.protocol), `Unsupported link scheme at ${location}: ${url.protocol}`);
    assert.ok(url.hostname && !url.username && !url.password, `Invalid public source URL at ${location}`);
    checkedUrls++;
  }
}
checkUrls({ resources, videos, sources, concepts, missions, historyEntries, historySources });
for (const [name, rows] of Object.entries({ concepts, missions })) {
  for (const row of rows) {
    assert.ok(row.source?.title?.trim() && row.source?.url, `${name}/${row.id} is missing a labeled source`);
  }
}
for (const entry of historyEntries) {
  assert.ok(entry.sources?.length, `History entry ${entry.id} has no sources`);
  for (const source of entry.sources) assert.ok(source.title?.trim() && source.url, `Unlabeled source in ${entry.id}`);
}

// Navigation is a public contract: every advertised section needs a label and renderer.
const expectedRoutes = ['home', 'path', 'diagnostic', 'concepts', 'history', 'glossary', 'method', 'missions', 'labs', 'practice', 'mistakes', 'library', 'notebook', 'horizon', 'sources'];
const nav = html.match(/<nav\b[^>]*\bid=["']primary-nav["'][^>]*>([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav, 'Primary navigation not found');
const navRoutes = [...nav.matchAll(/href=["']#([a-z]+)["']/g)].map(match => match[1]);
assert.equal(navRoutes.length, 15, 'Primary navigation must expose all 15 sections');
assert.equal(new Set(navRoutes).size, navRoutes.length, 'Primary navigation contains a duplicate route');
assert.deepEqual(new Set(navRoutes), new Set(expectedRoutes), 'Unexpected or missing primary route');
const routeLabels = app.match(/const\s+routeLabels\s*=\s*\{([^\n]+)\};/)?.[1];
const renderers = app.match(/const\s+renderers\s*=\s*\{([^\n]+)\};/)?.[1];
assert.ok(routeLabels && renderers, 'Route declarations were not found for navigation validation');
const labelKeys = [...routeLabels.matchAll(/(?:^|,)\s*([a-z]+)\s*:/g)].map(match => match[1]);
const rendererKeys = [...renderers.matchAll(/(?:^|,)\s*([a-z]+)\s*(?=:|,|$)/g)].map(match => match[1]);
assert.deepEqual(new Set(labelKeys), new Set(expectedRoutes), 'Navigation labels and supported routes differ');
assert.deepEqual(new Set(rendererKeys), new Set(expectedRoutes), 'Navigation routes and renderers differ');

console.log(`Integrity checks passed: ${requiredFiles.length} assets, ${expectedRoutes.length} routes, ${concepts.length} concepts, ${missions.length} missions, ${historyEntries.length} history entries, ${checkedUrls} source/resource URLs.`);
