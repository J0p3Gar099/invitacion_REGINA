'use client'
import { useEffect, useRef } from 'react'

/**
 * DiscoSpotlights — animated rotating light beams that sweep across the page,
 * as if cast by the disco ball decorations in the hero. Canvas-based, fixed layer.
 */
export default function DiscoSpotlights() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Each spotlight originates from a disco ball position
    interface Beam {
      // origin as fraction of screen
      ox: number; oy: number
      angle: number       // current angle (radians)
      speed: number       // rad/frame
      length: number      // beam length as fraction of diagonal
      width: number       // cone half-angle in radians
      color: string       // hue for the gradient
      alpha: number       // max opacity
      phase: number       // flicker phase offset
    }

    const diag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)

    const beams: Beam[] = [
      // Top-left disco ball
      { ox: 0, oy: 0, angle: 0.6, speed: 0.004, length: 1.1, width: 0.07, color: '180,210,255', alpha: 0.13, phase: 0 },
      { ox: 0, oy: 0, angle: 1.4, speed: 0.006, length: 0.9, width: 0.05, color: '200,220,255', alpha: 0.10, phase: 1.2 },
      { ox: 0, oy: 0, angle: 0.9, speed: -0.003, length: 1.0, width: 0.06, color: '155,168,184', alpha: 0.08, phase: 2.4 },
      // Bottom-right disco ball
      { ox: 1, oy: 1, angle: 3.8, speed: -0.005, length: 1.0, width: 0.07, color: '180,210,255', alpha: 0.11, phase: 0.7 },
      { ox: 1, oy: 1, angle: 4.5, speed: 0.004, length: 0.85, width: 0.05, color: '220,230,245', alpha: 0.09, phase: 1.9 },
    ]

    let tick = 0
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      beams.forEach(b => {
        b.angle += b.speed
        tick

        // Flicker: sine wave on opacity
        const flicker = 0.7 + 0.3 * Math.sin(tick * 0.04 + b.phase)
        const alpha = b.alpha * flicker

        const ox = b.ox * canvas.width
        const oy = b.oy * canvas.height
        const len = b.length * diag

        // Cone tip at origin, wide end far away
        const ax = b.angle - b.width
        const bAngle = b.angle + b.width

        const x1 = ox + Math.cos(ax) * len
        const y1 = oy + Math.sin(ax) * len
        const x2 = ox + Math.cos(bAngle) * len
        const y2 = oy + Math.sin(bAngle) * len

        // Radial gradient: bright at origin, fades out
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, len)
        grad.addColorStop(0, `rgba(${b.color},${alpha})`)
        grad.addColorStop(0.35, `rgba(${b.color},${alpha * 0.5})`)
        grad.addColorStop(1, `rgba(${b.color},0)`)

        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(x1, y1)
        // Arc across the wide end
        ctx.arc(ox, oy, len, ax, bAngle)
        ctx.lineTo(x2, y2)
        ctx.closePath()

        ctx.fillStyle = grad
        ctx.fill()
      })

      tick++
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,         // above ParticlesBg (z:0) but below content (z:2)
        mixBlendMode: 'screen',
      }}
    />
  )
}
