import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DeletePostButton from '@/components/DeletePostButton'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'

const CATEGORY_BADGE: Record<string, string> = {
  자유: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  건의: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  칭찬: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  고민: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === post.user_id

  return (
    <article className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] p-6">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-5"
      >
        ← 목록으로
      </Link>

      {/* 메타 정보 */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            CATEGORY_BADGE[post.category] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {post.category}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {new Date(post.created_at).toLocaleDateString('ko-KR')}
        </span>
      </div>

      {/* 제목 + 삭제 */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-xl font-bold text-[var(--text-primary)] leading-snug">{post.title}</h1>
        {isOwner && <DeletePostButton postId={post.id} />}
      </div>

      <p className="text-xs text-[var(--text-muted)] mb-6">익명</p>

      {/* 본문 */}
      <div className="text-sm text-[var(--text-secondary)] leading-7 tracking-wide whitespace-pre-wrap border-t border-[var(--border)] pt-5 mb-6">
        {post.content}
      </div>

      {/* 좋아요 */}
      <div className="flex justify-center py-4 border-t border-[var(--border)]">
        <LikeButton postId={post.id} />
      </div>

      <CommentSection postId={post.id} />
    </article>
  )
}
