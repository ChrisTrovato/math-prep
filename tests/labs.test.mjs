import {test} from 'node:test';import assert from 'node:assert/strict';
import {circularOrbit,components,scaleFactors,batteryEnergy,vectorDrawingGeometry,scaledCubeLayout,lineDrawingGeometry,mountLabs} from '../dist/math_prep/labs.js';
test('orbital model is dimensionally consistent and behaves as expected',()=>{const low=circularOrbit(400),high=circularOrbit(35786);assert.ok(low.speed>7.6&&low.speed<7.8);assert.ok(low.period/60>92&&low.period/60<93);assert.ok(high.period/3600>23.8&&high.period/3600<24.1);assert.ok(high.speed<low.speed);assert.ok(low.gravity>8.6&&low.gravity<8.8);assert.throws(()=>circularOrbit(-1));});
test('orthogonal vector components preserve magnitude',()=>{for(const a of [0,30,45,60,90]){const c=components(50,a);assert.ok(Math.abs(c.x*c.x+c.y*c.y-2500)<1e-8);}assert.ok(Math.abs(components(50,90).x)<1e-10);});
test('geometric scaling and energy units have correct powers',()=>{assert.deepEqual(scaleFactors(2),{length:2,area:4,volume:8});assert.deepEqual(batteryEnergy(40,3,200),{used:120,remaining:80,runtime:5});assert.equal(batteryEnergy(100,3,200).remaining,-100);});

test('invalid model inputs fail explicitly instead of displaying NaN or Infinity',()=>{
  for(const bad of [NaN,Infinity,-Infinity,'100']){
    assert.throws(()=>circularOrbit(bad),RangeError);
    assert.throws(()=>components(bad,30),RangeError);
    assert.throws(()=>components(50,bad),RangeError);
    assert.throws(()=>scaleFactors(bad),RangeError);
    assert.throws(()=>batteryEnergy(bad,3,200),RangeError);
    assert.throws(()=>batteryEnergy(40,bad,200),RangeError);
    assert.throws(()=>batteryEnergy(40,3,bad),RangeError);
  }
  assert.throws(()=>circularOrbit(Number.MAX_VALUE),RangeError);
  assert.throws(()=>components(-1,30),RangeError);
  assert.throws(()=>scaleFactors(0),RangeError);
  assert.throws(()=>scaleFactors(-1),RangeError);
  assert.throws(()=>scaleFactors(Number.MAX_VALUE),RangeError);
  assert.throws(()=>batteryEnergy(0,3,200),RangeError);
  assert.throws(()=>batteryEnergy(40,-1,200),RangeError);
  assert.throws(()=>batteryEnergy(40,3,-1),RangeError);
  assert.throws(()=>batteryEnergy(Number.MAX_VALUE,2,200),RangeError);
  assert.deepEqual(batteryEnergy(40,0,0),{used:0,remaining:0,runtime:0});
});

test('vector drawing preserves its stated angle and magnitude throughout the controls',()=>{
  for(let f=10;f<=100;f+=5)for(let angle=0;angle<=90;angle+=5){
    const g=vectorDrawingGeometry(f,angle),dx=g.end.x-g.origin.x,dy=g.origin.y-g.end.y;
    assert.ok(Math.abs(Math.atan2(dy,dx)*180/Math.PI-angle)<1e-10);
    assert.ok(Math.abs(Math.hypot(dx,dy)/g.pixelsPerNewton-f)<1e-10);
    assert.ok(g.end.x>=15&&g.end.x<=485&&g.end.y>=15&&g.end.y<=270);
  }
  assert.deepEqual(components(0,45),{x:0,y:0});
  assert.ok(Math.abs(components(50,450).y-50)<1e-10);
});

test('both scale cubes fit in the view and retain the same length ratio',()=>{
  for(let k=.5;k<=3;k+=.25){
    const {original,scaled}=scaledCubeLayout(k);
    assert.equal(original.size,50);
    assert.ok(Math.abs(scaled.size/original.size-k)<1e-10);
    for(const cube of [original,scaled]){
      assert.ok(cube.bounds.left>=1&&cube.bounds.right<=499);
      assert.ok(cube.bounds.top>=1&&cube.bounds.bottom<=284);
    }
    const ow=original.bounds.right-original.bounds.left,sw=scaled.bounds.right-scaled.bounds.left;
    assert.ok(Math.abs(sw/ow-k)<1e-10);
  }
});

test('the line intercept stays visible and the graph uses identical axis scales',()=>{
  for(let m=-3;m<=3;m+=.5)for(let b=-3;b<=4;b+=.5){
    const g=lineDrawingGeometry(m,b),dx=g.end.x-g.start.x,dy=g.start.y-g.end.y;
    assert.ok(Math.abs(dy/dx-m)<1e-10);
    assert.equal(g.intercept.x,g.origin.x);
    assert.equal((g.origin.y-g.intercept.y)/g.pixelsPerUnit,b);
    assert.ok(g.intercept.y>=5&&g.intercept.y<=280);
  }
  assert.throws(()=>lineDrawingGeometry(NaN,1),RangeError);
});

test('the power display retains fractional Wh, reacts to controls, and detaches cleanly',()=>{
  const listeners=new Map(),nodes={};
  for(const [id,value] of Object.entries({watts:'15',hours:'0.5',capacity:'200'})){
    nodes[id]={id,value,addEventListener:(type,fn)=>listeners.set(id,fn),removeEventListener:(type,fn)=>{assert.equal(listeners.get(id),fn);listeners.delete(id);}};
    nodes[id+'-out']={textContent:''};
  }
  for(const id of ['lab-drawing','lab-stats','lab-observation'])nodes[id]={innerHTML:'',textContent:''};
  const root={querySelector:selector=>selector==='[data-lab]'?{dataset:{lab:'power'}}:nodes[selector.slice(1)],querySelectorAll:()=>['watts','hours','capacity'].map(id=>nodes[id])};
  const cleanup=mountLabs(root);
  assert.match(nodes['lab-drawing'].innerHTML,/192\.5 Wh left/);
  assert.match(nodes['lab-stats'].innerHTML,/7\.5 Wh/);
  assert.match(nodes['lab-observation'].textContent,/7\.5 Wh, leaving 192\.5 Wh/);
  nodes.hours.value='8';nodes.watts.value='100';listeners.get('watts')();
  assert.match(nodes['lab-drawing'].innerHTML,/0 Wh left/);
  assert.match(nodes['lab-stats'].innerHTML,/600 Wh<\/b><span>energy shortfall/);
  assert.match(nodes['lab-observation'].textContent,/600 Wh more/);
  cleanup();assert.equal(listeners.size,0);
});
