import {it,expect} from 'vitest';
import {imageDimensions} from '../src/lib/dimensions';
it('rejects oversized PNG header before decoding',()=>{const b=new Uint8Array(24);b.set([137,80,78,71]);b.set([73,72,68,82],12);const v=new DataView(b.buffer);v.setUint32(16,100000);v.setUint32(20,100000);expect(()=>imageDimensions(b)).toThrow('1,600만');});
it('reads JPEG SOF dimensions after metadata',()=>{const b=new Uint8Array([255,216,255,224,0,4,0,0,255,192,0,7,8,1,144,1,44]);expect(imageDimensions(b)).toEqual({width:300,height:400});});
it('reads WebP extended dimensions',()=>{const b=new Uint8Array(30);b.set(new TextEncoder().encode('RIFF'),0);b.set(new TextEncoder().encode('WEBPVP8X'),8);b[24]=43;b[25]=1;b[27]=143;b[28]=1;expect(imageDimensions(b)).toEqual({width:300,height:400});});
it('rejects truncated and arbitrary bytes safely',()=>{for(const b of [new Uint8Array(),new Uint8Array([255,216,255,192,0,255]),new TextEncoder().encode('<svg></svg>')])expect(()=>imageDimensions(b)).toThrow();});
