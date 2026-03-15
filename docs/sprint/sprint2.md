# Sprint 2 — 이메일 인증

**기간:** 2026-03-15
**상태:** ✅ 완료

## 목표

이메일로 가입하고 로그인/로그아웃 가능

## 완료 태스크

- [x] 회원가입 페이지 (`/signup`)
- [x] 로그인 페이지 (`/login`)
- [x] 로그아웃 기능
- [x] 헤더 로그인 상태 분기
- [x] 미로그인 시 `/posts/new` 접근 차단 (middleware)

## 결정사항

- Supabase Email Provider 활성화 + `Confirm email` 비활성화 (개발 편의)
- Header를 Server Component → Client Component로 전환 (세션 실시간 반영)
- 로그인/가입 성공 후 `router.refresh()` 대신 `window.location.href = '/'` 사용 (서버 컴포넌트 갱신 보장)
- 미들웨어에서 `getUser()` → `getSession()` 변경 (세션 쿠키 기반 인증)
