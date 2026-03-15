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
    <header className="border-b dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          익명 게시판
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                글쓰기
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-800"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">로그인</Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
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
