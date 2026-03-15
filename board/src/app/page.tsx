export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase-server'
import CategoryFilter from '@/components/CategoryFilter'
import SearchBar from '@/components/SearchBar'
import TagBadge from '@/components/TagBadge'
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
  searchParams: Promise<{ category?: string; search?: string; tag?: string }>
}) {
  const { category, search, tag } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('id, title, category, tags, created_at')
    .order('created_at', { ascending: false })

  if (category && category !== '전체') {
    query = query.eq('category', category as Category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data: posts, error } = await query
  if (error) console.error('posts fetch error:', error)

  const isFiltered = search || (tag) || (category && category !== '전체')

  return (
    <div>
      <Suspense>
        <SearchBar />
      </Suspense>
      <div className="mt-3">
        <Suspense>
          <CategoryFilter current={category ?? '전체'} />
        </Suspense>
      </div>

      {(search || tag) && (
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          {search && <span>"{search}" 검색 결과</span>}
          {tag && <span>#{tag} 태그 필터</span>}
          {' '}— {posts?.length ?? 0}건
        </p>
      )}

      <div className="mt-2 divide-y divide-[var(--border)]">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex items-center justify-between px-1 py-4 hover:bg-[var(--bg-hover)] transition-colors group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    CATEGORY_BADGE[post.category] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {post.category}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                    {post.title}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {post.tags.map((t: string) => (
                        <span key={t} className="text-xs text-[var(--text-muted)]">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-xs text-[var(--text-muted)] ml-4">
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </span>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 text-[var(--text-muted)]">
            {search ? (
              <p className="text-sm">"{search}"에 대한 검색 결과가 없습니다.</p>
            ) : tag ? (
              <p className="text-sm">#{tag} 태그가 달린 게시글이 없습니다.</p>
            ) : (
              <p className="text-sm">아직 작성된 글이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
