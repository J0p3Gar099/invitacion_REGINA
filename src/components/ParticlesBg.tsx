'use client'
import { useEffect, useRef } from 'react'

export default function ParticlesBg() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Disco light flickers
    const colors = [
      'rgba(180,210,255,0.4)',
      'rgba(200,220,255,0.3)',
      'rgba(155,168,184,0.35)',
      'rgba(220,230,245,0.4)',
      'rgba(10,30,110,0.08)',
    ]

    for (let i = 0; i < 18; i++) {
      const d = document.createElement('div')
      d.className = 'disco-flicker'
      const size = 60 + Math.random() * 140
      d.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        width:${size}px; height:${size}px;
        background: radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%);
        --dur:${2 + Math.random() * 5}s;
        --delay:-${Math.random() * 6}s;
      `
      container.appendChild(d)
    }

    // Sparkle star SVG elements
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('div')
      s.className = 'sparkle'
      const size = 8 + Math.random() * 14
      const opacity = 0.3 + Math.random() * 0.5
      s.style.cssText = `
        left:${5 + Math.random() * 90}%;
        top:${5 + Math.random() * 90}%;
        width:${size}px; height:${size}px;
        --dur:${3 + Math.random() * 5}s;
        --delay:-${Math.random() * 6}s;
      `
      s.innerHTML = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="opacity:${opacity}">
        <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" fill="#9ba8b8"/>
      </svg>`
      container.appendChild(s)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
      aria-hidden="true"
    />
  )
}
