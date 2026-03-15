'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/ToastProvider'
import type { Comment } from '@/types'

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
    fetchComments()
  }, [])

  async function fetchComments() {
    setLoadingComments(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
    setLoadingComments(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/login'
      return
    }

    await supabase.from('comments').insert({
      post_id: postId,
      content: content.trim(),
      user_id: user.id,
    })

    setContent('')
    setLoading(false)
    toast.show('댓글이 등록되었습니다.')
    fetchComments()
  }

  async function handleDelete(commentId: string) {
    if (!confirm('댓글을 삭제할까요?')) return
    const supabase = createClient()
    await supabase.from('comments').delete().eq('id', commentId)
    toast.show('댓글이 삭제되었습니다.')
    fetchComments()
  }

  return (
    <div className="mt-6 border-t border-[var(--border)] pt-6">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        댓글{' '}
        <span className="text-[var(--accent)] font-bold">{comments.length}</span>
      </h2>

      <div className="space-y-0 mb-5 divide-y divide-[var(--border)]">
        {loadingComments ? (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between gap-2 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">익명</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">{comment.content}</p>
                </div>
                {userId === (comment as unknown as { user_id: string }).user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors shrink-0 mt-1"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] py-4">첫 댓글을 남겨보세요!</p>
            )}
          </>
        )}
      </div>

      {userId ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors font-medium"
          >
            등록
          </button>
        </form>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">
          댓글을 작성하려면{' '}
          <a href="/login" className="text-[var(--accent)] hover:underline">로그인</a>
          이 필요합니다.
        </p>
      )}
    </div>
  )
}
