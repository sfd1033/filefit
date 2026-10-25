# 인수 기준

| ID | 기준 | 검증 방법 |
|---|---|---|
| I1 | 300×400 JPG의 실제 픽셀과 100,000바이트 이하 | Playwright: Blob을 재디코딩, 다운로드 파일 길이 비교 |
| I2 | 최종 바이트 경계 포함, 초과 결과 금지 | Vitest: 100000/100001 경계 |
| I3 | PNG/WebP 실제 MIME과 다운로드 | Playwright 형식별 Blob 검사 |
| I4 | 불가능한 1바이트 요청에 오류·다운로드 없음 | Playwright |
| I5 | 위장 파일, 빈 파일, 비정상 숫자, 과대 크기 거부 | Vitest 및 Playwright |
| P1 | 이미지 2장 → 2페이지 PDF | Playwright + pdf-lib 재파싱 |
| P2 | 두 PDF → 총 페이지 합계 | Vitest + Playwright |
| P3 | 선택 순서·중복 제거·범위 오류 | Vitest 페이지 폭으로 순서 확인 + Playwright |
| P4 | 결과 PDF.js 미리보기 | Playwright 로컬 worker 실제 렌더링 |
| P5 | 손상/위장/200페이지 초과 PDF 오류 | Vitest |
| U1 | 모바일 가로 스크롤 없음 | Playwright Pixel 7 viewport |
| U2 | 선택·입력 레이블, focus, 상태 알림 | UI 구현 + 브라우저 동작 검사 |
| U3 | 설정 링크 재접속 시 값 복원 | Playwright |
| S1 | 파일 처리 중 외부 요청·쓰기 요청 0 | Playwright 네트워크 관찰 |
| S2 | 도구/정책/가이드 정적 페이지 정상 응답 | Playwright |
| S3 | canonical/sitemap/robots 생성 | Playwright 및 out 검사 |
| B1 | strict typecheck, lint, production build 성공 | 각 명령의 종료 코드 |

실행 결과는 VALIDATION.md에 별도 기록한다. 테스트 작성 사실과 실행 통과를 구분한다. 실기기 메모리 스트레스, Safari/Firefox, 암호화 문서의 다양한 방식, 모든 EXIF 방향의 실기기 결과는 자동으로 통과로 간주하지 않는다.
