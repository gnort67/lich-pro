import { useMemo } from 'react'
import { getLunarInfo, sameDay, mondayIndex, pad2, WEEKDAYS_SHORT } from '../lib/dateUtils'
import { NGAY_CHAY_THAP_TRAI, HOLIDAYS } from '../data/holidays'

function buildMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1)
  const startOffset = mondayIndex(firstDay.getDay())
  const start = new Date(year, month, 1 - startOffset)
  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

function holidaysOnDate(d, lunarInfo) {
  return HOLIDAYS.filter((h) => {
    if (h.type === 'solar') return h.day === d.getDate() && h.month === d.getMonth() + 1
    return h.day === lunarInfo.lunarDay && h.month === lunarInfo.lunarMonth && !lunarInfo.isLeap
  })
}

export default function CalendarGrid({ year, month, selectedDate, onSelect }) {
  const today = useMemo(() => new Date(), [])
  const days = useMemo(() => buildMonthMatrix(year, month), [year, month])

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-faint sm:text-xs">
        {WEEKDAYS_SHORT.map((w) => (
          <div key={w} className={w === 'CN' ? 'text-rose-500/80' : ''}>
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((d, i) => {
          const inMonth = d.getMonth() === month
          const lunarInfo = getLunarInfo(d)
          const isToday = sameDay(d, today)
          const isSelected = selectedDate && sameDay(d, selectedDate)
          const isSunday = d.getDay() === 0
          const holidaysToday = holidaysOnDate(d, lunarInfo)
          const isHoliday = holidaysToday.length > 0
          const isChay = NGAY_CHAY_THAP_TRAI.includes(lunarInfo.lunarDay)
          const isRam = lunarInfo.lunarDay === 15
          const isMungMot = lunarInfo.lunarDay === 1
          const lunarLabel = isMungMot ? `${lunarInfo.lunarDay}/${pad2(lunarInfo.lunarMonth)}` : pad2(lunarInfo.lunarDay)

          // Nền màu theo loại ngày (ưu tiên: lễ > chay > rằm/mùng một)
          let typeBg = ''
          let typeText = 'text-ink-faint'
          if (isHoliday) {
            typeBg = 'bg-amber-50 dark:bg-amber-500/15'
            typeText = 'text-amber-700 dark:text-amber-300 font-bold'
          } else if (isChay) {
            typeBg = 'bg-emerald-50 dark:bg-emerald-500/15'
            typeText = 'text-emerald-700 dark:text-emerald-300 font-bold'
          } else if (isRam || isMungMot) {
            typeBg = 'bg-accent-50 dark:bg-accent-100'
            typeText = 'text-accent-700 dark:text-accent-300 font-bold'
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={`focus-ring group relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border transition-all duration-150 active:scale-95
                ${inMonth ? typeBg || 'bg-surface-raised' : 'bg-transparent opacity-40'}
                ${isSelected ? 'border-accent-500 ring-2 ring-accent-400' : 'border-border hover:border-accent-300 hover:-translate-y-0.5'}
                ${isToday ? 'ring-2 ring-accent-500 ring-offset-1 ring-offset-surface' : ''}
              `}
              aria-label={`${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}, âm lịch ${lunarInfo.lunarDay}/${lunarInfo.lunarMonth}`}
              aria-pressed={isSelected}
            >
              {isToday && (
                <span className="absolute -top-1.5 whitespace-nowrap rounded-full bg-accent-600 px-1.5 py-[1px] text-[8px] font-bold text-white shadow-soft">
                  Hôm nay
                </span>
              )}
              <span
                className={`text-sm font-bold sm:text-base ${
                  isSelected
                    ? 'text-accent-600 dark:text-accent-400'
                    : isSunday && inMonth
                      ? 'text-rose-500'
                      : 'text-ink'
                }`}
              >
                {d.getDate()}
              </span>
              <span className={`text-[9.5px] sm:text-[10.5px] ${typeText}`}>{lunarLabel}</span>
              {isHoliday && isChay && (
                <span
                  className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                  title="Cũng là ngày chay"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
