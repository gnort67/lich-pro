import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, Search } from 'lucide-react'
import Header from '../components/Header'
import Button from '../components/Button'
import VanNienDetail from '../components/VanNienDetail'
import { CardSkeleton } from '../components/Skeleton'
import { useToast } from '../contexts/ToastContext'
import { lunarToSolar } from '../lib/lunar'
import { pad2 } from '../lib/dateUtils'

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const YEARS = Array.from({ length: 61 }, (_, i) => 2000 + i)

export default function VanNienPage() {
  const today = useMemo(() => new Date(), [])
  const [mode, setMode] = useState('solar') // 'solar' | 'lunar'
  const [solar, setSolar] = useState({ d: today.getDate(), m: today.getMonth() + 1, y: today.getFullYear() })
  const [lunar, setLunar] = useState({ d: 1, m: 1, y: today.getFullYear() })
  const [resultDate, setResultDate] = useState(today)
  const [searching, setSearching] = useState(false)
  const { notify } = useToast()

  useEffect(() => {
    setResultDate(today)
  }, [today])

  function handleLookup() {
    setSearching(true)
    setTimeout(() => {
      if (mode === 'solar') {
        const d = new Date(solar.y, solar.m - 1, solar.d)
        if (d.getMonth() !== solar.m - 1) {
          notify('Ngày dương lịch không hợp lệ, vui lòng kiểm tra lại.', { type: 'error', title: 'Lỗi dữ liệu' })
          setSearching(false)
          return
        }
        setResultDate(d)
        notify('Đã quy đổi sang âm lịch thành công.', { type: 'success' })
      } else {
        const [sd, sm, sy] = lunarToSolar(lunar.d, lunar.m, lunar.y, 0)
        if (!sd) {
          notify('Ngày âm lịch không hợp lệ, vui lòng kiểm tra lại.', { type: 'error', title: 'Lỗi dữ liệu' })
          setSearching(false)
          return
        }
        setResultDate(new Date(sy, sm - 1, sd))
        notify('Đã quy đổi sang dương lịch thành công.', { type: 'success' })
      }
      setSearching(false)
    }, 500)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6 sm:pt-8">
      <Header title="Lịch vạn niên" subtitle="Tra cứu &amp; quy đổi ngày" />
      <div className="mt-4 hidden sm:block">
        <h1 className="text-2xl font-extrabold text-ink">Lịch vạn niên</h1>
        <p className="text-sm text-ink-soft">Tra cứu thông tin chi tiết và quy đổi ngày âm - dương lịch.</p>
      </div>

      <section className="mt-4 rounded-2xl border border-border bg-surface-raised p-4 shadow-soft sm:mt-6 sm:p-5">
        <div className="mb-4 flex rounded-xl bg-surface-soft p-1">
          <TabButton active={mode === 'solar'} onClick={() => setMode('solar')}>
            Từ Dương lịch
          </TabButton>
          <TabButton active={mode === 'lunar'} onClick={() => setMode('lunar')}>
            Từ Âm lịch
          </TabButton>
        </div>

        {mode === 'solar' ? (
          <div className="grid grid-cols-3 gap-2.5">
            <Select label="Ngày" value={solar.d} onChange={(v) => setSolar((s) => ({ ...s, d: v }))} options={DAYS} />
            <Select label="Tháng" value={solar.m} onChange={(v) => setSolar((s) => ({ ...s, m: v }))} options={MONTHS} />
            <Select label="Năm" value={solar.y} onChange={(v) => setSolar((s) => ({ ...s, y: v }))} options={YEARS} />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            <Select label="Ngày" value={lunar.d} onChange={(v) => setLunar((s) => ({ ...s, d: v }))} options={DAYS} />
            <Select label="Tháng" value={lunar.m} onChange={(v) => setLunar((s) => ({ ...s, m: v }))} options={MONTHS} />
            <Select label="Năm" value={lunar.y} onChange={(v) => setLunar((s) => ({ ...s, y: v }))} options={YEARS} />
          </div>
        )}

        <Button className="mt-4 w-full" icon={mode === 'solar' ? Search : ArrowLeftRight} loading={searching} onClick={handleLookup}>
          Xem chi tiết vạn niên
        </Button>
      </section>

      <section className="mt-5 sm:mt-6">
        {searching ? <CardSkeleton /> : <VanNienDetail date={resultDate} />}
      </section>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-accent-600 text-white shadow-soft' : 'text-ink-soft hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-ink-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-ring rounded-xl border border-border bg-surface px-2.5 py-2.5 text-sm font-semibold text-ink"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {label === 'Năm' ? o : pad2(o)}
          </option>
        ))}
      </select>
    </label>
  )
}
