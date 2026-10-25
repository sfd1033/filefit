import {it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {mkdtemp,writeFile,readFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {protectHtml,generateCsp} from '../scripts/csp.mjs';

it('hashes exact trusted script bytes and guards HTML before any scripts',()=>{
 const code='\nself.__next_f.push([0]);\n';
 const source=`<html><head><script>${code}</script><script src="/app.js"></script></head><body></body></html>`;
 const result=protectHtml(source);
 expect(result.hashes).toEqual([`'sha256-${createHash('sha256').update(code).digest('base64')}'`]);
 expect(result.html.indexOf('http-equiv="Content-Security-Policy"')).toBeLessThan(result.html.indexOf('<script>'));
 expect(result.html).toContain("script-src-attr 'none'");
 expect(result.html).not.toContain('unsafe-inline');
});

it('keeps Google ownership verification files unchanged',()=>{
 const verification='google-site-verification: google123.html';
 expect(protectHtml(verification).html).toBe(verification);
});

it('protects direct HTML, clean aliases and 404 fallback within provider limits',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'filefit-csp-'));
 try{
  await mkdir(path.join(root,'tools','demo'),{recursive:true});
  const html='<html><head><script>self.__next_f=[];</script></head><body>test</body></html>';
  await writeFile(path.join(root,'index.html'),html);await writeFile(path.join(root,'tools','demo','index.html'),html);await writeFile(path.join(root,'404.html'),html);await writeFile(path.join(root,'_headers'),"/*\n  X-Frame-Options: DENY\n");
  const result=await generateCsp(root);const headers=await readFile(path.join(root,'_headers'),'utf8');
  for(const route of ['/','/index.html','/tools/demo','/tools/demo/','/tools/demo/index.html','/404.html'])expect(headers).toContain(`${route}\n  Content-Security-Policy:`);
  expect(result.maxHeaderLine).toBeLessThanOrEqual(2000);
  expect(await readFile(path.join(root,'404.html'),'utf8')).toContain('http-equiv="Content-Security-Policy"');
 }finally{if(!root.startsWith(path.join(tmpdir(),'filefit-csp-')))throw new Error('Unexpected fixture cleanup path');await rm(root,{recursive:true,force:true});}
});
