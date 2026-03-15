export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import CategoryFilter from '@/components/CategoryFilter'
import type { Category } from '@/types'

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
      <div className="mt-4 space-y-2">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block border rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
              </div>
              <p className="font-medium text-sm">{post.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 py-16 text-sm">
            아직 게시글이 없습니다. 첫 글을 작성해보세요!
          </p>
        )}
      </div>
    </div>
  )
}
