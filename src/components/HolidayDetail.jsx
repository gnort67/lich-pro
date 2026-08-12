import * as Icons from 'lucide-react'
import { Calendar, Tag, Bell, BellOff } from 'lucide-react'
import { diffParts, formatVNDate } from '../lib/dateUtils'
import { CATEGORY_COLOR, CATEGORY_LABEL } from '../data/holidays'
import { useNow } from '../hooks/useNow'
import { useSettings } from '../contexts/SettingsContext'

export default function HolidayDetail({ holiday, nextDate }) {
  const now = useNow(1000)
  const { settings, update } = useSettings()
  const Icon = Icons[holiday.icon] ?? Icons.Star
  const { days, hours, minutes, seconds } = diffParts(nextDate, now)
  const isTodayEvent = days === 0
  const isNotifyOn = settings.notifyHolidayIds.includes(holiday.id)

  function toggleNotify() {
    const set = new Set(settings.notifyHolidayIds)
    if (set.has(holiday.id)) set.delete(holiday.id)
    else set.add(holiday.id)
    update({ notifyHolidayIds: Array.from(set) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 p-5 text-white shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Icon size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-extrabold leading-tight">{holiday.name}</p>
            <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold">
              {CATEGORY_LABEL[holiday.category]}
            </span>
          </div>
        </div>
      </div>

      {isTodayEvent ? (
        <div className="rounded-2xl bg-accent-600 py-4 text-center text-base font-bold text-white shadow-soft">
          Diễn ra hôm nay!
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          <TimeBox value={days} label="Ngày" />
          <TimeBox value={hours} label="Giờ" />
          <TimeBox value={minutes} label="Phút" />
          <TimeBox value={seconds} label="Giây" />
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-soft">
        <div className="flex items-center gap-2.5">
          <Calendar size={16} className="shrink-0 text-accent-500" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">Ngày diễn ra gần nhất</p>
            <p className="text-sm font-bold text-ink">{formatVNDate(nextDate)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2.5 border-t border-border pt-3">
          <Tag size={16} className="shrink-0 text-accent-500" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">Loại lịch</p>
            <p className="text-sm font-bold text-ink">{holiday.type === 'solar' ? 'Theo dương lịch' : 'Theo âm lịch'} — {holiday.day}/{holiday.month}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-soft">
        <p className="text-sm font-semibold text-ink">Ý nghĩa</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{holiday.desc}</p>
      </div>

      <button
        onClick={toggleNotify}
        className={`focus-ring flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-semibold transition-colors ${
          isNotifyOn
            ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-100 dark:text-accent-300'
            : 'border-border text-ink-soft hover:border-accent-300'
        }`}
      >
        {isNotifyOn ? <Bell size={16} /> : <BellOff size={16} />}
        {isNotifyOn ? 'Đang nhận thông báo cho ngày này' : 'Bật thông báo cho ngày này'}
      </button>
    </div>
  )
}

function TimeBox({ value, label }) {
  return (
    <div className="rounded-xl bg-surface-soft py-2.5 text-center">
      <p className="text-lg font-extrabold tabular-nums text-ink">{String(value).padStart(2, '0')}</p>
      <p className="text-[9.5px] uppercase tracking-wide text-ink-faint">{label}</p>
    </div>
  )
}
