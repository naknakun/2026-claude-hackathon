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
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            current === cat
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
