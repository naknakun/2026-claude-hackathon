import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagInput from '@/components/TagInput'

describe('TagInput', () => {
  it('태그 입력창이 렌더링된다', () => {
    render(<TagInput value={[]} onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText(/태그 입력 후 Enter/)).toBeInTheDocument()
  })

  it('Enter 키로 태그 추가', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput value={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText(/태그 입력 후 Enter/), 'React{Enter}')
    expect(onChange).toHaveBeenCalledWith(['React'])
  })

  it('쉼표로 태그 추가', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput value={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText(/태그 입력 후 Enter/), 'TypeScript,')
    expect(onChange).toHaveBeenCalledWith(['TypeScript'])
  })

  it('빈 입력은 태그 추가하지 않음', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput value={[]} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText(/태그 입력 후 Enter/), '   {Enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('기존 태그가 뱃지로 표시된다', () => {
    render(<TagInput value={['React', 'Next.js']} onChange={vi.fn()} />)
    expect(screen.getByText('#React')).toBeInTheDocument()
    expect(screen.getByText('#Next.js')).toBeInTheDocument()
  })

  it('✕ 클릭 시 태그 제거', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput value={['React', 'Next.js']} onChange={onChange} />)

    const removeButtons = screen.getAllByRole('button', { name: '✕' })
    await user.click(removeButtons[0])
    expect(onChange).toHaveBeenCalledWith(['Next.js'])
  })

  it('중복 태그는 추가되지 않음', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagInput value={['React']} onChange={onChange} />)

    await user.type(screen.getByPlaceholderText(/태그 입력 후 Enter/), 'React{Enter}')
    expect(onChange).toHaveBeenCalledWith(['React'])
  })
})
