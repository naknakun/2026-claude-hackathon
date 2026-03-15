'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const { count: likeCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
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
    }

    init()
  }, [postId])

  async function handleToggle() {
    if (!userId) {
      window.location.href = '/login'
      return
    }
    setLoading(true)
    const supabase = createClient()

    if (liked) {
      await supabase.from('likes').delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      setLiked(false)
      setCount((c) => c - 1)
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId })
      setLiked(true)
      setCount((c) => c + 1)
    }
    setLoading(false)
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
