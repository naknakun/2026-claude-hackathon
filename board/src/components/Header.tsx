'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="border-b border-[var(--border)] px-4 py-3 bg-[var(--bg-surface)] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-base text-[var(--text-primary)] flex items-center gap-1.5 tracking-tight"
        >
          <span className="text-lg">🏢</span>
          <span>사내게시판</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors font-medium text-xs"
              >
                글쓰기
              </Link>
              <button
                onClick={handleLogout}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors text-xs"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xs"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg hover:bg-[var(--accent-hover)] transition-colors font-medium text-xs"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
