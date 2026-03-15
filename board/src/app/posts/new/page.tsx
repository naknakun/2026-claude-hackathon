'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import TagInput from '@/components/TagInput'
import type { Category } from '@/types'

const CATEGORIES: Category[] = ['자유', '건의', '칭찬', '고민']

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category>('자유')
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/login'
      return
    }

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      category,
      tags,
      user_id: user.id,
    })

    if (error) {
      setError('게시글 작성에 실패했습니다.')
      setLoading(false)
      return
    }

    sessionStorage.setItem('pendingToast', JSON.stringify({ message: '게시글이 등록되었습니다.', type: 'success' }))
    window.location.href = '/'
  }

  return (
    <div className="min-h-[60vh] flex flex-col">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6">
        <h1 className="text-lg font-bold text-[var(--text-primary)] mb-6">글쓰기</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 카테고리 탭 */}
          <div className="flex border-b border-[var(--border)]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  category === cat
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 제목 */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
          />

          {/* 내용 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="내용을 입력하세요"
            rows={10}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow resize-none leading-relaxed"
          />

          {/* 태그 */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">태그</label>
            <TagInput value={tags} onChange={setTags} />
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
