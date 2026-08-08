import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-accent-600 text-white hover:bg-accent-700 shadow-soft disabled:hover:bg-accent-600',
  secondary: 'bg-surface-raised text-ink border border-border hover:bg-surface-soft',
  ghost: 'text-ink-soft hover:bg-surface-soft hover:text-ink',
  outline: 'border border-accent-300 text-accent-700 dark:text-accent-300 hover:bg-accent-50 dark:hover:bg-accent-100'
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`focus-ring inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  )
}
