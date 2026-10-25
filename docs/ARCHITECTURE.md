# 아키텍처

Next.js App Router + strict TypeScript + Tailwind CSS 4. `output: export`와 trailing slash를 사용해 `out/`에 HTML/CSS/JS를 내보낸다. Tailwind PostCSS를 연결하고 시각 디자인은 CSS 변수와 컴포넌트 클래스로 구성한다. 서버 액션·API route·미들웨어·DB가 없다. Windows의 Turbopack 프로세스 오류로 검증 가능한 webpack 빌드 경로를 사용한다.

## 데이터 흐름

정적 호스트 → HTML/JS/로컬 PDF.js worker → File input → 메모리의 File → 변환 → Blob URL → 사용자 다운로드. 네트워크는 정적 자산 로딩만 필요하다. 파일 읽기 및 변환 데이터 전송 API는 없다. 외부 폰트/CDN/AI SDK가 없다.

- `src/lib/core.ts`: 입력 제한, 정수 검증, 바이트 제한 탐색, 페이지 범위 파서.
- `src/lib/dimensions.ts`: PNG/JPEG/WebP 헤더의 크기를 디코딩 전에 검사. 확장자와 MIME 문자열만 신뢰하지 않는다.
- `src/lib/image.ts`: createImageBitmap 방향 적용, Canvas 비율 처리, JPG 흰 배경, toBlob, 최종 크기 검사. bitmap.close와 canvas 초기화로 메모리 참조를 정리.
- `src/lib/pdf.ts`: pdf-lib로 실제 문서를 읽고 페이지 복사. PDF.js는 출력 문서 첫 페이지를 로컬 worker로 렌더링한다. 라이브러리는 필요할 때 동적 로드.
- `src/components/workbench.tsx`: 선택/설정/처리/완료/오류 UI. 설정·파일 변경 시 이전 결과를 즉시 무효화. 작업 중 입력을 잠가 중복 처리를 막음. 취소는 결과 발행을 무효화하며 동기 라이브러리 호출을 강제 종료하지 않는다.
- `src/app`: 검색 가능한 정적 도구 설명, 가이드, 정책, 메타데이터, sitemap, robots.
- `scripts/csp.mjs`: 정적 빌드의 실행 스크립트 해시를 페이지별로 계산하고 CSP 헤더 및 404 대체 응답용 메타 정책을 생성한다. 인라인 JavaScript 전체 허용은 제거했다. 상세 설계와 한계는 SECURITY.md 참조.
- `public/_headers`: Cloudflare Pages용 CSP/보안 헤더. preview 서버도 동일 헤더 사용. PDF worker와 이미지 Blob만 허용하고 connect-src를 self로 제한.

## 안정성과 한계

이미지는 21개 품질을 순서대로 검사하므로 단조 증가를 가정하지 않는다. 정확한 픽셀을 유지하며 0보다 크고 제한 이하인 Blob만 반환한다. PNG는 단일 무손실 인코딩을 검증한다. 100KB는 100,000바이트다.

PDF의 손상·암호화·페이지 상한을 검사한다. PDF parser의 내부 할당을 브라우저 코드가 완전히 통제할 수 없으며 공격적인 압축 스트림 또는 복잡한 페이지는 탭을 느리게 할 수 있다. 파일 크기/페이지 상한은 완전한 메모리 보장이 아니다. pdf-lib 처리 자체는 메인 스레드에서 실행된다. 대규모 문서 지원 전에 작업 전체를 별도 worker로 이동하고 강제 종료를 추가하는 것이 후속 과제다.

파일명은 React text node로 표시하고 HTML을 삽입하지 않는다. 결과 URL은 변경/삭제/unmount 때 revoke한다. 파일은 영구 저장소에 기록하지 않는다. 앱 참조 해제와 운영체제 물리 메모리의 즉시 삭제는 동일하지 않다.

## SEO 및 광고 확장

운영 URL이 없을 때 example 도메인을 임시 메타데이터로 쓰며 robots/noindex로 검색을 막는다. 운영 URL 환경변수 지정 후 다시 빌드해야 canonical/sitemap이 바뀐다. 검색 색인은 NEXT_PUBLIC_ALLOW_INDEXING=true도 별도로 지정해야 허용된다. 설정 URL 해시는 canonical에 포함하지 않아 사용자 설정별 중복 색인을 피한다.

광고는 현재 존재하지 않는다. 도구와 가이드의 별도 section 구조에 나중에 추가할 수 있다. 도입 시 CSP 허용 목록·개인정보 안내·동의·CLS 여유 공간을 함께 설계하고 변환 이벤트에 파일 정보를 붙이지 않는다.
