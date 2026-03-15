'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
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
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
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
          <p className="text-sm text-[var(--text-muted)] mt-1">익명으로 자유롭게 소통하는 공간</p>
        </div>

        {/* 카드 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5">회원가입</h2>
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
                minLength={6}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
                placeholder="6자 이상"
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </form>
        </div>

        <p className="text-xs text-center mt-4 text-[var(--text-muted)]">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
