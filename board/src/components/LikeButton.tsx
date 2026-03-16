'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/ToastProvider'

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUserId(user?.id ?? null)

        const { count: likeCount, error: countError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId)
        if (countError) throw countError
        setCount(likeCount ?? 0)

        if (user) {
          const { data } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single()
          setLiked(!!data)
        }
      } catch {
        // 초기 로딩 실패 시 기본값 유지 (silent fail)
      }
    }

    init()
  }, [postId])

  async function handleToggle() {
    if (!userId) {
      window.location.href = '/login'
      return
    }
    setLoading(true)
    const prevLiked = liked
    const prevCount = count

    // 낙관적 UI 업데이트
    setLiked(!liked)
    setCount((c) => liked ? c - 1 : c + 1)

    try {
      const supabase = createClient()
      if (liked) {
        const { error } = await supabase.from('likes').delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: userId })
        if (error) throw error
      }
    } catch {
      // 실패 시 UI 롤백
      setLiked(prevLiked)
      setCount(prevCount)
      toast.show('좋아요 처리 중 오류가 발생했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-all disabled:opacity-50 ${
        liked
          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
      }`}
    >
      <span className="text-base leading-none">{liked ? '♥' : '♡'}</span>
      <span>{count}</span>
    </button>
  )
}
