'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }
    router.push(`/?${params.toString()}`)
  }

  function handleClear() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="제목 또는 내용 검색"
        className="w-full border border-[var(--border)] rounded-lg px-3 py-2 pr-16 text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="검색어 초기화"
          className="absolute right-10 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xs px-1"
        >
          ✕
        </button>
      )}
      <button
        type="submit"
        aria-label="검색"
        className="absolute right-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        🔍
      </button>
    </form>
  )
}
