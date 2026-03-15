'use client'

import { useState } from 'react'
import { parseTags } from '@/lib/search'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  function addTag() {
    const newTags = parseTags(input)
    if (newTags.length === 0) return
    const merged = Array.from(new Set([...value, ...newTags]))
    onChange(merged)
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-400 transition-colors"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="태그 입력 후 Enter (예: React, Next.js)"
        className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
      <p className="text-xs text-[var(--text-muted)] mt-1">Enter 또는 쉼표로 태그 추가 (최대 5개)</p>
    </div>
  )
}
