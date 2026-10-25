# 보안 설정과 검증

2026-10-25 사용자 승인에 따라 인라인 JavaScript 전체 허용을 빌드된 스크립트의 SHA-256 해시 허용 방식으로 변경했다.

## 정적 CSP

- `npm run build`는 Next.js 정적 내보내기 후 `scripts/csp.mjs`를 반드시 실행한다.
- 각 HTML의 실제 인라인 스크립트 바이트를 해시한다. 실행 스크립트의 공백을 정규화하지 않는다.
- 출력 `_headers`에 페이지와 경로 별칭별 정책을 생성한다. 기본 헤더와 경로 헤더는 Cloudflare처럼 결합되며, 각 정책은 동시에 적용된다.
- 모든 HTML의 head 맨 앞에 script-src 해시 정책을 추가해 404 대체 응답과 파일 경로 별칭도 보호한다. frame-ancestors는 HTTP 헤더로만 전달한다.
- script-src에는 unsafe-inline/unsafe-eval이 없다. script-src-attr 'none'으로 인라인 이벤트 처리기를 차단한다. 같은 원점의 정적 JavaScript 파일은 허용한다.
- style-src의 unsafe-inline은 스타일 적용을 위해 유지한다. JavaScript 전체 허용과는 별개이며 이 변경이 모든 종류의 주입 공격을 제거한다는 의미는 아니다.
- 해시 생성이 누락되거나 Cloudflare의 100개 규칙/줄당 2,000자 제한을 넘으면 빌드를 실패시킨다. 현재 로컬 결과는 39개 경로, 최대 헤더 줄 724자다.
- Google 소유권 확인용 파일처럼 head와 실행 스크립트가 없는 텍스트 파일은 본문을 변경하지 않는다.

## 검증 근거

- 타입 검사, 린트, 단위 테스트 15개, Chromium 데스크톱/모바일 테스트 10개 통과.
- 실제 페이지에서 정상 스크립트가 실행되어 UI와 설정 링크가 동작하는지 확인했다.
- 테스트 브라우저에 임의 script 요소와 onclick 속성을 삽입했을 때 코드가 실행되지 않는지 확인했다.
- 이미지 형식 변환·용량 제한·다운로드, 이미지→PDF·합치기·추출·PDF worker 미리보기, 페이지 이동을 재검증했다.
- 이번 npm audit 실행의 알려진 취약점은 개발 의존성 포함 0건이다. 이는 감사 시 알려진 항목만을 뜻한다.

## 유지 사항과 제한

파일은 서버에 전송하지 않는다. 원본 파일명은 React 텍스트로 표시하며 직접 HTML을 삽입하지 않는다. 이미지와 파일 크기/PDF 페이지 제한은 유지한다. 복잡한 PDF는 브라우저 메모리와 메인 스레드를 많이 사용할 수 있으므로 별도 처리 worker와 시간 제한은 후속 안정화 과제다.

계정의 패스키, 복구 이메일·전화번호, 2단계 인증, 추가 사용자 권한, API 토큰은 이번 CSP 변경에 포함하지 않았다. 해당 설정은 계정 소유자가 직접 관리한다. 공개 사이트의 정적 Google 소유권 확인 태그는 비밀키가 아니며 인증 유지를 위해 제거하지 않는다.

참고:
- https://developers.cloudflare.com/pages/configuration/headers/
- https://nextjs.org/docs/app/guides/content-security-policy
