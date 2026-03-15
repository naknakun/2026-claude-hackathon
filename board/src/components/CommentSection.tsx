'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Comment } from '@/types'

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
    fetchComments()
  }, [])

  async function fetchComments() {
    const supabase = createClient()
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
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
    fetchComments()
  }

  async function handleDelete(commentId: string) {
    if (!confirm('댓글을 삭제할까요?')) return
    const supabase = createClient()
    await supabase.from('comments').delete().eq('id', commentId)
    fetchComments()
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="font-semibold text-sm mb-4">댓글 {comments.length}개</h2>

      <div className="space-y-3 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs text-gray-400 mr-2">익명</span>
              <span className="text-xs text-gray-300">
                {new Date(comment.created_at).toLocaleDateString('ko-KR')}
              </span>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
            {userId === comment.user_id && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-xs text-red-400 hover:text-red-600 shrink-0"
              >
                삭제
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">첫 댓글을 남겨보세요!</p>
        )}
      </div>

      {userId ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            등록
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-400">
          댓글을 작성하려면{' '}
          <a href="/login" className="text-blue-600 hover:underline">로그인</a>
          이 필요합니다.
        </p>
      )}
    </div>
  )
}
