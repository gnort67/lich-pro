import { Sun, Moon, Clock3, Sparkle, UtensilsCrossed, Rabbit } from 'lucide-react'
import { canChiDay, canChiMonth, canChiYear, chiAnimalYear, gioHoangDao, lunarMonthName } from '../lib/lunar'
import { getLunarInfo, formatVNDate } from '../lib/dateUtils'
import { NGAY_CHAY_THAP_TRAI } from '../data/holidays'

export default function VanNienDetail({ date }) {
  const { lunarDay, lunarMonth, lunarYear, isLeap } = getLunarInfo(date)
  const canChiN = canChiDay(date.getDate(), date.getMonth() + 1, date.getFullYear())
  const canChiT = canChiMonth(lunarMonth, lunarYear)
  const canChiY = canChiYear(lunarYear)
  const convat = chiAnimalYear(lunarYear)
  const gioTot = gioHoangDao(date.getDate(), date.getMonth() + 1, date.getFullYear())
  const isChay = NGAY_CHAY_THAP_TRAI.includes(lunarDay)
  const isRam = lunarDay === 15
  const isMungMot = lunarDay === 1

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 p-5 text-white shadow-card">
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">Dương lịch</p>
        <p className="mt-0.5 text-lg font-bold leading-tight">{formatVNDate(date)}</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">Âm lịch</p>
            <p className="text-2xl font-extrabold leading-tight">
              {lunarDay} {isLeap ? '(nhuận) ' : ''}Tháng {lunarMonthName(lunarMonth)}
            </p>
            <p className="text-sm text-white/80">Năm {canChiY} ({lunarYear})</p>
          </div>
          <Moon size={40} className="text-white/25" fill="currentColor" strokeWidth={0} />
        </div>
        {(isRam || isMungMot || isChay) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {isMungMot && (
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">Ngày Mùng Một</span>
            )}
            {isRam && <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">Ngày Rằm</span>}
            {isChay && (
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                <UtensilsCrossed size={11} /> Ngày Chay
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <InfoTile icon={Sun} label="Ngày (Can Chi)" value={canChiN} />
        <InfoTile icon={Sparkle} label="Tháng (Can Chi)" value={canChiT} />
        <InfoTile icon={Rabbit} label="Con giáp năm" value={convat} />
      </div>

      <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-soft">
        <div className="mb-2.5 flex items-center gap-2 text-accent-600 dark:text-accent-400">
          <Clock3 size={16} />
          <p className="text-sm font-semibold">Giờ hoàng đạo</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {gioTot.map((g) => (
            <span
              key={g}
              className="rounded-lg bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-200 dark:text-accent-300"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-3 text-center shadow-soft">
      <Icon size={16} className="mx-auto mb-1.5 text-accent-500" />
      <p className="text-[10px] uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
    </div>
  )
}
