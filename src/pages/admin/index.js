import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function RedirectHome() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/mySchedules')
  }, [])

  return null
}
