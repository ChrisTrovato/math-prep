import {parseNumber} from './problems.js';

// Original generated exercises. Each template constrains its parameters so that
// its question has one requested numeric answer. This is practice, not placement.
const stageNames={arithmetic:'Arithmetic',prealgebra:'Pre-algebra',algebra:'Algebra',geometry:'Geometry',algebra2:'Algebra II',precalculus:'Precalculus'};
export const drillStages=Object.entries(stageNames).map(([id,title])=>({id,title}));
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fraction=(n,d)=>{const g=gcd(n,d);return d/g===1?String(n/g):`${n/g}/${d/g}`;};
const term=n=>n<0?`− ${Math.abs(n)}`:`+ ${n}`;
const fmt=n=>Number.isInteger(n)?String(n):String(Number(n.toPrecision(12)));
const closeFraction=.000051;
const triples=[[3,4,5],[5,12,13],[8,15,17],[7,24,25]];

export function normalizeDrillSeed(seed){
  if(typeof seed==='number'&&(!Number.isSafeInteger(seed)))throw new TypeError('A numeric seed must be a safe integer.');
  if(!['string','number'].includes(typeof seed))throw new TypeError('Use a string or integer seed.');
  const value=String(seed);
  if(!value.length||value.length>160)throw new RangeError('A seed must contain 1–160 characters.');
  return value;
}
function randomSource(seed){
  let n=2166136261;
  for(const char of normalizeDrillSeed(seed)){n^=char.codePointAt(0);n=Math.imul(n,16777619);}
  return ()=>{n=(n+0x6D2B79F5)|0;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};
}
function context(seed){
  const random=randomSource(seed);
  const int=(min,max)=>min+Math.floor(random()*(max-min+1));
  return {int,pick:values=>values[int(0,values.length-1)]};
}
const templates=[];
function skill(id,stage,title,description,make){templates.push({id,stage,title,description,make});}
function result(prompt,answer,display,hint,steps,why,parameters,extra={}){
  return {prompt,answer,display,hint,steps,why,parameters,...extra};
}

skill('fraction-sums','arithmetic','Add unlike fractions','Make equivalent pieces before adding them.',r=>{
  const b=r.int(2,12),d=r.int(2,12),a=r.int(1,b-1),c=r.int(1,d-1),n=a*d+c*b,den=b*d;
  return result(`Compute ${a}/${b} + ${c}/${d}.`,n/den,fraction(n,den),'Use a common denominator; add pieces of the same size.',[`A common denominator is ${b} × ${d} = ${den}.`,`${a}/${b} = ${a*d}/${den}; ${c}/${d} = ${c*b}/${den}.`,`Add the numerators, then simplify: ${n}/${den} = ${fraction(n,den)}.`],'Fractions express exact proportions, such as part of a fuel load or a measurement interval.',{a,b,c,d},{tolerance:closeFraction});
});
skill('fraction-products','arithmetic','Multiply fractions','Understand multiplication as scaling.',r=>{
  const a=r.int(1,12),b=r.int(2,15),c=r.int(1,12),d=r.int(2,15),n=a*c,den=b*d;
  return result(`Compute (${a}/${b}) × (${c}/${d}).`,n/den,fraction(n,den),'Multiply the numerators and multiply the denominators.',[`(${a} × ${c})/(${b} × ${d}) = ${n}/${den}.`,`Reduce common factors: ${fraction(n,den)}.`],'Multiplication can shrink an amount when the scale factor is between zero and one.',{a,b,c,d},{tolerance:closeFraction});
});
skill('fraction-division','arithmetic','Divide fractions','Ask how many portions fit in an amount.',r=>{
  const a=r.int(1,14),b=r.int(2,12),c=r.int(1,10),d=r.int(2,12),n=a*d,den=b*c;
  return result(`Compute (${a}/${b}) ÷ (${c}/${d}).`,n/den,fraction(n,den),'Multiply by the reciprocal of the divisor.',[`(${a}/${b}) ÷ (${c}/${d}) = (${a}/${b}) × (${d}/${c}).`,`Multiply and simplify: ${n}/${den} = ${fraction(n,den)}.`],'Division compares quantities: the answer counts how many divisor-sized portions fit.',{a,b,c,d},{tolerance:closeFraction});
});
skill('percentage-change','arithmetic','Percent change','Keep track of the original reference amount.',r=>{
  const mass=r.int(10,100)*10,percent=r.int(1,9)*5,increase=r.pick([true,false]),change=mass*percent/100,answer=increase?mass+change:mass-change;
  return result(`A ${mass} g component becomes ${percent}% ${increase?'heavier':'lighter'}. What is its new mass in grams?`,answer,`${fmt(answer)} g`,'First find the change as a fraction of the original mass.',[`${percent}% of ${mass} g = ${percent}/100 × ${mass} = ${fmt(change)} g.`,`${increase?'Add':'Subtract'} the change: ${mass} ${increase?'+':'−'} ${fmt(change)} = ${fmt(answer)} g.`],'A percentage always has a reference amount; a reduction is different from the amount remaining.',{mass,percent,increase},{units:'g'});
});
skill('signed-operations','arithmetic','Signs and operation order','Multiply before adding; preserve negative signs.',r=>{
  const a=r.int(-18,18),b=r.int(2,12),c=r.int(-12,-1),answer=a+b*c;
  return result(`Compute ${a} + ${b} × (${c}).`,answer,String(answer),'Do multiplication first; a positive times a negative is negative.',[`${b} × (${c}) = ${b*c}.`,`${a} + (${b*c}) = ${answer}.`],'Signed quantities describe directions, offsets and changes, not just amounts.',{a,b,c});
});
skill('decimal-cost','arithmetic','Decimal multiplication','Combine a unit rate and a count.',r=>{
  const cents=r.int(15,250),count=r.int(3,35),price=cents/100,answer=cents*count/100;
  return result(`Each small connector costs $${price.toFixed(2)}. What do ${count} connectors cost, before tax? Enter dollars.`,answer,`$${answer.toFixed(2)}`,'Multiply price per connector by the number of connectors.',[`${count} × ${cents} cents = ${count*cents} cents.`,`Divide by 100: $${answer.toFixed(2)}.`],'Unit rates turn counts into budgets, masses or energy requirements.',{cents,count},{units:'dollars'});
});

skill('two-step-equations','prealgebra','Two-step equations','Undo addition and multiplication while preserving equality.',r=>{
  const a=r.int(2,12),b=r.int(-20,20),x=r.int(-12,20),c=a*x+b;
  return result(`Solve ${a}x ${term(b)} = ${c}. Enter x.`,x,`x = ${x}`,'Undo the added term on both sides, then divide by the coefficient.',[`Subtract ${b} from both sides: ${a}x = ${c-b}.`,`Divide by ${a}: x = ${x}.`,`Check: ${a}(${x}) ${term(b)} = ${c}.`],'An equation is a constraint; equal operations preserve its solutions.',{a,b,x,c});
});
skill('proportions','prealgebra','Proportional relationships','Use a constant ratio to find a missing amount.',r=>{
  const units=r.int(2,12),mass=r.int(3,25),count=r.int(13,40),total=units*mass,answer=count*mass;
  return result(`${units} identical brackets have total mass ${total} g. What is the mass of ${count} brackets, in grams?`,answer,`${answer} g`,'Find the mass of one bracket, then scale up.',[`One bracket has mass ${total}/${units} = ${mass} g.`,`${count} brackets have mass ${count} × ${mass} = ${answer} g.`],'Proportional reasoning works when the unit rate is constant.',{units,mass,count,total},{units:'g'});
});
skill('metric-conversion','prealgebra','Metric conversion','Let the units tell you whether to multiply or divide.',r=>{
  const cm=r.int(10,4999),answer=cm/100;
  return result(`Convert ${cm} centimeters to meters.`,answer,`${fmt(answer)} m`,'There are 100 centimeters in one meter.',[`${cm} cm × (1 m / 100 cm).`,`The centimeters cancel: ${cm}/100 = ${fmt(answer)} m.`],'An unchanged physical length can be expressed in different units; the number changes with the unit.',{cm},{units:'m'});
});
skill('scientific-notation','prealgebra','Scientific notation','Interpret powers of ten without changing the sign of the quantity.',r=>{
  const coefficient=r.int(11,99)/10,exponent=r.pick([-4,-3,-2,-1,1,2,3,4]),answer=coefficient*10**exponent;
  return result(`Write ${coefficient} × 10^(${exponent}) as an ordinary decimal number.`,answer,fmt(answer),'A negative exponent means divide by a power of ten.',[`10^(${exponent}) = ${fmt(10**exponent)}.`,`Multiply: ${coefficient} × ${fmt(10**exponent)} = ${fmt(answer)}.`],'Scientific notation keeps tiny sensor measurements and large distances readable.',{coefficient,exponent});
});
skill('arithmetic-mean','prealgebra','Mean of measurements','Distinguish the total from an equal share of the total.',r=>{
  const values=Array.from({length:r.int(3,6)},()=>r.int(10,90)),total=values.reduce((a,b)=>a+b,0),answer=total/values.length;
  return result(`Find the arithmetic mean of these readings: ${values.join(', ')}.`,answer,fraction(total,values.length),'Add the readings, then divide by the number of readings.',[`Sum = ${values.join(' + ')} = ${total}.`,`There are ${values.length} readings, so the mean is ${total}/${values.length} = ${fraction(total,values.length)}.`],'A mean summarizes measurements, but does not by itself describe their spread or accuracy.',{values},{tolerance:closeFraction});
});
skill('rate-and-time','prealgebra','Rate, time and amount','Rearrange a constant-rate relationship.',r=>{
  const power=r.int(2,30)*5,hours=r.int(1,16)/2,energy=power*hours;
  return result(`A hypothetical rover draws a constant ${power} W. How many hours would it take to use ${energy} Wh of energy?`,hours,`${hours} h`,'Energy = power × time, so time = energy / power.',[`E = Pt, so t = E/P.`,`${energy} Wh / ${power} W = ${hours} h.`],'Units are part of the reasoning: watt-hours divided by watts leaves hours. Real loads vary.',{power,hours,energy},{units:'h'});
});

skill('distributive-equations','algebra','Distribute and collect','Solve an equation with x on both sides.',r=>{
  const a=r.int(2,9),c=r.pick([1,2,3,4,5,6,7,8,9].filter(n=>n!==a)),b=r.int(-9,9),x=r.int(-12,12),d=a*(x+b)-c*x;
  return result(`Solve ${a}(x ${term(b)}) = ${c}x ${term(d)}. Enter x.`,x,`x = ${x}`,'Distribute across the parentheses, then collect x terms on one side.',[`${a}x ${term(a*b)} = ${c}x ${term(d)}.`,`${a-c}x = ${d-a*b}.`,`Divide by ${a-c}: x = ${x}.`],'Collecting terms is useful whenever two effects depend on the same unknown.',{a,b,c,d,x});
});
skill('slope-from-points','algebra','Slope from two points','Keep the same point order in rise and run.',r=>{
  const x1=r.int(-10,10),y1=r.int(-15,15),dx=r.int(2,12),dy=r.int(-20,20),x2=x1+dx,y2=y1+dy;
  return result(`A line passes through (${x1}, ${y1}) and (${x2}, ${y2}). What is its slope?`,dy/dx,fraction(dy,dx),'Slope is change in output divided by the corresponding change in input.',[`Δy = ${y2} − (${y1}) = ${dy}.`,`Δx = ${x2} − (${x1}) = ${dx}.`,`m = Δy/Δx = ${fraction(dy,dx)}.`],'Slope describes a rate. Its units would be output units per input unit.',{x1,y1,x2,y2},{tolerance:closeFraction});
});
skill('formula-rearrangement','algebra','Rearrange a formula','Isolate a quantity before substituting numbers.',r=>{
  const current=r.int(1,25)/10,resistance=r.int(2,60),voltage=current*resistance;
  return result(`Use V = IR. If V = ${fmt(voltage)} volts and I = ${current} amperes, find R in ohms.`,resistance,`${resistance} Ω`,'Divide both sides by the nonzero current I.',[`V = IR gives R = V/I.`,`R = ${fmt(voltage)}/${current} = ${resistance} Ω.`],'The same algebraic structure appears in many engineering relationships; the physical assumptions still matter.',{current,resistance,voltage},{units:'ohms'});
});
skill('linear-systems','algebra','Two simultaneous constraints','Eliminate a variable by combining equations.',r=>{
  const x=r.int(-15,20),y=r.int(-15,20),sum=x+y,difference=x-y;
  return result(`Solve x + y = ${sum} and x − y = ${difference}. Enter x.`,x,`x = ${x} (y = ${y})`,'Add the equations so that y and −y cancel.',[`Add both equations: 2x = ${sum} + (${difference}) = ${2*x}.`,`Divide by 2: x = ${x}.`,`Then y = ${sum} − (${x}) = ${y}. Check both original equations.`],'A valid solution must satisfy every constraint at once.',{x,y,sum,difference});
});
skill('line-intercept','algebra','Recover a line intercept','Use a known point and slope to find the starting value.',r=>{
  const m=r.int(-6,6),x=r.int(-12,12),b=r.int(-20,20),y=m*x+b;
  return result(`A line has equation y = ${m}x + b and passes through (${x}, ${y}). Find b.`,b,`b = ${b}`,'Substitute the known point, then isolate b.',[`${y} = ${m}(${x}) + b.`,`b = ${y} − (${m*x}) = ${b}.`],'The intercept anchors a constant-rate model to a reference condition.',{m,x,b,y});
});
skill('linear-functions','algebra','Evaluate a linear function','Treat a function as an input-output rule.',r=>{
  const m=r.int(-9,9),b=r.int(-20,20),x=r.int(-12,12),answer=m*x+b;
  return result(`For f(x) = ${m}x ${term(b)}, find f(${x}).`,answer,String(answer),'Replace every x with the given input, using parentheses.',[`f(${x}) = ${m}(${x}) ${term(b)}.`,`${m*x} ${term(b)} = ${answer}.`],'Function notation identifies which input produced an output, a habit that carries into code and models.',{m,b,x});
});

skill('right-triangle-distance','geometry','Right-triangle distance','Use perpendicular components to find a diagonal.',r=>{
  const [a,b,c]=r.pick(triples),k=r.int(1,12),legA=a*k,legB=b*k,answer=c*k;
  return result(`A right triangle has perpendicular legs ${legA} cm and ${legB} cm. Find the hypotenuse in centimeters.`,answer,`${answer} cm`,'Use a² + b² = c²; the hypotenuse is opposite the right angle.',[`c² = ${legA}² + ${legB}² = ${legA**2+legB**2}.`,`A length is nonnegative, so c = √${answer**2} = ${answer} cm.`],'The same relationship gives distances from perpendicular coordinate changes.',{legA,legB},{units:'cm'});
});
skill('triangle-area','geometry','Area of a triangle','Use the height perpendicular to the chosen base.',r=>{
  const base=r.int(3,35),height=r.int(3,30),answer=base*height/2;
  return result(`A triangular panel has base ${base} cm and perpendicular height ${height} cm. Find its area in cm².`,answer,`${answer} cm²`,'A triangle is half the corresponding base-by-height rectangle.',[`A = bh/2.`,`A = ${base} × ${height}/2 = ${answer} cm².`],'Areas use squared units; a slanted side is not automatically the perpendicular height.',{base,height},{units:'cm²'});
});
skill('circle-area','geometry','Area of a circle','Separate radius from diameter.',r=>{
  const radius=r.int(2,35),answer=3.14*radius**2;
  return result(`A circular plate has radius ${radius} cm. Using π = 3.14 for this exercise, find its area in cm².`,answer,`${fmt(answer)} cm²`,'Use A = πr²; square the radius before multiplying.',[`A = 3.14 × ${radius}².`,`A = 3.14 × ${radius**2} = ${fmt(answer)} cm².`],'Circle area matters for cross-sections and material quantities. Here π is deliberately approximated.',{radius,pi:3.14},{units:'cm²'});
});
skill('rectangular-volume','geometry','Volume and cubic units','Multiply three independent lengths.',r=>{
  const length=r.int(2,20),width=r.int(2,18),height=r.int(2,16),answer=length*width*height;
  return result(`A rectangular container measures ${length} cm × ${width} cm × ${height} cm internally. Find its volume in cm³.`,answer,`${answer} cm³`,'Volume is base area multiplied by perpendicular height.',[`Base area = ${length} × ${width} = ${length*width} cm².`,`Volume = ${length*width} × ${height} = ${answer} cm³.`],'Cubic units distinguish capacity from area; real usable capacity may be smaller than the geometric volume.',{length,width,height},{units:'cm³'});
});
skill('scale-model-length','geometry','Scale model length','Compare corresponding lengths in the same units.',r=>{
  const model=r.int(2,30),scale=r.int(2,25)*5,answer=model*scale;
  return result(`A 1:${scale} scale model has a ${model} cm-long feature. What is the real length in centimeters?`,answer,`${answer} cm`,'Each model centimeter represents the scale factor in real centimeters.',[`Real/model = ${scale}/1.`,`Real length = ${model} × ${scale} = ${answer} cm.`],'A drawing scale is a ratio of lengths, not automatically a ratio of areas or masses.',{model,scale},{units:'cm'});
});
skill('volume-scaling','geometry','Scaling changes volume','Apply the length factor in all three dimensions.',r=>{
  const volume=r.int(2,80),k=r.int(2,8),answer=volume*k**3;
  return result(`A solid has volume ${volume} cm³. Every length is multiplied by ${k}, keeping the same shape. Find the new volume in cm³.`,answer,`${answer} cm³`,'A uniform length scale factor k produces a volume factor k³.',[`Volume factor = ${k}³ = ${k**3}.`,`New volume = ${volume} × ${k**3} = ${answer} cm³.`],'At unchanged density, mass follows volume. This is one reason enlarged vehicles need fresh engineering.',{volume,k},{units:'cm³'});
});

skill('quadratic-functions','algebra2','Evaluate a quadratic','Keep parentheses around negative inputs.',r=>{
  const a=r.int(1,5),b=r.int(-12,12),c=r.int(-15,15),x=r.int(-9,9),answer=a*x*x+b*x+c;
  return result(`For f(x) = ${a}x² ${term(b)}x ${term(c)}, find f(${x}).`,answer,String(answer),'Square the complete input, then apply the coefficient.',[`f(${x}) = ${a}(${x})² ${term(b)}(${x}) ${term(c)}.`,`The three terms are ${a*x*x}, ${b*x}, and ${c}; their sum is ${answer}.`],'Quadratic relationships describe simple areas and idealized constant-acceleration motion.',{a,b,c,x});
});
skill('quadratic-roots','algebra2','Solve a factorable quadratic','Find both roots before selecting the requested one.',r=>{
  const low=r.int(-12,8),high=r.int(low+1,15),b=-(low+high),c=low*high;
  return result(`Solve x² ${term(b)}x ${term(c)} = 0. Enter the larger root.`,high,`${high} (the roots are ${low} and ${high})`,'Look for two numbers whose sum is the linear coefficient and whose product is the constant.',[`Factor: (x ${term(-low)})(x ${term(-high)}) = 0.`,`At least one factor must be zero, so x = ${low} or x = ${high}.`,`The larger root is ${high}.`],'A nonlinear constraint can have multiple solutions; the question or physical context may select one.',{low,high,b,c});
});
skill('domain-restrictions','algebra2','Keep domain restrictions','A denominator cannot be zero.',r=>{
  const a=r.int(-50,50);
  return result(`For (x² − ${a*a}) / (x ${term(-a)}), which single value of x must be excluded?`,a,`x ≠ ${a}`,'Use the denominator of the original expression, even if a factor can cancel.',[`The denominator is zero when x ${term(-a)} = 0.`,`Therefore x = ${a} is excluded.`,`Simplifying the expression does not restore that missing input.`],'A simplified formula must retain the conditions under which the original relationship was defined.',{a});
});
skill('exponential-equations','algebra2','Find an exponent','Ask what power produces the given output.',r=>{
  const base=r.int(2,8),exponent=r.int(2,7),value=base**exponent;
  return result(`Solve ${base}^x = ${value}. Enter x.`,exponent,`x = ${exponent}`,'Write the right side as repeated multiplication by the base.',[`${Array(exponent).fill(base).join(' × ')} = ${value}.`,`Thus ${base}^${exponent} = ${value}, so x = ${exponent}.`],'Exponential models describe repeated proportional change. Finding the exponent is logarithmic thinking.',{base,exponent,value});
});
skill('principal-square-root','algebra2','The principal square root','Distinguish √a from solving x² = a.',r=>{
  const root=r.int(2,75),value=root**2;
  return result(`Find √${value}, the principal square root.`,root,String(root),'The square-root symbol requests the nonnegative root.',[`${root}² = ${value}.`,`√${value} = ${root}. Solving x² = ${value} would instead give both ${root} and −${root}.`],'A formula may request a nonnegative magnitude even though a related equation has two signed solutions.',{root,value});
});
skill('rational-functions','algebra2','Evaluate a rational expression','Simplify carefully and retain exclusions.',r=>{
  const a=r.int(-15,15),x=r.pick(Array.from({length:41},(_,i)=>i-20).filter(n=>n!==a)),answer=x+a;
  return result(`Evaluate (x² − ${a*a}) / (x ${term(-a)}) at x = ${x}.`,answer,String(answer),'Factor the difference of squares; check that the denominator is nonzero.',[`x² − ${a*a} = (x ${term(-a)})(x ${term(a)}).`,`For x ≠ ${a}, the quotient equals x ${term(a)}.`,`The given input ${x} is allowed, and the result is ${x} ${term(a)} = ${answer}.`],'Algebraic simplification can make a calculation easier without changing its permitted inputs.',{a,x});
});

skill('radians-coefficient','precalculus','Degrees into radians','Express an angle as a multiple of π.',r=>{
  const degrees=r.int(1,47)*15,answer=degrees/180;
  return result(`Convert ${degrees}° to radians. Enter only the coefficient of π (for example, enter 1/2 for π/2).`,answer,`${fraction(degrees,180)} × π radians`,'Since 180° equals π radians, divide the degree measure by 180.',[`${degrees}° × (π radians / 180°) = (${degrees}/180)π radians.`,`The requested coefficient is ${fraction(degrees,180)}.`],'Radians connect an angle to arc length and make later calculus formulas natural.',{degrees},{tolerance:closeFraction});
});
skill('triangle-trigonometry','precalculus','Right-triangle ratios','Choose the sides relative to the named angle.',r=>{
  const [a,b,c]=r.pick(triples),k=r.int(1,12),opposite=a*k,adjacent=b*k,hypotenuse=c*k,useSine=r.pick([true,false]),n=useSine?opposite:adjacent;
  return result(`In a right triangle, relative to θ, opposite = ${opposite}, adjacent = ${adjacent}, and hypotenuse = ${hypotenuse}. Find ${useSine?'sin':'cos'}(θ).`,n/hypotenuse,fraction(n,hypotenuse),useSine?'Sine is opposite divided by hypotenuse.':'Cosine is adjacent divided by hypotenuse.',[`${useSine?'sin':'cos'}(θ) = ${useSine?'opposite':'adjacent'}/hypotenuse.`,`${n}/${hypotenuse} = ${fraction(n,hypotenuse)}.`],'Trigonometric ratios depend on the angle rather than the overall size of similar triangles.',{opposite,adjacent,hypotenuse,useSine},{tolerance:closeFraction});
});
skill('vector-components','precalculus','Resolve a vector','Project one vector onto a coordinate axis.',r=>{
  const force=r.int(2,100),degrees=r.pick([0,30,45,60,90]),horizontal=r.pick([true,false]),answer=force*(horizontal?Math.cos(degrees*Math.PI/180):Math.sin(degrees*Math.PI/180));
  return result(`A ${force} N force points ${degrees}° above horizontal. Find its ${horizontal?'horizontal':'vertical'} component in newtons. Round to four decimal places if needed.`,Math.abs(answer)<1e-12?0:answer,`${fmt(Math.abs(answer)<1e-12?0:answer)} N`,horizontal?'The horizontal component is F cos(θ).':'The vertical component is F sin(θ).',[`${horizontal?'Fₓ':'Fᵧ'} = F ${horizontal?'cos':'sin'}(θ).`,`= ${force} × ${horizontal?'cos':'sin'}(${degrees}°) = ${Math.abs(answer)<1e-12?'0':answer.toFixed(4)} N.`],'Components describe one vector in perpendicular directions. Their squared magnitudes add, not generally their magnitudes.',{force,degrees,horizontal},{tolerance:closeFraction,units:'N'});
});
skill('function-composition','precalculus','Compose functions','Feed one output into the next rule.',r=>{
  const a=r.int(2,8),b=r.int(-10,10),c=r.int(-8,8),x=r.int(-10,10),inner=x*x+c,answer=a*inner+b;
  return result(`Let f(x) = ${a}x ${term(b)} and g(x) = x² ${term(c)}. Find f(g(${x})).`,answer,String(answer),'Evaluate g at the input first, then send its output into f.',[`g(${x}) = (${x})² ${term(c)} = ${inner}.`,`f(${inner}) = ${a}(${inner}) ${term(b)} = ${answer}.`],'Chained models and software pipelines use the same input-output structure.',{a,b,c,x});
});
skill('logarithm-values','precalculus','Read a logarithm','A logarithm returns an exponent.',r=>{
  const base=r.int(2,9),exponent=r.int(1,6),value=base**exponent;
  return result(`Find log base ${base} of ${value}.`,exponent,String(exponent),`Ask: ${base} raised to what power equals ${value}?`,[`log base ${base} of ${value} = x means ${base}^x = ${value}.`,`${base}^${exponent} = ${value}, so the logarithm is ${exponent}.`],'Logarithms undo exponential relationships and help compare quantities across large ranges.',{base,exponent,value});
});
skill('arithmetic-sequences','precalculus','An arithmetic sequence','Connect an index to a repeated additive change.',r=>{
  const first=r.int(-20,20),difference=r.pick([-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7]),n=r.int(4,25),answer=first+(n-1)*difference;
  return result(`An arithmetic sequence begins at a₁ = ${first} and changes by ${difference} each step. Find a${n}.`,answer,String(answer),'From term 1 to term n, there are n − 1 changes.',[`aₙ = a₁ + (n − 1)d.`,`a${n} = ${first} + (${n} − 1)(${difference}) = ${answer}.`],'Sequences turn repeated updates into a rule, a useful bridge to discrete models and computation.',{first,difference,n});
});

export const skills=templates.map(({make,...metadata})=>Object.freeze({...metadata}));
const byId=new Map(templates.map(template=>[template.id,template]));
export function generateProblem(skillId,seed){
  const template=byId.get(skillId);
  if(!template)throw new RangeError('Unknown drill skill.');
  const normalized=normalizeDrillSeed(seed),p=template.make(context(`${skillId}|${normalized}`));
  if(!Number.isFinite(p.answer))throw new RangeError('A generated answer must be finite.');
  return {id:`${skillId}:${encodeURIComponent(normalized)}`,skillId,stage:template.stage,title:template.title,seed:normalized,...p};
}
export function pickDrillSkill(stage,seed,excludeId=null){
  const candidates=skills.filter(s=>stage==='all'||s.stage===stage);
  if(!candidates.length)throw new RangeError('Unknown drill stage.');
  const eligible=candidates.length>1?candidates.filter(s=>s.id!==excludeId):candidates;
  return context(seed).pick(eligible).id;
}
export function gradeDrill(problem,input){
  if(!problem||!Number.isFinite(problem.answer))throw new TypeError('A finite answer is required.');
  const tolerance=problem.tolerance??Math.max(1e-9,Math.abs(problem.answer)*1e-10);
  if(!Number.isFinite(tolerance)||tolerance<0)throw new RangeError('Tolerance must be finite and nonnegative.');
  if(!['string','number'].includes(typeof input)||String(input).length>120)return {valid:false,correct:false,value:null,message:'Enter a number or a fraction, without units or equations.'};
  const value=parseNumber(input);
  if(value===null)return {valid:false,correct:false,value:null,message:'Enter a number or a fraction such as 7/12. Do not include units or equations.'};
  return {valid:true,correct:Math.abs(value-problem.answer)<=tolerance,value,message:''};
}

const DAY=86400000;
const isObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const count=value=>Number.isSafeInteger(value)&&value>=0?Math.min(value,10000000):0;
const validDate=value=>typeof value==='string'&&/^\d{4}-\d\d-\d\dT/.test(value)&&Number.isFinite(Date.parse(value));
const clone=value=>JSON.parse(JSON.stringify(value));
export function createDrillState(){
  return {version:1,selectedStage:'arithmetic',selectedSkill:'mixed',counter:0,session:null,records:{}};
}
function cleanAttempt(raw,problem=null){
  if(!isObject(raw)||!validDate(raw.at)||typeof raw.correct!=='boolean'||typeof raw.assisted!=='boolean'||typeof raw.problemId!=='string'||typeof raw.input!=='string')return null;
  if(raw.problemId.length>700||raw.input.length>120)return null;
  if(problem){const grade=gradeDrill(problem,raw.input);if(!grade.valid||raw.problemId!==problem.id)return null;return {problemId:raw.problemId,input:raw.input,correct:grade.correct,assisted:raw.assisted,at:new Date(raw.at).toISOString()};}
  return {problemId:raw.problemId,input:raw.input,correct:raw.correct,assisted:raw.assisted,at:new Date(raw.at).toISOString()};
}
export function reviewIntervalDays(recent){
  let streak=0;
  for(let i=recent.length-1;i>=0;i--){if(recent[i].correct&&!recent[i].assisted)streak++;else break;}
  return [1,1,3,7,14][Math.min(streak,4)];
}
function cleanRecord(raw){
  const record=isObject(raw)?raw:{};
  const recent=Array.isArray(record.recent)?record.recent.slice(-20).map(a=>cleanAttempt(a)).filter(Boolean):[];
  const independentCorrect=count(record.independentCorrect),assistedCorrect=count(record.assistedCorrect),incorrect=count(record.incorrect);
  const last=recent.at(-1),intervalDays=reviewIntervalDays(recent);
  return {attempts:independentCorrect+assistedCorrect+incorrect,independentCorrect,assistedCorrect,incorrect,recent,lastAttemptAt:last?.at||null,nextReviewAt:last?new Date(Date.parse(last.at)+intervalDays*DAY).toISOString():null,intervalDays};
}
export function sanitizeDrillState(raw){
  const state=createDrillState();
  if(!isObject(raw)||raw.version!==1)return state;
  if(raw.selectedStage==='all'||drillStages.some(s=>s.id===raw.selectedStage))state.selectedStage=raw.selectedStage;
  if(raw.selectedSkill==='mixed'||skills.some(s=>s.id===raw.selectedSkill&&(state.selectedStage==='all'||s.stage===state.selectedStage)))state.selectedSkill=raw.selectedSkill;
  state.counter=count(raw.counter);
  if(isObject(raw.records))for(const skill of skills)if(Object.hasOwn(raw.records,skill.id))state.records[skill.id]=cleanRecord(raw.records[skill.id]);
  if(isObject(raw.session)&&byId.has(raw.session.skillId)){
    try{
      const p=generateProblem(raw.session.skillId,raw.session.seed),s=raw.session;
      const firstAttempt=cleanAttempt(s.firstAttempt,p);
      const input=typeof s.input==='string'?s.input.slice(0,120):'';
      const feedback=isObject(s.feedback)&&typeof s.feedback.input==='string'?gradeDrill(p,s.feedback.input):null;
      state.session={skillId:p.skillId,seed:p.seed,input,hintUsed:s.hintUsed===true,solutionShown:s.solutionShown===true,firstAttempt,feedback:feedback?.valid?{input:s.feedback.input.slice(0,120),correct:feedback.correct,value:feedback.value}:null};
    }catch{/* Invalid saved questions are replaced; the rest of the learning record survives. */}
  }
  return state;
}
export const normalizeDrillState=sanitizeDrillState;
export function startDrill(raw,{skillId=null,seed=null,now=Date.now()}={}){
  const state=sanitizeDrillState(raw);
  state.counter=(state.counter+1)%10000000;
  const nextSeed=normalizeDrillSeed(seed??`${now}-${state.counter}`);
  const chosen=skillId||(state.selectedSkill==='mixed'?pickDrillSkill(state.selectedStage,nextSeed,state.session?.skillId):state.selectedSkill);
  const p=generateProblem(chosen,nextSeed);
  state.session={skillId:chosen,seed:p.seed,input:'',hintUsed:false,solutionShown:false,firstAttempt:null,feedback:null};
  return state;
}
export function submitDrill(raw,input,now=Date.now()){
  const state=sanitizeDrillState(raw);
  if(!state.session)throw new RangeError('Start a question before submitting an answer.');
  if(!Number.isFinite(now)||!Number.isFinite(new Date(now).getTime()))throw new RangeError('Use a valid review timestamp.');
  const p=generateProblem(state.session.skillId,state.session.seed),grade=gradeDrill(p,input);
  state.session.input=['string','number'].includes(typeof input)?String(input).slice(0,120):'';
  if(!grade.valid){state.session.feedback=null;return {state,grade,recorded:false};}
  state.session.feedback={input:state.session.input,correct:grade.correct,value:grade.value};
  const record=cleanRecord(state.records[p.skillId]);
  const prior=record.recent.find(a=>a.problemId===p.id);
  if(state.session.firstAttempt||prior){
    if(!state.session.firstAttempt)state.session.firstAttempt=clone(prior);
    return {state,grade,recorded:false};
  }
  const attempt={problemId:p.id,input:state.session.input,correct:grade.correct,assisted:state.session.hintUsed||state.session.solutionShown,at:new Date(now).toISOString()};
  state.session.firstAttempt=attempt;
  if(attempt.correct){if(attempt.assisted)record.assistedCorrect++;else record.independentCorrect++;}else record.incorrect++;
  record.recent.push(attempt);
  state.records[p.skillId]=cleanRecord(record);
  return {state,grade,recorded:true};
}
export function getDrillReview(raw,now=Date.now()){
  const state=sanitizeDrillState(raw);
  if(!Number.isFinite(now))throw new TypeError('Use a finite review timestamp.');
  return skills.map(skill=>{const record=state.records[skill.id];return {...skill,record:record||null,due:!!record?.nextReviewAt&&Date.parse(record.nextReviewAt)<=now};})
    .filter(item=>item.record?.attempts>0)
    .sort((a,b)=>Date.parse(a.record.nextReviewAt||'9999-01-01')-Date.parse(b.record.nextReviewAt||'9999-01-01')||a.title.localeCompare(b.title));
}
