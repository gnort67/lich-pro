import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import CountdownCard from '../components/CountdownCard'
import Sheet from '../components/Sheet'
import HolidayDetail from '../components/HolidayDetail'
import { ListSkeleton } from '../components/Skeleton'
import { HOLIDAYS, CATEGORY_LABEL } from '../data/holidays'
import { getNextOccurrence } from '../lib/dateUtils'

const FILTERS = [{ id: 'all', label: 'Tất cả' }, ...Object.entries(CATEGORY_LABEL).map(([id, label]) => ({ id, label }))]

export default function CountdownPage() {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const today = useMemo(() => new Date(), [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const items = useMemo(() => {
    return HOLIDAYS.map((h) => ({ holiday: h, next: getNextOccurrence(h, today) }))
      .filter((x) => x.next && (filter === 'all' || x.holiday.category === filter))
      .sort((a, b) => a.next - b.next)
  }, [today, filter])

  return (
    <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6 sm:pt-8">
      <Header title="Đếm ngược sự kiện" subtitle="Ngày lễ nổi bật Việt Nam" />
      <div className="mt-4 hidden sm:block">
        <h1 className="text-2xl font-extrabold text-ink">Đếm ngược sự kiện</h1>
        <p className="text-sm text-ink-soft">Theo dõi thời gian còn lại đến các ngày lễ, kỷ niệm nổi bật. Chạm vào một thẻ để xem chi tiết.</p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar sm:mt-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`focus-ring shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.id
                ? 'border-accent-600 bg-accent-600 text-white'
                : 'border-border bg-surface-raised text-ink-soft hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="mt-4 sm:mt-6">
        {loading ? (
          <ListSkeleton rows={5} />
        ) : items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-ink-faint">
            Không có sự kiện nào trong danh mục này.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map(({ holiday, next }) => (
              <CountdownCard key={holiday.id} holiday={holiday} nextDate={next} onClick={() => setSelected({ holiday, next })} />
            ))}
          </div>
        )}
      </section>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title="Chi tiết sự kiện">
        {selected && <HolidayDetail holiday={selected.holiday} nextDate={selected.next} />}
      </Sheet>
    </div>
  )
}
