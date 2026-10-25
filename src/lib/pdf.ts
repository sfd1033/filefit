import { PDFDocument } from 'pdf-lib';
import { MAX_TOTAL, pageIndices, validateFiles } from './core';
import { convertImage, decodeImage } from './image';
export async function loadPdf(file:File) {
  validateFiles([file]);
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-') throw new Error('올바른 PDF 파일이 아닙니다.');
  try { const doc=await PDFDocument.load(bytes); if(doc.getPageCount()>200) throw new Error('PAGE_LIMIT'); return doc; }
  catch(e) { if(e instanceof Error && e.message==='PAGE_LIMIT') throw new Error('PDF는 최대 200페이지까지 지원합니다.'); throw new Error('암호로 보호되었거나 손상된 PDF는 처리할 수 없습니다.'); }
}
export async function pdfPreview(file:File):Promise<string> {
  const pdfjs=await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
  const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),stopAtErrors:true});
  try { const doc=await task.promise; const page=await doc.getPage(1); const base=page.getViewport({scale:1}); const viewport=page.getViewport({scale:Math.min(240/base.width,320/base.height)}); const canvas=document.createElement('canvas'); canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height); await page.render({canvas,viewport}).promise; const url=canvas.toDataURL(); canvas.width=canvas.height=0; return url; } finally { await task.destroy(); }
}
export async function makePdf(files:File[],mode:'image-to-pdf'|'pdf-merge'|'pdf-split',range:string) {
  validateFiles(files); const output=await PDFDocument.create();
  if(mode==='image-to-pdf') {
    for(const file of files) {
      const bmp=await decodeImage(file); const w=bmp.width,h=bmp.height; bmp.close();
      const blob=await convertImage(file,{width:w,height:h,maxBytes:20*1024*1024,format:'image/jpeg',fit:'contain'});
      const img=await output.embedJpg(await blob.arrayBuffer()); const page=output.addPage([595.28,841.89]); const scale=Math.min(555.28/w,801.89/h); page.drawImage(img,{x:(595.28-w*scale)/2,y:(841.89-h*scale)/2,width:w*scale,height:h*scale});
    }
  } else {
    if(mode==='pdf-split' && files.length!==1) throw new Error('페이지 추출은 PDF 한 개를 선택하세요.');
    for(const file of files) { const input=await loadPdf(file); const indices=mode==='pdf-split'?pageIndices(range,input.getPageCount()):input.getPageIndices(); if(output.getPageCount()+indices.length>200) throw new Error('결과 PDF는 200페이지 이하만 지원합니다.'); const pages=await output.copyPages(input,indices); pages.forEach(p=>output.addPage(p)); }
  }
  const bytes=await output.save(); if(bytes.byteLength>MAX_TOTAL) throw new Error('결과 PDF가 50MB를 초과합니다. 파일 개수나 이미지 픽셀을 줄여 주세요.'); return {blob:new Blob([new Uint8Array(bytes)],{type:'application/pdf'}),pages:output.getPageCount()};
}
