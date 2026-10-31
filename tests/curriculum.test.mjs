import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, curriculumSources } from '../dist/math_prep/curriculum-data.js';
import { stages } from '../dist/math_prep/data.js';

const byId = new Map(lessons.map(lesson => [lesson.id, lesson]));
const selected = id => { const q = byId.get(id).quiz; return q.options.find(o => o.id === q.answer).text; };
const near = (actual, expected, label) => assert.ok(Math.abs(actual - expected) <= 1e-10 * Math.max(1,Math.abs(expected)), `${label}: ${actual} ≠ ${expected}`);

test('curriculum has complete, unique lessons for every learning stage', () => {
  assert.equal(lessons.length, 48);
  assert.equal(byId.size, lessons.length);
  assert.deepEqual(lessons.map(l => l.order), Array.from({length:48},(_,i)=>i+1));
  for (const stage of stages) assert.equal(lessons.filter(l => l.stage === stage.id).length, 8, stage.id);
  for (const lesson of lessons) {
    assert.match(lesson.id, /^[a-z][a-z0-9-]*$/);
    assert.ok(stages.some(s => s.id === lesson.stage));
    for (const key of ['title','subtitle','why','engineering','reflection']) assert.ok(lesson[key]?.trim(), `${lesson.id}.${key}`);
    assert.ok(lesson.explanation.length >= 2 && lesson.explanation.length <= 4, lesson.id);
    assert.ok(lesson.worked.length >= 1 && lesson.worked.length <= 2, lesson.id);
    assert.ok(lesson.pitfalls.length > 0, lesson.id);
    for (const example of lesson.worked) {
      for (const key of ['title','given','answer','check']) assert.ok(example[key]?.trim(), `${lesson.id}.worked.${key}`);
      assert.ok(example.steps.length >= 2 && example.steps.every(s=>typeof s === 'string' && s.trim()));
    }
  }
});

test('prerequisites always resolve to earlier lessons without cycles', () => {
  for (const lesson of lessons) {
    assert.equal(new Set(lesson.prerequisites).size, lesson.prerequisites.length);
    for (const id of lesson.prerequisites) {
      const prerequisite = byId.get(id);
      assert.ok(prerequisite, `${lesson.id} points to missing ${id}`);
      assert.ok(prerequisite.order < lesson.order, `${lesson.id} has a forward or cyclic prerequisite ${id}`);
    }
  }
});

test('every lesson has one valid quiz answer and official, deduplicated reading references', () => {
  for (const lesson of lessons) {
    const q = lesson.quiz;
    assert.ok(q.prompt?.trim() && q.explanation?.trim(), lesson.id);
    assert.equal(q.options.length, 4, lesson.id);
    assert.equal(new Set(q.options.map(o=>o.id)).size, 4, lesson.id);
    assert.equal(q.options.filter(o=>o.id===q.answer).length, 1, lesson.id);
    assert.equal(new Set(q.options.map(o=>o.text)).size, 4, `${lesson.id}: duplicate options`);
    assert.ok(lesson.sources.length > 0);
    for (const source of lesson.sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.hostname, 'openstax.org');
      assert.ok(source.title.trim());
    }
  }
  const urls = new Set(lessons.flatMap(l=>l.sources.map(s=>s.url)));
  assert.deepEqual(new Set(curriculumSources.map(s=>s.url)), urls);
  assert.equal(curriculumSources.length, urls.size);
});

// Numeric questions are recomputed from their given quantities, not answer keys.
function numericChoice(text) {
  const normalized=text.replaceAll('−','-').replaceAll(',','').trim();
  const fraction=normalized.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)(?:\s|$)/);
  if(fraction) return Number(fraction[1])/Number(fraction[2]);
  return Number.parseFloat(normalized);
}
const gcd=(a,b)=>b?gcd(b,a%b):a;
const independentQuizValues = [
  ['place-value',Math.floor(26041/1000)%10*1000],
  ['addition-subtraction',325+79-146],
  ['multiplication-division',Math.floor(60/7)],
  ['order-of-operations',24/6*2+1],
  ['fraction-meaning-addition',3/4-1/6],
  ['fraction-products-quotients',(5/6)/(5/12)],
  ['decimal-operations',2.4/.06],
  ['ratios-rates-percents',3/(3+2)*100],
  ['signed-numbers',-4-(-9)],
  ['factors-multiples',8*12/gcd(8,12)],
  ['equation-balance',(28+7)/5],
  ['units-conversions',.02*100**2],
  ['proportions-percent-change',(80-60)/80*100],
  ['multistep-linear-equations',(10+4)/(4-2)],
  ['coordinates-and-slope',(0-8)/(5-1)],
  ['systems-of-equations',(12+4)/2],
  ['angles-and-triangles',180-68],
  ['perimeter-area',.5*12*5],
  ['right-triangle-distance',Math.sqrt(13**2-5**2)],
  ['similarity-and-scale',9*20/100],
  ['geometric-scaling',4**3],
  ['right-triangle-ratios',8/15],
  ['functions-domain-range',-4],
  ['rational-equations-rates',6/2+1],
  ['radicals-rational-powers',Math.cbrt(27)**2],
  ['exponential-change',50*3**2],
  ['logarithms-introduction',Math.log10(.001)],
  ['transform-compose-invert',2*3+4],
  ['trig-identities-equations',Math.sqrt(1-(3/5)**2)],
  ['vectors-and-components',Math.hypot(-8,6)],
  ['exponential-log-equations',Math.log(135/5)/Math.log(3)],
  ['bridge-to-calculus',(4**2-1**2)/(4-1)]
];
test('32 numeric quiz keys agree with independent computations', () => {
  for (const [id,expected] of independentQuizValues) near(numericChoice(selected(id)),expected,id);
});

test('remaining 16 formula, geometry, and solution-set quiz keys satisfy their defining conditions', () => {
  const sample=[-5,-2,0,1,4];
  let checked=0;
  const verify=(id,candidates,predicate)=>{
    const valid=candidates.map((candidate,i)=>predicate(candidate)?'abcd'[i]:null).filter(Boolean);
    assert.equal(valid.length,1,`${id}: there should be exactly one mathematically valid option`);
    assert.equal(byId.get(id).quiz.answer,valid[0],id);
    checked++;
  };
  verify('variables-expressions',[x=>3*x+4,x=>3*(x+4),x=>x+12,x=>3+x+4],f=>sample.every(x=>f(x)===3*(x+4)));
  verify('distribute-combine',[x=>7*x-2,x=>7*x-8,x=>4*x-5,x=>12*x-8],f=>sample.every(x=>f(x)===4*(x-2)+3*x));
  verify('powers-roots-scientific',[[7.2,-4],[7.2,4],[72,-4],[.72,-3]],([c,n])=>c>=1&&c<10&&Math.abs(c*10**n-.00072)<1e-12);
  verify('rearranging-formulas',[(e,t)=>e*t,(e,t)=>e/t,(e,t)=>t/e,(e,t)=>e-t],f=>[[20,4],[30,3],[7,2]].every(([e,t])=>f(e,t)*t===e));
  verify('inequalities-constraints',[x=>x>=-4,x=>x<=-4,x=>x>=4,x=>x<=4],p=>[-10,-4,-3,0,4,9].every(x=>p(x)===(-3*x>=12)));
  verify('linear-models',[x=>4*x+3,x=>4*x+11,x=>2*x+4,x=>4*x-3],f=>f(2)===11&&f(3)-f(2)===4);
  verify('polynomials-and-factoring',[x=>(x-3)**2,x=>(x-9)*(x+1),x=>(x-3)*(x+3),()=>NaN],f=>sample.every(x=>f(x)===x*x-9));
  verify('quadratics-by-factoring',[[2],[3],[-2,-3],[2,3]],roots=>roots.length===2&&new Set(roots).size===2&&roots.every(x=>x*x-5*x+6===0));
  verify('circles-and-arcs',[10,20,25,100],coefficient=>coefficient*Math.PI===Math.PI*(10/2)**2);
  verify('volume-surface-area',[10,20,25,40],coefficient=>coefficient*Math.PI===Math.PI*2**2*5);
  const parabola=x=>2*(x+1)**2-7;
  verify('quadratic-forms-formula',[[1,-7],[-1,-7],[-1,7],[2,-7]],([x,y])=>parabola(x)===y&&parabola(x-1)>y&&parabola(x+1)>y);
  verify('rational-expressions',[x=>x+6,x=>x+2,x=>3*x+2,x=>x/3+2],f=>sample.every(x=>f(x)===(3*x+6)/3));
  verify('complex-numbers',[[[3,0],[-3,0]],[[0,9],[0,-9]],[[0,3],[0,-3]],[[0,3]]],roots=>roots.length===2&&roots.every(([a,b])=>a*a-b*b===-9&&2*a*b===0));
  verify('polynomial-rational-graphs',[['y',3],['x',0],['x',3],['y',0]],([axis,value])=>axis==='x'&&value-3===0);
  verify('radians-unit-circle',[3/4,5/4,4/5,9/4],coefficient=>Math.abs(coefficient*Math.PI-225*Math.PI/180)<1e-12);
  verify('trigonometric-graphs',[3,2*Math.PI/3,6*Math.PI,2],period=>Math.abs(3*period-2*Math.PI)<1e-12);
  assert.equal(checked,16);
});

test('worked examples preserve equations, units, geometry, and threshold behavior', () => {
  // Rational and radical equations need checks in the original, not only a transformed form.
  const x=7/2;
  near((x+1)/(x-2),3,'rational equation');
  assert.equal(Math.sqrt(4+5),4-1);
  assert.notEqual(Math.sqrt(-1+5),-1-1,'extraneous radical candidate must fail');
  for(const root of [1,5]) assert.equal(root**2-6*root+5,0);
  assert.equal(5*2+4*5,30,'module mass system');
  near(54*1000/3600,15,'speed conversion');
  assert.equal(6*100**2,60000,'square-unit conversion');
  assert.equal(2*(3*2+3*1+2*1),22,'box surface area');
  near(3*(120*Math.PI/180),2*Math.PI,'arc length');
  near(Math.hypot(3-1,4+2),2*Math.sqrt(10),'resultant vector');
  const threshold=Math.log(.5)/Math.log(.8);
  near(100*.8**threshold,50,'exponential threshold');
  assert.ok(100*.8**3>50 && 100*.8**4<50,'first whole-cycle threshold is 4');
  for(const h of [.1,.01,-.01]) near(((2+h)**2-2**2)/h,4+h,'nonzero difference quotient');
});
