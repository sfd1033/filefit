import {describe,it,expect} from 'vitest';
import {pageIndices,validateOptions,validateFiles,encodeWithinLimit} from '../src/lib/core';
import {loadPdf,makePdf} from '../src/lib/pdf';
import {PDFDocument} from 'pdf-lib';
describe('file constraints',()=>{
 it('keeps exact byte boundary',async()=>{expect((await encodeWithinLimit(async()=>new Blob(['x'.repeat(100000)]),100000)).size).toBe(100000);await expect(encodeWithinLimit(async()=>new Blob(['x'.repeat(100001)]),100000)).rejects.toThrow();});
 it('rejects impossible lossless output',async()=>{let calls=0;await expect(encodeWithinLimit(async()=>{calls++;return new Blob(['abc']);},2,true)).rejects.toThrow();expect(calls).toBe(1);});
 it('searches even when sizes are not monotonic',async()=>{const blob=await encodeWithinLimit(async q=>new Blob(['x'.repeat(q===.9?3:8)]),4);expect(blob.size).toBe(3);});
 it('rejects nonfinite and excessive sizes',()=>{for(const width of [NaN,Infinity,0,-1,1.1,9000]) expect(()=>validateOptions({width,height:400,maxBytes:100000,format:'image/jpeg',fit:'contain'})).toThrow();expect(()=>validateFiles([])).toThrow();expect(()=>validateFiles([new File([],'empty')])).toThrow();});
 it('parses ordered unique pages and rejects invalid ranges',()=>{expect(pageIndices('5, 1-3, 2',5)).toEqual([4,0,1,2]);for(const s of ['','0','2-1','6','1,,2','1.5','1-999999999'])expect(()=>pageIndices(s,5)).toThrow();});
});
describe('real PDF bytes',()=>{
 async function file(count:number){const d=await PDFDocument.create();for(let i=0;i<count;i++)d.addPage([100+i,200]);return new File([new Uint8Array(await d.save())],'a.pdf',{type:'application/pdf'});}
 it('merges and extracts with correct page order',async()=>{const a=await file(3),b=await file(2);const merged=await makePdf([a,b],'pdf-merge','');expect((await PDFDocument.load(await merged.blob.arrayBuffer())).getPageCount()).toBe(5);const split=await makePdf([a],'pdf-split','3,1');const result=await PDFDocument.load(await split.blob.arrayBuffer());expect(result.getPages().map(p=>p.getWidth())).toEqual([102,100]);});
 it('rejects corrupt, disguised, and excessive-page PDFs',async()=>{await expect(loadPdf(new File(['oops'],'fake.pdf'))).rejects.toThrow();await expect(loadPdf(new File(['%PDF-broken'],'broken.pdf'))).rejects.toThrow();await expect(loadPdf(await file(201))).rejects.toThrow('200');});
});

it('rejects an encryption-marked PDF without bypassing encryption',async()=>{const d=await PDFDocument.create();d.addPage();d.context.trailerInfo.Encrypt=d.context.register(d.context.obj({Filter:'Standard',V:1,R:2,Length:40}));const f=new File([new Uint8Array(await d.save())],'locked.pdf');await expect(loadPdf(f)).rejects.toThrow('암호');});
