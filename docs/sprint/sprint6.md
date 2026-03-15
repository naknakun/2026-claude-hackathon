# Sprint 6 — 라이트/다크 테마

**기간:** 2026-03-15
**상태:** ✅ 완료

## 목표

테마 전환 + 모바일 레이아웃 완성

## 완료 태스크

- [x] Tailwind v4 class 기반 dark mode 설정 (`@custom-variant dark`)
- [x] ThemeToggle 컴포넌트 (헤더 내 🌙/☀️)
- [x] localStorage로 테마 상태 유지
- [x] FOUC 방지 인라인 스크립트 (`layout.tsx`)
- [x] 주요 컴포넌트 dark: 클래스 적용

## 결정사항

- `@media (prefers-color-scheme)` 대신 `class` 전략 사용 (수동 전환)
- `suppressHydrationWarning` on `<html>` (테마 클래스 hydration 불일치 방지)
