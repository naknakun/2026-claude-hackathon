# 사내 익명 게시판 — board

> 전체 온보딩 가이드는 루트의 [`README.md`](../README.md)를 참조하세요.

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. Playwright 브라우저 설치 (최초 1회)
npx playwright install chromium

# 3. 환경 변수 설정 (.env.local 직접 생성)
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# TEST_EMAIL=...
# TEST_PASSWORD=...

# 4. 개발 서버 실행
npm run dev
```

## 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 (localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run test` | 단위 테스트 (Vitest) |
| `npm run test:watch` | 단위 테스트 watch 모드 |
| `npm run test:e2e` | E2E 테스트 (dev 서버 실행 필요) |
| `npm run test:e2e:ui` | E2E 테스트 UI 모드 |

## Claude Code로 작업하기

```bash
# board/ 폴더에서 Claude Code 실행
claude
```

Claude가 `../CLAUDE.md`와 `../docs/sprint/` 최신 파일을 자동으로 읽어 컨텍스트를 파악합니다.
