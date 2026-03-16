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
Test Files: 7 passed
Tests:      38 passed
```

### 신규 테스트

| 파일 | 유형 | 케이스 수 | 주요 검증 |
|------|------|---------|---------|
| `ToastProvider.test.tsx` | 통합 | 4개 | useToast + sessionStorage 연동 |
| `LikeButton.test.tsx` | 단위(Supabase mock) | 4개 | 렌더링, 좋아요 수, liked 상태 |
| `CommentSection.test.tsx` | 단위(Supabase mock) | 5개 | 로딩, 목록, 빈 상태, 인증 분기 |

### 전체 테스트 현황

| 파일 | 유형 | 케이스 수 |
|------|------|---------|
| `SearchBar.test.tsx` | 단위 | 5개 |
| `TagInput.test.tsx` | 단위 | 7개 |
| `TagBadge.test.tsx` | 단위 | 4개 |
| `search.test.ts` | 단위 | 9개 |
| `ToastProvider.test.tsx` | 통합 | 4개 |
| `LikeButton.test.tsx` | 단위(Supabase mock) | 4개 |
| `CommentSection.test.tsx` | 단위(Supabase mock) | 5개 |
| **합계** | | **38개** |

### Supabase mock 전략

```ts
// createClient()를 vi.mock으로 대체
vi.mock('@/lib/supabase', () => ({ createClient: vi.fn() }))

// 쿼리 빌더: 체인 가능(eq/select 등) + thenable(count 쿼리 await용)
function makeBuilder(countResolve = { count: 0 }) {
  const builder = { select, eq, single, insert, delete, then }
  // then: await builder → countResolve
  // single: await builder.single() → { data: null | {...} }
}
```

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

### Playwright 응답 시간 측정 (`e2e/performance.spec.ts`)

실제 측정 결과 (로컬 dev 서버):

| 페이지 | 측정값 | 기준 |
|--------|--------|------|
| 홈 (`/`) | 318ms | 3000ms 이내 |
| 로그인 (`/login`) | 190ms | 2000ms 이내 |
| 게시글 상세 (`/posts/[id]`) | 58ms | 3000ms 이내 |

### Lighthouse CI 자동화 (`ci.yml` lighthouse job)

CI 파이프라인에서 push/PR 시 자동 실행:

| 항목 | 기준 | 미달 시 |
|------|------|---------|
| Performance | 70점 이상 | CI 실패 |
| Accessibility | 80점 이상 | CI 실패 |
| Best Practices | 80점 이상 | CI 실패 |

### 빌드 크기 / DB 성능

| 항목 | 방법 |
|------|------|
| 빌드 크기 | `npm run build` Page/Bundle 크기 자동 출력 (build-check job) |
| DB 쿼리 성능 | Supabase Dashboard → Query Performance |

---

## 결정사항

- 통합 테스트 대상: Context + Hook 조합 (ToastProvider) — 단위 테스트만으로는 검증 불가한 연동 버그 감지
- 성능 자동화 도구(Lighthouse CI) 미도입 — Vercel 자체 측정으로 대체
- Server Component(page.tsx) 테스트는 E2E로 커버하는 전략 유지
