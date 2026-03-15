# Sprint 3 — 게시글 CRUD + 카테고리

**기간:** 2026-03-15
**상태:** ✅ 완료

## 목표

글을 쓰고, 목록을 보고, 상세를 읽을 수 있음

## 완료 태스크

- [x] 게시글 목록 페이지 (`/`) — 최신순, 카테고리 필터
- [x] 게시글 상세 페이지 (`/posts/[id]`)
- [x] 게시글 작성 페이지 (`/posts/new`)
- [x] 게시글 삭제 (본인 글만)
- [x] 작성자 정보 미노출 (익명)
- [x] 카테고리 필터 UI (전체 / 자유 / 건의 / 칭찬 / 고민)

## 결정사항

- 홈 페이지에 `export const dynamic = 'force-dynamic'` 추가 (Next.js 캐싱 방지)
- 글 등록 후 `window.location.href = '/'` 사용
- 카테고리 필터는 URL searchParams 기반 (`/?category=건의`)
