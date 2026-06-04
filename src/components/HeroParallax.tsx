'use client'
import { useEffect } from 'react'

/**
 * Parallax for hero deco elements.
 * Uses CSS custom properties so it composes cleanly with CSS float animations.
 * The deco elements use: transform: translateY(var(--px, 0px))
 */
export default function HeroParallax() {
  useEffect(() => {
    const layers: { sel: string; speed: number }[] = [
      { sel: '.deco-ball--tl', speed: -0.18 },
      { sel: '.deco-ball--br', speed: -0.10 },
      { sel: '.deco-num',      speed: -0.22 },
      { sel: '.deco-star--tr1',speed: -0.14 },
      { sel: '.deco-star--tr2',speed: -0.08 },
      { sel: '.deco-star--bl', speed: -0.12 },
    ]

    let ticking = false
    let lastY = 0

    const tick = () => {
      layers.forEach(({ sel, speed }) => {
        const el = document.querySelector<HTMLElement>(sel)
        if (el) el.style.setProperty('--px', `${lastY * speed}px`)
      })
      ticking = false
    }

    const onScroll = () => {
      lastY = window.scrollY
      if (!ticking) { requestAnimationFrame(tick); ticking = true }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
