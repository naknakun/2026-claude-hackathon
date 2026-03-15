# Sprint 1 — 프로젝트 초기 세팅 & DB 스키마

**기간:** 2026-03-15
**상태:** ✅ 완료

## 목표

개발 환경 구성 + Supabase 테이블 설계 완료

## 완료 태스크

- [x] Next.js 16 프로젝트 생성 (App Router, Tailwind CSS v4, TypeScript)
- [x] Supabase 프로젝트 생성 및 `.env.local` 연결
- [x] DB 테이블 생성 (`posts`, `comments`, `likes`)
- [x] RLS 정책 설정 (읽기: 전체 / 쓰기: 로그인 유저 / 삭제: 본인만)
- [x] 폴더 구조 세팅 (`app/`, `components/`, `lib/`, `types/`)
- [x] Supabase 클라이언트 설정 (`lib/supabase.ts`, `lib/supabase-server.ts`)
- [x] 타입 정의 (`types/index.ts`)

## 결정사항

- Next.js 앱은 `/board` 서브폴더에 위치 (루트에 Claude Code 설정 파일 충돌 방지)
- `board/` 내부 별도 git 없이 루트 `first-claude` 레포에서 관리
- SSL 인증서 오류 (회사 네트워크) → `next.config.ts`에서 `NODE_TLS_REJECT_UNAUTHORIZED=0` 우회
