# GitHub / Cloudflare Pages 배포

현재 공개 베타가 Cloudflare Pages에 배포되어 있다. 소스와 자동 검증은 GitHub에 연결했다.

- 서비스: https://filefit-59l.pages.dev/
- 저장소: https://github.com/sfd1033/filefit
- Cloudflare 프로젝트: filefit / production branch: main
- 프리셋: Next.js (Static HTML Export), build: npm run build, output: out, root: 저장소 루트
- 빌드 환경: NODE_VERSION=24, NEXT_TELEMETRY_DISABLED=1, NEXT_PUBLIC_SITE_URL=https://filefit-59l.pages.dev
- 최초 배포 커밋: 679670a678d9c06b055e9108a7265ec6373ff6c6
- 해당 커밋의 GitHub 자동 검증: https://github.com/sfd1033/filefit/actions/runs/40179300178 (success)
- 공개 운영자: Mozzie King. 문의: studyfordream1033@gmail.com. 연락처와 정책을 게시했으며 Production에 NEXT_PUBLIC_ALLOW_INDEXING=true를 설정하고 재빌드하면 검색이 허용된다. Preview는 해당 값을 설정하지 않아 검색 차단을 유지한다. 도메인만 지정해도 자동으로 색인을 허용하지 않는다.
- 이후 main 변경은 Cloudflare에서 자동 빌드·배포한다. 롤백은 Cloudflare Pages 배포 목록에서 이전 성공 배포로 수행한다.

아래 연결 확인 기록은 최초 배포 전의 이력이며, 현재 상태는 위 배포 정보를 따른다.

## 재확인 결과 (2026-10-25)

- GitHub 연결 정상: `sfd1033` 계정의 프로필과 GitHub App 설치를 확인했다. 접근 가능한 저장소 목록은 빈 배열이며, 저장소 검색은 422를 반환했다. 새 저장소 생성 기능은 현재 연결 도구에 없다.
- GitHub 웹 저장소 생성 화면 접속은 저장된 브라우저 권한 설정으로 차단되었다. 다른 접속 방식으로 우회하지 않았다. 사용자가 직접 빈 `filefit` 저장소를 만든 뒤 URL을 알려 주면 연결 도구로 소스를 반영할 수 있다.
- Cloudflare 대시보드 접속은 성공했으며 `/login`의 로그인 화면을 확인했다. 해당 탭은 사용자 로그인용으로 유지했다. 로그인 정보는 사용자에게 직접 입력하도록 한다.
- 로컬 첫 커밋은 연결된 GitHub 로그인과 GitHub noreply 형식의 작성자 주소로 생성한다. 개인 이메일을 커밋에 사용하지 않는다. 저장소 원격 URL 및 배포 프로젝트는 아직 미설정이다.
- 실제 GitHub 원격 저장소 생성/업로드, Cloudflare Pages 프로젝트 생성/배포는 아직 미실행이다.

### 지금 사용자가 할 일

1. GitHub에서 빈 `filefit` 저장소를 만든 뒤 저장소 URL을 알려 준다. 소스 공개 여부를 아직 정하지 않았다면 Private을 선택할 수 있다. README·라이선스·gitignore는 현재 소스에 있으므로 새 저장소는 초기 파일 없이 만들어도 된다.
2. 열린 Cloudflare 로그인 화면에서 직접 로그인한 뒤 완료를 알려 준다. 이후 GitHub 저장소 연동 승인 요청이 나타나면 대상 저장소 권한을 확인하여 직접 승인한다.

GitHub 플러그인을 다시 설치할 필요는 없다. 아래는 재확인 이전의 기록이다.

## 최초 연결 확인 기록 (2026-10-25)

- GitHub 플러그인: 미설치. 앞선 연결 제안 이후에도 미설치 상태로 확인됨.
- GitHub CLI / Wrangler: 실행 경로에서 확인되지 않음. 배포용 환경변수도 확인되지 않음.
- GitHub 브라우저: 앞선 접속이 권한 승인 단계에서 거절됨. 다른 방식으로 우회 접속하지 않음.
- Cloudflare 브라우저: `Tab 1 is not part of browser session` 오류. 상태를 다시 조회해도 열린 탭이 없어 계정 로그인 여부를 확인하지 못함.
- 확인한 기본 Wrangler 인증 설정 위치에는 설정 파일이 없음. 이것만으로 다른 브라우저의 로그인 여부까지 판단할 수는 없음.
- 외부 저장소 생성, push, Cloudflare 프로젝트 생성 및 배포는 모두 미실행.
- 로컬 `filefit/.git`를 main 브랜치로 초기화하고 소스 42개 파일을 스테이징했다. 작성자 이름/이메일이 설정되지 않아 임의 작성자 정보로 커밋하지 않았다. GitHub 연결 후 실제 계정의 작성자 정보와 원격 URL을 확인하여 커밋/push하면 된다.
- `.nvmrc`에 Node 24를 지정하고 `.env.example`을 추가했다. delivery/빌드/의존성/인증 파일 제외 규칙은 `git check-ignore`로 확인했다. 이번 작업은 배포 설정·문서 변경이며 앱 기능 테스트를 새로 실행한 것은 아니다. 기능 검증 결과는 VALIDATION.md의 이전 실행 기록을 참조한다.

인증 토큰을 채팅에 붙여 넣지 않는다. GitHub 계정 연결 및 Cloudflare 로그인/권한 승인은 사용자가 직접 진행한다.

### 최초 확인 당시 안내 (위 재확인 결과로 대체됨)

1. Codex의 GitHub 플러그인을 설치하고 저장소를 만들 계정으로 연결한다.
2. Cloudflare 계정에 로그인하고 대시보드 접근을 허용한다. GitHub 연동 과정에서 Cloudflare GitHub 앱 권한 승인 요청이 나오면 대상 FileFit 저장소에 한해 직접 승인한다.
3. 공개 문의 이메일과 운영자 표시 이름을 정한다. 도메인이 없다면 먼저 Cloudflare가 발급한 pages.dev 주소를 사용할 수 있다. 해당 URL을 확인한 뒤 NEXT_PUBLIC_SITE_URL로 설정하고 재빌드한다.

Git 연동 자동 배포를 목표로 하므로 기본 경로는 Git integration이다. `delivery/filefit-static-preview.zip`은 빌드 완료된 수동 업로드용 임시 산출물이며 검색 차단 상태다. Direct Upload로 만든 프로젝트는 나중에 같은 프로젝트를 Git integration으로 전환할 수 없으므로 별도 임시 프로젝트를 원할 때만 선택한다. 공식 안내: https://developers.cloudflare.com/pages/get-started/direct-upload/

## 1. GitHub

filefit 폴더에서 git init 후 소스를 커밋하고 사용자의 새 GitHub 저장소를 origin으로 연결하여 push한다. node_modules, out, .next 및 테스트 임시 결과는 .gitignore로 제외된다. package-lock.json은 반드시 포함한다. 제공된 .github/workflows/ci.yml은 타입/린트/단위/빌드/브라우저 검증 후 정적 산출물을 보관한다. 저장소 루트는 filefit 폴더 자체를 권장한다.

## 2. Cloudflare Pages

Cloudflare의 Workers & Pages에서 Pages 프로젝트를 만들고 GitHub 저장소를 연결한다. Framework preset: Next.js (Static HTML Export). Build command: `npm run build`. Build output directory: `out`. Root directory: 저장소 루트(filefit을 상위 저장소에 넣었다면 `filefit`). NODE_VERSION=24로 설정한다.

공개 빌드 환경변수:

```text
NEXT_PUBLIC_SITE_URL=https://실제-도메인
NEXT_PUBLIC_CONTACT_EMAIL=실제-문의-이메일
# 운영자/문의/정책을 완성한 정식 공개 시에만 설정
NEXT_PUBLIC_ALLOW_INDEXING=true
NEXT_TELEMETRY_DISABLED=1
```

NEXT_PUBLIC 값은 공개되는 설정이므로 비밀키를 넣지 않는다. 도메인 미설정 또는 NEXT_PUBLIC_ALLOW_INDEXING이 true가 아니면 noindex와 robots Disallow가 적용된다. 배포 미리보기 환경에는 운영 도메인 변수를 넣지 않아 색인을 막는다. 운영 환경변수 변경 뒤 반드시 새로 빌드한다.

빌드 결과에는 `_headers`와 PDF.js worker가 포함된다. SPA fallback을 강제로 걸지 않는다. trailing slash 경로의 실제 index.html을 제공한다. 정적 export이므로 Pages Functions나 Node 서버는 필요 없다.

## 3. 공개 전 확인

- privacy/contact에 운영자와 문의 채널, 실제 호스팅 로그 정책을 반영한다.
- 운영 도메인 HTTPS, canonical, sitemap.xml, robots.txt, 404를 확인한다.
- 이미지 다운로드와 PDF worker 요청, CSP 응답 헤더를 배포 도메인에서도 확인한다.
- 실제 iPhone/Android 기기에서 작업과 다운로드를 확인한다.
- Search Console에 도메인 소유권을 확인하고 sitemap을 제출한다.
- 개발 의존성 보안 경고는 VALIDATION.md를 확인하고 공급자 패치 시 업데이트한다.

AdSense는 미설치 상태다. 승인 신청 전 유용한 고유 가이드 콘텐츠와 운영자 정보, 개인정보 안내를 완성한다. 광고 도입 때 동의·CSP·레이아웃 공간을 함께 수정한다. 승인/수익을 보장하지 않는다.

공식 참고: https://nextjs.org/docs/app/getting-started/deploying 및 https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
