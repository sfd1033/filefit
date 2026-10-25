import { imageDimensions } from './dimensions';
import { MAX_PIXELS, validateFiles, validateOptions, encodeWithinLimit, type Options } from './core';
export async function decodeImage(file: File) {
  validateFiles([file]);
  imageDimensions(new Uint8Array(await file.arrayBuffer()));
  let bitmap:ImageBitmap;
  try { bitmap=await createImageBitmap(file,{imageOrientation:'from-image'}); } catch { throw new Error('손상되었거나 이 브라우저에서 읽을 수 없는 이미지입니다.'); }
  if(bitmap.width*bitmap.height>MAX_PIXELS) { bitmap.close(); throw new Error('원본 이미지는 1,600만 픽셀 이하만 지원합니다.'); }
  return bitmap;
}
export async function convertImage(file:File,o:Options):Promise<Blob> {
  validateOptions(o);
  const bitmap=await decodeImage(file);
  const canvas=document.createElement('canvas'); canvas.width=o.width; canvas.height=o.height;
  try {
    const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('브라우저 이미지 처리 기능을 사용할 수 없습니다.');
    if(o.format==='image/jpeg') { ctx.fillStyle='#fff'; ctx.fillRect(0,0,o.width,o.height); }
    const ratio=o.fit==='cover'?Math.max(o.width/bitmap.width,o.height/bitmap.height):Math.min(o.width/bitmap.width,o.height/bitmap.height);
    ctx.drawImage(bitmap,(o.width-bitmap.width*ratio)/2,(o.height-bitmap.height*ratio)/2,bitmap.width*ratio,bitmap.height*ratio);
    return await encodeWithinLimit(q=>new Promise((resolve,reject)=>canvas.toBlob(blob=> {
      if(!blob || blob.type!==o.format) reject(new Error('이 브라우저는 선택한 출력 형식을 지원하지 않습니다.')); else resolve(blob);
    },o.format,q)),o.maxBytes,o.format==='image/png');
  } finally { bitmap.close(); canvas.width=canvas.height=0; }
}
