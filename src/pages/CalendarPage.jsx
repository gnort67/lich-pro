import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react'
import Header from '../components/Header'
import Button from '../components/Button'
import CalendarGrid from '../components/CalendarGrid'
import Sheet from '../components/Sheet'
import VanNienDetail from '../components/VanNienDetail'
import { CalendarSkeleton } from '../components/Skeleton'
import { MONTH_NAMES, getLunarInfo } from '../lib/dateUtils'
import { canChiYear } from '../lib/lunar'

export default function CalendarPage() {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSelected] = useState(today)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [cursor])

  function changeMonth(delta) {
    setCursor((c) => {
      let m = c.month + delta
      let y = c.year
      if (m < 0) { m = 11; y -= 1 }
      if (m > 11) { m = 0; y += 1 }
      return { year: y, month: m }
    })
  }

  function goToday() {
    setCursor({ year: today.getFullYear(), month: today.getMonth() })
    setSelected(today)
  }

  function handleSelect(d) {
    setSelected(d)
    if (d.getMonth() !== cursor.month) {
      setCursor({ year: d.getFullYear(), month: d.getMonth() })
    }
    setSheetOpen(true)
  }

  const { lunarYear } = getLunarInfo(new Date(cursor.year, cursor.month, 15))

  return (
    <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6 sm:pt-8">
      <Header title="Lịch âm dương" subtitle={`${MONTH_NAMES[cursor.month]} ${cursor.year}`} />

      <div className="mt-4 flex items-center justify-between sm:mt-0">
        <div className="hidden sm:block">
          <h1 className="text-2xl font-extrabold text-ink">Lịch âm dương</h1>
          <p className="text-sm text-ink-soft">Năm {canChiYear(lunarYear)} ({lunarYear})</p>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-raised p-1">
            <button onClick={() => changeMonth(-1)} className="focus-ring rounded-lg p-1.5 text-ink-soft hover:bg-surface-soft" aria-label="Tháng trước">
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-[110px] text-center text-sm font-bold text-ink">
              {MONTH_NAMES[cursor.month]} {cursor.year}
            </span>
            <button onClick={() => changeMonth(1)} className="focus-ring rounded-lg p-1.5 text-ink-soft hover:bg-surface-soft" aria-label="Tháng sau">
              <ChevronRight size={18} />
            </button>
          </div>
          <Button variant="secondary" size="sm" icon={CalendarClock} onClick={goToday}>
            Hôm nay
          </Button>
        </div>
      </div>

      <section className="mt-4 sm:mt-6">
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <div className="rounded-3xl border border-border bg-surface-raised p-3 shadow-soft sm:p-6">
            <CalendarGrid year={cursor.year} month={cursor.month} selectedDate={selected} onSelect={handleSelect} />
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-ink-soft">
              <LegendDot color="bg-accent-500" label="Hôm nay" />
              <LegendDot color="bg-emerald-500" label="Ngày chay" />
              <LegendDot color="bg-amber-500" label="Ngày lễ" />
              <span className="text-rose-500 font-semibold">Đỏ = Chủ nhật</span>
            </div>
          </div>
        )}
      </section>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Chi tiết ngày">
        {selected && <VanNienDetail date={selected} />}
      </Sheet>
    </div>
  )
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  )
}
