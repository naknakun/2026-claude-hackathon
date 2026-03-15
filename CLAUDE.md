# CLAUDE.md

## Project Overview

회사 내부용 익명 게시판. 이메일 로그인으로 사내 구성원임을 인증하되, 게시글/댓글은 완전 익명으로 작성된다.

## Tech Stack

- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Backend / DB**: Supabase (PostgreSQL + Auth + RLS)
- **Deploy**: Vercel

## Structure

```
board/          ← Next.js 앱 루트
├── src/
│   ├── app/        ← App Router 페이지
│   ├── components/ ← 공통 컴포넌트
│   ├── lib/        ← Supabase 클라이언트 등 유틸
│   └── types/      ← TypeScript 타입 정의
├── .env.local      ← Supabase 키 (git 제외)
└── supabase-schema.sql ← DB 스키마
docs/
├── PRD.md      ← 요구사항 정의서
└── ROADMAP.md  ← Sprint 계획
```

## Development

```bash
cd board
npm run dev   # http://localhost:3000
```

## Key Rules

- 작성자 정보(user_id)는 DB에만 저장, API/UI에서 절대 노출 금지
- RLS(Row Level Security)로 본인 글/댓글만 삭제 가능
- 새 세션 시작 시 docs/ROADMAP.md에서 현재 Sprint 상태 먼저 확인할 것
