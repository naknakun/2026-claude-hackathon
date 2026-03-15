# Sprint 8 — 게시글 검색 + 태그 필터링

**기간:** 미정
**상태:** ✅ 완료

---

## 목표

키워드 검색과 태그 기반 탐색 기능 추가

## 완료 기준

- 검색창에 키워드 입력 → 제목/내용에서 매칭된 게시글 목록 표시
- 태그 클릭 → 해당 태그가 달린 게시글 목록 표시
- 검색 + 카테고리 + 태그 복합 필터 정상 동작
- 테스트 커버리지: 검색 유틸 단위 테스트 + E2E 핵심 흐름 통과

---

## DB 변경사항

### posts 테이블에 tags 컬럼 추가

```sql
-- Supabase SQL Editor에서 실행
ALTER TABLE posts ADD COLUMN tags text[] DEFAULT '{}';

-- 태그 검색 성능을 위한 GIN 인덱스
CREATE INDEX posts_tags_gin ON posts USING GIN(tags);
```

### 타입 업데이트 (`src/types/index.ts`)

```ts
export interface Post {
  id: string
  title: string
  content: string
  category: Category
  tags: string[]          // 추가
  created_at: string
  comment_count?: number
  like_count?: number
}
```

---

## 기능 설계

### 검색 (Search)

- **URL 파라미터**: `/?search=키워드`
- **검색 범위**: 제목 + 내용 (`ilike '%키워드%'`)
- **Supabase 쿼리**:
  ```ts
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }
  ```
- **UI**: 목록 상단 검색 입력창, 입력 후 Enter 또는 버튼으로 검색

### 태그 (Tags)

- **글쓰기**: 쉼표(,) 구분으로 태그 입력 → `string[]`로 변환 후 저장
- **표시**: 게시글 카드 하단 + 상세 페이지에 태그 뱃지 표시
- **필터**: 태그 클릭 시 `/?tag=태그명`으로 이동
- **Supabase 쿼리**:
  ```ts
  if (tag) {
    query = query.contains('tags', [tag])
  }
  ```

### 복합 필터 우선순위

`category` → `search` → `tag` 순으로 AND 조건 누적

---

## 컴포넌트 목록

| 컴포넌트 | 타입 | 설명 |
|----------|------|------|
| `SearchBar` | Client | 검색 입력창, URL 파라미터 업데이트 |
| `TagBadge` | Server | 단일 태그 뱃지 (클릭 시 필터) |
| `TagInput` | Client | 글쓰기 태그 입력 (쉼표 구분) |

---

## 테스트 전략

### 단위 테스트 (Vitest + React Testing Library)

**설치:**
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom
```

**테스트 대상:**

| 파일 | 테스트 내용 |
|------|------------|
| `lib/search.ts` | 태그 파싱 함수 (`"태그1, 태그2"` → `["태그1", "태그2"]`) |
| `components/SearchBar.tsx` | 입력 렌더링, Enter 키 동작 |
| `components/TagInput.tsx` | 태그 추가/제거 동작 |
| `components/TagBadge.tsx` | 뱃지 렌더링 및 클릭 이벤트 |

**예시 테스트:**
```ts
// src/__tests__/search.test.ts
import { parseTags } from '@/lib/search'

describe('parseTags', () => {
  it('쉼표로 구분된 태그를 배열로 변환', () => {
    expect(parseTags('React, Next.js, TypeScript')).toEqual(['React', 'Next.js', 'TypeScript'])
  })
  it('앞뒤 공백 제거', () => {
    expect(parseTags('  태그1 ,  태그2  ')).toEqual(['태그1', '태그2'])
  })
  it('빈 문자열은 빈 배열 반환', () => {
    expect(parseTags('')).toEqual([])
  })
})
```

### E2E 테스트 (Playwright)

**설치:**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

**테스트 시나리오:**

```
검색 흐름:
  1. 게시글 2개 이상 작성 (제목에 다른 키워드 포함)
  2. 검색창에 키워드 입력 → Enter
  3. 매칭된 게시글만 목록에 표시되는지 확인
  4. 검색어 지우면 전체 목록 복원 확인

태그 필터 흐름:
  1. 태그가 있는 게시글 작성
  2. 목록에서 태그 뱃지 클릭
  3. 해당 태그 게시글만 필터링되는지 확인

복합 필터 흐름:
  1. 카테고리 '건의' 선택
  2. 검색어 입력
  3. 두 조건 모두 충족하는 게시글만 표시 확인
```

---

## 작업 순서

1. **DB 변경** → Supabase SQL Editor에서 `tags` 컬럼 + 인덱스 추가
2. **타입 업데이트** → `types/index.ts`
3. **유틸 함수** → `lib/search.ts` (태그 파싱 등)
4. **단위 테스트 작성** → `src/__tests__/`
5. **컴포넌트 구현** → SearchBar, TagInput, TagBadge
6. **페이지 연동** → `page.tsx` 쿼리 수정, `posts/new` 태그 입력 추가
7. **E2E 테스트 작성 및 실행**
8. **커밋**

---

## 결정 필요 사항

- [ ] 태그 최대 개수 제한 여부 (예: 최대 5개)
- [ ] 검색 방식: `ilike` (단순) vs Supabase Full Text Search (고급)
- [ ] 태그 자동완성 기능 여부 (MVP에서는 제외 고려)
