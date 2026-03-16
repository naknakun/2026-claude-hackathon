import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import CommentSection from '@/components/CommentSection'
import { ToastProvider } from '@/components/ToastProvider'
import { createClient } from '@/lib/supabase'
import type { Comment } from '@/types'

vi.mock('@/lib/supabase', () => ({
  createClient: vi.fn(),
}))

const mockComment: Comment = {
  id: 'comment-1',
  post_id: 'post-1',
  content: '테스트 댓글 내용',
  created_at: new Date().toISOString(),
}

// Supabase 쿼리 빌더 mock: select/eq/order 체인 + insert/delete
function makeBuilder(comments: Comment[] = []) {
  const builder: Record<string, unknown> = {}
  builder.select = vi.fn().mockReturnValue(builder)
  builder.eq = vi.fn().mockReturnValue(builder)
  builder.order = vi.fn().mockResolvedValue({ data: comments })
  builder.insert = vi.fn().mockResolvedValue({ data: null })
  builder.delete = vi.fn().mockReturnValue(builder)
  return builder
}

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('CommentSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('초기 로딩 스피너가 표시된다', () => {
    const builder = makeBuilder()
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    renderWithToast(<CommentSection postId="post-1" />)

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('댓글 목록이 렌더링된다', async () => {
    const builder = makeBuilder([mockComment])
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    renderWithToast(<CommentSection postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('테스트 댓글 내용')).toBeInTheDocument()
    })
  })

  it('댓글이 없으면 "첫 댓글을 남겨보세요!" 메시지가 표시된다', async () => {
    const builder = makeBuilder([])
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    renderWithToast(<CommentSection postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('첫 댓글을 남겨보세요!')).toBeInTheDocument()
    })
  })

  it('미로그인 상태에서 로그인 링크가 표시된다', async () => {
    const builder = makeBuilder()
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    renderWithToast(<CommentSection postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument()
    })
  })

  it('로그인 상태에서 댓글 입력 폼이 표시된다', async () => {
    const builder = makeBuilder()
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    renderWithToast(<CommentSection postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('댓글을 입력하세요')).toBeInTheDocument()
    })
  })
})
