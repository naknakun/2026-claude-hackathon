# CLAUDE.md

## 프로젝트 개요

- **서비스명**: 사내 익명 게시판
- **설명**: 회사 구성원만 접근 가능한 익명 게시판. 이메일 로그인으로 인증하되 게시글/댓글은 완전 익명
- **기술 스택**: Next.js (App Router) / TypeScript / Tailwind CSS v4 / Supabase

## 코드 규칙

- `any` 타입 사용 금지 — 반드시 명시적 타입 정의
- `console.log` 프로덕션 코드에 남기지 말 것
- TODO 없이 미완성 코드 커밋 금지
- 데이터 패칭: Server Component → `lib/supabase-server.ts`
- 클라이언트 뮤테이션: Client Component → `lib/supabase.ts`
- 페이지 전환 후 서버 컴포넌트 갱신: `window.location.href` 사용 (`router.refresh()` 단독 사용 금지)

## 절대 하지 말 것

- 작성자 `user_id` API/UI 노출 금지 (익명성 보장)
- RLS 정책 비활성화 금지
- `any` 타입 사용 금지

## 컨텍스트 참조

- **기술 스택 & 코드 규칙**: `docs/SPEC.md` 참조
- **요구사항**: `docs/PRD.md` 참조
- **개발 계획**: `docs/ROADMAP.md` 참조
- **현재 Sprint**: `docs/sprint/` 폴더의 최신 파일 참조

## 새 세션 시작 시

1. `docs/ROADMAP.md`에서 현재 진행 중인 Sprint 확인
2. 해당 Sprint 파일 (`docs/sprint/sprintN.md`) 읽기
3. `docs/SPEC.md`에서 코드 규칙 확인 후 작업 시작
