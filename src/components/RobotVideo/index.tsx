'use client'

import { useEffect, useRef } from 'react'
import styles from './RobotVideo.module.css'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

const SENSITIVITY = 0.8

export default function RobotVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let prevX: number | null = null
    let targetTime = 0
    let isSeeking = false

    const onSeeked = () => {
      if (video.readyState < 1) return
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime
      } else {
        isSeeking = false
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (prevX === null) {
        prevX = e.clientX
        return
      }
      const delta = e.clientX - prevX
      prevX = e.clientX
      if (!video.duration) return
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTime = Math.max(0, Math.min(video.duration, targetTime + offset))
      if (!isSeeking) {
        video.currentTime = targetTime
        isSeeking = true
      }
    }

    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className={styles.video}
      src={VIDEO_URL}
      muted
      playsInline
      preload="metadata"
      tabIndex={-1}
      crossOrigin="anonymous"
      aria-hidden="true"
    />
  )
}
