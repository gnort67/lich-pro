import { useCallback, useEffect, useState } from 'react'
import { HOLIDAYS, NGAY_CHAY_THAP_TRAI } from '../data/holidays'
import { getLunarInfo, getNextOccurrence, sameDay, startOfDay, addDays, formatShortDate } from '../lib/dateUtils'

const LAST_NOTIFIED_KEY = 'lich-pro:last-notified-date'

export function getNotificationSupport() {
  return typeof window !== 'undefined' && 'Notification' in window
}

/**
 * Kiểm tra hôm nay/ngày mai có sự kiện đặc biệt gì cần nhắc hay không, có lọc
 * theo tuỳ chọn của người dùng (notifyLunarDays, notifyHolidayIds).
 */
export function getTodayReminders(from = new Date(), prefs = {}) {
  const notifyLunarDays = prefs.notifyLunarDays ?? true
  const notifyHolidayIds = prefs.notifyHolidayIds ?? HOLIDAYS.map((h) => h.id)

  const today = startOfDay(from)
  const tomorrow = addDays(today, 1)
  const messages = []

  if (notifyLunarDays) {
    const { lunarDay } = getLunarInfo(today)
    if (lunarDay === 1) messages.push({ title: 'Hôm nay là Mùng Một âm lịch', body: 'Ngày đầu tháng âm lịch, thời điểm tốt để khởi đầu mọi việc.' })
    else if (lunarDay === 15) messages.push({ title: 'Hôm nay là Ngày Rằm', body: 'Rằm âm lịch — ngày lễ Phật quan trọng trong tháng.' })
    else if (NGAY_CHAY_THAP_TRAI.includes(lunarDay)) {
      messages.push({ title: 'Hôm nay là Ngày Chay', body: 'Một trong mười ngày chay (Thập trai) theo truyền thống Phật giáo.' })
    }
  }

  for (const h of HOLIDAYS) {
    if (!notifyHolidayIds.includes(h.id)) continue
    const next = getNextOccurrence(h, today)
    if (next && sameDay(next, today)) {
      messages.push({ title: `Hôm nay: ${h.name}`, body: h.desc })
    } else if (next && sameDay(next, tomorrow)) {
      messages.push({ title: `Ngày mai: ${h.name}`, body: `Diễn ra vào ${formatShortDate(next)}. ${h.desc}` })
    }
  }

  return messages
}

/** Trạng thái quyền thông báo trình duyệt + hàm yêu cầu quyền. Dùng ở bất kỳ đâu (vd. trang Cài đặt). */
export function useNotificationPermission() {
  const [permission, setPermission] = useState(() => (getNotificationSupport() ? Notification.permission : 'unsupported'))

  const requestPermission = useCallback(async () => {
    if (!getNotificationSupport()) return 'unsupported'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  return { permission, requestPermission, supported: getNotificationSupport() }
}

/** Bộ đếm nền: kiểm tra định kỳ và bắn thông báo trình duyệt (chỉ nên mount 1 lần, ở Layout gốc). */
export function useReminders(enabled, prefs = {}) {
  const notifyLunarDays = prefs.notifyLunarDays ?? true
  const notifyHolidayIds = prefs.notifyHolidayIds ?? HOLIDAYS.map((h) => h.id)
  const holidayIdsKey = notifyHolidayIds.join(',')

  const checkAndNotify = useCallback(() => {
    if (!enabled || !getNotificationSupport() || Notification.permission !== 'granted') return
    const todayKey = startOfDay(new Date()).toISOString().slice(0, 10)
    const lastNotified = localStorage.getItem(LAST_NOTIFIED_KEY)
    if (lastNotified === todayKey) return

    const reminders = getTodayReminders(new Date(), { notifyLunarDays, notifyHolidayIds })
    if (reminders.length > 0) {
      reminders.slice(0, 3).forEach((r, idx) => {
        setTimeout(() => {
          try {
            new Notification(r.title, { body: r.body, icon: '/icons/icon-192.png', tag: `lich-pro-${todayKey}-${idx}` })
          } catch {
            /* trình duyệt có thể chặn tạo Notification trực tiếp trên một số nền tảng di động */
          }
        }, idx * 400)
      })
    }
    localStorage.setItem(LAST_NOTIFIED_KEY, todayKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, notifyLunarDays, holidayIdsKey])

  useEffect(() => {
    checkAndNotify()
    const id = setInterval(checkAndNotify, 60 * 1000)
    return () => clearInterval(id)
  }, [checkAndNotify])
}
