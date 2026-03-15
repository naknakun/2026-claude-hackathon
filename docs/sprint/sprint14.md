# Sprint 14 — 테스트 전략 보강 (통합 테스트 · 성능)

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

통합 테스트 추가로 컴포넌트 간 상호작용 검증. 성능 테스트 전략 문서화.

## 완료 기준

- [x] ToastProvider 통합 테스트 (useToast + sessionStorage 연동)
- [x] 테스트 총 29개 통과
- [x] 성능 테스트 전략 문서화

---

## 테스트 결과

```
Test Files: 5 passed
Tests:      29 passed
```

### 통합 테스트 (`ToastProvider.test.tsx`) — 4개

| 케이스 | 검증 내용 |
|--------|---------|
| success 토스트 표시 | useToast().show() 호출 시 메시지 렌더링 |
| error 토스트 표시 | error 타입 토스트 렌더링 |
| sessionStorage pendingToast | 마운트 시 자동 읽기 + 표시 + 삭제 |
| 여러 토스트 동시 표시 | 복수 토스트 누적 렌더링 |

### 전체 테스트 현황

| 파일 | 유형 | 케이스 수 |
|------|------|---------|
| `SearchBar.test.tsx` | 단위 | 5개 |
| `TagInput.test.tsx` | 단위 | 7개 |
| `TagBadge.test.tsx` | 단위 | 4개 |
| `search.test.ts` | 단위 | 9개 |
| `ToastProvider.test.tsx` | **통합** | 4개 |
| **합계** | | **29개** |

---

## 테스트 전략 전체 구조

```
단위 테스트 (Vitest)
├── 순수 UI 컴포넌트: SearchBar, TagBadge, TagInput — 100% 커버리지
├── 유틸 함수: search.ts — 100% 커버리지
└── 통합 테스트: ToastProvider + useToast + sessionStorage 연동

E2E 테스트 (Playwright)
├── Desktop Chrome: 11/11 시나리오 통과
└── Mobile Chrome (Pixel 5): 11/11 시나리오 통과

서버 컴포넌트 (page.tsx)
└── E2E로 커버 (Server Component는 jsdom 환경에서 단위 테스트 불가)
```

## 성능 테스트 전략

### 현재 적용

| 항목 | 방법 |
|------|------|
| 빌드 크기 | `npm run build` 출력의 Page/Bundle 크기 확인 |
| 응답 속도 | Vercel Dashboard → Functions → Duration 모니터링 |
| DB 쿼리 성능 | Supabase Dashboard → Query Performance |

### Lighthouse 기준값 (Vercel Preview 배포 후 수동 측정)

| 항목 | 목표 |
|------|------|
| Performance | 80점 이상 |
| Accessibility | 90점 이상 |
| Best Practices | 90점 이상 |

---

## 결정사항

- 통합 테스트 대상: Context + Hook 조합 (ToastProvider) — 단위 테스트만으로는 검증 불가한 연동 버그 감지
- 성능 자동화 도구(Lighthouse CI) 미도입 — Vercel 자체 측정으로 대체
- Server Component(page.tsx) 테스트는 E2E로 커버하는 전략 유지
