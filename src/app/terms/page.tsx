import { operator } from '@/lib/operator';

export const metadata = { title: '이용약관', alternates: { canonical: '/terms/' } };

export default function Terms() {
  return (
    <article className="article">
      <h1>이용약관</h1>
      <p>적용일: 2026년 10월 25일 · FileFit 운영 안내</p>
      <h2>운영자</h2>
      <p>FileFit 운영자: {operator.name}<br />문의: <a href={`mailto:${operator.email}`}>{operator.email}</a></p>
      <h2>서비스 범위</h2>
      <p>FileFit은 브라우저에서 이미지 크기·형식 변환과 PDF 페이지 편집을 제공하는 무료 도구입니다. 처리 제한과 지원 형식은 각 도구와 가이드에 안내합니다.</p>
      <h2>사용자의 확인</h2>
      <p>처리 권한이 있는 파일만 사용하세요. 원본은 별도로 보관하고 결과의 품질·페이지 순서·내용을 직접 확인하세요. 제출처의 사진 내용 심사나 파일 승인 여부를 보장하지 않습니다.</p>
      <h2>기술적 제한</h2>
      <p>기기 자원과 브라우저에 따라 처리 실패가 발생할 수 있습니다. PDF 서명과 대화형 기능, 애니메이션 유지, 암호화 문서 처리를 지원하지 않습니다. 중요한 원본을 결과로 덮어쓰지 마세요.</p>
      <h2>운영 안내</h2>
      <p>현재 버전은 공개 베타 MVP입니다. 기능과 약관을 변경할 경우 이 페이지에 적용일과 함께 안내합니다. 적용되는 법령상 권리를 제한하지 않습니다.</p>
    </article>
  );
}
