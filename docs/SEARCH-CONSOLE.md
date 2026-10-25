# Google Search Console 운영

- URL 접두어 속성: https://filefit-59l.pages.dev/
- 사이트맵: https://filefit-59l.pages.dev/sitemap.xml
- 공개 페이지 11개의 URL과 HTTP 200 응답을 확인했다.
- 운영 홈페이지의 robots 메타는 index, follow이며 robots.txt는 Allow: /이다.
- `src/app/layout.tsx`의 Google 소유권 확인 메타태그는 Search Console에서 제공한 값이다. 소유권 확인 뒤에도 유지한다.
- 파일 업로드·Google Analytics·Tag Manager·추적 스크립트를 추가하지 않고 정적 메타태그만으로 소유권을 확인한다.

태그 배포 후 Search Console의 HTML 태그 확인 버튼으로 인증하고, 사이트맵 메뉴에서 sitemap.xml을 제출한다. 성공 여부는 Search Console의 실제 응답으로 판단하며 태그 게시만으로 제출 완료라고 간주하지 않는다.

속성에 데이터가 나타나는 시점과 실제 검색 색인은 Google의 크롤링·심사에 따른다. 소유권 확인이나 사이트맵 제출 자체가 노출·순위를 보장하지 않는다. 도메인을 변경하면 새 속성과 기준 URL/사이트맵을 함께 갱신한다.

참고:
- https://support.google.com/webmasters/answer/9008080
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
