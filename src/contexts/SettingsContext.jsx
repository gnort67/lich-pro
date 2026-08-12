import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { HOLIDAYS } from '../data/holidays'

const SettingsContext = createContext(null)

export const FONT_OPTIONS = [
  { id: 'be-vietnam-pro', label: 'Be Vietnam Pro', value: "'Be Vietnam Pro', sans-serif" },
  { id: 'inter', label: 'Inter', value: "'Inter', sans-serif" },
  { id: 'nunito', label: 'Nunito', value: "'Nunito', sans-serif" },
  { id: 'times-new-roman', label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { id: 'arial', label: 'Arial', value: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }
]

/** 8 màu chủ đề — Hồng Đào luôn có mặt theo yêu cầu. */
export const COLOR_OPTIONS = [
  { id: 'do', label: 'Đỏ Son', hex: '#B3261E' },
  { id: 'vang', label: 'Vàng Kim', hex: '#C9860F' },
  { id: 'xanh-la', label: 'Xanh Ngọc', hex: '#2C9750' },
  { id: 'xanh-duong', label: 'Xanh Dương', hex: '#226FC2' },
  { id: 'tim', label: 'Tím Huế', hex: '#7638AE' },
  { id: 'hong', label: 'Hồng Đào', hex: '#D23D71' },
  { id: 'cam', label: 'Cam Sen', hex: '#D9670B' },
  { id: 'ngoc-lam', label: 'Ngọc Lam', hex: '#0E8C82' }
]

export const FONT_SIZE_OPTIONS = [
  { id: 'nho', label: 'Nhỏ', scale: 0.925 },
  { id: 'vua', label: 'Vừa', scale: 1 },
  { id: 'lon', label: 'Lớn', scale: 1.08 },
  { id: 'rat-lon', label: 'Rất lớn', scale: 1.16 }
]

const DEFAULTS = {
  themeMode: 'system', // 'light' | 'dark' | 'system'
  color: 'do',
  dailyColorRotation: false,
  font: 'be-vietnam-pro',
  fontSize: 'vua',
  glassIntensity: 70,
  notificationsEnabled: false,
  notifyLunarDays: true,
  notifyHolidayIds: HOLIDAYS.map((h) => h.id),
  notifyHour: 8,
  notifyMinute: 0,
  notifyTiming: 'on-day', // 'on-day' | 'before'
  notifyBeforeDays: 1
}

const STORAGE_KEY = 'lich-pro:settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

/** Chọn màu "ngẫu nhiên trong ngày" — cố định trong cùng 1 ngày, đổi khi sang ngày mới. */
export function getDailyColorId(date = new Date()) {
  const dayKey = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate()
  const index = dayKey % COLOR_OPTIONS.length
  return COLOR_OPTIONS[index].id
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const isDark = settings.themeMode === 'dark' || (settings.themeMode === 'system' && systemDark)
  const effectiveColor = settings.dailyColorRotation ? getDailyColorId() : settings.color

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.setAttribute('data-color', effectiveColor)
    const fontValue = FONT_OPTIONS.find((f) => f.id === settings.font)?.value ?? FONT_OPTIONS[0].value
    root.style.setProperty('--font-family', fontValue)
    const scale = FONT_SIZE_OPTIONS.find((s) => s.id === settings.fontSize)?.scale ?? 1
    root.style.setProperty('--font-scale', String(scale))

    // Glassmorphism: cường độ mờ kính điều chỉnh được (0-100%)
    const intensity = Math.min(100, Math.max(0, settings.glassIntensity ?? 70)) / 100
    root.style.setProperty('--glass-blur', `${(intensity * 20).toFixed(1)}px`)
    root.style.setProperty('--glass-bg-opacity', `${(0.35 + intensity * 0.5).toFixed(2)}`)
    root.style.setProperty('--glass-border-opacity', `${(0.4 + intensity * 0.45).toFixed(2)}`)

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      const accent = COLOR_OPTIONS.find((c) => c.id === effectiveColor)?.hex
      meta.setAttribute('content', isDark ? '#18181B' : accent ?? '#B3261E')
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* ignore quota errors */
    }
  }, [settings, isDark, effectiveColor])

  const update = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => setSettings(DEFAULTS), [])

  const value = useMemo(
    () => ({ settings, isDark, effectiveColor, update, reset }),
    [settings, isDark, effectiveColor, update, reset]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings phải được dùng trong SettingsProvider')
  return ctx
}
