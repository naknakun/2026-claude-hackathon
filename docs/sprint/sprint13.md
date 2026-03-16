# Sprint 13 — CI/CD 고도화 (빌드 체크 · 롤백 · 모니터링)

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

프로덕션 수준의 CI/CD 완성. 배포 전 빌드 검증, 롤백 절차, 모니터링 설정 문서화.

## 완료 기준

- [x] CI 파이프라인에 빌드 체크 job 추가
- [x] 롤백 전략 문서화 (Vercel 대시보드 / git revert / 핫픽스)
- [x] 모니터링 항목 문서화 (Vercel + Supabase)
- [x] 배포 전 체크리스트 보완

---

## 구현 결과

### CI 파이프라인 구조 (`.github/workflows/ci.yml`)

```
push/PR → build-check   → Next.js 빌드 성공 여부 검증
        → unit-test     → Vitest 38개 테스트
        → e2e-test      → Playwright 11개 E2E (Supabase 시크릿 설정 시 자동 실행)

main push 전용:
        → lighthouse    → Lighthouse CI (성능/접근성 자동 측정)
        → health-check  → 배포 후 HTTP 200 확인 (5회 재시도, 30s 간격)
```

**변경 사항:**
- `build-check` job 추가: TypeScript/import 오류 조기 감지
- E2E 조건 개선: `vars.RUN_E2E == 'true'` → `secrets.NEXT_PUBLIC_SUPABASE_URL != ''` (자동 감지)
- `lighthouse` job 추가: push/PR 모두 실행, Performance/Accessibility/Best-Practices 기준 미달 시 CI 실패
- `health-check` job 추가: 배포 후 HTTP 200 자동 검증 (5회 재시도) + **실패 시 `vercel rollback` 자동 실행**

### 자동 롤백 흐름

```
push to main
    → build-check + unit-test 통과
    → Vercel 자동 배포
    → health-check: HTTP 200 확인 (최대 2분 30초 대기)
        ✅ 통과 → 완료
        ❌ 실패 → vercel rollback --token=$VERCEL_TOKEN --yes (자동)
```

**필요한 GitHub Secrets (자동 롤백용):**

| Secret | 설명 |
|--------|------|
| `VERCEL_TOKEN` | Vercel 계정 Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel 프로젝트 Settings → General |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 Settings → General |

### Lighthouse 기준 (`.lighthouserc.json`)

| 항목 | 기준 | 미달 시 |
|------|------|---------|
| Performance | 70점 이상 | CI 실패 |
| Accessibility | 80점 이상 | CI 실패 |
| Best Practices | 80점 이상 | CI 실패 |

### 롤백 전략

| 방법 | 소요 시간 | 사용 상황 |
|------|----------|---------|
| Vercel 대시보드 Promote | ~1분 | 배포 후 즉각 오류 발생 |
| git revert + push | ~3분 | 특정 커밋 문제 파악된 경우 |
| 핫픽스 브랜치 | ~10분 | 수정이 필요한 경우 |

### 모니터링 체계

| 도구 | 모니터링 항목 |
|------|------------|
| Vercel Dashboard | 빌드 상태, 함수 에러 로그 |
| GitHub Actions 배지 | CI 통과 여부 (README 실시간 반영) |
| Supabase Dashboard | DB 쿼리 성능, Auth 로그, API 요청 수 |

---

## 결정사항

- build-check는 unit-test와 병렬 실행 (독립적)
- 롤백은 Vercel 대시보드 우선 (가장 빠름)
- 별도 APM 도구 미도입 — Vercel + Supabase 기본 대시보드로 충분
