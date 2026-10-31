import {parseNumber} from './problems.js';

export const diagnosticDomains = [
  {id:'arithmetic',label:'Arithmetic',focus:'Fractions, signs and quantities'},
  {id:'prealgebra',label:'Prealgebra',focus:'Variables, powers and units'},
  {id:'algebra',label:'Algebra I',focus:'Equations and relationships'},
  {id:'geometry',label:'Geometry',focus:'Shape, scale and measurement'},
  {id:'algebra2',label:'Algebra II',focus:'Functions and restrictions'},
  {id:'precalculus',label:'Precalculus preview',focus:'Angles and composed functions'}
];

// Original screening items. A small, transparent sample, not a validated placement instrument.
export const diagnosticQuestions = [
  {id:'da1',stage:'arithmetic',skill:'Fractions',type:'number',prompt:'Compute 5/6 − 1/4.',answer:7/12,display:'7/12',explanation:['Use twelfths: 5/6 = 10/12 and 1/4 = 3/12.','Subtract equal-sized pieces: 10/12 − 3/12 = 7/12.'],repair:'Review common denominators and what the denominator means.'},
  {id:'da2',stage:'arithmetic',skill:'Signs and order',type:'number',prompt:'Compute −3 × (4 − 7).',answer:9,display:'9',explanation:['Work inside the parentheses: 4 − 7 = −3.','The product of −3 and −3 is +9.'],repair:'Review negative numbers and order of operations.'},
  {id:'da3',stage:'arithmetic',skill:'Percentage change',type:'number',prompt:'A quantity of 80 increases by 20%. What is the new quantity?',answer:96,display:'96',explanation:['20% of 80 is 0.20 × 80 = 16.','Add the increase to the original amount: 80 + 16 = 96.'],repair:'Distinguish the amount of a change from the new total.'},
  {id:'da4',stage:'arithmetic',skill:'Dividing fractions',type:'number',prompt:'How many quarter-liter portions are in 7/8 of a liter? A fractional number of portions is allowed.',answer:3.5,display:'7/2, or 3.5 portions',explanation:['Divide the total volume by the volume of one portion.','(7/8) ÷ (1/4) = (7/8) × 4 = 7/2.'],repair:'Review division as the number of groups that fit in a quantity.'},
  {id:'dp1',stage:'prealgebra',skill:'One-variable equation',type:'number',prompt:'Solve 5x − 4 = 26. Enter the value of x.',answer:6,display:'x = 6',explanation:['Add 4 to both sides: 5x = 30.','Divide both sides by 5: x = 6. Check: 5(6) − 4 = 26.'],repair:'Review inverse operations and checking by substitution.'},
  {id:'dp2',stage:'prealgebra',skill:'Powers of ten',type:'number',prompt:'Write 0.0036 as 3.6 × 10ⁿ. What is n?',answer:-3,display:'n = −3',explanation:['0.0036 is 3.6 divided by 1,000.','1/1,000 = 10⁻³, so n = −3.'],repair:'Review the meaning of a negative exponent; it does not make the value negative.'},
  {id:'dp3',stage:'prealgebra',skill:'Unit conversion',type:'number',prompt:'How many meters are in 2.4 kilometers?',answer:2400,display:'2,400 meters',explanation:['One kilometer is 1,000 meters.','2.4 km × 1,000 m/km = 2,400 m.'],repair:'Write conversion factors with units and cancel the unwanted unit.'},
  {id:'dp4',stage:'prealgebra',skill:'Distributive property',type:'choice',prompt:'Which expression equals 3(2x − 5) for every x?',answer:'b',display:'6x − 15',options:[{id:'a',text:'6x − 5'},{id:'b',text:'6x − 15'},{id:'c',text:'5x − 15'},{id:'d',text:'6x + 15'}],explanation:['The 3 multiplies each term inside the parentheses.','3(2x) − 3(5) = 6x − 15.'],repair:'Review distributing a factor to every term, including its sign.'},
  {id:'dl1',stage:'algebra',skill:'Rearranging a formula',type:'choice',prompt:'Given a = (v − u)/t and t ≠ 0, which expression gives v?',answer:'c',display:'v = u + at',options:[{id:'a',text:'v = a/t − u'},{id:'b',text:'v = at − u'},{id:'c',text:'v = u + at'},{id:'d',text:'v = (a + u)t'}],explanation:['Multiply both sides by t: at = v − u.','Add u to both sides: v = u + at.'],repair:'Perform the same operation on both sides instead of moving symbols by memory.'},
  {id:'dl2',stage:'algebra',skill:'Slope',type:'number',prompt:'A line passes through (−1, 2) and (3, 10). What is its slope?',answer:2,display:'2',explanation:['The change in y is 10 − 2 = 8.','The corresponding change in x is 3 − (−1) = 4. Slope = 8/4 = 2.'],repair:'Review slope as output change divided by input change.'},
  {id:'dl3',stage:'algebra',skill:'Equation with a fraction',type:'number',prompt:'Solve x/3 + 2 = 7. Enter x.',answer:15,display:'x = 15',explanation:['Subtract 2 from both sides: x/3 = 5.','Multiply both sides by 3: x = 15.'],repair:'Undo operations in an order that keeps the equation balanced.'},
  {id:'dl4',stage:'algebra',skill:'Systems of equations',type:'number',prompt:'Solve 2x + y = 11 and x − y = 1. Enter x.',answer:4,display:'x = 4; y = 3',explanation:['Add the equations to eliminate y: 3x = 12.','Thus x = 4. Substituting gives y = 3, which satisfies both equations.'],repair:'Review how a solution must satisfy every equation in a system.'},
  {id:'dg1',stage:'geometry',skill:'Right-triangle length',type:'number',prompt:'A right triangle has perpendicular legs of 5 cm and 12 cm. What is the hypotenuse length in centimeters?',answer:13,display:'13 cm',explanation:['The Pythagorean theorem gives c² = 5² + 12² = 25 + 144 = 169.','A length is positive, so c = 13 cm.'],repair:'Identify the right angle and the hypotenuse before using the theorem.'},
  {id:'dg2',stage:'geometry',skill:'Scale',type:'number',prompt:'On a 1:50 scale model, a length is 6 cm. What is the real length in centimeters?',answer:300,display:'300 cm',explanation:['Each model centimeter represents 50 real centimeters.','6 × 50 = 300 cm.'],repair:'Review corresponding lengths and ratios; keep the units requested.'},
  {id:'dg3',stage:'geometry',skill:'Area',type:'number',prompt:'A triangle has a base of 10 cm and a perpendicular height of 7 cm. What is its area in square centimeters?',answer:35,display:'35 cm²',explanation:['The area of a triangle is half its base times its perpendicular height.','A = (1/2)(10)(7) = 35 cm².'],repair:'Distinguish area from length and use a perpendicular height.'},
  {id:'dg4',stage:'geometry',skill:'Geometric scaling',type:'choice',prompt:'Every length of a flat shape is doubled. By what factor does its area change?',answer:'b',display:'A factor of 4',options:[{id:'a',text:'2'},{id:'b',text:'4'},{id:'c',text:'6'},{id:'d',text:'8'}],explanation:['Area scales in two dimensions.','Multiplying each length by 2 multiplies area by 2² = 4.'],repair:'Review why length, area and volume respond differently to scaling.'},
  {id:'df1',stage:'algebra2',skill:'Evaluating a function',type:'number',prompt:'For f(x) = 2x² − x, find f(−3).',answer:21,display:'21',explanation:['Substitute −3 for every x: 2(−3)² − (−3).','This is 2(9) + 3 = 21.'],repair:'Use parentheses around negative inputs and follow the order of operations.'},
  {id:'df2',stage:'algebra2',skill:'Domain restrictions',type:'number',prompt:'For (x² − 16)/(x − 4), which value of x must be excluded?',answer:4,display:'x = 4',explanation:['The original denominator is zero when x = 4.','The expression can simplify to x + 4 only with the restriction x ≠ 4 retained.'],repair:'Check the original denominator before canceling factors.'},
  {id:'df3',stage:'algebra2',skill:'Quadratic equations',type:'number',prompt:'Solve x² − 7x + 12 = 0. Enter the larger solution.',answer:4,display:'4; the two solutions are 3 and 4',explanation:['Factor: x² − 7x + 12 = (x − 3)(x − 4).','The product is zero for x = 3 or x = 4. The larger solution is 4.'],repair:'Review factoring and the zero-product property.'},
  {id:'df4',stage:'algebra2',skill:'Radicals',type:'choice',prompt:'What is √(9 + 16)? The square root covers the entire sum.',answer:'a',display:'5',options:[{id:'a',text:'5'},{id:'b',text:'7'},{id:'c',text:'25'},{id:'d',text:'√9 + √16 is always the same as √(9 + 16)'}],explanation:['First evaluate the sum inside the radical: 9 + 16 = 25.','The principal square root of 25 is 5. Square roots do not generally distribute over addition.'],repair:'Check which operations an algebraic rule actually permits.'},
  {id:'dt1',stage:'precalculus',skill:'Angle measure',type:'number',prompt:'150° equals kπ radians. What is k? Enter the coefficient only, as a fraction or decimal.',answer:5/6,display:'k = 5/6',explanation:['Convert degrees by multiplying by π/180.','150 × π/180 = 5π/6, so the coefficient k is 5/6.'],repair:'Review radians and conversion between angle measures.'},
  {id:'dt2',stage:'precalculus',skill:'Basic trigonometry',type:'number',prompt:'What is sin(30°)?',answer:.5,display:'1/2',explanation:['In a 30°–60°–90° triangle, the side opposite 30° is half the hypotenuse.','Sine is opposite divided by hypotenuse, so sin(30°) = 1/2.'],repair:'Review special right triangles and sine as a ratio.'},
  {id:'dt3',stage:'precalculus',skill:'Logarithms',type:'number',prompt:'What is log₁₀(1000)?',answer:3,display:'3',explanation:['The logarithm asks which exponent on 10 gives 1,000.','10³ = 1,000, so log₁₀(1000) = 3.'],repair:'Connect logarithms with the exponent question they answer.'},
  {id:'dt4',stage:'precalculus',skill:'Composition',type:'number',prompt:'Let f(x) = x + 2 and g(x) = 3x. Find f(g(4)).',answer:14,display:'14',explanation:['Evaluate the inner function first: g(4) = 12.','Then f(12) = 12 + 2 = 14.'],repair:'Trace how one function’s output becomes the next function’s input.'}
];

const DOMAIN_LABEL=Object.fromEntries(diagnosticDomains.map(d=>[d.id,d.label]));
const CORE_ORDER=['arithmetic','prealgebra','algebra','algebra2','precalculus'];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
export function diagnosticPool(mode='full') {
  return mode==='short' ? diagnosticDomains.flatMap(d=>diagnosticQuestions.filter(q=>q.stage===d.id).slice(0,2)) : [...diagnosticQuestions];
}
export function createDiagnosticSession(mode='short') {
  return {version:1,mode:mode==='full'?'full':'short',index:0,answers:{},complete:false,paused:false};
}
export function sanitizeDiagnosticSession(raw) {
  if(!isObject(raw)||raw.version!==1||!['short','full'].includes(raw.mode))return null;
  const pool=diagnosticPool(raw.mode),session=createDiagnosticSession(raw.mode);
  session.index=Number.isInteger(raw.index)?Math.min(Math.max(raw.index,0),pool.length-1):0;
  session.paused=raw.paused===true;
  const answers=isObject(raw.answers)?raw.answers:{};
  for(const q of pool){
    const a=Object.hasOwn(answers,q.id)?answers[q.id]:null;
    if(!isObject(a)||!['answer','skip','unknown'].includes(a.kind))continue;
    if(a.kind==='answer'){
      if(typeof a.value!=='string'&&typeof a.value!=='number')continue;
      session.answers[q.id]={kind:'answer',value:String(a.value).slice(0,120)};
    }else session.answers[q.id]={kind:a.kind,value:''};
  }
  session.complete=raw.complete===true&&pool.every(q=>['correct','incorrect','skipped','notLearned'].includes(classify(q,session.answers[q.id])));
  return session;
}
function classify(q,response) {
  if(!response)return 'unvisited';
  if(response.kind==='skip')return 'skipped';
  if(response.kind==='unknown')return 'notLearned';
  if(response.kind!=='answer')return 'invalid';
  if(q.type==='choice'){
    if(!q.options.some(o=>o.id===response.value))return 'invalid';
    return response.value===q.answer?'correct':'incorrect';
  }
  const n=parseNumber(response.value);
  if(n===null)return 'invalid';
  return Math.abs(n-q.answer)<=Math.max(.0001,Math.abs(q.answer)*.0001)?'correct':'incorrect';
}
export function assessDiagnostic(raw) {
  const session=sanitizeDiagnosticSession(raw);
  if(!session)return {available:false,isComplete:false,mode:null,total:0,correct:0,incorrect:0,skipped:0,notLearned:0,unvisited:0,invalid:0,attempted:0,recorded:0,domains:[],items:[],recommendation:null};
  const pool=diagnosticPool(session.mode);
  const items=pool.map(q=>({question:q,response:session.answers[q.id]||null,result:classify(q,session.answers[q.id])}));
  const counts=list=>Object.fromEntries(['correct','incorrect','skipped','notLearned','unvisited','invalid'].map(key=>[key,list.filter(item=>item.result===key).length]));
  const totalCounts=counts(items);
  const domains=diagnosticDomains.map(d=>{
    const subset=items.filter(i=>i.question.stage===d.id),c=counts(subset),attempted=c.correct+c.incorrect;
    const promising=attempted===subset.length&&c.correct/subset.length>=.75;
    return {...d,...c,total:subset.length,attempted,coverage:attempted/subset.length,level:attempted===0?'unexplored':promising?'promising':'review'};
  });
  const isComplete=items.every(i=>!['unvisited','invalid'].includes(i.result));
  const attempted=totalCounts.correct+totalCounts.incorrect;
  let recommendation=null;
  if(isComplete){
    const first=CORE_ORDER.map(id=>domains.find(d=>d.id===id)).find(d=>d.level!=='promising');
    const stage=first?.id||'precalculus';
    let reason;
    if(attempted===0)reason='There are no scored attempts yet. Arithmetic is a suggested starting point to investigate, not a conclusion about your ability. You can also choose a familiar stage and try its practice.';
    else if(!first)reason='Your answers were promising across this small sample. Use the precalculus checks and your intended college course requirements to decide what comes next; this does not establish calculus readiness.';
    else if(first.attempted===0)reason=`${first.label} is the earliest core stage without a scored attempt. Investigate those topics before assuming the later prerequisites are secure.`;
    else if(first.skipped||first.notLearned||first.invalid||first.unvisited)reason=`${first.label} is the earliest core stage with incomplete evidence or skills you have not learned yet. Use its resources to check the foundation before adding more complexity.`;
    else reason=`${first.label} is the earliest core stage where this sample suggests a review. Repair the specific missed skills, then try fresh problems; you do not need to restart every chapter.`;
    const geometry=domains.find(d=>d.id==='geometry');
    recommendation={stage,title:`Explore ${DOMAIN_LABEL[stage]}`,reason,confidence:session.mode==='short'?'Very limited sample: two questions per area.':'Limited sample: four questions per area.',geometryParallel:geometry.level!=='promising',allCorePromising:!first};
  }
  return {available:true,mode:session.mode,total:pool.length,isComplete,attempted,recorded:pool.length-totalCounts.unvisited-totalCounts.invalid,...totalCounts,domains,items,recommendation};
}

function introMarkup(session) {
  const progress=session?assessDiagnostic(session):null;
  return `<div class="diag-intro"><div class="eyebrow">FIND A USEFUL STARTING POINT</div><h1>A learning check,<br><em>with room to be unsure.</em></h1><p class="diag-lead">Try a few questions across the foundations. Your result points to skills to review and resources to use next. There is no timer, and “not learned yet” is a useful answer.</p><div class="note diag-scope"><b>Informal guidance, not official placement.</b><p>This small original question set is not a validated assessment. It does not assign a college class, award credit, or measure your potential as an engineer.</p></div>${session?`<div class="diag-resume"><b>Your saved check is here.</b><p>${progress.recorded} of ${progress.total} responses recorded in the ${session.mode==='short'?'quick':'fuller'} check.</p><button class="btn primary" data-diag-action="resume">Resume my check →</button></div>`:''}<div class="diag-mode-grid"><article class="essay diag-mode"><div class="overline">12 QUESTIONS / A FIRST LOOK</div><h3>Quick orientation</h3><p>Two questions in each area, from arithmetic to a precalculus preview. A starting signal with very limited coverage.</p><button class="btn primary" data-diag-action="start" data-mode="short">Start the quick check →</button></article><article class="essay diag-mode"><div class="overline">24 QUESTIONS / MORE EVIDENCE</div><h3>A fuller check</h3><p>Four questions per area, including conceptual choices, units, geometry, and functions. Still a sample, not a course exam.</p><button class="btn" data-diag-action="start" data-mode="full">Start the fuller check →</button></article></div><div class="diag-before"><h3>Before you begin</h3><ul><li>Use paper for your reasoning. Try without notes, a calculator, or outside help so the result reflects independent work.</li><li>Enter numbers or fractions, such as <span class="diag-math">7/12</span>. For repeating decimals, use at least four decimal places.</li><li>“Skip for now” means no evidence. “Not learned yet” marks an unfamiliar topic. Neither is silently counted as a wrong answer.</li><li>Correct answers and explanations appear after the check. Precalculus questions are a preview; unfamiliarity there does not mean your earlier mathematics is weak.</li></ul></div></div>`;
}
function questionMarkup(session) {
  const pool=diagnosticPool(session.mode),q=pool[session.index],response=session.answers[q.id],report=assessDiagnostic(session);
  const value=response?.kind==='answer'?response.value:'';
  const input=q.type==='choice'?`<fieldset class="diag-options"><legend class="answer-label">Choose one relationship.</legend>${q.options.map(o=>`<label class="diag-option"><input type="radio" name="diag-answer" value="${o.id}" ${value===o.id?'checked':''}><span>${o.text}</span></label>`).join('')}</fieldset>`:`<label class="answer-label" for="diag-answer">Your answer — number or fraction only</label><input class="diag-answer" id="diag-answer" name="diag-answer" type="text" maxlength="120" autocomplete="off" spellcheck="false" value="${escape(value)}" placeholder="For example: 7/12 or −3" aria-describedby="diag-format diag-error"><p class="smallprint" id="diag-format">Use the requested units, but leave their names out of the answer box.</p>`;
  const savedStatus=response?.kind==='skip'?'You previously skipped this question.':response?.kind==='unknown'?'You previously marked this topic “not learned yet.”':'';
  return `<div class="diag-run"><div class="diag-run-top"><div><div class="overline">${session.mode==='short'?'QUICK ORIENTATION':'FULLER CHECK'}</div><p class="diag-position">Question <b>${session.index+1}</b> of ${pool.length}</p></div><button class="btn small" data-diag-action="pause">Pause & save</button></div><label class="smallprint" for="diag-progress">${report.recorded} responses recorded, including skips</label><progress class="diag-progress" id="diag-progress" value="${report.recorded}" max="${pool.length}">${report.recorded} of ${pool.length}</progress><article class="problem-card diag-question"><div class="overline">${DOMAIN_LABEL[q.stage]} · ${q.skill}</div><h1 class="diag-prompt">${q.prompt}</h1>${q.stage==='precalculus'?'<p class="diag-preview-note">Later-stage preview. Use “not learned yet” if you have not studied this topic.</p>':''}<form data-diag-form novalidate>${input}<div class="diag-error" id="diag-error" role="status" aria-live="polite"></div><p class="smallprint diag-saved-status">${savedStatus}</p><div class="actions diag-navigation"><button type="button" class="btn" data-diag-action="back" ${session.index===0?'disabled':''}>← Back</button><button type="submit" class="btn primary">${session.index===pool.length-1?'See my learning map':'Save & next'} →</button></div></form><div class="diag-skip-actions"><button class="btn small" data-diag-action="skip">Skip for now</button><button class="btn small" data-diag-action="unknown">Not learned yet</button></div><p class="smallprint diag-no-score">No score is shown while you work. You can revise earlier answers before finishing.</p></article></div>`;
}
const resultNames={correct:'Correct',incorrect:'Review this skill',skipped:'Skipped',notLearned:'Not learned yet',unvisited:'Not visited',invalid:'No valid response'};
function resultMarkup(session) {
  const r=assessDiagnostic(session),rec=r.recommendation;
  return `<div class="diag-results"><div class="eyebrow">YOUR LEARNING MAP</div><h1>A clearer next step.</h1><p class="diag-lead">This is a snapshot of the questions you tried. Use it to choose a useful starting topic, then check the suggestion with more practice.</p><div class="diag-score-strip"><div><b>${r.correct}</b><span>correct</span></div><div><b>${r.incorrect}</b><span>to review</span></div><div><b>${r.skipped}</b><span>skipped</span></div><div><b>${r.notLearned}</b><span>not learned yet</span></div></div><div class="note diag-recommendation"><div class="overline">SUGGESTED FIRST STOP</div><h3>${rec.title}</h3><p>${rec.reason}</p><div class="actions"><a class="btn primary" data-diag-navigate href="#path/${rec.stage}">Open this learning stage →</a><a class="text-link" data-diag-navigate href="#library/${rec.stage}">Find its resources</a></div><p class="smallprint">${rec.confidence} Confirm with fresh problems on another day. A few answers cannot demonstrate mastery of an entire subject.</p></div>${rec.geometryParallel?'<div class="diag-geometry-note note"><b>Give geometry some attention alongside algebra.</b><p>The geometry sample needs review or more evidence. Work on diagrams, measurement and scale as a parallel strand; this does not automatically require postponing all algebra.</p><a class="text-link" data-diag-navigate href="#path/geometry">Open the geometry strand →</a></div>':''}<div class="diag-domain-grid">${r.domains.map(d=>`<article class="diag-domain ${d.level}"><div class="diag-domain-top"><h3>${d.label}</h3><span class="chip">${d.level==='promising'?'PROMISING SAMPLE':d.level==='unexplored'?'MORE EVIDENCE NEEDED':'REVIEW / INVESTIGATE'}</span></div><p class="smallprint">${d.focus}</p><div class="diag-domain-score"><b>${d.correct} / ${d.total}</b><span>correct in this sample</span></div><div class="diag-domain-bar" aria-hidden="true"><span style="width:${100*d.correct/d.total}%"></span></div><p class="smallprint">${d.incorrect} incorrect · ${d.skipped} skipped · ${d.notLearned} not learned yet</p><a class="text-link" data-diag-navigate href="#path/${d.id}">Explore ${d.label} →</a></article>`).join('')}</div><div class="diag-scoring-note"><h3>How the suggestion works</h3><p>Each area gets the same number of questions. “Promising” requires all items attempted and at least 3 of 4 correct in the fuller check, or 2 of 2 in the quick check. The first core stage needing review or evidence becomes the suggested stop. Geometry is treated as a parallel strand.</p><p>Those thresholds are editorial rules, not validated placement cutoffs. Correct answers to familiar questions can overstate readiness; one mistake can also understate it. If all core areas look promising, the recommendation remains a precalculus review and a check of your college’s actual requirements.</p></div><section class="diag-review"><div class="section-head"><h2>Inspect the reasoning.</h2><p>Look for repeated causes rather than treating every missed question as a different problem.</p></div>${r.items.map((item,i)=>{const q=item.question,a=item.response;const answerText=a?.kind==='answer'?(q.type==='choice'?q.options.find(o=>o.id===a.value)?.text||'No valid choice':a.value):resultNames[item.result];return `<details class="diag-review-item"><summary><span class="diag-review-num">${String(i+1).padStart(2,'0')}</span><span>${q.skill}</span><span class="diag-result-tag ${item.result}">${resultNames[item.result]}</span></summary><p><strong>Question:</strong> ${q.prompt}</p><p><strong>Your response:</strong> ${escape(answerText)}</p><p><strong>Answer:</strong> ${q.display}</p><ol>${q.explanation.map(line=>`<li>${line}</li>`).join('')}</ol>${item.result!=='correct'?`<div class="diag-repair"><b>A useful repair:</b> ${q.repair}</div>`:''}</details>`;}).join('')}</section><div class="note diag-official"><b>College placement is a separate step.</b><p>For Southwestern, use the college’s current placement process and prerequisites. This site does not decide enrollment or transfer credit.</p><a class="text-link" href="https://www.swccd.edu/student-support/placement-and-prerequisites/placement-guide/index.aspx" target="_blank" rel="noopener noreferrer">Southwestern’s placement guide ↗</a></div><div class="actions"><button class="btn" data-diag-action="start" data-mode="short">Start a new quick check</button><button class="btn" data-diag-action="start" data-mode="full">Start a new fuller check</button></div><p class="smallprint diag-retake-note">This version reuses the same questions. An immediate retake measures familiarity as well as skill; validate improvement with fresh problems in your course.</p></div>`;
}
export function renderDiagnostic(savedSession=null) {
  const session=sanitizeDiagnosticSession(savedSession);
  let body;
  if(!session||session.paused)body=introMarkup(session);
  else if(session.complete&&assessDiagnostic(session).isComplete)body=resultMarkup(session);
  else body=questionMarkup(session);
  return `<section class="diag-shell" data-diagnostic aria-label="Informal math learning diagnostic">${body}<div class="diag-confirm-slot" aria-live="polite"></div></section>`;
}

/** Mount in a dedicated host, not the entire page. Returns cleanup(). */
export function mountDiagnostic(root,{session:savedSession=null,onSave=()=>{},onNavigate}={}) {
  if(!root||typeof root.addEventListener!=='function')throw new TypeError('A diagnostic host element is required.');
  let session=sanitizeDiagnosticSession(savedSession),pendingMode=null;
  const clone=()=>session?JSON.parse(JSON.stringify(session)):null;
  const save=()=>onSave(clone());
  const draw=(focus=false)=>{
    root.innerHTML=renderDiagnostic(session);
    if(focus){const heading=root.querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
  };
  const error=message=>{const el=root.querySelector('#diag-error');if(el)el.textContent=message;};
  const currentQuestion=()=>session?diagnosticPool(session.mode)[session.index]:null;
  const capture=()=>{
    const q=currentQuestion();if(!q||session.complete)return;
    const input=q.type==='choice'?root.querySelector('[name="diag-answer"]:checked'):root.querySelector('[name="diag-answer"]');
    if(input){
      const value=String(input.value).slice(0,120),existing=session.answers[q.id];
      // Revisiting a skipped item must not erase its meaning merely because its input is empty.
      if(value===''&&(existing?.kind==='skip'||existing?.kind==='unknown'))return;
      session.answers[q.id]={kind:'answer',value};session.complete=false;
    }
  };
  const advance=()=>{
    const pool=diagnosticPool(session.mode);
    if(session.index<pool.length-1)session.index++;
    else{
      const missing=pool.findIndex(q=>['unvisited','invalid'].includes(classify(q,session.answers[q.id])));
      if(missing>=0){session.index=missing;save();draw(true);error('This earlier question still needs a valid answer, a skip, or “not learned yet.”');return;}
      session.complete=true;session.paused=false;
    }
    save();draw(true);
  };
  const start=mode=>{session=createDiagnosticSession(mode);pendingMode=null;save();draw(true);};
  const onInput=event=>{
    if(!event.target.matches('[name="diag-answer"]'))return;
    capture();save();error('');
  };
  const onSubmit=event=>{
    if(!event.target.matches('[data-diag-form]'))return;
    event.preventDefault();capture();
    const q=currentQuestion(),result=classify(q,session.answers[q.id]);
    if(result==='invalid'||result==='unvisited'){
      error(q.type==='choice'?'Choose an option, skip this question, or mark it not learned yet.':'Enter a number or fraction such as 7/12, or use skip / not learned yet. Leave out units and equations.');save();return;
    }
    advance();
  };
  const onClick=event=>{
    const link=event.target.closest('[data-diag-navigate]');
    if(link&&typeof onNavigate==='function'){event.preventDefault();onNavigate(link.getAttribute('href'));return;}
    const button=event.target.closest('[data-diag-action]');if(!button)return;
    const action=button.dataset.diagAction;
    if(action==='start'){
      const mode=button.dataset.mode==='full'?'full':'short';
      if(!session){start(mode);return;}
      pendingMode=mode;
      root.querySelector('.diag-confirm-slot').innerHTML='<div class="note diag-confirm"><b>Replace this saved diagnostic?</b><p>The new check replaces this diagnostic’s responses. Your resource shelf and other study progress are unaffected.</p><div class="actions"><button class="btn primary" data-diag-action="confirm-start">Start the new check</button><button class="btn" data-diag-action="cancel-start">Keep my current check</button></div></div>';
      root.querySelector('[data-diag-action="confirm-start"]').focus();
    }else if(action==='confirm-start'&&pendingMode)start(pendingMode);
    else if(action==='cancel-start'){pendingMode=null;root.querySelector('.diag-confirm-slot').innerHTML='';}
    else if(action==='resume'&&session){session.paused=false;save();draw(true);}
    else if(action==='pause'&&session){capture();session.paused=true;save();draw(true);}
    else if(action==='back'&&session&&session.index>0){capture();session.index--;save();draw(true);}
    else if((action==='skip'||action==='unknown')&&session){session.answers[currentQuestion().id]={kind:action,value:''};advance();}
  };
  root.addEventListener('input',onInput);
  root.addEventListener('change',onInput);
  root.addEventListener('submit',onSubmit);
  root.addEventListener('click',onClick);
  draw();
  return ()=>{root.removeEventListener('input',onInput);root.removeEventListener('change',onInput);root.removeEventListener('submit',onSubmit);root.removeEventListener('click',onClick);};
}
