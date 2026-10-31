import {test} from 'node:test';
import assert from 'node:assert/strict';
import {diagnosticQuestions,diagnosticPool,createDiagnosticSession,sanitizeDiagnosticSession,assessDiagnostic,renderDiagnostic} from '../dist/math_prep/diagnostic.js';

function answered(mode='full',transform=q=>({kind:'answer',value:String(q.answer)})){
  const s=createDiagnosticSession(mode);for(const q of diagnosticPool(mode))s.answers[q.id]=transform(q);s.complete=true;return s;
}
test('24 original items and balanced 12-question quick mode',()=>{
  assert.equal(diagnosticQuestions.length,24);assert.equal(new Set(diagnosticQuestions.map(q=>q.id)).size,24);
  for(const mode of ['short','full']){const pool=diagnosticPool(mode);assert.equal(pool.length,mode==='short'?12:24);for(const stage of ['arithmetic','prealgebra','algebra','geometry','algebra2','precalculus'])assert.equal(pool.filter(q=>q.stage===stage).length,mode==='short'?2:4);}
});
test('answer keys match independent calculations and conceptual choices',()=>{
  const expected={da1:5/6-1/4,da2:-3*(4-7),da3:80*1.2,da4:(7/8)/(1/4),dp1:(26+4)/5,dp2:-3,dp3:2.4*1000,dp4:'b',dl1:'c',dl2:(10-2)/(3-(-1)),dl3:(7-2)*3,dl4:(11+1)/3,dg1:Math.hypot(5,12),dg2:6*50,dg3:10*7/2,dg4:'b',df1:2*(-3)**2-(-3),df2:4,df3:4,df4:'a',dt1:150/180,dt2:.5,dt3:Math.log10(1000),dt4:3*4+2};
  for(const q of diagnosticQuestions){if(typeof q.answer==='number')assert.ok(Math.abs(q.answer-expected[q.id])<1e-12,q.id);else assert.equal(q.answer,expected[q.id]);}
});
test('all correct remains a precalculus recommendation, not automatic calculus placement',()=>{
  for(const mode of ['short','full']){const r=assessDiagnostic(answered(mode));assert.equal(r.correct,r.total);assert.equal(r.isComplete,true);assert.equal(r.recommendation.stage,'precalculus');assert.equal(r.recommendation.allCorePromising,true);assert.equal(r.recommendation.geometryParallel,false);assert.ok(r.domains.every(d=>d.level==='promising'));}
});
test('all wrong recommends earliest foundation and counts actual incorrect attempts',()=>{
  const s=answered('full',q=>({kind:'answer',value:q.type==='choice'?q.options.find(o=>o.id!==q.answer).id:String(q.answer+100)}));
  const r=assessDiagnostic(s);assert.equal(r.incorrect,24);assert.equal(r.correct,0);assert.equal(r.recommendation.stage,'arithmetic');assert.equal(r.recommendation.geometryParallel,true);
});
test('skipped and not-learned responses are not silently scored wrong',()=>{
  const allSkipped=assessDiagnostic(answered('short',()=>({kind:'skip',value:''})));assert.equal(allSkipped.skipped,12);assert.equal(allSkipped.incorrect,0);assert.equal(allSkipped.attempted,0);assert.equal(allSkipped.isComplete,true);assert.match(allSkipped.recommendation.reason,/no scored attempts/);
  const unknown=assessDiagnostic(answered('full',()=>({kind:'unknown',value:''})));assert.equal(unknown.notLearned,24);assert.equal(unknown.incorrect,0);assert.equal(unknown.recommendation.stage,'arithmetic');
});
test('geometry is identified alongside the core path instead of blocking algebra',()=>{
  const s=answered('full',q=>q.stage==='geometry'?{kind:'unknown',value:''}:{kind:'answer',value:String(q.answer)});const r=assessDiagnostic(s);assert.equal(r.recommendation.stage,'precalculus');assert.equal(r.recommendation.geometryParallel,true);
});
test('earliest weak core area is deterministic and thresholds are explicit',()=>{
  const s=answered('full');s.answers.dl1={kind:'skip',value:''};assert.equal(assessDiagnostic(s).recommendation.stage,'algebra');
  s.answers.dl1={kind:'answer',value:'a'};assert.equal(assessDiagnostic(s).recommendation.stage,'precalculus'); // 3/4 attempted and correct is promising in full mode.
  s.answers.dl2={kind:'answer',value:'99'};assert.equal(assessDiagnostic(s).recommendation.stage,'algebra');
  const quick=answered('short');quick.answers.dl1={kind:'answer',value:'a'};assert.equal(assessDiagnostic(quick).recommendation.stage,'algebra');
});
test('sparse and malformed state cannot produce a confident finished report',()=>{
  for(const bad of [null,undefined,[],{},'bad',{version:2,mode:'full'},{version:1,mode:'unknown'}]){assert.equal(sanitizeDiagnosticSession(bad),null);assert.equal(assessDiagnostic(bad).recommendation,null);}
  const sparse={version:1,mode:'full',index:900,complete:true,answers:{da1:{kind:'answer',value:'7/12'},madeUp:{kind:'answer',value:'1'}}};
  const safe=sanitizeDiagnosticSession(sparse);assert.equal(safe.index,23);assert.equal(safe.complete,false);assert.equal(Object.hasOwn(safe.answers,'madeUp'),false);
  const r=assessDiagnostic(sparse);assert.equal(r.correct,1);assert.equal(r.unvisited,23);assert.equal(r.recommendation,null);assert.equal(r.isComplete,false);
});
test('invalid arithmetic and choice answers remain unscored and unfinished',()=>{
  const s=answered('full');s.answers.da1={kind:'answer',value:'1/0'};s.answers.dp4={kind:'answer',value:'<script>'};const r=assessDiagnostic(s);assert.equal(r.invalid,2);assert.equal(r.incorrect,0);assert.equal(r.isComplete,false);assert.equal(sanitizeDiagnosticSession(s).complete,false);
});
test('equivalent fractions, Unicode negatives and reasonable decimal rounding work',()=>{
  const s=answered('full');s.answers.da1.value='14/24';s.answers.dp2.value='−3';s.answers.dt1.value='0.8333';const r=assessDiagnostic(s);assert.equal(r.correct,24);
});
test('saved user input is escaped and questions reveal no answer key before completion',()=>{
  const s=createDiagnosticSession('full');s.answers.da1={kind:'answer',value:'"><img src=x onerror=alert(1)>'};const html=renderDiagnostic(s);assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('Use twelfths:'));assert.ok(renderDiagnostic(answered('full')).includes('Use twelfths:'));
});
