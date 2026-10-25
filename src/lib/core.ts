export const MAX_FILE = 20 * 1024 * 1024;
export const MAX_TOTAL = 50 * 1024 * 1024;
export const MAX_PIXELS = 16_000_000;
export type Format = 'image/jpeg' | 'image/png' | 'image/webp';
export type Options = { width: number; height: number; maxBytes: number; format: Format; fit: 'contain' | 'cover' };
export function validateOptions(o: Options) {
  if (![o.width,o.height,o.maxBytes].every(Number.isSafeInteger) || o.width<1 || o.height<1 || o.width>8000 || o.height>8000 || o.width*o.height>MAX_PIXELS || o.maxBytes<1 || o.maxBytes>MAX_FILE) throw new Error('가로·세로는 1~8,000 정수, 총 1,600만 픽셀 이하, 용량은 1바이트~20MB로 입력하세요.');
  if (!['image/jpeg','image/png','image/webp'].includes(o.format) || !['contain','cover'].includes(o.fit)) throw new Error('지원하지 않는 변환 설정입니다.');
}
export function validateFiles(files: readonly File[]) {
  if (!files.length || files.length>20) throw new Error('파일은 1~20개 선택하세요.');
  if (files.some(f=>f.size===0 || f.size>MAX_FILE) || files.reduce((n,f)=>n+f.size,0)>MAX_TOTAL) throw new Error('빈 파일은 처리할 수 없습니다. 파일당 20MB, 합계 50MB 이하로 선택하세요.');
}
export function pageIndices(text: string, count: number): number[] {
  const result = new Set<number>();
  if (!text.trim()) throw new Error('페이지를 입력하세요. 예: 1-3, 5');
  for(const part of text.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error('페이지 형식이 올바르지 않습니다. 예: 1-3, 5');
    const start=Number(match[1]), end=Number(match[2]??match[1]);
    if(start<1 || end<start || end>count) throw new Error(`페이지는 1~${count} 범위로 입력하세요.`);
    for(let i=start;i<=end;i++) result.add(i-1);
  }
  return [...result];
}
export async function encodeWithinLimit(encode:(quality:number)=>Promise<Blob>, max:number, lossless=false) {
  // A finite descending search does not assume browser encoders are monotonic.
  for(const q of lossless ? [1] : [1,.95,.9,.85,.8,.75,.7,.65,.6,.55,.5,.45,.4,.35,.3,.25,.2,.15,.1,.05,0]) {
    const blob=await encode(q);
    if(blob.size>0 && blob.size<=max) return blob;
  }
  throw new Error('지정한 픽셀을 유지하면서 목표 용량을 충족하지 못했습니다. 용량 제한을 높이거나 픽셀을 줄여 주세요. PNG는 JPG 또는 WebP로 변경해 보세요.');
}
