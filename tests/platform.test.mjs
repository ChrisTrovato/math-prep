import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blankWorkspace,normalizeWorkspace,parseBackup,backupText,mergeWorkspace} from '../dist/math_prep/workspace.js';
import {normalizeDrillState,startDrill,submitDrill,generateProblem} from '../dist/math_prep/drill-engine.js';
import {sanitizeDiagnosticSession,createDiagnosticSession} from '../dist/math_prep/diagnostic.js';
import {platformHome,curriculumPage,lessonPage,manualPage,projectsPage,capabilityPage,progressPage,buildSearchIndex,platformSources,mountPlatform} from '../dist/math_prep/platform.js';
import {lessons} from '../dist/math_prep/curriculum-data.js';
import {studyGuides,engineeringHabits,projects} from '../dist/math_prep/field-manual-data.js';
import {concepts,missions} from '../dist/math_prep/concepts-data.js';
import {historyEntries} from '../dist/math_prep/history-data.js';
import {stages,resources} from '../dist/math_prep/data.js';

const validators={resourceIds:new Set(['open-pre','khan-arithmetic']),lessonIds:new Set(['lesson-one','lesson-two']),drills:normalizeDrillState,diagnostic:sanitizeDiagnosticSession};
const normalize=raw=>normalizeWorkspace(raw,validators);
const note=(id,text=id)=>({id,title:`Note ${id}`,text,type:'reflection',date:'2026-10-31T12:00:00.000Z'});
function practiced(seed='backup-question'){
  let drills=normalizeDrillState(null);drills.selectedStage='geometry';drills.selectedSkill='triangle-area';
  drills=startDrill(drills,{seed,now:Date.UTC(2026,9,31)});
  const p=generateProblem(drills.session.skillId,drills.session.seed);
  return submitDrill(drills,String(p.answer),Date.UTC(2026,9,31)).state;
}

test('workspace normalization filters unsafe keys, unknown resources/lessons, malformed records and oversized strings',()=>{
  const raw=JSON.parse('{"saved":["open-pre","open-pre","unknown","__proto__"],"checks":{"constructor":true,"valid-check":true,"bad":"yes"},"solved":{"__proto__":{},"a1":{"helped":true,"date":"2026-10-31T12:00:00.000Z"}},"lessons":{"lesson-one":{"read":true},"unknown":{"read":true}},"notes":[],"preferences":{"reading":"huge"}}');
  raw.notes=[note('safe','x'.repeat(6000)),{...note('safe','last copy'),title:'t'.repeat(200)},{...note('constructor'),title:'bad'}];
  raw.lastLesson='unknown';raw.projects={prototype:{read:true}};
  const state=normalize(raw);
  assert.deepEqual(state.saved,['open-pre']);assert.deepEqual(state.checks,{'valid-check':true});assert.deepEqual(Object.keys(state.lessons),['lesson-one']);
  assert.equal(state.notes.length,1);assert.equal(state.notes[0].title.length,120);assert.equal(state.notes[0].text,'last copy');assert.equal(state.lastLesson,null);assert.equal(state.preferences.reading,'comfortable');
  assert.equal(Object.hasOwn(state.solved,'__proto__'),false);assert.equal(Object.hasOwn(state.projects,'prototype'),false);assert.equal({}.polluted,undefined);
  assert.equal(normalize({notes:[note('large','x'.repeat(6000))]}).notes[0].text.length,5000);
});

test('supported legacy backups migrate and malformed files fail before mutation',()=>{
  for(const version of [1,2,3]){
    const state=parseBackup(JSON.stringify({version,saved:['open-pre'],checks:{'arithmetic-0':true},solved:{a1:{helped:false}},notes:[note('legacy')]}),validators);
    assert.deepEqual(state.saved,['open-pre']);assert.equal(state.notes[0].id,'legacy');assert.equal(state.preferences.reading,'comfortable');assert.equal(state.drills.version,1);
  }
  for(const input of ['', '{broken', '[]','null','{"version":4,"saved":[],"checks":{}}','{"version":3,"saved":{}}'])assert.throws(()=>parseBackup(input,validators));
  assert.throws(()=>parseBackup(' '.repeat(3000001),validators));
  assert.throws(()=>parseBackup({},validators));
});

test('imported boolean-like strings do not count as achievements and dates are canonical',()=>{
  const state=normalize({lessons:{'lesson-one':{read:'false',quizCorrect:'false',date:'October 31, 2026 12:00:00 GMT'}},solved:{a1:{helped:'false'}},notes:[{...note('date'),date:'October 31, 2026 12:00:00 GMT'}]});
  assert.equal(state.lessons['lesson-one'].read,false);assert.equal(state.lessons['lesson-one'].quizCorrect,false);assert.equal(state.solved.a1.helped,false);
  assert.equal(state.lessons['lesson-one'].date,'2026-10-31T12:00:00.000Z');assert.equal(state.notes[0].date,'2026-10-31T12:00:00.000Z');
});

test('a complete backup round-trip retains the current generated question and diagnostic progress',()=>{
  const state=normalize({saved:['open-pre'],checks:{'arithmetic-0':true},notes:[note('reflection','Fractions are units.')],drills:practiced(),diagnostic:createDiagnosticSession('short'),lessons:{'lesson-one':{read:true,date:'2026-10-31T12:00:00.000Z'}},lastLesson:'lesson-one'});
  state.drills.session.input='17/2';state.drills.session.hintUsed=true;
  const restored=parseBackup(backupText(state),validators);
  assert.deepEqual(restored,state);assert.equal(restored.drills.session.seed,'backup-question');assert.equal(restored.drills.session.input,'17/2');assert.equal(restored.drills.session.hintUsed,true);
});

test('merge keeps existing notes on ID conflicts and uses newer dated lesson records',()=>{
  const current=normalize({notes:[note('shared','keep my current version')],saved:['open-pre'],lessons:{'lesson-one':{read:false,date:'2026-10-31T12:00:00.000Z'}},checks:{'arithmetic-0':false}});
  const incoming=normalize({notes:[note('shared','older imported version'),note('extra')],saved:['khan-arithmetic'],lessons:{'lesson-one':{read:true,date:'2026-10-30T12:00:00.000Z'},'lesson-two':{read:true,date:'2026-10-31T12:00:00.000Z'}},checks:{'arithmetic-0':true}});
  const beforeCurrent=structuredClone(current),beforeIncoming=structuredClone(incoming),merged=mergeWorkspace(current,incoming);
  assert.equal(merged.notes.find(n=>n.id==='shared').text,'keep my current version');assert.equal(merged.notes.length,2);assert.equal(merged.lessons['lesson-one'].read,false);assert.equal(merged.lessons['lesson-two'].read,true);assert.equal(merged.checks['arithmetic-0'],false);
  assert.deepEqual(new Set(merged.saved),new Set(['open-pre','khan-arithmetic']));assert.deepEqual(current,beforeCurrent);assert.deepEqual(incoming,beforeIncoming);
});

test('restoring into a fresh normalized workspace restores the saved drill session, not only its counters',()=>{
  const current=normalize(blankWorkspace()),incoming=normalize({drills:practiced()});
  const merged=mergeWorkspace(current,incoming);
  assert.deepEqual(merged.drills.session,incoming.drills.session);
  assert.equal(merged.drills.selectedStage,'geometry');assert.equal(merged.drills.selectedSkill,'triangle-area');
  assert.equal(merged.drills.records['triangle-area'].attempts,1);
});

test('re-importing the same practice history never adds duplicate attempts',()=>{
  const state=normalize({drills:practiced()});
  let merged=mergeWorkspace(state,structuredClone(state));merged=mergeWorkspace(merged,structuredClone(state));
  assert.equal(merged.drills.records['triangle-area'].attempts,1);assert.equal(merged.drills.records['triangle-area'].independentCorrect,1);assert.equal(merged.drills.records['triangle-area'].recent.length,1);
});

test('an over-limit note merge is rejected atomically instead of dropping records on reload',()=>{
  const current=normalize({notes:Array.from({length:2000},(_,i)=>note(`current-${i}`))});
  const incoming=normalize({notes:Array.from({length:2000},(_,i)=>note(`incoming-${i}`))});
  const beforeCurrent=structuredClone(current),beforeIncoming=structuredClone(incoming);
  assert.throws(()=>mergeWorkspace(current,incoming),/limit|smaller|exceed/i);
  assert.deepEqual(current,beforeCurrent);assert.deepEqual(incoming,beforeIncoming);
  assert.equal(normalize(current).notes.length,2000);
});

test('over-limit checklist and solved-record merges are rejected without mutating either workspace',()=>{
  const entries=prefix=>Object.fromEntries(Array.from({length:1000},(_,i)=>[`${prefix}-${i}`,true]));
  const solved=prefix=>Object.fromEntries(Array.from({length:1000},(_,i)=>[`${prefix}-${i}`,{helped:false,date:'2026-10-31T12:00:00.000Z'}]));
  const current=normalize({checks:entries('current'),solved:solved('current')}),incoming=normalize({checks:entries('incoming'),solved:solved('incoming')});
  const beforeCurrent=structuredClone(current),beforeIncoming=structuredClone(incoming);
  assert.throws(()=>mergeWorkspace(current,incoming),/limit|smaller|exceed/i);
  assert.deepEqual(current,beforeCurrent);assert.deepEqual(incoming,beforeIncoming);
});

test('backup parsing rejects oversized collections before normalization could truncate them',()=>{
  const base={version:3,saved:[],checks:{},notes:[]};
  assert.throws(()=>parseBackup(JSON.stringify({...base,notes:Array.from({length:2001},(_,i)=>note(`n-${i}`))}),validators),/limit|support/i);
  assert.throws(()=>parseBackup(JSON.stringify({...base,checks:Object.fromEntries(Array.from({length:1001},(_,i)=>[`check-${i}`,true]))}),validators),/limit|support/i);
});

test('an export at the valid note limit can be imported again',()=>{
  const state=normalize({notes:Array.from({length:2000},(_,i)=>note(`large-${i}`,'x'.repeat(5000)))});
  const text=backupText(state);assert.ok(text.length>3000000);
  const restored=parseBackup(text,validators);assert.equal(restored.notes.length,2000);assert.equal(restored.notes[1999].text.length,5000);
});

test('curriculum, field notes, sources and quiz shapes satisfy the platform render contracts',()=>{
  const ids=new Set(lessons.map(l=>l.id)),stageIds=new Set(stages.map(s=>s.id));
  assert.equal(ids.size,lessons.length);
  for(const lesson of lessons){
    assert.ok(stageIds.has(lesson.stage));assert.ok(lesson.prerequisites.every(id=>ids.has(id)),lesson.id);
    assert.ok(Array.isArray(lesson.explanation)&&lesson.explanation.length>0);
    assert.ok(lesson.worked.every(w=>w.title&&w.given&&Array.isArray(w.steps)&&w.answer&&w.check));
    const options=lesson.quiz.options;assert.equal(new Set(options.map(o=>o.id)).size,options.length);assert.ok(options.some(o=>o.id===lesson.quiz.answer));assert.ok(lesson.quiz.explanation);
  }
  for(const article of [...studyGuides,...engineeringHabits])assert.ok(article.title&&article.subtitle&&article.lead&&article.exercise&&article.takeaway&&article.sections.every(s=>s.title&&Array.isArray(s.body)));
  for(const item of [...lessons,...studyGuides,...engineeringHabits,...projects])for(const source of item.sources){assert.ok(source.title);assert.ok(['https:','http:'].includes(new URL(source.url).protocol));}
});

test('all platform detail renderers resolve their real data without broken URLs or missing markup values',()=>{
  const state=blankWorkspace();
  const pages=[platformHome(state),curriculumPage(state),progressPage(state),platformSources(),capabilityPage(),...lessons.map(l=>lessonPage(state,l.id)),...studyGuides.map(a=>manualPage(state,'study',a.id)),...engineeringHabits.map(a=>manualPage(state,'habits',a.id)),...projects.map(p=>projectsPage(state,p.id))];
  const lessonIds=new Set(lessons.map(l=>l.id));
  for(const html of pages){
    assert.ok(typeof html==='string'&&html.length>100);
    assert.ok(!/href="[^"]*(?:undefined|NaN)/.test(html));
    assert.ok(!/>undefined<|>NaN<|href="javascript:/i.test(html));
    for(const [,id] of html.matchAll(/href="#lesson\/([^"]+)"/g))assert.ok(lessonIds.has(id),id);
  }
  assert.match(lessonPage(state,'unknown'),/LESSON NOT FOUND/);
});

test('search uses actual titles and valid routes for concepts, missions, history, and resources',()=>{
  const index=buildSearchIndex();
  for(const item of index){assert.ok(typeof item.title==='string'&&item.title.length);assert.ok(typeof item.text==='string');assert.ok(item.url.startsWith('#'));assert.ok(!item.url.includes('undefined'));}
  for(const c of concepts)assert.ok(index.some(x=>x.title===c.title&&x.kind==='Concept'&&x.url==='#concepts/'+c.stage));
  for(const m of missions)assert.ok(index.some(x=>x.title===m.title&&x.kind==='Aerospace example'&&x.url==='#missions/'+m.id));
  for(const h of historyEntries)assert.ok(index.some(x=>x.title===h.title&&x.kind==='History'&&x.url==='#history/'+h.id));
  for(const r of resources)assert.ok(index.some(x=>x.title===r.title&&x.kind==='Resource'));
});

function fakeNode(){
  const listeners=new Map();
  return {listeners,textContent:'',innerHTML:'',dataset:{},attributes:{},
    addEventListener(name,handler,options={}){listeners.set(name,handler);options.signal?.addEventListener('abort',()=>listeners.delete(name),{once:true});},
    setAttribute(name,value){this.attributes[name]=value;},
    hasAttribute(name){return Object.hasOwn(this.attributes,name);},
    dispatch(name,event){return listeners.get(name)?.(event);}
  };
}
test('lesson quizzes require a choice, persist feedback and preserve quiz data when read marks change',()=>{
  const lesson=lessons[0],state=blankWorkspace(),root=fakeNode(),form=fakeNode(),out=fakeNode();let saves=0;
  form.dataset.lessonQuiz=lesson.id;form.querySelector=selector=>selector==='[data-quiz-feedback]'?out:null;
  root.querySelector=selector=>selector==='[data-lesson-quiz]'?form:null;
  const OriginalFormData=globalThis.FormData;
  globalThis.FormData=class{constructor(form){this.form=form;}get(){return this.form.choice||null;}};
  let cleanup;
  try{
    cleanup=mountPlatform(root,{state,view:'lesson',arg:lesson.id,onSave:()=>saves++,refresh(){},toast(){},validators});
    assert.equal(state.lastLesson,lesson.id);
    form.dispatch('submit',{preventDefault(){}});assert.match(out.textContent,/Choose an answer/);assert.equal(state.lessons[lesson.id],undefined);
    form.choice=lesson.quiz.answer;form.dispatch('submit',{preventDefault(){}});
    assert.equal(state.lessons[lesson.id].quizCorrect,true);assert.equal(state.lessons[lesson.id].quizAttempts,1);assert.ok(out.innerHTML.includes('Correct.'));
    form.choice=lesson.quiz.options.find(o=>o.id!==lesson.quiz.answer).id;form.dispatch('submit',{preventDefault(){}});
    assert.equal(state.lessons[lesson.id].quizCorrect,false);assert.equal(state.lessons[lesson.id].quizAttempts,2);assert.ok(out.innerHTML.includes('Not quite yet.'));
    const button=fakeNode();button.dataset.markLesson=lesson.id;
    root.dispatch('click',{target:{closest:()=>button}});assert.equal(state.lessons[lesson.id].read,true);assert.equal(state.lessons[lesson.id].quizAttempts,2);
    root.dispatch('click',{target:{closest:()=>button}});assert.equal(state.lessons[lesson.id].read,false);assert.ok(saves>=5);
  }finally{cleanup?.();globalThis.FormData=OriginalFormData;}
  assert.equal(root.listeners.size,0);assert.equal(form.listeners.size,0);
});

test('progress displays first-attempt quantities separately from read marks and notes',()=>{
  const state=blankWorkspace();state.drills=practiced();state.notes=[note('one')];state.lessons[lessons[0].id]={read:true};
  const html=progressPage(state);
  assert.match(html,/<b>1<\/b><span>lessons marked read/);
  assert.match(html,/<b>1<\/b><span>first attempts recorded/);
  assert.match(html,/<b>1<\/b><span>independent first-attempt answers correct/);
  assert.match(html,/<b>0<\/b><span>helped first-attempt answers correct/);
  assert.match(html,/Read marks show coverage/);
});

function importHost(){
  const root=fakeNode(),input=fakeNode(),preview=fakeNode(),confirm=fakeNode();
  root.querySelector=selector=>selector==='#backup-file'?input:selector==='#backup-preview'?preview:null;
  preview.querySelector=selector=>selector==='#confirm-backup'?confirm:null;
  return {root,input,preview,confirm};
}
test('a slower earlier backup file cannot overwrite the latest selected backup or its merge',async()=>{
  const {root,input,preview,confirm}=importHost(),state=blankWorkspace();
  const cleanup=mountPlatform(root,{state,view:'progress',onSave(){},refresh(){},toast(){},validators});
  let finishFirst,finishSecond;
  const firstText=new Promise(resolve=>finishFirst=resolve),secondText=new Promise(resolve=>finishSecond=resolve);
  const first=input.dispatch('change',{target:{files:[{size:100,text:()=>firstText}]}});
  const second=input.dispatch('change',{target:{files:[{size:100,text:()=>secondText}]}});
  finishSecond(backupText(normalize({notes:[note('selected-a'),note('selected-b')]})));await second;
  assert.match(preview.innerHTML,/2 notes/);
  finishFirst(backupText(normalize({notes:[note('outdated-file')]})));await first;
  assert.match(preview.innerHTML,/2 notes/);
  confirm.dispatch('click',{});
  assert.deepEqual(state.notes.map(n=>n.id),['selected-a','selected-b']);
  cleanup();assert.equal(root.listeners.size,0);assert.equal(input.listeners.size,0);assert.equal(confirm.listeners.size,0);
});

test('pending file reads cannot modify a cleaned-up platform view',async()=>{
  const {root,input,preview}=importHost(),state=blankWorkspace();
  const cleanup=mountPlatform(root,{state,view:'progress',onSave(){throw new Error('No save should occur');},refresh(){},toast(){},validators});
  let finish;const text=new Promise(resolve=>finish=resolve);
  const pending=input.dispatch('change',{target:{files:[{size:100,text:()=>text}]}});
  cleanup();const beforeMarkup=preview.innerHTML,beforeText=preview.textContent;
  finish(backupText(normalize({notes:[note('late')]})));await pending;
  assert.equal(preview.innerHTML,beforeMarkup);assert.equal(preview.textContent,beforeText);assert.equal(state.notes.length,0);
});
