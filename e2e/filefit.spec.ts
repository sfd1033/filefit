import {test,expect,type Page} from '@playwright/test';
import {PDFDocument} from 'pdf-lib';
import {readFile} from 'node:fs/promises';
async function imageFile(page:Page) {
 const data=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=600;c.height=800;const ctx=c.getContext('2d')!;ctx.fillStyle='#227763';ctx.fillRect(0,0,600,800);ctx.fillStyle='#f0d6a0';ctx.fillRect(140,140,320,450);return c.toDataURL('image/png').split(',')[1];});
 return {name:'sample.png',mimeType:'image/png',buffer:Buffer.from(data,'base64')};
}
async function convert(page:Page){await page.getByRole('button',{name:'규격에 맞게 변환하기'}).click();await expect(page.getByRole('link',{name:'파일 다운로드'})).toBeVisible({timeout:30000});}
test('real image output, byte limit, no upload, responsive layout',async({page},testInfo)=>{
 const external:string[]=[],writes:string[]=[];
 page.on('request',r=>{if(!r.url().startsWith('http://localhost:3000')&&!r.url().startsWith('blob:')&&!r.url().startsWith('data:'))external.push(r.url());if(!['GET','HEAD'].includes(r.method()))writes.push(r.method()+' '+r.url());});
 await page.goto('/');await page.getByLabel('변환할 파일 선택').setInputFiles(await imageFile(page));await convert(page);
 const facts=await page.locator('.result img').evaluate((el:HTMLImageElement)=>({w:el.naturalWidth,h:el.naturalHeight}));
 expect(facts).toEqual({w:300,h:400});
 const pending=page.waitForEvent('download');await page.getByRole('link',{name:'파일 다운로드'}).click();const dl=await pending;const bytes=await readFile((await dl.path())!);expect(bytes.length).toBeLessThanOrEqual(100000);expect(bytes[0]).toBe(255);expect(bytes[1]).toBe(216);
 expect(external).toEqual([]);expect(writes).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/${testInfo.project.name}-home.png`,fullPage:true});
});
test('PNG and WebP outputs, impossible limit, invalid file, shared settings',async({page})=>{
 await page.goto('/tools/image-convert/');const fixture=await imageFile(page);await page.getByLabel('변환할 파일 선택').setInputFiles(fixture);
 for(const format of ['image/png','image/webp']){await page.getByLabel('출력 형식').selectOption(format);await convert(page);const pending=page.waitForEvent('download');await page.getByRole('link',{name:'파일 다운로드'}).click();const dl=await pending;const bytes=await readFile((await dl.path())!);if(format==='image/png')expect(bytes.subarray(1,4).toString()).toBe('PNG');else expect(bytes.subarray(8,12).toString()).toBe('WEBP');}
 await page.getByLabel('최대 용량 (KB)').fill('0.001');await page.getByRole('button',{name:'규격에 맞게 변환하기'}).click();await expect(page.locator('main').getByRole('alert')).toContainText('충족하지 못했습니다');await expect(page.getByRole('link',{name:'파일 다운로드'})).toHaveCount(0);
 await page.getByLabel('최대 용량 (KB)').fill('100');await page.getByLabel('가로 (px)').fill('640');await page.getByRole('button',{name:'내 설정 공유 링크'}).click();const shared=await page.getByLabel('설정 공유 URL').inputValue();await page.goto(shared);await page.reload();await expect(page.getByLabel('가로 (px)')).toHaveValue('640');
 await page.getByLabel('변환할 파일 선택').setInputFiles({name:'fake.jpg',mimeType:'image/jpeg',buffer:Buffer.from('not a jpeg')});await page.getByRole('button',{name:'규격에 맞게 변환하기'}).click();await expect(page.locator('main').getByRole('alert')).toContainText('실제 이미지');
});
test('image PDF, merging, extracting, PDF.js local preview',async({page})=>{
 const forbidden:string[]=[];page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()) || (!r.url().startsWith('http://localhost:3000')&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:')))forbidden.push(r.url());});
 await page.goto('/tools/image-to-pdf/');const fixture=await imageFile(page);await page.getByLabel('변환할 파일 선택').setInputFiles([fixture,{...fixture,name:'second.png'}]);await convert(page);await expect(page.locator('.result img')).toBeVisible();
 async function resultBytes(){const pending=page.waitForEvent('download');await page.getByRole('link',{name:'파일 다운로드'}).click();const dl=await pending;return readFile((await dl.path())!);}
 const imagePdf=await resultBytes();expect((await PDFDocument.load(imagePdf)).getPageCount()).toBe(2);
 await page.goto('/tools/pdf-merge/');await page.getByLabel('변환할 파일 선택').setInputFiles([{name:'first.pdf',mimeType:'application/pdf',buffer:imagePdf},{name:'second.pdf',mimeType:'application/pdf',buffer:imagePdf}]);await convert(page);const merged=await resultBytes();expect((await PDFDocument.load(merged)).getPageCount()).toBe(4);
 await page.goto('/tools/pdf-split/');await page.getByLabel('변환할 파일 선택').setInputFiles({name:'merged.pdf',mimeType:'application/pdf',buffer:merged});await page.getByLabel('추출할 페이지').fill('4, 1-2');await convert(page);expect((await PDFDocument.load(await resultBytes())).getPageCount()).toBe(3);
 await page.getByLabel('추출할 페이지').fill('0-999');await page.getByRole('button',{name:'규격에 맞게 변환하기'}).click();await expect(page.locator('main').getByRole('alert')).toContainText('범위');expect(forbidden).toEqual([]);
});
test('all static pages and metadata exist',async({page})=>{
 for(const route of ['/guides/','/privacy/','/terms/','/contact/','/tools/image-compress/','/tools/image-resize/']) {const response=await page.goto(route);expect(response?.status()).toBe(200);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('link[rel=canonical]')).toHaveCount(1);}
 expect((await page.request.get('/sitemap.xml')).status()).toBe(200);expect((await page.request.get('/robots.txt')).status()).toBe(200);
});
