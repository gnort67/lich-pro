import * as Icons from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { diffParts, formatShortDate, formatVNDate } from '../lib/dateUtils'
import { CATEGORY_COLOR, CATEGORY_LABEL } from '../data/holidays'
import { useNow } from '../hooks/useNow'

export default function CountdownCard({ holiday, nextDate, compact = false, onClick }) {
  const now = useNow(1000)
  const Icon = Icons[holiday.icon] ?? Icons.Star
  const { days, hours, minutes, seconds } = diffParts(nextDate, now)
  const isTodayEvent = days === 0

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="focus-ring hover-lift flex w-40 shrink-0 flex-col gap-2 rounded-2xl border border-border bg-surface-raised p-3.5 text-left shadow-soft sm:w-44"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600 dark:bg-accent-200 dark:text-accent-300">
          <Icon size={16} />
        </div>
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-ink">{holiday.name}</p>
        <p className="text-lg font-extrabold text-accent-600 dark:text-accent-400">
          {isTodayEvent ? 'Hôm nay' : `${days} ngày`}
        </p>
        <p className="text-[11px] text-ink-faint">{formatShortDate(nextDate)}</p>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="focus-ring hover-lift w-full rounded-2xl border border-border bg-surface-raised p-4 text-left shadow-soft hover:shadow-card"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-200 dark:text-accent-300">
            <Icon size={19} />
          </div>
          <div>
            <p className="text-sm font-bold leading-snug text-ink">{holiday.name}</p>
            <p className="mt-0.5 text-xs text-ink-faint">{formatVNDate(nextDate)}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLOR[holiday.category]}`}>
          {CATEGORY_LABEL[holiday.category]}
        </span>
      </div>

      {isTodayEvent ? (
        <div className="rounded-xl bg-accent-600 py-2.5 text-center text-sm font-bold text-white">Diễn ra hôm nay!</div>
      ) : (
        <div className="grid grid-cols-4 gap-1.5">
          <TimeBox value={days} label="Ngày" />
          <TimeBox value={hours} label="Giờ" />
          <TimeBox value={minutes} label="Phút" />
          <TimeBox value={seconds} label="Giây" />
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">{holiday.desc}</p>
      <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-accent-600 dark:text-accent-400">
        Xem chi tiết <ChevronRight size={13} />
      </p>
    </button>
  )
}

function TimeBox({ value, label }) {
  return (
    <div className="rounded-lg bg-surface-soft py-2 text-center">
      <p className="text-base font-extrabold tabular-nums text-ink sm:text-lg">{String(value).padStart(2, '0')}</p>
      <p className="text-[9.5px] uppercase tracking-wide text-ink-faint">{label}</p>
    </div>
  )
}
