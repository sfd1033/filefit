'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { type Options, validateFiles, validateOptions } from '@/lib/core';
import { type ToolSlug } from '@/lib/catalog';
const defaults: Options={width:300,height:400,maxBytes:100000,format:'image/jpeg',fit:'contain'};
type Result={url:string;name:string;size:number;detail:string};
export function Workbench({slug}:{slug:ToolSlug}) {
 const isImage=['image-resize','image-compress','image-convert'].includes(slug);
 const [files,setFiles]=useState<File[]>([]),[options,setOptions]=useState(defaults),[range,setRange]=useState('1'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState(''),[result,setResult]=useState<Result|null>(null),[preview,setPreview]=useState(''),[share,setShare]=useState('');
 const activeUrl=useRef(''); const generation=useRef(0); const input=useRef<HTMLInputElement>(null);
 useEffect(()=> {
   const state=generation;
   const restore=()=>{if(isImage && location.hash) {try {const p=new URLSearchParams(location.hash.slice(1));const next={width:Number(p.get('w')),height:Number(p.get('h')),maxBytes:Number(p.get('b')),format:p.get('f'),fit:p.get('fit')} as Options;validateOptions(next);setOptions(next);}catch{setError('공유 링크의 설정이 올바르지 않아 기본 설정을 사용합니다.');}}};
   const timer=setTimeout(restore,0);
   window.addEventListener('hashchange',restore);
   return ()=>{clearTimeout(timer);window.removeEventListener('hashchange',restore);state.current++;URL.revokeObjectURL(activeUrl.current);};
 },[isImage]);
 function clearOutput() { generation.current++; URL.revokeObjectURL(activeUrl.current); activeUrl.current='';setResult(null);setError('');setStatus('');setPreview(''); }
 function choose(list:File[]) { clearOutput();setShare(''); try {validateFiles(list);if(isImage&&list.length!==1) throw new Error('이미지를 한 개 선택하세요.');setFiles(list);}catch(e){setFiles([]);setError((e as Error).message);} }
 function update(next:Options){clearOutput();setShare('');setOptions(next);}
 async function run() {
   clearOutput();setBusy(true);const token=generation.current;
   try {
    validateFiles(files); let blob:Blob;let detail:string;let name:string;
    setStatus('파일을 처리하고 결과를 검증하고 있습니다…');
    if(isImage){const {convertImage}=await import('@/lib/image');blob=await convertImage(files[0],options);const ext=options.format.split('/')[1].replace('jpeg','jpg');name=`filefit-${options.width}x${options.height}.${ext}`;detail=`${options.width} × ${options.height}px · ${options.format.split('/')[1].toUpperCase()} · 제한 ${options.maxBytes.toLocaleString()}바이트 이하 확인`;}
    else {const {makePdf,pdfPreview}=await import('@/lib/pdf'); const output=await makePdf(files,slug as 'image-to-pdf'|'pdf-merge'|'pdf-split',range);blob=output.blob;name=`filefit-${slug}.pdf`;detail=`${output.pages}페이지 · PDF`; try {const p=await pdfPreview(new File([blob],name,{type:'application/pdf'}));if(token===generation.current)setPreview(p);}catch{if(token===generation.current)setStatus('PDF 생성 완료. 이 문서의 미리보기는 표시할 수 없습니다.');} }
    if(token!==generation.current)return;
    activeUrl.current=URL.createObjectURL(blob);setResult({url:activeUrl.current,name,size:blob.size,detail});setStatus('변환 완료. 아래에서 파일을 저장하세요.');
   }catch(e){if(token===generation.current){setError(e instanceof Error?e.message:'처리 중 오류가 발생했습니다. 파일을 줄여 다시 시도하세요.');setStatus('');}}
   finally{setBusy(false);}
 }
 function move(index:number,delta:number){clearOutput();setFiles(old=>{const list=[...old];[list[index],list[index+delta]]=[list[index+delta],list[index]];return list;});}
 function shareSettings(){try{validateOptions(options);const p=new URLSearchParams({w:String(options.width),h:String(options.height),b:String(options.maxBytes),f:options.format,fit:options.fit,id:crypto.randomUUID()});const url=`${location.origin}${location.pathname}#${p}`;history.replaceState(null,'',url);setShare(url);}catch(e){setError((e as Error).message);}}
 return <div className="workspace"><section className="panel"><div className="step"><span>01</span><h2>파일 선택</h2><span className="local-badge">기기 안에서 처리</span></div>
 <fieldset disabled={busy}><div className="dropzone" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(!busy)choose(Array.from(e.dataTransfer.files));}}><div className="upload-icon">↑</div><h3>파일을 여기에 놓아 주세요</h3><p>{isImage||slug==='image-to-pdf'?'JPG, PNG, WebP':'PDF'} · 파일당 최대 20MB</p><label className="button secondary file-button">파일 선택<input ref={input} type="file" aria-label="변환할 파일 선택" accept={isImage||slug==='image-to-pdf'?'.jpg,.jpeg,.png,.webp':'.pdf'} multiple={!isImage&&slug!=='pdf-split'} onChange={e=>choose(Array.from(e.target.files??[]))}/></label></div>
 {files.length>0&&<ul className="file-list">{files.map((f,i)=><li key={`${i}-${f.name}`}><span><strong>{f.name}</strong><small>{f.size.toLocaleString()}바이트</small></span>{files.length>1&&<div><button type="button" disabled={i===0} aria-label={`${f.name} 위로`} onClick={()=>move(i,-1)}>↑</button><button type="button" disabled={i===files.length-1} aria-label={`${f.name} 아래로`} onClick={()=>move(i,1)}>↓</button></div>}</li>)}</ul>}
 <div className="step settings-title"><span>02</span><h2>{isImage?'출력 규격':'문서 설정'}</h2></div>
 {isImage?<><div className="fields"><label>가로 (px)<input type="number" min="1" max="8000" value={options.width} onChange={e=>update({...options,width:Number(e.target.value)})}/></label><label>세로 (px)<input type="number" min="1" max="8000" value={options.height} onChange={e=>update({...options,height:Number(e.target.value)})}/></label><label>최대 용량 (KB)<input type="number" min="0.001" max="20000" step="0.001" value={options.maxBytes/1000} onChange={e=>update({...options,maxBytes:Math.round(Number(e.target.value)*1000)})}/></label><label>출력 형식<select value={options.format} onChange={e=>update({...options,format:e.target.value as Options['format']})}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label></div><label className="full-label">비율 처리<select value={options.fit} onChange={e=>update({...options,fit:e.target.value as Options['fit']})}><option value="contain">전체 보이기 (여백 추가)</option><option value="cover">꽉 채우기 (중앙 기준 자르기)</option></select></label><p className="hint">1KB = 1,000바이트. 픽셀 크기는 고정하며, JPG의 여백과 투명 부분은 흰색이 됩니다.</p><button className="text-button" type="button" onClick={shareSettings}>내 설정 공유 링크 만들기 ↗</button>{share&&<label className="full-label">파일 없이 설정만 공유됩니다<input aria-label="설정 공유 URL" readOnly value={share} onFocus={e=>e.target.select()}/></label>}</>:slug==='pdf-split'?<label className="full-label">추출할 페이지<input value={range} onChange={e=>{clearOutput();setRange(e.target.value);}} placeholder="예: 1-3, 5"/><small>입력한 순서로 중복 없이 하나의 새 PDF를 만듭니다.</small></label>:<p className="hint">목록의 화살표로 순서를 바꿀 수 있습니다. {slug==='image-to-pdf'?'각 이미지는 A4 한 페이지에 비율을 유지하여 들어갑니다.':'모든 페이지를 목록 순서대로 합칩니다.'}</p>}
 <button className="button primary convert" type="button" disabled={!files.length} onClick={run}>규격에 맞게 변환하기 <span>→</span></button></fieldset>
 {busy&&<button className="text-button" onClick={()=>{generation.current++;setStatus('결과 저장을 취소했습니다. 내부 처리가 끝날 때까지 잠시 기다려 주세요.');}}>결과 생성 취소</button>}
 <p role="status" aria-live="polite">{status}</p>{error&&<div className="error" role="alert">{error}</div>}
 </section><aside className="result-column"><section className="panel result-panel"><div className="step"><span>03</span><h2>변환 결과</h2></div>{result?<div className="result"><div className="success-mark">✓</div><h3>파일이 준비됐어요</h3>{(isImage||preview)&&<img className="preview" src={isImage?result.url:preview} alt="변환 결과 미리보기"/>}<p>{result.detail}</p><strong className="byte-count">{result.size.toLocaleString()}<small> 바이트</small></strong><a className="button primary" href={result.url} download={result.name}>파일 다운로드 ↓</a><button className="text-button" onClick={()=>{clearOutput();setFiles([]);if(input.current)input.current.value='';}}>파일 및 결과 지우기</button></div>:<div className="empty-result"><div>▧</div><h3>{busy?'변환 중입니다':'결과가 여기에 표시됩니다'}</h3><p>파일을 선택하고 필요한 규격을 입력하세요.<br/>실제 변환된 파일만 다운로드할 수 있습니다.</p></div>}</section><section className="privacy-note"><span>◇</span><div><h3>내 파일은 내 브라우저에</h3><p>원본과 결과를 서버로 전송하지 않습니다. 파일을 지우거나 탭을 닫으면 앱이 보관하는 파일 참조가 해제됩니다.</p></div></section><p className="hint">최대 20개 · 합계 50MB · 이미지 1,600만 픽셀 · PDF 200페이지. 기기의 여유 메모리에 따라 더 작은 파일도 실패할 수 있습니다.</p></aside></div>;
}
