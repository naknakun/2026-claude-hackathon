'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

type ToastType = 'success' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} })

let nextId = 0

type Action =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: number }

function reducer(state: Toast[], action: Action): Toast[] {
  if (action.type === 'ADD') return [...state, action.toast]
  if (action.type === 'REMOVE') return state.filter((t) => t.id !== action.id)
  return state
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++
    dispatch({ type: 'ADD', toast: { id, message, type } })
    setTimeout(() => dispatch({ type: 'REMOVE', id }), 3000)
  }, [])

  // 페이지 이동 후 sessionStorage에서 pending toast 읽기
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingToast')
    if (pending) {
      sessionStorage.removeItem('pendingToast')
      try {
        const { message, type } = JSON.parse(pending) as { message: string; type: ToastType }
        show(message, type)
      } catch {}
    }
  }, [show])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg text-sm font-medium text-white shadow-lg transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-500'
                : 'bg-red-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
