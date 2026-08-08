import { Moon } from 'lucide-react'

export default function Header({ title, subtitle }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/90 px-4 py-3.5 backdrop-blur-md sm:hidden">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-white">
        <Moon size={17} fill="currentColor" strokeWidth={0} />
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold leading-tight text-ink">{title}</h1>
        {subtitle && <p className="truncate text-xs text-ink-faint">{subtitle}</p>}
      </div>
    </header>
  )
}
