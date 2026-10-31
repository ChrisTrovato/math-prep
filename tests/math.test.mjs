import {test} from 'node:test';
import assert from 'node:assert/strict';
import {problems,parseNumber,gradeAnswer} from '../dist/math_prep/problems.js';
import {resources,stages,sources} from '../dist/math_prep/data.js';
test('independently calculated answers for all original questions',()=>{
 const expected={a1:11/12,a2:3/5,a3:240*(1-.15),a4:-4+3*(-2),a5:3/(3/8),p1:(22-7)/3,p2:72/60,p3:4.2/1000,p4:36/8,l1:18/2,l2:(13-5)/(6-2),l3:12/.4,l4:(11+3)/2,g1:Math.hypot(6,8),g2:3**3,g3:12*5/2,g4:7*20,f1:(-2)**2-3*(-2)+2,f2:3,f3:3,f4:5,t1:180/3,t2:2*3**2+1,t3:3/5};
 assert.equal(problems.length,Object.keys(expected).length);
 for(const p of problems){assert.ok(Math.abs(p.answer-expected[p.id])<1e-9,p.id);assert.equal(gradeAnswer(p,String(expected[p.id])),'correct');assert.equal(gradeAnswer(p,String(expected[p.id]+1)),'incorrect');}
});
test('fractions, decimal rounding and negative answers work',()=>{assert.equal(parseNumber(' 11 / 12 '),11/12);assert.equal(parseNumber('−10'),-10);assert.equal(parseNumber('.6'),.6);assert.equal(gradeAnswer(problems[0],'0.9167'),'correct');assert.equal(gradeAnswer(problems[1],'6/10'),'correct');assert.equal(gradeAnswer(problems[0],'0.91'),'incorrect');});
test('blank, malformed and executable inputs never become answers',()=>{for(const x of ['', '  ','1/0','0/0','Infinity','NaN','3/4/5','1e999','alert(1)','2+3','5 cm','x=5','<script>'])assert.equal(parseNumber(x),null,x);});
test('all stage resources and filters refer to actual entries',()=>{assert.equal(new Set(resources.map(r=>r.id)).size,resources.length);assert.equal(new Set(problems.map(r=>r.id)).size,problems.length);for(const s of stages){assert.ok(resources.some(r=>r.id===s.book));assert.ok(resources.some(r=>r.id===s.practice));assert.ok(problems.some(p=>p.stage===s.id));}for(const r of [...resources,...sources]){assert.equal(new URL(r.url).protocol,'https:');}for(const p of problems){assert.ok(p.steps.length>0&&p.hint&&p.why&&p.pitfall);assert.ok(stages.some(s=>s.id===p.stage));}});
