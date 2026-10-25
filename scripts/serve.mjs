import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.xml':'application/xml','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
const headerText=await readFile(path.join(root,'_headers'),'utf8');
const rules=[]; let currentRule;
for(const line of headerText.split(/\r?\n/)){
  if(!line.trim()||line.trimStart().startsWith('#'))continue;
  if(!/^\s/.test(line)){currentRule={pattern:line.trim(),headers:[]};rules.push(currentRule);}
  else {const i=line.indexOf(':');if(i>0&&currentRule)currentRule.headers.push([line.slice(0,i).trim(),line.slice(i+1).trim()]);}
}
function headersFor(pathname){const result={};for(const rule of rules){const pattern=rule.pattern.split('*').map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*');if(!new RegExp(`^${pattern}$`).test(pathname))continue;for(const [name,value] of rule.headers)result[name]=result[name]?`${result[name]}, ${value}`:value;}return result;}
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let target=path.resolve(root,'.'+pathname);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);res.end();return;}if(!path.extname(target))target=path.join(target,'index.html');const body=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream',...headersFor(pathname)});res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(3000,'127.0.0.1',()=>console.log('FileFit preview: http://localhost:3000'));
