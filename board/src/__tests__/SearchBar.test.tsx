import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'

const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}))

beforeEach(() => {
  mockPush.mockClear()
})

describe('SearchBar', () => {
  it('검색 입력창이 렌더링된다', () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText('제목 또는 내용 검색')).toBeInTheDocument()
  })

  it('검색어 입력 후 Enter 시 router.push 호출', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    await user.type(screen.getByPlaceholderText('제목 또는 내용 검색'), 'Next.js{Enter}')
    expect(mockPush).toHaveBeenCalledWith('/?search=Next.js')
  })

  it('검색어 입력 시 ✕ 버튼이 나타난다', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    expect(screen.queryByRole('button', { name: '검색어 초기화' })).not.toBeInTheDocument()
    await user.type(screen.getByPlaceholderText('제목 또는 내용 검색'), 'hello')
    expect(screen.getByRole('button', { name: '검색어 초기화' })).toBeInTheDocument()
  })

  it('✕ 버튼 클릭 시 검색어 초기화 및 router.push 호출', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    await user.type(screen.getByPlaceholderText('제목 또는 내용 검색'), 'hello')
    await user.click(screen.getByRole('button', { name: '검색어 초기화' }))
    expect(mockPush).toHaveBeenCalledWith('/?')
    expect(screen.getByPlaceholderText('제목 또는 내용 검색')).toHaveValue('')
  })

  it('빈 검색어로 Enter 시 search 파라미터 제거', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    await user.click(screen.getByPlaceholderText('제목 또는 내용 검색'))
    await user.keyboard('{Enter}')
    expect(mockPush).toHaveBeenCalledWith('/?')
  })
})
