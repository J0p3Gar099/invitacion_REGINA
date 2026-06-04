'use client'
import { useEffect, useRef } from 'react'

export default function ParticlesBg() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Disco light blobs (soft radial gradients, parallax on scroll) ──
    const colors = [
      'rgba(180,210,255,0.35)',
      'rgba(200,220,255,0.28)',
      'rgba(155,168,184,0.30)',
      'rgba(220,230,245,0.35)',
      'rgba(10,30,110,0.06)',
    ]

    const blobs: HTMLDivElement[] = []

    for (let i = 0; i < 14; i++) {
      const d = document.createElement('div')
      const size = 80 + Math.random() * 160
      const speed = 0.04 + Math.random() * 0.14   // parallax speed per blob
      const topPct = Math.random() * 120           // spread beyond 100vh too

      d.style.cssText = `
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${topPct}%;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%);
        animation: discoFlicker ${2 + Math.random() * 5}s ease-in-out infinite ${-Math.random() * 6}s;
        will-change: transform;
      `
      d.dataset.speed = String(speed)
      container.appendChild(d)
      blobs.push(d)
    }

    // ── Tiny sparkle crosses scattered around ──
    const sparkles: HTMLDivElement[] = []
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('div')
      const size = 10 + Math.random() * 16
      const speed = 0.02 + Math.random() * 0.08
      const topPct = Math.random() * 130

      s.style.cssText = `
        position: absolute;
        pointer-events: none;
        left: ${5 + Math.random() * 90}%;
        top: ${topPct}%;
        width: ${size}px;
        height: ${size}px;
        will-change: transform;
        animation: sparklePop ${3 + Math.random() * 5}s ease-in-out infinite ${-Math.random() * 6}s;
      `
      s.dataset.speed = String(speed)
      s.innerHTML = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="opacity:${0.2 + Math.random() * 0.4}; display:block;">
        <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" fill="#9ba8b8"/>
      </svg>`
      container.appendChild(s)
      sparkles.push(s)
    }

    // ── Smooth parallax on scroll using requestAnimationFrame ──
    let ticking = false
    let lastY = window.scrollY

    const onScroll = () => {
      lastY = window.scrollY
      if (!ticking) {
        requestAnimationFrame(() => {
          blobs.forEach(el => {
            const speed = parseFloat(el.dataset.speed ?? '0.06')
            el.style.transform = `translateY(${lastY * speed}px)`
          })
          sparkles.forEach(el => {
            const speed = parseFloat(el.dataset.speed ?? '0.04')
            el.style.transform = `translateY(${lastY * speed}px)`
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  )
}
