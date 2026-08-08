import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { useSettings } from '../contexts/SettingsContext'
import { useReminders } from '../hooks/useReminders'

export default function Layout() {
  const location = useLocation()
  const { settings } = useSettings()
  useReminders(settings.notificationsEnabled, {
    notifyLunarDays: settings.notifyLunarDays,
    notifyHolidayIds: settings.notifyHolidayIds
  })

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 pb-24 sm:pb-10">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
