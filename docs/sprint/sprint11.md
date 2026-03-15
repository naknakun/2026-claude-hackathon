# Sprint 11 — 컴포넌트 단위 테스트 + 커버리지

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

SearchBar, TagInput, TagBadge 컴포넌트 단위 테스트 추가. 테스트 커버리지 수치 측정 및 문서화.

## 완료 기준

- [x] SearchBar: 렌더링, Enter 키 검색, 초기화 버튼 테스트
- [x] TagInput: 태그 추가(Enter/쉼표), 제거, 중복 방지 테스트
- [x] TagBadge: 렌더링, 클릭 이벤트 테스트
- [x] `npm run test:coverage` 명령으로 커버리지 수치 확인 가능
- [x] 테스트 대상 컴포넌트 100% 커버리지 달성

---

## 테스트 결과

```
Test Files: 4 passed
Tests:      25 passed
```

### 전체 커버리지 (`npm run test:coverage`)

```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   21.46 |    18.66 |   26.08 |   21.35 |
 src/components    |   21.24 |    17.39 |   25.45 |   21.54 |
  SearchBar.tsx    |     100 |      100 |     100 |     100 |
  TagBadge.tsx     |     100 |      100 |     100 |     100 |
  TagInput.tsx     |     100 |      100 |     100 |     100 |
  (기타 컴포넌트)  |       0 |        0 |       0 |       0 |
 src/lib           |   46.15 |      100 |   44.44 |   41.66 |
  search.ts        |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|
```

> **전체 수치가 낮은 이유**: `CommentSection`, `LikeButton`, `Header` 등 Supabase 세션/서버 의존성이 있는 컴포넌트는 jsdom 환경에서 단위 테스트가 불가하여 E2E 테스트로 커버. 페이지 컴포넌트(`src/app/**`)는 Server Component로 설정상 제외.

### 테스트 전략별 커버리지

| 컴포넌트 유형 | 테스트 방법 | 커버리지 |
|-------------|-----------|---------|
| 순수 UI 컴포넌트 (SearchBar, TagBadge, TagInput) | Vitest 단위 테스트 | 100% |
| 검색 유틸 함수 (search.ts) | Vitest 단위 테스트 | 100% |
| 인터랙티브 컴포넌트 (LikeButton, CommentSection 등) | Playwright E2E | 11/11 시나리오 통과 |
| 페이지 컴포넌트 (page.tsx — Server Component) | Playwright E2E | 11/11 시나리오 통과 |

### 단위 테스트 대상 컴포넌트별 커버리지

| 파일 | Stmts | Branch | Funcs | Lines |
|------|-------|--------|-------|-------|
| `SearchBar.tsx` | 100% | 100% | 100% | 100% |
| `TagBadge.tsx` | 100% | 100% | 100% | 100% |
| `TagInput.tsx` | 100% | 100% | 100% | 100% |
| `search.ts` (parseTags/formatTags) | 100% | 100% | 100% | 100% |

---

## 테스트 대상

| 파일 | 테스트 케이스 수 | 주요 케이스 |
|------|--------------|-----------|
| `SearchBar.tsx` | 5개 | 렌더링, Enter 검색, ✕ 버튼 표시/동작, 빈 검색 처리 |
| `TagInput.tsx` | 7개 | Enter/쉼표 추가, 태그 제거, 빈 입력 무시, 중복 방지 |
| `TagBadge.tsx` | 4개 | 렌더링, # 접두사, 클릭 시 router.push, 특수문자 |
| `search.ts` | 9개 | parseTags/formatTags 엣지 케이스 포함 |

---

## 기술 설정

### vitest.config.ts coverage 설정

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov'],
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['src/**/*.test.{ts,tsx}', 'src/app/**', 'src/types/**'],
},
```

### Next.js 라우터 모킹 패턴

```ts
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}))
```

---

## 결정사항

- `@testing-library/jest-dom` 설정: `src/test-setup.ts`에서 import, `vitest.config.ts` setupFiles 지정
- E2E 파일 제외: `include: ['src/**/*.test.{ts,tsx}']`로 e2e/ 디렉터리 분리
- Next.js router mock: `vi.mock('next/navigation', ...)` 패턴 통일
- 커버리지 측정 범위: `src/components/`, `src/lib/` (app/ 제외 — 서버 컴포넌트)
