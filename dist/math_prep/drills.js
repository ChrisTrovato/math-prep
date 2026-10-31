import {skills,drillStages,generateProblem,normalizeDrillState,startDrill,submitDrill,getDrillReview} from './drill-engine.js';
export {normalizeDrillState} from './drill-engine.js';

const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const stageTitle=id=>drillStages.find(s=>s.id===id)?.title||'All foundations';
const dateLabel=value=>value?new Date(value).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'Not scheduled';
const selected=(a,b)=>a===b?' selected':'';
const link=(href,label,classes='text-link')=>`<a class="${classes}" href="${escape(href)}" data-drill-navigate>${label}</a>`;

function configureRoute(raw,arg){
  const state=normalizeDrillState(raw),skill=skills.find(s=>s.id===arg);
  let changed=false;
  if(skill){
    changed=state.selectedSkill!==skill.id||state.session?.skillId!==skill.id;
    state.selectedStage=skill.stage;state.selectedSkill=skill.id;
  }else if(arg==='all'||drillStages.some(s=>s.id===arg)){
    changed=state.selectedStage!==arg||state.selectedSkill!=='mixed'||(arg!=='all'&&state.session&&generateProblem(state.session.skillId,state.session.seed).stage!==arg);
    state.selectedStage=arg;state.selectedSkill='mixed';
  }
  return {state,changed};
}
function totals(drills){
  return Object.values(drills.records).reduce((sum,r)=>({attempts:sum.attempts+r.attempts,independentCorrect:sum.independentCorrect+r.independentCorrect,assistedCorrect:sum.assistedCorrect+r.assistedCorrect,incorrect:sum.incorrect+r.incorrect}),{attempts:0,independentCorrect:0,assistedCorrect:0,incorrect:0});
}
function recentMarkup(record){
  if(!record?.recent?.length)return '<p class="smallprint">No first attempts recorded for this skill yet.</p>';
  return `<div class="drill-recent" aria-label="Recent first attempts">${record.recent.slice(-8).map(a=>{
    const label=a.correct?(a.assisted?'Correct with help':'Correct independently'):'Needs another look';
    return `<span class="drill-recent-mark ${a.correct?(a.assisted?'assisted':'independent'):'retry'}" title="${label} · ${escape(dateLabel(a.at))}" aria-label="${label}">${a.correct?(a.assisted?'H':'✓'):'↻'}</span>`;
  }).join('')}</div><p class="smallprint">Most recent first attempts, oldest to newest. ✓ independent · H with help · ↻ review.</p>`;
}
function solutionMarkup(problem){
  return `<section class="drill-solution"><div class="eyebrow">WORK THROUGH THE REASONING</div><h3>${escape(problem.display)}</h3><ol>${problem.steps.map(step=>`<li>${escape(step)}</li>`).join('')}</ol><div class="drill-why"><b>Why this matters</b><p>${escape(problem.why)}</p></div></section>`;
}
function feedbackMarkup(session){
  const feedback=session.feedback;
  if(!feedback)return '';
  const first=session.firstAttempt;
  const currentWasFirst=!!first&&feedback.input===first.input;
  let detail;
  if(feedback.correct){
    if(currentWasFirst&&first.correct)detail=first.assisted?'Correct with help. That is useful learning; this first attempt is recorded as assisted.':'Correct on the first try without opening this question’s hint or solution. Recorded as independent.';
    else detail='This answer is correct. Your original first attempt stays in the record; retries do not add attempts.';
  }else detail='That answer does not match the requested quantity. Recheck the units, signs, and what the question asks. You can revise it or open a hint.';
  return `<div class="drill-feedback ${feedback.correct?'correct':'retry'}" role="status"><b>${feedback.correct?'That works.':'A useful place to investigate.'}</b><p>${detail}</p>${first&&!first.correct?'<p class="smallprint">The first attempt is recorded as a review signal. Getting a later attempt right is still progress.</p>':''}</div>`;
}
function questionMarkup(drills){
  const session=drills.session;
  if(!session)return '<article class="drill-problem"><div class="eyebrow">A FRESH SET OF NUMBERS</div><h2>Choose a skill. Try a problem.</h2><p>Each skill generates many variations with worked reasoning. Start with a topic that feels familiar, then stretch.</p><button class="btn primary" data-drill-action="new">Generate a problem →</button></article>';
  const problem=generateProblem(session.skillId,session.seed),record=drills.records[problem.skillId];
  const showReasoning=session.solutionShown||session.feedback?.correct;
  return `<div class="drill-grid"><article class="drill-problem"><div class="drill-problem-top"><span class="overline">${escape(stageTitle(problem.stage))} / ${escape(problem.title)}</span><span class="chip">GENERATED PRACTICE</span></div><h2 class="drill-prompt">${escape(problem.prompt)}</h2><p class="drill-input-note">Enter a number or fraction${problem.units?`, in ${escape(problem.units)}`:''}. Leave unit symbols out of the box.${problem.tolerance?' For a repeating decimal, use at least four decimal places.':''}</p><form data-drill-form novalidate><label for="drill-answer" class="answer-label">Your answer</label><div class="drill-answer-row"><input id="drill-answer" name="drill-answer" type="text" maxlength="120" autocomplete="off" spellcheck="false" value="${escape(session.input)}" placeholder="For example: 7/12 or −3" aria-describedby="drill-input-error"><button class="btn primary" type="submit">${session.firstAttempt?'Check this try':'Check answer'} →</button></div><div id="drill-input-error" class="drill-input-error" role="status"></div></form><div class="drill-help-actions"><button class="btn small" data-drill-action="hint" ${session.hintUsed?'disabled':''}>${session.hintUsed?'Hint opened':'Give me a hint'}</button><button class="btn small" data-drill-action="solution" ${session.solutionShown?'disabled':''}>${session.solutionShown?'Solution opened':'Show the worked solution'}</button></div>${session.hintUsed?`<aside class="drill-hint"><b>A nudge</b><p>${escape(problem.hint)}</p></aside>`:''}${feedbackMarkup(session)}${showReasoning?solutionMarkup(problem):''}<div class="drill-question-footer"><button class="btn" data-drill-action="new">Another generated problem →</button><span class="smallprint">${session.firstAttempt?'First attempt saved. Further checks do not add to your count.':'A new problem replaces this unfinished question without adding an attempt.'}</span></div></article><aside class="drill-sidebar"><div class="drill-skill-card"><div class="eyebrow">THE SKILL UNDERNEATH</div><h3>${escape(problem.title)}</h3><p>${escape(skills.find(s=>s.id===problem.skillId).description)}</p>${link('#curriculum/'+problem.stage,'Go to the learning material →')}<div class="drill-skill-numbers"><div><b>${record?.attempts||0}</b><span>first attempts</span></div><div><b>${record?.independentCorrect||0}</b><span>independent correct</span></div></div>${recentMarkup(record)}${record?.nextReviewAt?`<p class="drill-next-review">Suggested review: <strong>${escape(dateLabel(record.nextReviewAt))}</strong></p>`:''}</div><div class="drill-coaching note"><b>A useful way to practice</b><ol><li>Name the quantity you need.</li><li>Write the relationship before calculating.</li><li>Check the answer’s sign, size, and units.</li></ol><p class="smallprint">Use a hint when you need it. Then try a fresh variation later without help.</p></div><details class="drill-record-explainer"><summary>What counts as independent?</summary><p>A correct first submitted answer before opening this question’s hint or solution. This is a local behavior label, not a measure of confidence, a verified proctored result, or mastery.</p><p>Outside help cannot be detected. For a meaningful record, try on paper without answer tools; treat worked solutions as study.</p></details></aside></div>`;
}
export function renderDrills(state={},arg=''){
  const {state:drills}=configureRoute(state?.drills,arg),summary=totals(drills);
  const available=skills.filter(skill=>drills.selectedStage==='all'||skill.stage===drills.selectedStage);
  return `<section class="drill-shell" data-drills data-drill-route="${escape(arg)}"><div class="page-intro"><div class="eyebrow">THE PRACTICE WORKSHOP</div><h1>Turn a rule<br>into a <em>skill.</em></h1><p>36 skill families. Fresh numbers, deliberate practice, and reasoning you can inspect. Choose one skill to build fluency, or mix topics to practice choosing a method.</p></div><div class="drill-overview"><span><b>${summary.attempts}</b> first attempts</span><span><b>${summary.independentCorrect}</b> independent correct</span><span><b>${summary.assistedCorrect}</b> correct with help</span>${link('#review','My review queue →')}</div><div class="drill-toolbar"><label for="drill-stage">Learning stage<select id="drill-stage"><option value="all"${selected(drills.selectedStage,'all')}>All stages · broad mix</option>${drillStages.map(stage=>`<option value="${stage.id}"${selected(drills.selectedStage,stage.id)}>${stage.title}</option>`).join('')}</select></label><label for="drill-skill">What to practice<select id="drill-skill"><option value="mixed"${selected(drills.selectedSkill,'mixed')}>Mixed practice in this selection</option>${available.map(skill=>`<option value="${skill.id}"${selected(drills.selectedSkill,skill.id)}>${escape(skill.title)}</option>`).join('')}</select></label><button class="btn primary" data-drill-action="new">New problem →</button></div>${questionMarkup(drills)}<div class="drill-boundary smallprint"><b>Practice, not placement.</b> These original generated questions are an informal learning tool, not a validated assessment or a complete course. Your current question and record stay in this browser when workspace storage is available. Use the workspace backup to move them between browsers.</div></section>`;
}

export function mountDrills(root,{state={},onSave=()=>{},onNavigate}={}){
  if(!root||typeof root.addEventListener!=='function')throw new TypeError('A drills host element is required.');
  const arg=root.querySelector('[data-drills]')?.dataset.drillRoute||'';
  const configured=configureRoute(state?.drills,arg);
  let drills=configured.state;
  const save=()=>{const snapshot=JSON.parse(JSON.stringify(drills));if(state&&typeof state==='object')state.drills=snapshot;onSave(snapshot);};
  const draw=(focus=false)=>{root.innerHTML=renderDrills({drills});if(focus){const heading=root.querySelector('.drill-prompt')||root.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}};
  const capture=()=>{const input=root.querySelector('[name="drill-answer"]');if(input&&drills.session)drills.session.input=String(input.value).slice(0,120);};
  const error=message=>{const node=root.querySelector('#drill-input-error');if(node)node.textContent=message;};
  const next=()=>{drills=startDrill(drills);save();draw(true);};
  const navigate=hash=>{if(typeof onNavigate==='function')onNavigate(hash);else if(typeof globalThis.location==='object')globalThis.location.hash=hash;};
  const onInput=event=>{
    if(!event.target.matches?.('[name="drill-answer"]')||!drills.session)return;
    capture();drills.session.feedback=null;save();error('');
  };
  const onChange=event=>{
    if(event.target.id==='drill-stage'){
      const id=event.target.value;if(id!=='all'&&!drillStages.some(s=>s.id===id))return;
      drills.selectedStage=id;drills.selectedSkill='mixed';next();navigate('#drills/'+id);
    }else if(event.target.id==='drill-skill'){
      const id=event.target.value;if(id!=='mixed'&&!skills.some(s=>s.id===id&&(drills.selectedStage==='all'||s.stage===drills.selectedStage)))return;
      drills.selectedSkill=id;next();navigate('#drills/'+(id==='mixed'?drills.selectedStage:id));
    }
  };
  const onSubmit=event=>{
    if(!event.target.matches?.('[data-drill-form]'))return;
    event.preventDefault();capture();
    if(!drills.session)return;
    const result=submitDrill(drills,drills.session.input);drills=result.state;save();
    if(!result.grade.valid){error(result.grade.message);return;}
    draw();
    const feedback=root.querySelector('.drill-feedback');
    if(feedback){feedback.tabIndex=-1;feedback.focus?.({preventScroll:true});feedback.scrollIntoView?.({block:'nearest'});}
  };
  const onClick=event=>{
    const anchor=event.target.closest?.('[data-drill-navigate]');
    if(anchor&&typeof onNavigate==='function'){event.preventDefault();onNavigate(anchor.getAttribute('href'));return;}
    const button=event.target.closest?.('[data-drill-action]');if(!button)return;
    const action=button.dataset.drillAction;
    if(action==='new'){next();return;}
    if(!drills.session)return;
    capture();
    if(action==='hint')drills.session.hintUsed=true;
    else if(action==='solution')drills.session.solutionShown=true;
    else return;
    save();draw();
    const help=root.querySelector(action==='hint'?'.drill-hint':'.drill-solution');
    if(help){help.tabIndex=-1;help.focus?.({preventScroll:true});}
  };
  root.addEventListener('input',onInput);root.addEventListener('change',onChange);root.addEventListener('submit',onSubmit);root.addEventListener('click',onClick);
  if(!drills.session||configured.changed){drills=startDrill(drills);save();}
  draw();
  return ()=>{root.removeEventListener('input',onInput);root.removeEventListener('change',onChange);root.removeEventListener('submit',onSubmit);root.removeEventListener('click',onClick);};
}

export function renderReview(state={}){
  const drills=normalizeDrillState(state?.drills),items=getDrillReview(drills),due=items.filter(item=>item.due),summary=totals(drills);
  const untouched=skills.filter(skill=>!drills.records[skill.id]?.attempts);
  const next=due[0]||items[0];
  return `<section class="drill-review-page" data-drill-review><div class="page-intro"><div class="eyebrow">RETURN BEFORE YOU FORGET</div><h1>Meet the idea<br><em>again.</em></h1><p>Short returns to familiar skills are more useful than a single marathon. This queue uses a simple, visible scheduling rule. It makes a review suggestion, not a claim that you have mastered a topic.</p></div><div class="drill-review-summary"><div><b>${due.length}</b><span>skills due now</span></div><div><b>${items.length-due.length}</b><span>scheduled later</span></div><div><b>${summary.attempts}</b><span>first attempts recorded</span></div><div><b>${untouched.length}</b><span>skills not tried yet</span></div></div><div class="actions">${link(next?'#drills/'+next.id:'#drills',due.length?'Practice the next due skill →':next?'Practice a tracked skill →':'Try your first skill →','btn primary')}${link('#drills','Choose another skill','btn')}</div><details class="drill-review-rule"><summary>Exactly how review dates are chosen</summary><p>Consecutive independent correct first attempts on a skill suggest returns after <b>1, 3, 7, then 14 days</b>. Additional consecutive independent correct first attempts stay at 14 days. A first-attempt error or a correct answer after opening help resets the suggestion to 1 day.</p><p>The interval starts at the latest first attempt. There is no probability estimate, hidden mastery score, or punishment for returning late. This is an editorial heuristic, not an optimized memory model. Repeated submissions of the same question never add attempts.</p><p>You can practice earlier or later. To make the record useful, use fresh questions, and eventually check understanding with unfamiliar problems from your course.</p></details>${items.length?`<div class="drill-review-list">${items.map(item=>{const r=item.record;return `<article class="drill-review-card ${item.due?'due':''}"><div class="drill-review-card-top"><span class="overline">${escape(stageTitle(item.stage))}</span><span class="chip">${item.due?'DUE NOW':'SUGGESTED '+escape(dateLabel(r.nextReviewAt).toUpperCase())}</span></div><h2>${escape(item.title)}</h2><p>${escape(item.description)}</p>${recentMarkup(r)}<div class="drill-review-counts"><span>${r.independentCorrect} independent correct</span><span>${r.assistedCorrect} assisted correct</span><span>${r.incorrect} first attempts to review</span></div><p class="smallprint">Last tried ${escape(dateLabel(r.lastAttemptAt))} · ${r.intervalDays}-day suggested interval.</p><div class="actions">${link('#drills/'+item.id,'Practice this skill →','btn')}${link('#curriculum/'+item.stage,'Review the lesson')}</div></article>`;}).join('')}</div>`:'<div class="drill-review-empty note"><h2>A queue starts with an attempt.</h2><p>Try a generated question in the workshop. Your first submitted answer creates a review suggestion. Hints and mistakes are useful information, not reasons to stop.</p></div>'}${untouched.length?`<section class="drill-unexplored"><div class="section-head"><h2>Still to explore.</h2><p>Untried does not mean weak. These skills simply have no practice record here yet.</p></div><div class="drill-unexplored-links">${untouched.map(skill=>link('#drills/'+skill.id,escape(skill.title),'drill-skill-link')).join('')}</div></section>`:''}</section>`;
}
export function mountReview(root,{onNavigate}={}){
  if(!root||typeof root.addEventListener!=='function')throw new TypeError('A review host element is required.');
  const onClick=event=>{const anchor=event.target.closest?.('[data-drill-navigate]');if(anchor&&typeof onNavigate==='function'){event.preventDefault();onNavigate(anchor.getAttribute('href'));}};
  root.addEventListener('click',onClick);
  return ()=>root.removeEventListener('click',onClick);
}
