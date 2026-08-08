import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import VanNienPage from './pages/VanNienPage'
import CountdownPage from './pages/CountdownPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lich" element={<CalendarPage />} />
        <Route path="/van-nien" element={<VanNienPage />} />
        <Route path="/dem-nguoc" element={<CountdownPage />} />
        <Route path="/cai-dat" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
