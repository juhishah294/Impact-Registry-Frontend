import * as React from 'react'

type ToastVariant = 'default' | 'destructive' | 'success'

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastVariant
}

interface ToastOptions {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastVariant
}

interface ToastState {
  toasts: Toast[]
}

interface ToastContextType {
  toasts: Toast[]
  toast: (options: ToastOptions) => void
  dismiss: (toastId: string) => void
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000000

const generateId = () => {
  return Math.random().toString(36).substring(2, 9)
}

export const useToast = () => {
  const [state, setState] = React.useState<ToastState>({
    toasts: [],
  })

  const toast = React.useCallback((opts: ToastOptions) => {
    const id = generateId()

    const toast: Toast = {
      id,
      ...opts,
      variant: opts.variant || 'default',
    }

    setState((prev) => ({
      toasts: [toast, ...prev.toasts].slice(0, TOAST_LIMIT),
    }))

    return id
  }, [])

  const dismiss = React.useCallback((toastId: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== toastId),
    }))
  }, [])

  return {
    ...state,
    toast,
    dismiss,
  }
}