export const tools = [
 {slug:'image-resize',title:'이미지 규격 맞추기',short:'픽셀 + 용량',description:'가로·세로 픽셀과 최대 용량을 한 번에 맞추세요. JPG 300×400px, 100KB 이하도 정확한 바이트로 확인합니다.',icon:'↗'},
 {slug:'image-compress',title:'이미지 압축',short:'가볍게 줄이기',description:'원하는 픽셀과 용량으로 JPG·WebP 사진을 압축합니다. 원본 픽셀을 입력하면 크기를 유지할 수 있습니다.',icon:'↓'},
 {slug:'image-convert',title:'이미지 형식 변환',short:'JPG · PNG · WebP',description:'JPG, PNG, WebP 사이에서 이미지 형식을 변환합니다. JPG는 투명 영역을 흰색으로 처리합니다.',icon:'⇄'},
 {slug:'image-to-pdf',title:'이미지를 PDF로',short:'사진을 한 문서로',description:'여러 장의 이미지를 선택한 순서대로 A4 PDF 한 파일에 담습니다.',icon:'▧'},
 {slug:'pdf-merge',title:'PDF 합치기',short:'여러 문서를 하나로',description:'PDF 파일의 순서를 정하고 하나의 PDF로 합칩니다. 파일은 브라우저 안에서만 처리합니다.',icon:'⊞'},
 {slug:'pdf-split',title:'PDF 페이지 분할',short:'필요한 페이지만',description:'1-3, 5처럼 페이지를 선택하여 새 PDF로 추출하고 다운로드합니다.',icon:'✂'},
] as const;
export type ToolSlug = typeof tools[number]['slug'];
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://filefit.example').replace(/\/$/,'');

export const isIndexable = Boolean(process.env.NEXT_PUBLIC_SITE_URL) && process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
