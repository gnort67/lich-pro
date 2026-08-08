import { useEffect, useState } from 'react'

/** Trả về thời gian hiện tại, tự cập nhật mỗi `intervalMs` mili-giây */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
