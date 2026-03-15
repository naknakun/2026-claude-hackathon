# Sprint 11 — 컴포넌트 단위 테스트 + 커버리지

**기간:** 2026-03-16
**상태:** 🔄 진행 중

---

## 목표

SearchBar, TagInput, TagBadge 컴포넌트 단위 테스트 추가. 테스트 커버리지 수치 측정 및 문서화.

## 완료 기준

- SearchBar: 렌더링, Enter 키 검색, 초기화 버튼 테스트
- TagInput: 태그 추가(Enter/쉼표), 제거, 최대 5개 제한 테스트
- TagBadge: 렌더링, 클릭 이벤트 테스트
- `npm run test:coverage` 명령으로 커버리지 수치 확인 가능
- 전체 커버리지 70% 이상 목표

---

## 테스트 대상

| 파일 | 테스트 케이스 |
|------|--------------|
| `SearchBar.tsx` | 입력창 렌더링, value prop, Enter 제출, 초기화 버튼 표시/동작 |
| `TagInput.tsx` | 태그 추가(Enter), 쉼표 구분, 태그 제거, 빈 입력 무시, 최대 5개 |
| `TagBadge.tsx` | 태그명 렌더링, # 접두사, 클릭 시 router.push 호출 |

## 커버리지 설정

`vitest.config.ts`에 coverage 설정 추가:

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov'],
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['src/**/*.test.{ts,tsx}', 'src/app/**'],
}
```

```bash
npm install -D @vitest/coverage-v8
npm run test:coverage
```

---

## 결정사항

- Next.js router mock: `vi.mock('next/navigation', ...)`
- 컴포넌트 테스트는 jsdom 환경 유지
- 커버리지 결과는 터미널 출력으로 확인
