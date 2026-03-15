# Sprint 10 — CI/CD 파이프라인

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

GitHub Actions로 CI 파이프라인 구축. PR/push 시 자동으로 단위 테스트 실행 및 Vercel 배포 자동화.

## 완료 기준

- [x] GitHub Actions: push/PR 시 Vitest 단위 테스트 자동 실행
- [x] E2E 테스트 CI job: GitHub Secrets 연동, Playwright 리포트 아티팩트 업로드
- [x] `playwright.config.ts` webServer 옵션 추가 (CI 환경 자동 서버 시작)
- [x] README에 CI 배지 및 배포 URL 추가
- [x] Vercel 배포 자동화 (main push → 자동 배포)

---

## 구현 결과

### GitHub Actions 워크플로우 (`.github/workflows/ci.yml`)

| Job | 트리거 | 내용 |
|-----|--------|------|
| `unit-test` | push/PR to main | `npm ci` → `npm run test` (25개 테스트) |
| `e2e-test` | `vars.RUN_E2E == 'true'` 조건부 | Playwright headless E2E 11개 테스트 |

**CI 배지:** [![CI](https://github.com/naknakun/2026-claude-hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/naknakun/2026-claude-hackathon/actions/workflows/ci.yml)

### Vercel 자동 배포

- **배포 URL:** https://2026-claude-hackathon.vercel.app
- main 브랜치 push 시 Vercel이 자동으로 빌드 및 배포
- PR 생성 시 Preview URL 자동 생성

### playwright.config.ts webServer 설정

```ts
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,  // CI에서는 항상 새 서버 시작
  timeout: 120 * 1000,
},
```

---

## 결정사항

- E2E 테스트는 `vars.RUN_E2E == 'true'` 조건부 실행 (실제 Supabase DB 필요)
- GitHub Secrets 필요 항목: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `TEST_EMAIL`, `TEST_PASSWORD`
- E2E 실패 시 Playwright 리포트를 GitHub Actions 아티팩트로 7일간 보관
- Vercel은 GitHub 연동으로 자동 배포 (별도 CLI 설정 불필요)
