import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DeletePostButton from '@/components/DeletePostButton'
import CommentSection from '@/components/CommentSection'
import LikeButton from '@/components/LikeButton'

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
    <article>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {post.category}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(post.created_at).toLocaleDateString('ko-KR')}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <h1 className="text-xl font-bold mb-4">{post.title}</h1>
        {isOwner && <DeletePostButton postId={post.id} />}
      </div>
      <p className="text-sm text-gray-500 mb-6">익명</p>
      <div className="text-sm leading-relaxed whitespace-pre-wrap border-t pt-4">
        {post.content}
      </div>
      <div className="mt-6 flex justify-center">
        <LikeButton postId={post.id} />
      </div>
      <CommentSection postId={post.id} />
    </article>
  )
}
