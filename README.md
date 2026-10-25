# FileFit

공개 베타: https://filefit-59l.pages.dev/
소스: https://github.com/sfd1033/filefit

한국어 브라우저 전용 이미지·PDF 도구 MVP. 원본/결과 업로드, AI API, 계정, DB, 결제, 광고 코드 없음.

## 실행

Node.js 22.13 이상(권장 Node 24 LTS), npm 사용.

```sh
npm ci
npm run dev
```

정적 배포 파일 및 로컬 미리보기:

```sh
npm run build
npm start
```

http://localhost:3000 에서 열기. 소스 대신 out/을 서빙하므로 파일을 수정하면 다시 빌드한다. PDF.js worker는 dev/build 전 준비 스크립트가 node_modules에서 public으로 복사한다.

## 검증

```sh
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run build
npm run test:e2e
```

실행 근거와 제한: [검증 보고서](docs/VALIDATION.md). 요구사항: [PRD](docs/PRD.md), [아키텍처](docs/ARCHITECTURE.md), [인수 기준](docs/ACCEPTANCE.md), [배포](docs/DEPLOYMENT.md).

기본 빌드는 검색 차단 상태다. 실제 도메인 및 문의 이메일을 설정하고 운영 문서를 완성한 다음 NEXT_PUBLIC_ALLOW_INDEXING=true로 재빌드하면 검색 색인이 허용된다. 테스트와 설정 링크에 원본 파일이 포함되지 않는다.
