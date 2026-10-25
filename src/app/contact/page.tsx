import { operator } from '@/lib/operator';

export const metadata = { title: '문의', alternates: { canonical: '/contact/' } };

export default function Contact() {
  return (
    <article className="article">
      <h1>문의</h1>
      <p>오류나 개선 의견을 알려 주세요. 개인정보가 담긴 원본 파일은 보내지 마세요.</p>
      <h2>운영자 연락처</h2>
      <p>운영자: {operator.name}<br />이메일: <a href={`mailto:${operator.email}`}>{operator.email}</a></p>
      <p>이메일 링크를 누르면 사용 중인 메일 앱이 열립니다. 이 페이지에는 문의 내용을 전송하는 양식이 없습니다.</p>
      <h2>오류를 설명할 때</h2>
      <ul>
        <li>사용한 도구와 선택한 설정</li>
        <li>브라우저 이름과 운영체제</li>
        <li>파일 형식, 대략적인 용량과 페이지 수</li>
        <li>화면에 표시된 오류 문구</li>
      </ul>
    </article>
  );
}
