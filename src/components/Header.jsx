export default function Header({ title, subtitle }) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/90 px-4 pb-3.5 backdrop-blur-md sm:hidden"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.875rem)' }}
    >
      <img src="/icons/icon-192.png" alt="Lịch Pro" className="h-9 w-9 shrink-0 rounded-xl" />
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold leading-tight text-ink">{title}</h1>
        {subtitle && <p className="truncate text-xs text-ink-faint">{subtitle}</p>}
      </div>
    </header>
  )
}
