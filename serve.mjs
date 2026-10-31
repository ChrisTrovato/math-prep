import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const server=http.createServer((req,res)=>{
 let url;try{url=new URL(req.url,'http://127.0.0.1');}catch{res.writeHead(400).end();return;}
 if(url.pathname==='/__mobile'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Math Prep mobile QA</title></head><body style="margin:0;background:#c8c9c3"><iframe title="390-pixel mobile preview" style="width:390px;height:850px;border:0;display:block;margin:12px auto" src="/math_prep"></iframe></body></html>');return;}
 let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400).end();return;}
 if(pathname==='/'||pathname==='/math_prep'||pathname==='/math_prep/')pathname='/math_prep/index.html';
 const file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end('Not found');return;}
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});server.listen(4319,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4319/math_prep'));
