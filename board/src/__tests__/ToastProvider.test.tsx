import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from '@/components/ToastProvider'

function ToastTrigger({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  const { show } = useToast()
  return <button onClick={() => show(message, type)}>토스트 표시</button>
}

describe('ToastProvider 통합 테스트', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('useToast로 success 토스트가 화면에 표시된다', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTrigger message="게시글이 등록되었습니다." />
      </ToastProvider>
    )

    await user.click(screen.getByText('토스트 표시'))
    expect(screen.getByText('게시글이 등록되었습니다.')).toBeInTheDocument()
  })

  it('useToast로 error 토스트가 화면에 표시된다', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ToastTrigger message="오류가 발생했습니다." type="error" />
      </ToastProvider>
    )

    await user.click(screen.getByText('토스트 표시'))
    expect(screen.getByText('오류가 발생했습니다.')).toBeInTheDocument()
  })

  it('sessionStorage의 pendingToast를 읽어 마운트 시 자동 표시한다', () => {
    sessionStorage.setItem(
      'pendingToast',
      JSON.stringify({ message: '게시글이 삭제되었습니다.', type: 'success' })
    )

    render(
      <ToastProvider>
        <div />
      </ToastProvider>
    )

    expect(screen.getByText('게시글이 삭제되었습니다.')).toBeInTheDocument()
    expect(sessionStorage.getItem('pendingToast')).toBeNull()
  })

  it('여러 토스트를 동시에 표시할 수 있다', async () => {
    const user = userEvent.setup()

    function MultiToast() {
      const { show } = useToast()
      return (
        <>
          <button onClick={() => show('첫 번째 메시지')}>첫 번째</button>
          <button onClick={() => show('두 번째 메시지')}>두 번째</button>
        </>
      )
    }

    render(
      <ToastProvider>
        <MultiToast />
      </ToastProvider>
    )

    await user.click(screen.getByText('첫 번째'))
    await user.click(screen.getByText('두 번째'))
    expect(screen.getByText('첫 번째 메시지')).toBeInTheDocument()
    expect(screen.getByText('두 번째 메시지')).toBeInTheDocument()
  })
})
