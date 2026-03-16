import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import LikeButton from '@/components/LikeButton'
import { createClient } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
  createClient: vi.fn(),
}))

// Supabase 쿼리 빌더 mock: 체인 가능 + thenable (count 쿼리용)
function makeBuilder(countResolve: object = { count: 0 }) {
  const builder: Record<string, unknown> = {}
  builder.select = vi.fn().mockReturnValue(builder)
  builder.eq = vi.fn().mockReturnValue(builder)
  builder.single = vi.fn().mockResolvedValue({ data: null })
  builder.insert = vi.fn().mockResolvedValue({ data: null })
  builder.delete = vi.fn().mockReturnValue(builder)
  // thenable: await builder → countResolve (좋아요 수 count 쿼리)
  builder.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
    Promise.resolve(countResolve).then(resolve, reject)
  return builder
}

describe('LikeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('미로그인 상태에서 좋아요 버튼이 렌더링된다', async () => {
    const builder = makeBuilder({ count: 0 })
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    render(<LikeButton postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '좋아요' })).toBeInTheDocument()
    })
  })

  it('초기 좋아요 수가 표시된다', async () => {
    const builder = makeBuilder({ count: 5 })
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    render(<LikeButton postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('좋아요하지 않은 상태에서 ♡ 아이콘이 표시된다', async () => {
    const builder = makeBuilder({ count: 3 })
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    render(<LikeButton postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByText('♡')).toBeInTheDocument()
    })
  })

  it('이미 좋아요한 경우 ♥ 아이콘과 "좋아요 취소" aria-label이 표시된다', async () => {
    const builder = makeBuilder({ count: 3 })
    builder.single = vi.fn().mockResolvedValue({ data: { id: 'like-1' } })
    ;(createClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      from: vi.fn().mockReturnValue(builder),
    })

    render(<LikeButton postId="post-1" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '좋아요 취소' })).toBeInTheDocument()
      expect(screen.getByText('♥')).toBeInTheDocument()
    })
  })
})
