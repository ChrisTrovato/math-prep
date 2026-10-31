export const EARTH_MU=398600.435507; // km^3/s^2, JPL DE440
export const EARTH_RADIUS=6371; // km, NASA volumetric mean radius
export function circularOrbit(altitude){
  if(!Number.isFinite(altitude)||altitude<0)throw new RangeError('Altitude must be finite and nonnegative.');
  const radius=EARTH_RADIUS+altitude,speed=Math.sqrt(EARTH_MU/radius);
  const result={radius,speed,period:2*Math.PI*radius/speed,gravity:EARTH_MU/radius**2*1000};
  if(Object.values(result).some(value=>!Number.isFinite(value)))throw new RangeError('Altitude exceeds the numerical range of this model.');
  return result;
}
export function components(magnitude,degrees){
  if(!Number.isFinite(magnitude)||magnitude<0||!Number.isFinite(degrees))throw new RangeError('Use a finite nonnegative magnitude and a finite angle.');
  const a=(degrees%360)*Math.PI/180;
  return {x:magnitude*Math.cos(a),y:magnitude*Math.sin(a)};
}
export function scaleFactors(k){
  if(!Number.isFinite(k)||k<=0)throw new RangeError('The scale factor must be finite and positive.');
  const result={length:k,area:k*k,volume:k*k*k};
  if(Object.values(result).some(value=>!Number.isFinite(value)))throw new RangeError('Scale factor exceeds the numerical range of this model.');
  return result;
}
export function batteryEnergy(watts,hours,capacity){
  if(!Number.isFinite(watts)||watts<=0||!Number.isFinite(hours)||hours<0||!Number.isFinite(capacity)||capacity<0)throw new RangeError('Use positive finite power and nonnegative finite time and usable capacity.');
  const result={used:watts*hours,remaining:capacity-watts*hours,runtime:capacity/watts};
  if(Object.values(result).some(value=>!Number.isFinite(value)))throw new RangeError('Inputs exceed the numerical range of this model.');
  return result;
}
// Shared plotting scales keep displayed angles and ratios consistent with the model.
export function vectorDrawingGeometry(magnitude,degrees){
  const c=components(magnitude,degrees),origin={x:120,y:240},pixelsPerNewton=2.1;
  return {origin,end:{x:origin.x+c.x*pixelsPerNewton,y:origin.y-c.y*pixelsPerNewton},pixelsPerNewton,components:c};
}
export function scaledCubeLayout(k){
  scaleFactors(k);
  const baseSize=Math.min(50,150/Math.max(1,k));
  const place=(x,size)=>{const y=230-size*1.05;return {x,y,size,bounds:{left:x,right:x+size*1.2,top:y-size*.35,bottom:y+size*1.05}};};
  return {original:place(80,baseSize),scaled:place(275,baseSize*k)};
}
export function lineDrawingGeometry(m,b){
  if(!Number.isFinite(m)||!Number.isFinite(b))throw new RangeError('Slope and intercept must be finite.');
  const origin={x:75,y:200},pixelsPerUnit=25;
  const point=x=>({x:origin.x+pixelsPerUnit*x,y:origin.y-pixelsPerUnit*(m*x+b)});
  return {origin,pixelsPerUnit,start:point(-3),end:point(17),intercept:point(0)};
}
const labs=[{id:'power',title:'Energy & units',level:'Arithmetic',subtitle:'How long can the robot keep working?'},{id:'line',title:'Functions & graphs',level:'Algebra',subtitle:'See an equation become a relationship.'},{id:'scale',title:'Scale & shape',level:'Geometry',subtitle:'Twice as long is eight times the volume.'},{id:'vector',title:'Angles & components',level:'Trigonometry preview',subtitle:'A direction changes how a force is shared.'},{id:'orbit',title:'Orbit intuition',level:'A later engineering preview',subtitle:'Higher circular orbits take longer to complete.'}];
const slider=(id,label,min,max,step,value,unit)=>`<label class="lab-slider" for="${id}"><span>${label}<b><output id="${id}-out">${value}</output> ${unit}</b></span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const source=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const labData={
 power:{controls:slider('watts','Power draw',10,100,5,40,'W')+slider('hours','Operating time',.5,8,.5,3,'h')+slider('capacity','Usable energy',100,500,25,200,'Wh'),equation:'Energy = power × time',predict:'Before you move a slider: if power doubles and time stays fixed, what happens to energy use?',explain:'Watts measure a rate of energy use. Watt-hours measure an amount of energy. Multiplying watts by hours gives watt-hours, just as speed multiplied by time gives distance.',assumptions:'A hypothetical robot, constant power, and an already usable battery-energy rating. Real sizing must account for losses, temperature, aging, variable loads and reserves.',source:source('https://www.eia.gov/energyexplained/electricity/measuring-electricity.php','EIA: power and energy')},
 line:{controls:slider('slope','Slope m',-3,3,.5,1,'')+slider('intercept','Starting value b',-3,4,.5,1,''),equation:'y = mx + b',predict:'Predict which slider moves the whole line up, and which changes its steepness.',explain:'Slope describes the change in output for each unit of input. The intercept is the output when the input is zero. A straight line can model a constant rate, within the range where that assumption is useful.',assumptions:'This is a mathematical relationship. A physical model also needs units, a meaningful input range, and evidence that a linear relationship fits.',source:source('https://openstax.org/books/elementary-algebra-2e/pages/4-introduction','OpenStax: graphs')},
 scale:{controls:slider('factor','Length scale factor',.5,3,.25,1.5,'×'),equation:'Length × k · area × k² · volume × k³',predict:'If every length is doubled, predict the factors for surface area and volume before moving the slider.',explain:'An area involves two lengths, so both receive the scale factor. A volume involves three. At constant density, mass scales with volume. Geometry is one reason a larger vehicle is not simply a small vehicle with every part enlarged.',assumptions:'Geometrically similar solids with uniform scale. Mass follows the volume factor only if material density is unchanged. Structural strength and heat transfer need additional models.',source:source('https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area','OpenStax: volume and surface area')},
 vector:{controls:slider('force','Force magnitude',10,100,5,50,'N')+slider('angle','Angle above horizontal',0,90,5,30,'°'),equation:'Fₓ = F cos θ · Fᵧ = F sin θ',predict:'At 0°, which component is zero? What about 90°? At 45°, should they match?',explain:'The horizontal and vertical components describe one force in two perpendicular directions. They are not extra forces. Trigonometry connects the angle and magnitude to the two components.',assumptions:'A single vector in a two-dimensional, fixed coordinate system. This is not a complete aircraft force balance or a control-system design.',source:source('https://www.grc.nasa.gov/www/k-12/airplane/vectors.html','NASA: scalars and vectors')},
 orbit:{controls:slider('altitude','Altitude above mean Earth',200,36000,100,400,'km'),equation:'v = √(μ/r) · T = 2π√(r³/μ)',predict:'In this family of circular orbits, will a higher satellite move faster or slower? Will it take more or less time to complete one orbit?',explain:'Orbital radius is measured from Earth’s center, not its surface. Gravity supplies the inward acceleration. In this idealized family, a larger circular-orbit radius means lower speed and a longer period. Changing from one orbit to another requires a separate maneuver analysis.',assumptions:'Circular two-body model, spherical Earth, negligible satellite mass; no atmosphere, oblateness, other bodies or maneuver dynamics. μ = 398600.435507 km³/s²; mean radius = 6371 km. The drawing is schematic, not to scale.',source:source('https://ssd.jpl.nasa.gov/astro_par.html','JPL gravitational parameter')+' · '+source('https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html','NASA Earth radius')+' · '+source('https://www.met.reading.ac.uk/pplato2/h-flap/phys3_2.html','University of Reading: orbits')}
};
export function renderLabs(id='power'){const l=labs.find(l=>l.id===id)||labs[0],d=labData[l.id];return `<div class="page-intro"><div class="eyebrow">INTERACTIVE LABORATORY</div><h1>Change something.<br><em>Notice what follows.</em></h1><p>Make a prediction, move a control, and explain the result. The early labs use familiar arithmetic; the orbit lab offers a glimpse of where these tools lead.</p></div><div class="lab-tabs">${labs.map(x=>`<a href="#labs/${x.id}" class="${x.id===l.id?'active':''}"><span>${x.level}</span>${x.title}</a>`).join('')}</div><section class="lab-panel" data-lab="${l.id}"><div class="lab-visual"><div class="overline">${l.level.toUpperCase()}</div><h2>${l.subtitle}</h2><div id="lab-drawing"></div><div class="lab-stats" id="lab-stats" aria-live="polite"></div></div><div class="lab-console"><div class="eyebrow">MAKE A PREDICTION</div><p>${d.predict}</p><div class="lab-controls">${d.controls}</div><div class="lab-equation">${d.equation}</div><p id="lab-observation" class="lab-observation"></p></div></section><section class="dual section"><article class="essay"><div class="eyebrow">WHAT THE MODEL SAYS</div><h3>The relationship underneath.</h3><p>${d.explain}</p></article><article class="essay"><div class="eyebrow">WHAT WE ASSUMED</div><h3>A model has boundaries.</h3><p>${d.assumptions}</p><div class="inline-sources">${d.source}</div></article></section>`;}
const stat=(value,label)=>`<div><b>${value}</b><span>${label}</span></div>`;
const svg=(content,label)=>`<svg viewBox="0 0 500 285" role="img" aria-label="${label}"><defs><pattern id="lab-grid" x="50" y="225" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#ffffff10"/></pattern><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#efbb68"/></marker></defs><rect width="500" height="285" fill="url(#lab-grid)"/>${content}</svg>`;
const cube=(x,y,size,color)=>`<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.4"><path d="M0 0l${size*.6} ${-size*.35} ${size*.6} ${size*.35} ${-size*.6} ${size*.35}Z" fill="${color}25"/><path d="M0 0v${size*.7}l${size*.6} ${size*.35}v${-size*.7}M${size*1.2} 0v${size*.7}l${-size*.6} ${size*.35}" fill="none"/></g>`;
const displayNumber=(value,digits=2)=>Number(value.toFixed(digits)).toLocaleString('en-US');
export function mountLabs(root){
  const panel=root.querySelector('[data-lab]');
  if(!panel)return;
  const kind=panel.dataset.lab;
  const value=id=>Number(root.querySelector('#'+id).value);
  const put=(selector,text)=>{root.querySelector(selector).textContent=text;};
  const update=()=>{
    for(const el of root.querySelectorAll('.lab-slider input'))put('#'+el.id+'-out',el.value);
    let drawing='',stats='',observation='';
    if(kind==='power'){
      const w=value('watts'),t=value('hours'),c=value('capacity'),e=batteryEnergy(w,t,c);
      const fraction=c>0?Math.max(0,Math.min(1,e.remaining/c)):0;
      drawing=svg(`<rect x="85" y="80" width="310" height="118" rx="12" fill="none" stroke="#93c9c5" stroke-width="3"/><path d="M397 116h18v45h-18" stroke="#93c9c5" fill="none" stroke-width="3"/><rect x="94" y="89" width="${292*fraction}" height="100" rx="6" fill="${e.remaining<0?'#ed876c':'#93c9c5'}"/><text x="240" y="150" text-anchor="middle" fill="${fraction>.65?'#142332':'#fff'}" font-size="24" font-family="monospace">${displayNumber(Math.max(0,e.remaining))} Wh left</text>`,'Illustrative battery showing remaining usable energy');
      stats=stat(displayNumber(e.used)+' Wh','energy required')+stat(displayNumber(e.runtime)+' h','ideal operating time')+stat(displayNumber(Math.abs(e.remaining))+' Wh',e.remaining<0?'energy shortfall':'energy margin');
      observation=e.remaining<0?`This plan needs ${displayNumber(Math.abs(e.remaining))} Wh more than the stated usable capacity.`:`The plan uses ${w} × ${t} = ${displayNumber(e.used)} Wh, leaving ${displayNumber(e.remaining)} Wh.`;
    }else if(kind==='line'){
      const m=value('slope'),b=value('intercept'),g=lineDrawingGeometry(m,b);
      drawing=svg(`<path d="M0 ${g.origin.y}H500M${g.origin.x} 0V285" stroke="#7f9ca8"/><clipPath id="line-clip"><rect width="500" height="285"/></clipPath><path d="M${g.start.x} ${g.start.y}L${g.end.x} ${g.end.y}" stroke="#efbb68" stroke-width="3" clip-path="url(#line-clip)"/><circle cx="${g.intercept.x}" cy="${g.intercept.y}" r="5" fill="#93c9c5"/><g fill="#bdd0d6" font-size="12" font-family="monospace"><text x="57" y="219">0</text><text x="197" y="219">5</text><text x="322" y="219">10</text><text x="56" y="79">5</text><text x="477" y="219">x</text><text x="58" y="15">y</text></g>`,'Graph of a straight line with equal scales on the axes and adjustable slope and intercept');
      stats=stat(m,'slope')+stat(b,'output at x = 0')+stat(2*m+b,'output at x = 2');
      observation=`Each +1 in x changes y by ${m}. At x = 0, the output is ${b}.`;
    }else if(kind==='scale'){
      const k=value('factor'),s=scaleFactors(k),g=scaledCubeLayout(k),o=g.original,c=g.scaled;
      drawing=svg(cube(o.x,o.y,o.size,'#93c9c5')+cube(c.x,c.y,c.size,'#efbb68')+'<g fill="#bdd0d6" font-size="12" font-family="monospace"><text x="80" y="260">ORIGINAL</text><text x="275" y="260">SCALED</text></g>','Two similar cubes drawn with the same length scale, original and scaled');
      stats=stat(s.length.toFixed(2)+'×','length')+stat(s.area.toFixed(2)+'×','surface area')+stat(s.volume.toFixed(2)+'×','volume / same-density mass');
      observation=`A ${k}× length factor gives a ${s.area.toFixed(2)}× area factor and a ${s.volume.toFixed(2)}× volume factor.`;
    }else if(kind==='vector'){
      const f=value('force'),a=value('angle'),g=vectorDrawingGeometry(f,a),c=g.components,{x:ox,y:oy}=g.origin,{x,y}=g.end;
      const radians=a*Math.PI/180,arcRadius=29;
      const angleArc=a>0?`<path d="M${ox+arcRadius} ${oy}A${arcRadius} ${arcRadius} 0 0 0 ${ox+arcRadius*Math.cos(radians)} ${oy-arcRadius*Math.sin(radians)}" fill="none" stroke="#efbb68" stroke-width="1.1"/>`:'';
      const labelX=ox+45*Math.cos(radians/2),labelY=oy-45*Math.sin(radians/2)-4;
      drawing=svg(`<path d="M${ox} 15V${oy}H420" stroke="#7f9ca8" fill="none"/><path d="M${ox} ${oy}H${x}V${y}" fill="none" stroke="#93c9c5" stroke-width="2" stroke-dasharray="6 5"/><path d="M${ox} ${oy}L${x} ${y}" stroke="#efbb68" stroke-width="3" marker-end="url(#arrow)"/>${angleArc}<g fill="#9bb7c1" font-size="10" font-family="monospace"><text x="${ox-15}" y="${oy+15}">0</text><text x="${ox+50*g.pixelsPerNewton-5}" y="${oy+15}">50</text><text x="${ox+100*g.pixelsPerNewton-8}" y="${oy+15}">100</text><text x="${ox-25}" y="${oy-50*g.pixelsPerNewton+4}">50</text><text x="${ox-31}" y="${oy-100*g.pixelsPerNewton+4}">100</text><text x="430" y="${oy+4}">Fₓ (N)</text><text x="${ox-11}" y="10">Fᵧ (N)</text></g><text x="${Math.min(410,x+12)}" y="${Math.max(30,y-12)}" fill="#efbb68" font-family="monospace" font-size="14">${f} N</text><text x="${labelX}" y="${labelY}" fill="#bdd0d6" font-family="monospace" font-size="12">${a}°</text>`,'A force vector and its horizontal and vertical components, with equal scales on both axes');
      stats=stat(c.x.toFixed(1)+' N','horizontal component')+stat(c.y.toFixed(1)+' N','vertical component')+stat(f+' N','total magnitude');
      observation=`Components are ${c.x.toFixed(1)} N and ${c.y.toFixed(1)} N. Their squares add to the square of the magnitude; the components themselves do not generally add to ${f}.`;
    }else{
      const a=value('altitude'),o=circularOrbit(a),r=98+Math.log10(1+a/400)*26,tilt=-20*Math.PI/180;
      drawing=svg(`<defs><radialGradient id="earth-grad"><stop stop-color="#6eb2b0"/><stop offset="1" stop-color="#245165"/></radialGradient></defs><circle cx="250" cy="145" r="55" fill="url(#earth-grad)" stroke="#93c9c5"/><ellipse cx="250" cy="145" rx="55" ry="19" fill="none" stroke="#a3d2cf55"/><ellipse cx="250" cy="145" rx="20" ry="55" fill="none" stroke="#a3d2cf55"/><ellipse cx="250" cy="145" rx="${r}" ry="${r*.65}" transform="rotate(-20 250 145)" fill="none" stroke="#efbb68" stroke-dasharray="3 6"/><g transform="translate(${250+r*Math.cos(tilt)} ${145+r*Math.sin(tilt)})"><rect x="-7" y="-5" width="14" height="10" fill="#efbb68"/><path d="M-9-7h-18v14h18M9-7h18v14H9" fill="#93c9c5"/></g><text x="250" y="273" text-anchor="middle" fill="#bdd0d6" font-family="monospace" font-size="10">SCHEMATIC · A CIRCULAR ORBIT SHOWN IN PERSPECTIVE</text>`,'Schematic Earth and a circular satellite orbit, not to scale');
      stats=stat(o.speed.toFixed(2)+' km/s','circular-orbit speed')+stat((o.period/60).toFixed(1)+' min','one complete orbit')+stat(o.gravity.toFixed(2)+' m/s²','gravity at this radius');
      observation=`At ${a.toLocaleString()} km altitude, the radius is ${o.radius.toLocaleString()} km. Gravity is still present; orbit is continuous free fall.`;
    }
    root.querySelector('#lab-drawing').innerHTML=drawing;
    root.querySelector('#lab-stats').innerHTML=stats;
    put('#lab-observation',observation);
  };
  const inputs=[...root.querySelectorAll('.lab-slider input')];
  inputs.forEach(el=>el.addEventListener('input',update));
  update();
  return ()=>inputs.forEach(el=>el.removeEventListener('input',update));
}
