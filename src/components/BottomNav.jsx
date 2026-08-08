import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, ScrollText, Hourglass, Settings2 } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Trang chủ', icon: Home },
  { to: '/lich', label: 'Lịch', icon: CalendarDays },
  { to: '/van-nien', label: 'Vạn Niên', icon: ScrollText },
  { to: '/dem-nguoc', label: 'Đếm ngược', icon: Hourglass },
  { to: '/cai-dat', label: 'Cài đặt', icon: Settings2 }
]

export default function BottomNav() {
  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Điều hướng chính"
    >
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `focus-ring flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-accent-600 dark:text-accent-400' : 'text-ink-faint'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-8 w-11 items-center justify-center rounded-xl transition-colors ${
                  isActive ? 'bg-accent-100 dark:bg-accent-200' : ''
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
