'use client'
import { useEffect, useRef } from 'react'

export default function ParticlesBg() {
  const starsRef = useRef<HTMLDivElement>(null)
  const confRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Stars
    const stars = starsRef.current
    if (stars) {
      for (let i = 0; i < 130; i++) {
        const s = document.createElement('div')
        s.className = 'star'
        const size = Math.random() * 2.5 + 0.5
        s.style.cssText = `
          left:${Math.random() * 100}%;
          top:${Math.random() * 100}%;
          width:${size}px; height:${size}px;
          --dur:${2 + Math.random() * 4}s;
          --delay:-${Math.random() * 5}s;
          --parallax-speed:${0.02 + Math.random() * 0.08};
        `
        stars.appendChild(s)
      }
    }

    // Confetti
    const conf = confRef.current
    if (conf) {
      const colors = ['#b48aff', '#ff85c2', '#78e0a4', '#ffd580', '#85cbff', '#f0a8ff']
      for (let i = 0; i < 35; i++) {
        const c = document.createElement('div')
        c.className = 'confetti-piece'
        const isCircle = Math.random() > 0.5
        const drift = (Math.random() - 0.5) * 120
        c.style.cssText = `
          left:${Math.random() * 100}%;
          top:-10px;
          background:${colors[Math.floor(Math.random() * colors.length)]};
          border-radius:${isCircle ? '50%' : '2px'};
          width:${6 + Math.random() * 6}px;
          height:${6 + Math.random() * 6}px;
          --dur:${4 + Math.random() * 5}s;
          --delay:-${Math.random() * 8}s;
          --drift:${drift}px;
        `
        conf.appendChild(c)
      }
    }

    // Parallax on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      const starEls = starsRef.current?.querySelectorAll<HTMLElement>('.star')
      starEls?.forEach(star => {
        const speed = parseFloat(star.style.getPropertyValue('--parallax-speed') || '0.05')
        star.style.transform = `translateY(${scrollY * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="stars-bg" ref={starsRef} aria-hidden="true" />
      <div ref={confRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} aria-hidden="true" />
    </>
  )
}
