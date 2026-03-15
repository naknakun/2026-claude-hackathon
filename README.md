# 사내 익명 게시판

[![CI](https://github.com/naknakun/2026-claude-hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/naknakun/2026-claude-hackathon/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/Vercel-배포중-brightgreen)](https://2026-claude-hackathon.vercel.app)

회사 구성원만 접근 가능한 익명 게시판. 이메일로 로그인하되 게시글/댓글은 완전 익명으로 작동합니다.

**🌐 배포 URL:** https://2026-claude-hackathon.vercel.app

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 백엔드/DB | Supabase (PostgreSQL + Auth + RLS) |
| 테스트 | Vitest (단위), Playwright (E2E) |

---

## 새 팀원 온보딩

### 1. 사전 준비

**필수 설치:**
- [Node.js 20+](https://nodejs.org/)
- [Claude Code](https://claude.ai/code) — `npm install -g @anthropic-ai/claude-code`
- [Supabase 계정](https://supabase.com) — 무료 플랜으로 충분

**Claude Code 로그인:**
```bash
claude login
```

---

### 2. 레포지토리 클론

```bash
git clone <repo-url>
cd first-claude
```

---

### 3. Supabase 프로젝트 설정

1. [app.supabase.com](https://app.supabase.com) 접속 → **New project** 생성
2. **Settings → API**에서 `Project URL`과 `anon public` 키 복사
3. **SQL Editor**에서 `board/supabase-schema.sql` 전체 내용 실행
4. **Authentication → Providers → Email**에서 **Confirm email** 비활성화 (개발 편의)
5. **Authentication → Providers → Email**이 활성화되어 있는지 확인

---

### 4. 환경 변수 설정

`board/.env.local` 파일을 생성합니다 (git에서 제외되어 있으므로 직접 생성 필요):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxx...

# E2E 테스트용 계정 (Supabase에서 미리 가입한 계정)
TEST_EMAIL=test@example.com
TEST_PASSWORD=testpassword123
```

> **회사 내부망(SSL 인증서 문제)**: `next.config.ts`에 `NODE_TLS_REJECT_UNAUTHORIZED=0`이 이미 설정되어 있습니다.

---

### 5. 의존성 설치 및 실행

```bash
cd board
npm install
npx playwright install chromium   # E2E 테스트 브라우저
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## Claude Code로 바이브 코딩하기

이 프로젝트는 **Claude Code + 문서 기반 스프린트** 방식으로 개발합니다.

### 워크플로우

```
docs/PRD.md          ← 요구사항 (변경 거의 없음)
docs/ROADMAP.md      ← 스프린트 계획 (전체 로드맵)
docs/SPEC.md         ← 기술 규칙 (코드 작성 기준)
docs/DESIGN-SYSTEM.md ← 디자인 토큰 & 컴포넌트 패턴
docs/sprint/sprintN.md ← 현재 스프린트 상세 계획
```

### Claude Code 시작

```bash
# board/ 폴더에서 시작
cd board
claude
```

Claude가 세션 시작 시 `CLAUDE.md`를 자동으로 읽고 현재 스프린트 파일을 참조합니다.

### 새 스프린트 시작 방법

1. `docs/ROADMAP.md`에서 다음 스프린트 확인
2. `docs/sprint/sprintN.md` 파일 작성 (스프린트 목표, 완료 기준, 작업 상세)
3. Claude에게 요청: **"Sprint N 시작하자"**
4. Claude가 문서를 읽고 구현 시작

### 핵심 원칙

- **문서 먼저**: 구현 전 반드시 스프린트 문서에 목표/완료 기준 정의
- **스프린트 완료 시 커밋**: 각 스프린트 끝에 git commit
- **테스트 필수**: 단위 테스트 + E2E 테스트 통과 후 완료 처리

---

## 개발 명령어

```bash
# 개발 서버
npm run dev

# 단위 테스트 (Vitest)
npm run test           # 1회 실행
npm run test:watch     # watch 모드

# E2E 테스트 (Playwright) — dev 서버 실행 후
npm run test:e2e       # headless
npm run test:e2e:ui    # UI 모드 (디버깅)

# 빌드
npm run build
```

---

## 프로젝트 구조

```
first-claude/
├── board/                    # Next.js 앱
│   ├── src/
│   │   ├── app/              # App Router 페이지
│   │   │   ├── page.tsx      # 게시글 목록 (홈)
│   │   │   ├── login/        # 로그인
│   │   │   ├── signup/       # 회원가입
│   │   │   └── posts/
│   │   │       ├── new/      # 글쓰기
│   │   │       └── [id]/     # 게시글 상세
│   │   ├── components/       # 공통 컴포넌트
│   │   ├── lib/              # Supabase 클라이언트
│   │   └── types/            # TypeScript 타입
│   ├── e2e/                  # Playwright E2E 테스트
│   │   ├── helpers/auth.ts   # 공통 로그인 헬퍼
│   │   ├── auth.spec.ts
│   │   ├── post.spec.ts
│   │   ├── search.spec.ts
│   │   ├── tag.spec.ts
│   │   ├── comment.spec.ts
│   │   └── like.spec.ts
│   ├── src/__tests__/        # Vitest 단위 테스트
│   ├── supabase-schema.sql   # DB 스키마 (최초 1회 실행)
│   └── .env.local            # 환경 변수 (git 제외 — 직접 생성)
├── docs/
│   ├── PRD.md                # 제품 요구사항
│   ├── ROADMAP.md            # 스프린트 로드맵
│   ├── SPEC.md               # 기술 스택 & 코드 규칙
│   ├── DESIGN-SYSTEM.md      # 디자인 시스템
│   └── sprint/               # 스프린트별 상세 문서
│       ├── sprint1.md ~ sprint9.md
└── CLAUDE.md                 # Claude Code 프로젝트 지침
```

---

## DB 스키마 요약

```sql
posts    (id, user_id, title, content, category, tags, created_at)
comments (id, post_id, user_id, content, created_at)
likes    (id, post_id, user_id, created_at)
```

- RLS: 읽기 전체 허용 / 쓰기 로그인 유저 / 삭제 본인만
- `tags`: `text[]` 컬럼, GIN 인덱스

---

## 코드 규칙 요약

| 규칙 | 내용 |
|------|------|
| 타입 | `any` 금지, 명시적 타입 정의 |
| 익명성 | `user_id` API/UI 노출 금지 |
| 페이지 전환 | `window.location.href` 사용 (`router.refresh()` 단독 금지) |
| 데이터 패칭 | Server Component → `lib/supabase-server.ts` |
| 클라이언트 뮤테이션 | Client Component → `lib/supabase.ts` |

전체 규칙: `docs/SPEC.md` 참조

---

## 완료된 스프린트

| Sprint | 내용 | 상태 |
|--------|------|------|
| 1 | 프로젝트 초기 세팅 & DB 스키마 | ✅ |
| 2 | 인증 (로그인/회원가입) | ✅ |
| 3 | 게시글 CRUD + 카테고리 | ✅ |
| 4 | 댓글 | ✅ |
| 5 | 좋아요 | ✅ |
| 6 | 라이트/다크 테마 + 반응형 | ✅ |
| 7 | UI 리디자인 (Blind 스타일) | ✅ |
| 8 | 게시글 검색 + 태그 필터링 | ✅ |
| 9 | Playwright E2E 테스트 (11/11) | ✅ |
| 10 | CI/CD (GitHub Actions) | ✅ |
| 11 | 컴포넌트 단위 테스트 + 커버리지 (25/25) | ✅ |
| 12 | UX 개선 (토스트 · 로딩 · 접근성) | ✅ |
