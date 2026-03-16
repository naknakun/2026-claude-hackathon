# Sprint 16 — 상태 관리 전략 문서화

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

Context API 선택 근거와 확장성 계획을 명시적으로 문서화.

## 완료 기준

- [x] ARCHITECTURE.md 상태 관리 전략 섹션 추가
- [x] Context API 선택 근거 문서화
- [x] 확장 시 대안 기술 명시

---

## 상태 관리 전략

### 현재 구조

| 상태 유형 | 관리 방법 | 위치 |
|----------|---------|------|
| 전역 UI 상태 (토스트) | Context API + useReducer | `ToastProvider.tsx` |
| 컴포넌트 로컬 상태 | useState | 각 Client Component |
| 서버 데이터 | Server Component SSR | `app/page.tsx`, `app/posts/[id]/page.tsx` |
| 테마 | localStorage + CSS class | `ThemeToggle.tsx` |
| 인증 세션 | Supabase Auth (쿠키) | `middleware.ts` |

### Context API 선택 근거

| 항목 | 내용 |
|------|------|
| 전역 상태 범위 | 토스트 1개 — 외부 라이브러리 불필요 |
| 번들 크기 | 추가 의존성 없음 (React 내장) |
| 서비스 규모 | 사내 소규모 게시판 — 상태 복잡도 낮음 |
| 데이터 패칭 | Server Component SSR로 처리 — 클라이언트 상태 최소화 |

### 확장 시 고려 기술

서비스 규모 확장으로 전역 상태가 복잡해질 경우:

| 상황 | 대안 | 이유 |
|------|------|------|
| 전역 상태 5개 이상 | Zustand | 경량, 보일러플레이트 없음 |
| 서버 상태 캐싱 필요 | TanStack Query | 캐싱/리페치/낙관적 업데이트 자동화 |
| 복잡한 비즈니스 로직 | Redux Toolkit | 예측 가능한 상태 관리 |

---

## 결정사항

- 현재 규모에서 Zustand/Redux 도입은 과도한 복잡성 추가
- Next.js App Router의 Server Component가 대부분의 데이터 패칭을 담당하므로 클라이언트 상태 최소화 유지
- 추후 기능 확장(알림, 실시간 등) 시 Zustand + TanStack Query 조합 검토
