import { operator } from '@/lib/operator';

export const metadata = { title: '개인정보처리방침', alternates: { canonical: '/privacy/' } };

export default function Privacy() {
  return (
    <article className="article">
      <h1>개인정보처리방침</h1>
      <p>적용일: 2026년 10월 25일 · FileFit 운영 안내</p>
      <h2>운영자 및 문의</h2>
      <p>FileFit 운영자: {operator.name}<br />개인정보 관련 문의·열람·삭제 요청: <a href={`mailto:${operator.email}`}>{operator.email}</a></p>
      <h2>파일 처리</h2>
      <p>선택한 이미지와 PDF, 변환 결과는 브라우저에서 처리하며 FileFit 서버에 업로드하거나 데이터베이스에 저장하지 않습니다. 파일을 지우거나 탭을 닫으면 앱의 참조를 해제합니다. 다운로드한 파일은 사용자의 기기에 남습니다.</p>
      <h2>접속 정보와 호스팅</h2>
      <p>사이트의 정적 파일은 Cloudflare Pages를 통해 제공됩니다. 호스팅 업체 Cloudflare는 서비스 전달과 보안을 위해 IP 주소, 요청 경로, 브라우저 정보 등 기술적 접속 정보를 처리할 수 있습니다. 선택한 파일 내용과 변환 결과는 이러한 요청에 포함하지 않습니다. Cloudflare가 처리하는 정보와 보관에 관한 안내는 <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare 개인정보처리방침</a>에서 확인할 수 있습니다.</p>
      <h2>이메일 문의</h2>
      <p>직접 이메일로 문의하면 운영자는 답변과 문제 해결을 위해 발신 이메일 주소와 문의 내용을 확인합니다. 개인정보가 담긴 원본 파일이나 민감한 정보는 보내지 마세요. 문의 내용의 열람·정정·삭제 요청은 위 연락처로 보낼 수 있습니다.</p>
      <h2>쿠키·분석·광고</h2>
      <p>현재 버전은 광고, 방문 분석, 회원가입, 외부 AI API를 사용하지 않으며 앱 자체 쿠키나 영구 저장소에 파일을 보관하지 않습니다. 향후 광고를 도입하면 실제 사용 업체, 처리 항목과 필요한 동의 절차를 안내에 반영한 뒤 적용합니다.</p>
      <h2>공유 링크</h2>
      <p>개인 설정 링크에는 무작위 식별자, 픽셀, 용량, 형식과 여백 설정만 URL 해시로 담습니다. 이름이나 파일 내용은 담지 않습니다. 링크를 가진 사람은 동일한 설정을 열 수 있습니다.</p>
    </article>
  );
}
