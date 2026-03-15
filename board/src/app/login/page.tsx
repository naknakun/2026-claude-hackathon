'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg-base)]">
      <div className="w-full max-w-sm">
        {/* 로고/타이틀 */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">🏢</div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">사내게시판</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">로그인하고 익명으로 소통하세요</p>
        </div>

        {/* 카드 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5">로그인</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
                placeholder="example@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? '처리 중...' : '로그인'}
            </button>
          </form>
        </div>

        <p className="text-xs text-center mt-4 text-[var(--text-muted)]">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
