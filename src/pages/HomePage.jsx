import { useEffect, useMemo, useState } from 'react'
import { RefreshCcw, ChevronRight, UtensilsCrossed, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import VanNienDetail from '../components/VanNienDetail'
import CountdownCard from '../components/CountdownCard'
import Sheet from '../components/Sheet'
import HolidayDetail from '../components/HolidayDetail'
import { CardSkeleton, Skeleton } from '../components/Skeleton'
import Button from '../components/Button'
import { HOLIDAYS } from '../data/holidays'
import { getNextOccurrence, getLunarInfo, WEEKDAYS_SHORT, sameDay, mondayIndex, addDays } from '../lib/dateUtils'
import { useToast } from '../contexts/ToastContext'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selected, setSelected] = useState(null)
  const { notify } = useToast()
  const today = useMemo(() => new Date(), [])
  const { lunarDay: todayLunarDay } = useMemo(() => getLunarInfo(today), [today])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [])

  const upcoming = useMemo(() => {
    return HOLIDAYS.map((h) => ({ holiday: h, next: getNextOccurrence(h, today) }))
      .filter((x) => x.next)
      .sort((a, b) => a.next - b.next)
      .slice(0, 6)
  }, [today])

  const weekStrip = useMemo(() => {
    const start = addDays(today, -mondayIndex(today.getDay()))
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
  }, [today])

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      notify('Đã cập nhật dữ liệu lịch mới nhất.', { type: 'success', title: 'Làm mới thành công' })
    }, 900)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6 sm:pt-8">
      <Header title="Lịch Pro" subtitle="Hôm nay của bạn" />

      <div className="mt-4 hidden items-center justify-between sm:flex">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Xin chào 👋</h1>
          <p className="text-sm text-ink-soft">Đây là thông tin lịch hôm nay dành cho bạn.</p>
        </div>
        <Button variant="secondary" icon={RefreshCcw} loading={refreshing} onClick={handleRefresh}>
          Làm mới
        </Button>
      </div>

      {/* Dải ngày trong tuần (Thứ Hai -> Chủ Nhật) */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar sm:mt-6">
        {weekStrip.map((d, i) => {
          const isToday = sameDay(d, today)
          const { lunarDay } = getLunarInfo(d)
          return (
            <div
              key={d.toISOString()}
              className={`hover-lift flex w-14 shrink-0 flex-col items-center gap-1 rounded-2xl border py-2.5 transition-colors duration-200 ${
                isToday ? 'border-accent-500 bg-accent-600 text-white shadow-soft' : 'border-border bg-surface-raised text-ink'
              }`}
            >
              <span className={`text-[10px] font-semibold uppercase ${isToday ? 'text-white/80' : d.getDay() === 0 ? 'text-rose-500/80' : 'text-ink-faint'}`}>
                {WEEKDAYS_SHORT[i]}
              </span>
              <span className="text-base font-extrabold">{d.getDate()}</span>
              <span className={`text-[9.5px] ${isToday ? 'text-white/70' : 'text-ink-faint'}`}>ÂL {lunarDay}</span>
            </div>
          )
        })}
      </div>

      {/* Thẻ thông tin hôm nay */}
      <section className="mt-5 sm:mt-6">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface-raised p-5 shadow-soft">
            <Skeleton className="mb-3 h-4 w-28" />
            <Skeleton className="mb-2 h-7 w-52" />
            <Skeleton className="h-4 w-36" />
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        ) : (
          <VanNienDetail date={today} />
        )}
      </section>

      {/* Ngày lễ sắp tới */}
      <section className="mt-6 sm:mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink sm:text-lg">Sự kiện sắp tới</h2>
          <Link to="/dem-nguoc" className="focus-ring flex items-center gap-0.5 text-xs font-semibold text-accent-600 dark:text-accent-400">
            Xem tất cả <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-44 shrink-0">
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {upcoming.map(({ holiday, next }) => (
              <CountdownCard key={holiday.id} holiday={holiday} nextDate={next} compact onClick={() => setSelected({ holiday, next })} />
            ))}
          </div>
        )}
      </section>

      {/* Ngày chay trong tháng - dạng thẻ nổi bật, cuộn ngang trên mobile */}
      <section className="mt-6 sm:mt-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
            <UtensilsCrossed size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink sm:text-lg">Ngày chay trong tháng</h2>
            <p className="text-[11px] text-ink-faint">Nhị trai — Mùng Một &amp; Rằm hàng tháng âm lịch</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { day: 1, label: 'Mùng Một', desc: 'Đầu tháng âm lịch' },
            { day: 15, label: 'Rằm', desc: 'Giữa tháng âm lịch' }
          ].map(({ day, label, desc }) => {
            const isTodayChay = day === todayLunarDay
            return (
              <div
                key={day}
                className={`hover-lift flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-6 text-center shadow-soft transition-colors duration-200 ${
                  isTodayChay
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/10 dark:text-emerald-300'
                }`}
              >
                <UtensilsCrossed size={20} className={isTodayChay ? 'text-white/90' : 'opacity-75'} />
                <span className="text-2xl font-extrabold leading-none">{label}</span>
                <span className={`text-[11px] font-medium ${isTodayChay ? 'text-white/80' : 'opacity-70'}`}>{desc}</span>
                {isTodayChay && (
                  <span className="mt-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">Hôm nay</span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Gợi ý bật thông báo */}
      <section className="mt-6 flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-300 dark:bg-accent-50 sm:mt-8">
        <Sparkles size={18} className="shrink-0 text-accent-600 dark:text-accent-300" />
        <p className="text-xs leading-relaxed text-ink-soft">
          Bật <Link to="/cai-dat" className="font-semibold text-accent-700 underline decoration-dotted dark:text-accent-300">thông báo nhắc nhở</Link> trong Cài đặt để không bỏ lỡ ngày chay, ngày rằm và các ngày lễ đặc biệt.
        </p>
      </section>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title="Chi tiết sự kiện">
        {selected && <HolidayDetail holiday={selected.holiday} nextDate={selected.next} />}
      </Sheet>
    </div>
  )
}
