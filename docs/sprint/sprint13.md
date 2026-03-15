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
push/PR → build-check  → Next.js 빌드 성공 여부 검증
        → unit-test    → Vitest 25개 단위 테스트
        → e2e-test     → Playwright 11개 E2E (vars.RUN_E2E == 'true' 시)
```

**추가된 build-check job:**
- `npm run build` 실행으로 TypeScript 타입 오류, import 오류 조기 감지
- Supabase 환경 변수 미설정 환경에서도 placeholder로 빌드 가능

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
