import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle
}

const RING = {
  success: 'text-emerald-500',
  error: 'text-rose-500',
  info: 'text-accent-500',
  warning: 'text-amber-500'
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message, { type = 'info', title, duration = 3200 } = {}) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, message, type, title }])
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[100] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-2"
        style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
        role="region"
        aria-live="polite"
        aria-label="Thông báo"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.type] ?? Info
          return (
            <div
              key={t.id}
              className="glass animate-toast-in pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 shadow-glass"
            >
              <Icon size={20} className={`mt-0.5 shrink-0 ${RING[t.type]}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                {t.title && <p className="text-sm font-semibold text-ink">{t.title}</p>}
                <p className="text-sm text-ink-soft leading-snug">{t.message}</p>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="focus-ring shrink-0 rounded-full p-1 text-ink-faint hover:bg-surface-soft hover:text-ink"
                aria-label="Đóng thông báo"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast phải được dùng trong ToastProvider')
  return ctx
}
