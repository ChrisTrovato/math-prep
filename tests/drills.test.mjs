import {test} from 'node:test';
import assert from 'node:assert/strict';
import {skills,drillStages,generateProblem,gradeDrill,pickDrillSkill,normalizeDrillSeed,createDrillState,normalizeDrillState,startDrill,submitDrill,getDrillReview,reviewIntervalDays} from '../dist/math_prep/drill-engine.js';
import {renderDrills,mountDrills,renderReview,mountReview} from '../dist/math_prep/drills.js';

// These independent calculations use the question parameters, not its answer key.
const reference={
  'fraction-sums':p=>p.a/p.b+p.c/p.d,
  'fraction-products':p=>(p.a/p.b)*(p.c/p.d),
  'fraction-division':p=>(p.a/p.b)/(p.c/p.d),
  'percentage-change':p=>p.mass*(1+(p.increase?1:-1)*p.percent/100),
  'signed-operations':p=>p.b*p.c+p.a,
  'decimal-cost':p=>p.count*(p.cents/100),
  'two-step-equations':p=>(p.c-p.b)/p.a,
  proportions:p=>p.total/p.units*p.count,
  'metric-conversion':p=>p.cm*.01,
  'scientific-notation':p=>p.exponent>0?p.coefficient*10**p.exponent:p.coefficient/10**(-p.exponent),
  'arithmetic-mean':p=>p.values.reduce((sum,n)=>sum+n/p.values.length,0),
  'rate-and-time':p=>p.energy/p.power,
  'distributive-equations':p=>(p.d-p.a*p.b)/(p.a-p.c),
  'slope-from-points':p=>(p.y2-p.y1)/(p.x2-p.x1),
  'formula-rearrangement':p=>p.voltage/p.current,
  'linear-systems':p=>(p.sum+p.difference)/2,
  'line-intercept':p=>p.y-p.m*p.x,
  'linear-functions':p=>p.b+p.x*p.m,
  'right-triangle-distance':p=>Math.hypot(p.legA,p.legB),
  'triangle-area':p=>p.height*(p.base/2),
  'circle-area':p=>3.14*p.radius*p.radius,
  'rectangular-volume':p=>p.height*(p.length*p.width),
  'scale-model-length':p=>p.scale*p.model,
  'volume-scaling':p=>(p.volume*p.k)*p.k*p.k,
  'quadratic-functions':p=>(p.a*p.x+p.b)*p.x+p.c,
  'quadratic-roots':p=>(-p.b+Math.sqrt(p.b*p.b-4*p.c))/2,
  'domain-restrictions':p=>p.a,
  'exponential-equations':p=>Math.log(p.value)/Math.log(p.base),
  'principal-square-root':p=>Math.sqrt(p.value),
  'rational-functions':p=>(p.x*p.x-p.a*p.a)/(p.x-p.a),
  'radians-coefficient':p=>p.degrees/360*2,
  'triangle-trigonometry':p=>(p.useSine?p.opposite:p.adjacent)/p.hypotenuse,
  'vector-components':p=>p.force*(p.horizontal?{0:1,30:Math.sqrt(3)/2,45:Math.SQRT1_2,60:.5,90:0}:{0:0,30:.5,45:Math.SQRT1_2,60:Math.sqrt(3)/2,90:1})[p.degrees],
  'function-composition':p=>p.a*p.x*p.x+p.a*p.c+p.b,
  'logarithm-values':p=>Math.log(p.value)/Math.log(p.base),
  'arithmetic-sequences':p=>Array.from({length:p.n-1}).reduce(sum=>sum+p.difference,p.first)
};
const NOW=Date.UTC(2026,9,31,12),DAY=86400000;
function problemState(skillId='fraction-sums',seed='test'){const state=createDrillState();state.selectedStage=skills.find(s=>s.id===skillId).stage;state.selectedSkill=skillId;return startDrill(state,{seed,now:NOW});}
function answer(state){return generateProblem(state.session.skillId,state.session.seed).answer;}

test('36 distinct skill templates cover every stage evenly',()=>{
  assert.equal(skills.length,36);assert.equal(new Set(skills.map(s=>s.id)).size,36);
  assert.equal(drillStages.length,6);
  for(const stage of drillStages)assert.equal(skills.filter(s=>s.stage===stage.id).length,6);
  assert.deepEqual(new Set(skills.map(s=>s.id)),new Set(Object.keys(reference)));
});

test('all 36 templates are deterministic, varied, finite, and independently correct across 7,200 cases',()=>{
  for(const skill of skills){
    const prompts=new Set();
    for(let seed=0;seed<200;seed++){
      const p=generateProblem(skill.id,seed),q=generateProblem(skill.id,String(seed)),expected=reference[skill.id](p.parameters);
      assert.deepEqual(p,q,`${skill.id} is reproducible`);
      assert.equal(p.skillId,skill.id);assert.equal(p.stage,skill.stage);
      assert.ok(Number.isFinite(p.answer)&&Math.abs(p.answer)<1e8,skill.id);
      assert.ok(Math.abs(p.answer-expected)<Math.max(1e-8,Math.abs(expected)*1e-12),`${skill.id} / seed ${seed}`);
      assert.equal(gradeDrill(p,String(expected)).correct,true,`${skill.id} / independent answer`);
      assert.equal(gradeDrill(p,String(p.answer+1)).correct,false,`${skill.id} rejects a wrong answer`);
      assert.ok(p.prompt.length>10&&p.hint.length>10&&p.why.length>15);
      assert.ok(p.steps.length>=2&&p.steps.every(step=>typeof step==='string'&&step.length>3));
      assert.ok(!/NaN|undefined|Infinity/.test([p.prompt,p.display,p.hint,...p.steps].join(' ')));
      prompts.add(p.prompt);
    }
    assert.ok(prompts.size>=25,`${skill.id} has ${prompts.size} distinct questions`);
  }
});

test('generated parameter bounds exclude ambiguous and undefined questions',()=>{
  for(let seed=0;seed<500;seed++){
    const fractions=generateProblem('fraction-division',seed).parameters;
    assert.ok(fractions.b>0&&fractions.c>0&&fractions.d>0);
    const equation=generateProblem('distributive-equations',seed).parameters;assert.notEqual(equation.a,equation.c);
    const rational=generateProblem('rational-functions',seed).parameters;assert.notEqual(rational.x,rational.a);
    const points=generateProblem('slope-from-points',seed).parameters;assert.notEqual(points.x1,points.x2);
    const roots=generateProblem('quadratic-roots',seed).parameters;assert.ok(roots.low<roots.high);
    const triangle=generateProblem('triangle-trigonometry',seed).parameters;
    assert.equal(triangle.opposite**2+triangle.adjacent**2,triangle.hypotenuse**2);
    const notation=generateProblem('scientific-notation',seed).parameters;assert.ok(notation.coefficient>=1&&notation.coefficient<10);assert.notEqual(notation.exponent,0);
  }
});

test('strict numeric input permits equivalent fractions and intended rounding, without executing expressions',()=>{
  const p={answer:7/12,tolerance:.000051};
  for(const input of ['7/12','14/24','0.5833',' +7 / 12 '])assert.equal(gradeDrill(p,input).correct,true);
  assert.equal(gradeDrill({answer:-3},'−3').correct,true);
  for(const input of ['',null,undefined,{},[],true,'1/0','Infinity',Infinity,NaN,'1e3','2+2','Math.sqrt(9)','<img src=x onerror=alert(1)>','7/12 cm','1'.repeat(121)]){
    assert.equal(gradeDrill(p,input).valid,false,String(input));
  }
  const tiny={answer:.00011};assert.equal(gradeDrill(tiny,'0').correct,false);assert.equal(gradeDrill(tiny,'.00011').correct,true);
  assert.equal(gradeDrill({answer:0},'0').correct,true);
  assert.throws(()=>gradeDrill({answer:NaN},'1'),TypeError);
  assert.throws(()=>gradeDrill({answer:1,tolerance:-1},'1'),RangeError);
  assert.throws(()=>gradeDrill({answer:1,tolerance:Infinity},'1'),RangeError);
});

test('invalid skills and seeds fail explicitly; mixed practice stays in its selected stage',()=>{
  assert.throws(()=>generateProblem('not-a-skill',1),RangeError);
  for(const invalid of [undefined,null,{},[],NaN,Infinity,1.5,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>normalizeDrillSeed(invalid),TypeError);
  for(const invalid of ['', 'x'.repeat(161)])assert.throws(()=>normalizeDrillSeed(invalid),RangeError);
  assert.equal(normalizeDrillSeed(0),'0');assert.deepEqual(generateProblem('fraction-sums','π-seed'),generateProblem('fraction-sums','π-seed'));
  assert.throws(()=>pickDrillSkill('imaginary-stage',1),RangeError);
  for(const stage of [...drillStages.map(s=>s.id),'all'])for(let seed=0;seed<60;seed++){
    const id=pickDrillSkill(stage,seed),skill=skills.find(s=>s.id===id);
    assert.ok(stage==='all'||skill.stage===stage);
    assert.notEqual(pickDrillSkill(stage,seed,id),id);
  }
});

test('only the first valid answer counts, including wrong-first then correct retries',()=>{
  let state=problemState(),value=answer(state);
  const invalid=submitDrill(state,'1/0',NOW);assert.equal(invalid.recorded,false);assert.deepEqual(invalid.state.records,{});
  const first=submitDrill(state,String(value+2),NOW);state=first.state;assert.equal(first.recorded,true);
  assert.equal(state.records['fraction-sums'].attempts,1);assert.equal(state.records['fraction-sums'].incorrect,1);
  for(let i=0;i<5;i++){const next=submitDrill(state,String(value),NOW+DAY);state=next.state;assert.equal(next.recorded,false);assert.equal(next.grade.correct,true);}
  assert.equal(state.records['fraction-sums'].attempts,1);assert.equal(state.records['fraction-sums'].independentCorrect,0);
  assert.equal(state.session.firstAttempt.correct,false);assert.equal(state.session.feedback.correct,true);
  state.session.firstAttempt=null;const recovered=submitDrill(state,String(value),NOW+DAY);
  assert.equal(recovered.recorded,false);assert.equal(recovered.state.session.firstAttempt.correct,false);
});

test('hint and solution use are recorded as assisted without self-reported confidence',()=>{
  for(const flag of ['hintUsed','solutionShown']){
    let state=problemState('linear-functions',flag);state.session[flag]=true;
    state=submitDrill(state,String(answer(state)),NOW).state;
    assert.equal(state.session.firstAttempt.assisted,true);assert.equal(state.records['linear-functions'].assistedCorrect,1);assert.equal(state.records['linear-functions'].independentCorrect,0);
  }
  let state=problemState('linear-functions','independent');state=submitDrill(state,String(answer(state)),NOW).state;
  state.session.solutionShown=true;state=submitDrill(state,String(answer(state)),NOW).state;
  assert.equal(state.records['linear-functions'].independentCorrect,1);assert.equal(state.records['linear-functions'].assistedCorrect,0);
});

test('review uses transparent 1 / 3 / 7 / 14-day intervals and resets after errors or help',()=>{
  let state=problemState('triangle-area','review-0');
  for(let i=0;i<5;i++){
    if(i)state=startDrill(state,{seed:`review-${i}`});
    state=submitDrill(state,String(answer(state)),NOW+i*DAY).state;
    const record=state.records['triangle-area'],interval=[1,3,7,14,14][i];
    assert.equal(record.intervalDays,interval);assert.equal(Date.parse(record.nextReviewAt),NOW+(i+interval)*DAY);
  }
  state=startDrill(state,{seed:'review-miss'});state=submitDrill(state,String(answer(state)+1),NOW+6*DAY).state;
  assert.equal(state.records['triangle-area'].intervalDays,1);
  state=startDrill(state,{seed:'review-help'});state.session.hintUsed=true;state=submitDrill(state,String(answer(state)),NOW+7*DAY).state;
  assert.equal(state.records['triangle-area'].intervalDays,1);
  assert.equal(getDrillReview(state,NOW+7*DAY)[0].due,false);assert.equal(getDrillReview(state,NOW+8*DAY)[0].due,true);
  assert.equal(reviewIntervalDays([]),1);
  assert.throws(()=>submitDrill(state,'1',NaN),RangeError);
});

test('recent history is bounded while aggregate first-attempt counts survive reload',()=>{
  let state=problemState('decimal-cost','history-0');
  for(let i=0;i<30;i++){
    if(i)state=startDrill(state,{seed:`history-${i}`});
    state=submitDrill(state,String(answer(state)),NOW+i*DAY).state;
  }
  const copy=normalizeDrillState(JSON.parse(JSON.stringify(state))),record=copy.records['decimal-cost'];
  assert.equal(record.attempts,30);assert.equal(record.independentCorrect,30);assert.equal(record.recent.length,20);
  assert.equal(copy.session.seed,'history-29');assert.deepEqual(copy,state);
});

test('untrusted saved state is bounded, normalized, and cannot inject markup',()=>{
  for(const raw of [null,undefined,[],{},'invalid',{version:7}])assert.deepEqual(normalizeDrillState(raw),createDrillState());
  const raw={version:1,selectedStage:'unknown',selectedSkill:'evil',counter:Infinity,records:{evil:{attempts:999},'fraction-sums':{independentCorrect:-1,assistedCorrect:Infinity,incorrect:'3',recent:Array(1000).fill(null)}},session:{skillId:'fraction-sums',seed:'safe',input:'"><img src=x onerror=alert(1)>',hintUsed:true,solutionShown:false,firstAttempt:{correct:true},feedback:{input:'<script>',correct:true}}};
  const safe=normalizeDrillState(raw);
  assert.equal(safe.selectedStage,'arithmetic');assert.equal(safe.selectedSkill,'mixed');assert.equal(safe.counter,0);assert.equal(Object.hasOwn(safe.records,'evil'),false);assert.equal(safe.records['fraction-sums'].attempts,0);assert.equal(safe.session.firstAttempt,null);assert.equal(safe.session.feedback,null);
  const markup=renderDrills({drills:safe});assert.ok(!markup.includes('<img src=x'));assert.ok(markup.includes('&lt;img'));
  safe.session.input='a'.repeat(1000);assert.equal(normalizeDrillState(safe).session.input.length,120);
  safe.session.seed='a'.repeat(1000);assert.equal(normalizeDrillState(safe).session,null);
  assert.ok(renderReview({drills:raw}).includes('Untried does not mean weak'));
});

function eventHost(html=''){
  const listeners=new Map(),error={textContent:''};let markup='',input=null;
  const root={listeners,error,
    get innerHTML(){return markup;},
    set innerHTML(value){markup=value;const match=value.match(/name="drill-answer"[^>]*value="([^"]*)"/);input=match?{value:match[1],matches:selector=>selector==='[name="drill-answer"]'}:null;},
    querySelector(selector){
      if(selector==='[data-drills]'){const match=markup.match(/data-drill-route="([^"]*)"/);return match?{dataset:{drillRoute:match[1]}}:null;}
      if(selector==='[name="drill-answer"]')return input;
      if(selector==='#drill-input-error')return error;
      if(selector==='.drill-prompt'||selector==='h2')return {focus(){}};
      if(selector==='.drill-feedback')return {scrollIntoView(){}};
      return null;
    },
    addEventListener:(name,handler)=>listeners.set(name,handler),removeEventListener:name=>listeners.delete(name),
    enter(value){input.value=value;listeners.get('input')({target:input});},
    submit(){listeners.get('submit')({preventDefault(){},target:{matches:s=>s==='[data-drill-form]'}});},
    click(action){listeners.get('click')({preventDefault(){},target:{closest:s=>s==='[data-drill-action]'?{dataset:{drillAction:action}}:null}});},
    change(id,value){listeners.get('change')({target:{id,value}});},
    navigate(href){listeners.get('click')({preventDefault(){},target:{closest:s=>s==='[data-drill-navigate]'?{getAttribute:()=>href}:null}});}
  };
  root.innerHTML=html;return root;
}

test('practice UI saves input, hints and first attempts; reload resumes the exact generated question',()=>{
  const state={drills:problemState('fraction-sums','ui-seed')},host=eventHost(renderDrills(state));let saved=null;
  const cleanup=mountDrills(host,{state,onSave:value=>{saved=value;}});
  const originalId=generateProblem(state.drills.session.skillId,state.drills.session.seed).id;
  host.enter('7/12');host.click('hint');assert.equal(saved.session.input,'7/12');assert.equal(saved.session.hintUsed,true);
  cleanup();assert.equal(host.listeners.size,0);
  const loaded={drills:JSON.parse(JSON.stringify(saved))},second=eventHost(renderDrills(loaded));let navigation='';
  const dispose=mountDrills(second,{state:loaded,onNavigate:href=>navigation=href});
  assert.equal(generateProblem(loaded.drills.session.skillId,loaded.drills.session.seed).id,originalId);
  assert.equal(second.querySelector('[name="drill-answer"]').value,'7/12');assert.match(second.innerHTML,/A nudge/);
  second.enter(String(answer(loaded.drills)));second.submit();second.submit();
  assert.equal(loaded.drills.records['fraction-sums'].attempts,1);assert.equal(loaded.drills.records['fraction-sums'].assistedCorrect,1);assert.match(second.innerHTML,/WORK THROUGH THE REASONING/);
  second.navigate('#curriculum/arithmetic');assert.equal(navigation,'#curriculum/arithmetic');
  second.click('new');assert.notEqual(generateProblem(loaded.drills.session.skillId,loaded.drills.session.seed).id,originalId);
  second.change('drill-stage','geometry');assert.equal(loaded.drills.selectedStage,'geometry');assert.equal(generateProblem(loaded.drills.session.skillId,loaded.drills.session.seed).stage,'geometry');
  second.change('drill-skill','circle-area');assert.equal(loaded.drills.session.skillId,'circle-area');
  dispose();assert.equal(second.listeners.size,0);
});

test('skill routes generate the intended question and review navigation detaches cleanly',()=>{
  const state={drills:problemState()},host=eventHost(renderDrills(state,'vector-components'));
  const cleanup=mountDrills(host,{state});assert.equal(state.drills.session.skillId,'vector-components');assert.equal(state.drills.selectedStage,'precalculus');cleanup();
  const reviewHost=eventHost(renderReview(state));let destination='';const dispose=mountReview(reviewHost,{onNavigate:href=>destination=href});reviewHost.navigate('#drills/vector-components');assert.equal(destination,'#drills/vector-components');dispose();assert.equal(reviewHost.listeners.size,0);
});

test('changing a skill updates its route so a reload preserves the new question and seed',()=>{
  const state={drills:problemState()},host=eventHost(renderDrills(state,'circle-area'));let route='';
  const cleanup=mountDrills(host,{state,onNavigate:hash=>route=hash});
  host.change('drill-stage','arithmetic');assert.equal(route,'#drills/arithmetic');
  host.change('drill-skill','fraction-products');assert.equal(route,'#drills/fraction-products');
  host.enter('7/12');const before=structuredClone(state.drills.session);cleanup();
  const reloaded=eventHost(renderDrills(state,route.slice('#drills/'.length)));
  const dispose=mountDrills(reloaded,{state});assert.deepEqual(state.drills.session,before);dispose();
});
