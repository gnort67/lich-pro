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

export const COLOR_OPTIONS = [
  { id: 'do', label: 'Đỏ Son', hex: '#B3261E' },
  { id: 'vang', label: 'Vàng Kim', hex: '#C9860F' },
  { id: 'xanh-la', label: 'Xanh Ngọc', hex: '#2C9750' },
  { id: 'xanh-duong', label: 'Xanh Dương', hex: '#226FC2' },
  { id: 'tim', label: 'Tím Huế', hex: '#7638AE' },
  { id: 'hong', label: 'Hồng Đào', hex: '#D23D71' },
  { id: 'cam', label: 'Cam Sen', hex: '#D9670B' },
  { id: 'ngoc-lam', label: 'Ngọc Lam', hex: '#0E8C82' },
  { id: 'cham', label: 'Chàm Tím', hex: '#4C3FC7' },
  { id: 'xam-khoi', label: 'Xám Khói', hex: '#52525E' }
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
  font: 'be-vietnam-pro',
  fontSize: 'vua',
  notificationsEnabled: false,
  notifyLunarDays: true,
  notifyHolidayIds: HOLIDAYS.map((h) => h.id)
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

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.setAttribute('data-color', settings.color)
    const fontValue = FONT_OPTIONS.find((f) => f.id === settings.font)?.value ?? FONT_OPTIONS[0].value
    root.style.setProperty('--font-family', fontValue)
    const scale = FONT_SIZE_OPTIONS.find((s) => s.id === settings.fontSize)?.scale ?? 1
    root.style.setProperty('--font-scale', String(scale))
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      const accent = COLOR_OPTIONS.find((c) => c.id === settings.color)?.hex
      meta.setAttribute('content', isDark ? '#18181B' : accent ?? '#B3261E')
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* ignore quota errors */
    }
  }, [settings, isDark])

  const update = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => setSettings(DEFAULTS), [])

  const value = useMemo(
    () => ({ settings, isDark, update, reset }),
    [settings, isDark, update, reset]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings phải được dùng trong SettingsProvider')
  return ctx
}
