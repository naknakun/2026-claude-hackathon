# SPEC — 기술 스택 & 코드 규칙

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | v4 |
| 백엔드/DB | Supabase (PostgreSQL + Auth + RLS) | latest |
| 배포 | Vercel | - |

## 폴더 구조

```
board/
├── src/
│   ├── app/              # App Router 페이지
│   │   ├── page.tsx      # 게시글 목록 (홈)
│   │   ├── login/        # 로그인
│   │   ├── signup/       # 회원가입
│   │   └── posts/
│   │       ├── new/      # 글쓰기
│   │       └── [id]/     # 게시글 상세
│   ├── components/       # 공통 컴포넌트
│   ├── lib/              # Supabase 클라이언트
│   └── types/            # TypeScript 타입 정의
├── .env.local            # Supabase 키 (git 제외)
└── supabase-schema.sql   # DB 스키마
```

## 컴포넌트 규칙

- Server Component 기본, 인터랙션 필요 시 `'use client'` 추가
- 데이터 패칭: Server Component에서 `supabase-server.ts` 사용
- 클라이언트 뮤테이션: Client Component에서 `supabase.ts` 사용

## 코드 규칙

- `any` 타입 사용 금지 — 반드시 명시적 타입 정의
- `console.log` 프로덕션 코드에 남기지 말 것
- TODO 없이 미완성 코드 커밋 금지
- 컴포넌트 파일명: PascalCase (`PostCard.tsx`)
- 페이지 파일명: Next.js 규칙 (`page.tsx`, `layout.tsx`)

## 스타일 규칙

- CSS 변수 (`--bg-surface`, `--accent` 등) 사용 — `globals.css` 참조
- 다크모드: `dark:` Tailwind 클래스 또는 CSS 변수로 처리
- 임의값: `bg-[var(--bg-surface)]` 형태 허용

## 절대 하지 말 것

- 작성자 `user_id` API/UI 노출 금지 (익명성 보장)
- `router.refresh()` 단독 사용 금지 → `window.location.href` 사용
- RLS 비활성화 금지
