import {MAX_PIXELS} from './core';
// Read dimensions before decoding compressed image data, including JPEG/WebP bombs.
export function imageDimensions(b:Uint8Array):{width:number;height:number} {
 const v=new DataView(b.buffer,b.byteOffset,b.byteLength);
 const ascii=(start:number,n:number)=>String.fromCharCode(...b.slice(start,start+n));
 let width=0,height=0;
 if(b.length>=24&&ascii(1,3)==='PNG'&&b[0]===137&&ascii(12,4)==='IHDR'){width=v.getUint32(16);height=v.getUint32(20);}
 else if(b[0]===255&&b[1]===216){
  let pos=2;
  while(pos+4<=b.length){if(b[pos++]!==255)break;while(b[pos]===255)pos++;const marker=b[pos++];if(marker===0xda||marker===0xd9)break;if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;if(pos+2>b.length)break;const length=v.getUint16(pos);if(length<2||pos+length>b.length)break;if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)&&length>=7){height=v.getUint16(pos+3);width=v.getUint16(pos+5);break;}pos+=length;}
 }else if(b.length>=30&&ascii(0,4)==='RIFF'&&ascii(8,4)==='WEBP'){
  const chunk=ascii(12,4);
  if(chunk==='VP8X'){width=1+b[24]+(b[25]<<8)+(b[26]<<16);height=1+b[27]+(b[28]<<8)+(b[29]<<16);}
  else if(chunk==='VP8 '&&b[23]===0x9d&&b[24]===1&&b[25]===0x2a){width=v.getUint16(26,true)&0x3fff;height=v.getUint16(28,true)&0x3fff;}
  else if(chunk==='VP8L'&&b[20]===0x2f){const bits=v.getUint32(21,true);width=(bits&0x3fff)+1;height=((bits>>>14)&0x3fff)+1;}
 }
 if(!width||!height)throw new Error('JPG, PNG, WebP 실제 이미지 파일만 지원합니다. 손상된 이미지 또는 HEIC, GIF, SVG는 처리할 수 없습니다.');
 if(width*height>MAX_PIXELS)throw new Error('원본 이미지는 1,600만 픽셀 이하만 지원합니다.');
 return {width,height};
}
