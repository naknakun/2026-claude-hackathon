# Sprint 12 — UX 개선 (토스트 · 로딩 · 접근성)

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

토스트 알림, 로딩 상태 시각화, 빈 상태 UI, 폼 검증, 접근성(aria-label) 개선으로 사용자 경험 향상.

## 완료 기준

- [x] 글 작성/삭제, 댓글 등록/삭제 액션 시 토스트 알림 표시
- [x] CommentSection 로딩 스피너 추가
- [x] 빈 상태 UI 개선 (검색 결과 없음 / 태그 없음 / 전체 없음 구분)
- [x] 주요 버튼 aria-label 추가

---

## 구현 결과

### 토스트 시스템 (`src/components/ToastProvider.tsx`)

- Context + useReducer 기반 자체 구현 (외부 라이브러리 없음)
- 3초 후 자동 소멸
- 위치: 화면 우측 하단 (fixed bottom-4 right-4)
- sessionStorage 연동: 페이지 이동 후에도 토스트 표시 가능

**적용 위치:**

| 액션 | 토스트 메시지 | 방식 |
|------|------------|------|
| 글 작성 성공 | "게시글이 등록되었습니다." | sessionStorage → 홈에서 표시 |
| 글 삭제 성공 | "게시글이 삭제되었습니다." | sessionStorage → 홈에서 표시 |
| 댓글 등록 | "댓글이 등록되었습니다." | 동일 페이지 직접 표시 |
| 댓글 삭제 | "댓글이 삭제되었습니다." | 동일 페이지 직접 표시 |

### 로딩 상태

- `CommentSection`: `loadingComments` state + CSS 스피너 (`animate-spin`)
- `LikeButton`: 기존 `loading` state 유지 (버튼 disabled 처리)

### 빈 상태 UI (`src/app/page.tsx`)

```tsx
{search ? (
  <p>"{search}"에 대한 검색 결과가 없습니다.</p>
) : tag ? (
  <p>#{tag} 태그가 달린 게시글이 없습니다.</p>
) : (
  <p>아직 작성된 글이 없습니다.</p>
)}
```

### 접근성 개선 (aria-label)

| 컴포넌트 | 추가된 aria-label |
|---------|-----------------|
| SearchBar — ✕ 버튼 | `aria-label="검색어 초기화"` |
| SearchBar — 🔍 버튼 | `aria-label="검색"` |
| LikeButton | `aria-label={liked ? '좋아요 취소' : '좋아요'}` |
| DeletePostButton | `aria-label="게시글 삭제"` |

---

## 결정사항

- 토스트는 외부 라이브러리 없이 자체 구현 (의존성 최소화)
- 페이지 이동(window.location.href) 후 토스트는 sessionStorage 경유
- 토스트 지속 시간: 3초 (UX 표준 준수)
- 테스트: 25/25 기존 테스트 모두 통과 확인
