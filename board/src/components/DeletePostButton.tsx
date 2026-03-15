'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('게시글을 삭제할까요?')) return

    const supabase = createClient()
    await supabase.from('posts').delete().eq('id', postId)

    sessionStorage.setItem('pendingToast', JSON.stringify({ message: '게시글이 삭제되었습니다.', type: 'success' }))
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      aria-label="게시글 삭제"
      className="text-xs text-red-400 hover:text-red-600"
    >
      삭제
    </button>
  )
}
