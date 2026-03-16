# Sprint 15 — 에러 처리 전략 구현

**기간:** 2026-03-16
**상태:** ✅ 완료

---

## 목표

LikeButton, CommentSection의 에러 처리 최소화 문제 해결. 전체 에러 처리 전략 문서화.

## 완료 기준

- [x] LikeButton: try/catch + 낙관적 UI 롤백 + error toast
- [x] CommentSection: fetchComments/handleSubmit/handleDelete 전체 try/catch
- [x] ARCHITECTURE.md 에러 처리 전략 섹션 추가

---

## 구현 결과

### LikeButton 에러 처리

**변경 전**: `await supabase...` 결과를 확인하지 않고 상태 업데이트

**변경 후**:
```ts
// 낙관적 UI 업데이트 (즉각 반응)
setLiked(!liked)
setCount((c) => liked ? c - 1 : c + 1)

try {
  const { error } = await supabase.from('likes')...
  if (error) throw error
} catch {
  // 실패 시 이전 상태로 롤백
  setLiked(prevLiked)
  setCount(prevCount)
  toast.show('좋아요 처리 중 오류가 발생했습니다.', 'error')
} finally {
  setLoading(false)
}
```

### CommentSection 에러 처리

| 함수 | 에러 처리 |
|------|---------|
| `fetchComments()` | try/catch → error toast + finally로 로딩 해제 |
| `handleSubmit()` | try/catch → error toast + finally로 loading 해제 |
| `handleDelete()` | try/catch → error toast |

### 에러 처리 원칙

| 원칙 | 설명 |
|------|------|
| 낙관적 UI | 사용자 액션 즉시 반영, 실패 시 롤백 |
| finally | loading 상태는 반드시 finally에서 해제 |
| error toast | 사용자에게 실패 원인 인지 가능하도록 |
| silent fail | 초기 데이터 로딩 실패는 기본값 유지 (UX 방해 최소화) |

---

## 결정사항

- 낙관적 UI 업데이트: 사용자 응답성 향상 (서버 응답 기다리지 않음)
- 초기 init() 실패: silent fail (좋아요 수 0으로 표시) — 페이지 렌더링 방해 없음
- 에러 메시지: 한국어 사용자 친화적 문구
