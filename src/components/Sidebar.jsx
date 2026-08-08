import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, ScrollText, Hourglass, Settings2, Moon, Sparkles } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Trang chủ', icon: Home },
  { to: '/lich', label: 'Lịch âm dương', icon: CalendarDays },
  { to: '/van-nien', label: 'Lịch vạn niên', icon: ScrollText },
  { to: '/dem-nguoc', label: 'Đếm ngược sự kiện', icon: Hourglass },
  { to: '/cai-dat', label: 'Cài đặt', icon: Settings2 }
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface-soft px-4 py-6 sm:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-soft">
          <Moon size={20} fill="currentColor" strokeWidth={0} />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-ink">Lịch Pro</p>
          <p className="text-[11px] text-ink-faint">Âm dương &amp; vạn niên</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Điều hướng chính">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-600 text-white shadow-soft'
                  : 'text-ink-soft hover:bg-surface-raised hover:text-ink'
              }`
            }
          >
            <Icon size={18} strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl bg-surface-raised p-3.5 shadow-soft">
        <div className="mb-1.5 flex items-center gap-1.5 text-accent-600 dark:text-accent-400">
          <Sparkles size={14} />
          <p className="text-xs font-semibold">Mẹo nhanh</p>
        </div>
        <p className="text-xs leading-relaxed text-ink-soft">
          Chạm vào một ngày bất kỳ trong Lịch để xem chi tiết âm lịch, can chi và giờ hoàng đạo.
        </p>
      </div>

      <p className="mt-4 px-2 text-[11px] text-ink-faint">Thiết kế &amp; phát triển bởi minhtrong67</p>
    </aside>
  )
}
