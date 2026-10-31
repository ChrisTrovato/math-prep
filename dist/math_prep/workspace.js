// Browser-local learning records. Import treats every byte as untrusted data.
export const STORAGE_KEY='math-prep-v1';
export const BACKUP_VERSION=3;
const record=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const safeKey=k=>typeof k==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,150}$/.test(k)&&!['__proto__','constructor','prototype'].includes(k);
const string=(v,n)=>typeof v==='string'?v.slice(0,n):'';
const date=v=>typeof v==='string'&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():'';
const number=(v,max=1000000)=>Number.isFinite(v)&&v>=0?Math.min(Math.floor(v),max):0;
export const blankWorkspace=()=>({saved:[],checks:{},solved:{},notes:[],diagnostic:null,lessons:{},articles:{},projects:{},drills:null,lastLesson:null,preferences:{reading:'comfortable'},updatedAt:null});
export function normalizeWorkspace(raw,validators={}){
 const out=blankWorkspace();if(!record(raw))return out;
 out.saved=Array.isArray(raw.saved)?[...new Set(raw.saved.filter(x=>safeKey(x)&&(!validators.resourceIds||validators.resourceIds.has(x))))].slice(0,1000):[];
 if(record(raw.checks))for(const [k,v]of Object.entries(raw.checks).slice(0,1000))if(safeKey(k)&&typeof v==='boolean')out.checks[k]=v;
 if(record(raw.solved))for(const [k,v]of Object.entries(raw.solved).slice(0,1000))if(safeKey(k)&&record(v))out.solved[k]={helped:v.helped===true,date:date(v.date)};
 if(Array.isArray(raw.notes))for(const n of raw.notes.slice(0,2000))if(record(n)&&safeKey(n.id)&&typeof n.title==='string'&&typeof n.text==='string')out.notes.push({id:n.id,title:string(n.title,120),text:string(n.text,5000),type:['reflection','error','question'].includes(n.type)?n.type:'reflection',date:date(n.date)});
 out.notes=[...new Map(out.notes.map(n=>[n.id,n])).values()];
 for(const field of ['lessons','articles','projects'])if(record(raw[field]))for(const [k,v]of Object.entries(raw[field]).slice(0,1000)){
  if(!safeKey(k)||!record(v))continue;
  if(field==='lessons'&&validators.lessonIds&&!validators.lessonIds.has(k))continue;
  out[field][k]={read:v.read===true,date:date(v.date),quizChoice:string(v.quizChoice,60),quizCorrect:v.quizCorrect===true,quizAttempts:number(v.quizAttempts,10000)};
 }
 out.lastLesson=safeKey(raw.lastLesson)&&(!validators.lessonIds||validators.lessonIds.has(raw.lastLesson))?raw.lastLesson:null;
 out.preferences.reading=raw.preferences?.reading==='large'?'large':'comfortable';
 out.updatedAt=date(raw.updatedAt)||null;
 out.diagnostic=validators.diagnostic?validators.diagnostic(raw.diagnostic):null;
 out.drills=validators.drills?validators.drills(raw.drills):null;
 return out;
}
export function parseBackup(text,validators={}){
 if(typeof text!=='string'||text.length>50000000)throw new Error('Choose a Math Prep JSON backup smaller than 50 MB.');
 let raw;try{raw=JSON.parse(text);}catch{throw new Error('This file is not valid JSON. Choose an exported Math Prep backup.');}
 if(!record(raw)||![1,2,3].includes(raw.version)||!Array.isArray(raw.saved)||!record(raw.checks)||!Array.isArray(raw.notes??[]))throw new Error('This does not look like a supported Math Prep backup (versions 1–3).');
 if((raw.notes?.length||0)>2000||raw.saved.length>1000||['checks','solved','lessons','articles','projects'].some(k=>record(raw[k])&&Object.keys(raw[k]).length>1000))throw new Error('This backup exceeds the supported record limits. Nothing was imported.');
 return normalizeWorkspace(raw,validators);
}
export function backupText(state){return JSON.stringify({app:'Math Prep',version:BACKUP_VERSION,exportedAt:new Date().toISOString(),...state},null,2);}
export function downloadBackup(state){const url=URL.createObjectURL(new Blob([backupText(state)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='math-prep-workspace-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
export function mergeWorkspace(current,incoming){
 const next=structuredClone(current);
 next.saved=[...new Set([...current.saved,...incoming.saved])];
 for(const key of ['checks','solved'])next[key]={...current[key],...Object.fromEntries(Object.entries(incoming[key]).filter(([k])=>!Object.hasOwn(current[key],k)))};
 next.notes=[...current.notes,...incoming.notes.filter(n=>!current.notes.some(old=>old.id===n.id))];
 for(const field of ['lessons','articles','projects']){
  next[field]={...current[field]};
  for(const [id,item]of Object.entries(incoming[field])){const old=next[field][id];if(!old||Date.parse(item.date||0)>Date.parse(old.date||0))next[field][id]=item;}
 }
 // Never add counters from two copies of the same practice history.
 if(!current.drills)next.drills=incoming.drills;
 else if(incoming.drills){if(!current.drills.session)next.drills={...incoming.drills};next.drills.records={...(current.drills.records||{})};for(const [id,item]of Object.entries(incoming.drills.records||{})){const old=next.drills.records[id];if(!old||(Date.parse(item.lastAttemptAt)||0)>(Date.parse(old.lastAttemptAt)||0))next.drills.records[id]=item;}}
 if(!current.diagnostic)next.diagnostic=incoming.diagnostic;
 if(!current.lastLesson)next.lastLesson=incoming.lastLesson;
 if(next.notes.length>2000||next.saved.length>1000||['checks','solved','lessons','articles','projects'].some(k=>Object.keys(next[k]).length>1000))throw new Error('This merge exceeds the local record limit. No changes were made. Keep both backup files and merge a smaller selection.');
 next.updatedAt=new Date().toISOString();return next;
}
