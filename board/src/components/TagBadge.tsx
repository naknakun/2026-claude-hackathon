'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function TagBadge({ tag }: { tag: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tag', tag)
    params.delete('search')
    router.push(`/?${params.toString()}`)
  }

  return (
    <button
      onClick={handleClick}
      className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
    >
      #{tag}
    </button>
  )
}
