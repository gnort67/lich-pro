import * as Icons from 'lucide-react'
import { Sun, Moon, Clock3, Sparkle, UtensilsCrossed, Rabbit, PartyPopper } from 'lucide-react'
import { canChiDay, canChiMonth, canChiYear, chiAnimalYear, gioHoangDao, lunarMonthName } from '../lib/lunar'
import { getLunarInfo, formatVNDate } from '../lib/dateUtils'
import { NGAY_CHAY_NHI_TRAI, getHolidaysOnDate, CATEGORY_LABEL, CATEGORY_COLOR } from '../data/holidays'

export default function VanNienDetail({ date }) {
  const lunarInfo = getLunarInfo(date)
  const { lunarDay, lunarMonth, lunarYear, isLeap } = lunarInfo
  const canChiN = canChiDay(date.getDate(), date.getMonth() + 1, date.getFullYear())
  const canChiT = canChiMonth(lunarMonth, lunarYear)
  const canChiY = canChiYear(lunarYear)
  const convat = chiAnimalYear(lunarYear)
  const gioTot = gioHoangDao(date.getDate(), date.getMonth() + 1, date.getFullYear())
  const isChay = NGAY_CHAY_NHI_TRAI.includes(lunarDay)
  const isRam = lunarDay === 15
  const isMungMot = lunarDay === 1
  const holidaysToday = getHolidaysOnDate(date, lunarInfo)

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

      {/* Ngày chay — làm nổi bật để dễ nhận biết */}
      {isChay && (
        <div className="animate-fade-in flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 shadow-soft dark:border-emerald-700/60 dark:bg-emerald-500/15">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <UtensilsCrossed size={19} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {isMungMot ? 'Ngày Chay — Mùng Một' : 'Ngày Chay — Ngày Rằm'}
            </p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">Ngày ăn chay truyền thống theo Nhị trai.</p>
          </div>
        </div>
      )}

      {/* Ngày lễ — làm nổi bật để dễ nhận biết */}
      {holidaysToday.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {holidaysToday.map((h) => {
            const Icon = Icons[h.icon] ?? PartyPopper
            return (
              <div
                key={h.id}
                className="animate-fade-in flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-soft dark:border-amber-700/60 dark:bg-amber-500/15"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Icon size={19} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{h.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLOR[h.category]}`}>
                      {CATEGORY_LABEL[h.category]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-400/80">{h.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
    <div className="hover-lift rounded-2xl border border-border bg-surface-raised p-3 text-center shadow-soft">
      <Icon size={16} className="mx-auto mb-1.5 text-accent-500" />
      <p className="text-[10px] uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-ink">{value}</p>
    </div>
  )
}
