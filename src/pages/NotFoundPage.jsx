import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Button from '../components/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 text-accent-600 dark:bg-accent-200 dark:text-accent-300">
        <Compass size={28} />
      </div>
      <h1 className="text-xl font-extrabold text-ink">Không tìm thấy trang</h1>
      <p className="mt-1.5 max-w-xs text-sm text-ink-soft">Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>
      <Link to="/" className="mt-5">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  )
}
