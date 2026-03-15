# DESIGN SYSTEM — 사내 익명 게시판

> 레퍼런스: Blind (teamblind.com) — IT 회사 직원 대상 익명 커뮤니티 감성

---

## 1. 컬러 토큰

CSS 변수로 정의 (`src/app/globals.css`). 컴포넌트에서는 `bg-[var(--bg-surface)]` 형태로 사용.

### 라이트 모드

| 토큰 | 값 | 용도 |
|------|----|------|
| `--bg-base` | `#f8f9fc` | 전체 페이지 배경 |
| `--bg-surface` | `#ffffff` | 카드, 헤더, 폼 배경 |
| `--bg-hover` | `#f1f5f9` | hover 상태 배경 |
| `--border` | `#e2e8f0` | 구분선, 카드 테두리 |
| `--text-primary` | `#0f172a` | 제목, 주요 텍스트 |
| `--text-secondary` | `#475569` | 본문, 보조 텍스트 |
| `--text-muted` | `#94a3b8` | 날짜, 메타 정보 |
| `--accent` | `#6366f1` | 버튼, 활성 상태, 링크 (인디고) |
| `--accent-hover` | `#4f46e5` | 버튼 hover |

### 다크 모드 (`.dark` 클래스)

| 토큰 | 값 | 용도 |
|------|----|------|
| `--bg-base` | `#0f1117` | 전체 페이지 배경 |
| `--bg-surface` | `#1a1d27` | 카드, 헤더, 폼 배경 |
| `--bg-hover` | `#252836` | hover 상태 배경 |
| `--border` | `#2a2d3e` | 구분선, 카드 테두리 |
| `--text-primary` | `#f1f5f9` | 제목, 주요 텍스트 |
| `--text-secondary` | `#94a3b8` | 본문, 보조 텍스트 |
| `--text-muted` | `#64748b` | 날짜, 메타 정보 |
| `--accent` | `#818cf8` | 버튼, 활성 상태 (밝은 인디고) |
| `--accent-hover` | `#6366f1` | 버튼 hover |

---

## 2. 카테고리 뱃지

게시글 카테고리를 색상으로 구분. `CATEGORY_BADGE` 맵으로 관리 (`page.tsx`, `posts/[id]/page.tsx`).

| 카테고리 | 라이트 | 다크 |
|----------|--------|------|
| 자유 | `bg-slate-100 text-slate-600` | `bg-slate-800 text-slate-300` |
| 건의 | `bg-blue-100 text-blue-600` | `bg-blue-900/40 text-blue-400` |
| 칭찬 | `bg-emerald-100 text-emerald-600` | `bg-emerald-900/40 text-emerald-400` |
| 고민 | `bg-amber-100 text-amber-600` | `bg-amber-900/40 text-amber-400` |

```tsx
// 사용 예시
const CATEGORY_BADGE: Record<string, string> = {
  자유: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  건의: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  칭찬: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  고민: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
}

<span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_BADGE[category]}`}>
  {category}
</span>
```

---

## 3. 타이포그래피

| 용도 | 클래스 |
|------|--------|
| 페이지 제목 | `text-xl font-bold text-[var(--text-primary)]` |
| 카드 제목 | `font-medium text-sm text-[var(--text-primary)]` |
| 본문 | `text-sm text-[var(--text-secondary)] leading-7 tracking-wide` |
| 메타 정보 (날짜, 익명) | `text-xs text-[var(--text-muted)]` |
| 섹션 헤더 | `font-semibold text-sm text-[var(--text-primary)]` |

**폰트 스택:** `'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif`

---

## 4. 컴포넌트 패턴

### 카드 (게시글 상세)
```tsx
<div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] p-6">
  ...
</div>
```

### 목록 구분선
```tsx
<div className="divide-y divide-[var(--border)]">
  ...
</div>
```

### 목록 아이템 hover
```tsx
<Link className="flex ... hover:bg-[var(--bg-hover)] transition-colors">
```

### 기본 버튼 (Primary)
```tsx
<button className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors font-medium text-sm">
```

### 기본 버튼 (Ghost)
```tsx
<button className="border border-[var(--border)] text-[var(--text-secondary)] px-4 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm">
```

### 입력 필드
```tsx
<input className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
```

### 카테고리 탭 필터
```tsx
// 활성
<button className="pb-2 text-sm font-semibold text-[var(--accent)] border-b-2 border-[var(--accent)]">
// 비활성
<button className="pb-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
```

---

## 5. 레이아웃

- **최대 너비**: `max-w-2xl mx-auto` (680px)
- **패딩**: `px-4`
- **헤더**: sticky (`sticky top-0 z-50`), `bg-[var(--bg-surface)]`, `border-b border-[var(--border)]`
- **메인 콘텐츠**: `py-6`

---

## 6. 다크모드 구성

- **전략**: class 기반 (`<html class="dark">`)
- **Tailwind v4 설정**: `@custom-variant dark (&:where(.dark, .dark *));`
- **상태 저장**: `localStorage.getItem('theme')`
- **FOUC 방지**: `layout.tsx` 내 인라인 스크립트

```html
<!-- layout.tsx -->
<script dangerouslySetInnerHTML={{
  __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')})()`
}} />
```
