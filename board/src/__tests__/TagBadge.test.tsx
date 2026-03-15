import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagBadge from '@/components/TagBadge'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}))

beforeEach(() => {
  mockPush.mockClear()
})

describe('TagBadge', () => {
  it('# 접두사와 함께 태그명이 렌더링된다', () => {
    render(<TagBadge tag="React" />)
    expect(screen.getByText('#React')).toBeInTheDocument()
  })

  it('버튼 요소로 렌더링된다', () => {
    render(<TagBadge tag="Next.js" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('클릭 시 router.push로 태그 필터 URL로 이동', async () => {
    const user = userEvent.setup()
    render(<TagBadge tag="TypeScript" />)

    await user.click(screen.getByRole('button'))
    expect(mockPush).toHaveBeenCalledWith('/?tag=TypeScript')
  })

  it('특수문자 포함 태그도 URL에 포함된다', async () => {
    const user = userEvent.setup()
    render(<TagBadge tag="Next.js" />)

    await user.click(screen.getByRole('button'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('tag=Next.js'))
  })
})
