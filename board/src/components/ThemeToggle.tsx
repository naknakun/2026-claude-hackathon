'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const isDark = saved === 'dark'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="text-sm px-2 py-1 rounded-md hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-muted)]"
      aria-label="테마 전환"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
