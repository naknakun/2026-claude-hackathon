'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types'

const CATEGORIES: (Category | '전체')[] = ['전체', '자유', '건의', '칭찬', '고민']

export default function CategoryFilter({ current }: { current: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleClick(category: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (category === '전체') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-0 border-b border-[var(--border)]">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            current === cat
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border)]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
