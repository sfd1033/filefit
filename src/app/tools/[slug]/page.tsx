import {notFound} from 'next/navigation';
import Link from 'next/link';
import type {Metadata} from 'next';
import {tools} from '@/lib/catalog';
import {Workbench} from '@/components/workbench';
export function generateStaticParams(){return tools.map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const t=tools.find(t=>t.slug===slug);return {title:t?.title,description:t?.description,alternates:{canonical:`/tools/${slug}/`}};}
export default async function Tool({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const t=tools.find(t=>t.slug===slug);if(!t)notFound();return <><div className="page-heading"><Link href="/">모든 도구</Link><span className="eyebrow">FREE · LOCAL · SIMPLE</span><h1>{t.title}</h1><p>{t.description}</p></div><Workbench key={t.slug} slug={t.slug}/><section className="article"><h2>이렇게 사용하세요</h2><ol><li>처리할 파일을 선택하세요. 파일당 20MB, 합계 50MB까지 지원합니다.</li><li>{slug.startsWith('image-')&&slug!=='image-to-pdf'?'픽셀, 최대 용량, 출력 형식과 여백·자르기 방식을 설정하세요.':'파일 순서를 확인하거나 추출할 페이지 범위를 입력하세요.'}</li><li>변환 후 결과 크기와 미리보기를 확인하고 다운로드하세요.</li></ol><h2>자주 묻는 질문</h2><h3>파일이 서버에 저장되나요?</h3><p>아니요. 브라우저의 메모리에서 처리하고 다운로드 링크를 만듭니다. URL 공유에도 파일은 포함하지 않습니다.</p><h3>제출처의 규격을 보장하나요?</h3><p>픽셀과 바이트는 확인하지만 인물 배경, 얼굴 비율, 문서 내용 등 제출처의 개별 심사 조건은 확인하지 않습니다. 제출처의 최신 공지를 확인하세요.</p><Link href="/guides/">자세한 사용 가이드 →</Link></section></>}
