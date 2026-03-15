# Sprint 7 — UI 리디자인 (IT 커뮤니티 스타일)

**기간:** 2026-03-15
**상태:** ✅ 완료

## 목표

기본 Tailwind 디자인을 Blind 스타일 IT 커뮤니티 감성으로 전면 개편

## 완료 태스크

- [x] 글로벌 CSS 변수 정의 (`--bg-base`, `--bg-surface`, `--accent` 등)
- [x] 헤더 리디자인 (🏢 사내게시판 로고, sticky, 인디고 버튼)
- [x] 카테고리 색상 뱃지 4종 (자유=slate, 건의=blue, 칭찬=emerald, 고민=amber)
- [x] 게시글 목록 Blind 스타일 리스트 (divide-y, hover 강조)
- [x] 게시글 상세 카드 레이아웃 + 뒤로가기
- [x] 로그인/회원가입 중앙 카드 형태
- [x] 다크모드 전체 컴포넌트 완성

## 진행 중

- [ ] 브라우저 최종 확인 및 세부 조정

## 결정사항

- CSS 변수 기반 컬러 시스템 (`globals.css`에 정의, 컴포넌트에서 `bg-[var(--bg-surface)]` 사용)
- 카테고리 뱃지는 `CATEGORY_BADGE` 맵으로 관리
