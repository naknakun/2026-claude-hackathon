# Sprint 5 — 좋아요

**기간:** 2026-03-15
**상태:** ✅ 완료

## 목표

게시글에 좋아요 토글 가능

## 완료 태스크

- [x] 좋아요 버튼 UI (토글)
- [x] 좋아요 수 표시
- [x] 1인 1회 제한 (DB unique constraint)
- [x] 새로고침 후에도 상태 유지

## 결정사항

- `LikeButton` Client Component로 구현
- 좋아요 취소 시 `user_id + post_id` 조건으로 삭제
- 인기순 정렬은 백로그로 이동
