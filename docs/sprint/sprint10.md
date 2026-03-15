# Sprint 10 — CI/CD 파이프라인

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

GitHub Actions로 CI 파이프라인 구축. PR/push 시 자동으로 테스트 실행 및 Vercel 배포 자동화 증거 문서화.

## 완료 기준

- GitHub Actions: push/PR 시 Vitest + Playwright 자동 실행
- CI 환경에서 headless 모드 E2E 테스트 통과
- Vercel 배포 자동화 문서화 (README 업데이트)

---

## 구현 계획

### GitHub Actions 워크플로우

`.github/workflows/ci.yml` 생성:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: board/package-lock.json
      - run: npm ci
        working-directory: board
      - run: npm run test
        working-directory: board
      - run: npx playwright install --with-deps chromium
        working-directory: board
      - run: npm run test:e2e
        working-directory: board
        env:
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### Vercel 배포 자동화

- GitHub 연동으로 main 브랜치 push 시 자동 배포
- PR 시 Preview URL 자동 생성

---

## 결정사항

- E2E 테스트는 실제 Supabase DB 사용 (GitHub Secrets에 환경 변수 저장)
- CI에서 Playwright headless 모드 기본 동작
- Vercel은 GitHub 연동으로 자동 배포 (별도 설정 불필요)
