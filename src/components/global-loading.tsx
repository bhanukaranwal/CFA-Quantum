'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Listen for route changes
    const originalPush = router.push
    const originalReplace = router.replace

    router.push = (...args) => {
      handleStart()
      return originalPush.apply(router, args).finally(handleComplete)
    }

    router.replace = (...args) => {
      handleStart()
      return originalReplace.apply(router, args).finally(handleComplete)
    }

    return () => {
      router.push = originalPush
      router.replace = originalReplace
    }
  }, [router])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-cfa-blue relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-cfa-gold animate-pulse" />
      </div>
    </div>
  )
}
