'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function RouteFocusManager() {
  const pathname = usePathname()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>('main h1')
      if (!target) return
      target.tabIndex = -1
      target.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
