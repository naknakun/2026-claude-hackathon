export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import CategoryFilter from '@/components/CategoryFilter'
import type { Category } from '@/types'

const CATEGORY_BADGE: Record<string, string> = {
  자유: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  건의: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  칭찬: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  고민: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('id, title, category, created_at')
    .order('created_at', { ascending: false })

  if (category && category !== '전체') {
    query = query.eq('category', category as Category)
  }

  const { data: posts, error } = await query
  if (error) console.error('posts fetch error:', error)

  return (
    <div>
      <CategoryFilter current={category ?? '전체'} />
      <div className="mt-1 divide-y divide-[var(--border)]">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex items-center justify-between px-1 py-4 hover:bg-[var(--bg-hover)] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    CATEGORY_BADGE[post.category] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {post.category}
                </span>
                <p className="font-medium text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                  {post.title}
                </p>
              </div>
              <span className="shrink-0 text-xs text-[var(--text-muted)] ml-4">
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-center text-[var(--text-muted)] py-20 text-sm">
            아직 게시글이 없습니다. 첫 글을 작성해보세요!
          </p>
        )}
      </div>
    </div>
  )
}
