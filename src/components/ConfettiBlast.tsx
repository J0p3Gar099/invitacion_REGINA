'use client'
import { useEffect } from 'react'

/**
 * ConfettiBlast — fires a burst of metallic confetti on mount.
 * Pure canvas, no external deps. Silver/navy/white palette to match the party theme.
 */
export default function ConfettiBlast() {
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Metallic palette matching the invitation's navy/silver theme
    const COLORS = [
      '#c8d4e0', '#dde8f4', '#ffffff',
      '#9ba8b8', '#0f2d6e', '#1a4090',
      '#b8c4d0', '#e8eff7', '#7a92aa',
    ]

    // Shapes: rect (classic), strip (long thin), dot
    type Shape = 'rect' | 'strip' | 'dot'

    interface Piece {
      x: number; y: number
      vx: number; vy: number
      angle: number; spin: number
      color: string
      shape: Shape
      w: number; h: number
      opacity: number
      gravity: number
      wobble: number; wobbleSpeed: number
    }

    const pieces: Piece[] = []
    const SHAPES: Shape[] = ['rect', 'rect', 'strip', 'dot']
    const COUNT = 160

    const createPiece = (): Piece => {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      const isStrip = shape === 'strip'
      return {
        x: canvas.width * 0.5 + (Math.random() - 0.5) * canvas.width * 0.6,
        y: -10,
        vx: (Math.random() - 0.5) * 6,
        vy: -(4 + Math.random() * 6),    // shoot upward first
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape,
        w: isStrip ? 2 + Math.random() * 2 : 6 + Math.random() * 8,
        h: isStrip ? 12 + Math.random() * 14 : 6 + Math.random() * 8,
        opacity: 0.85 + Math.random() * 0.15,
        gravity: 0.12 + Math.random() * 0.08,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.06,
      }
    }

    for (let i = 0; i < COUNT; i++) {
      const p = createPiece()
      // Stagger launch across first 0.8s
      p.y = -10 - Math.random() * 200
      pieces.push(p)
    }

    let frame = 0
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false

      pieces.forEach(p => {
        p.wobble += p.wobbleSpeed
        p.vy += p.gravity
        p.vx += Math.sin(p.wobble) * 0.04
        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin

        // Fade out as pieces fall off screen bottom
        if (p.y > canvas.height * 0.75) {
          p.opacity = Math.max(0, p.opacity - 0.012)
        }

        if (p.y < canvas.height + 40 && p.opacity > 0) alive = true

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        ctx.fillStyle = p.color

        // Add a metallic sheen via gradient
        if (p.shape !== 'dot') {
          const grad = ctx.createLinearGradient(-p.w / 2, -p.h / 2, p.w / 2, p.h / 2)
          grad.addColorStop(0, p.color)
          grad.addColorStop(0.45, '#ffffff')
          grad.addColorStop(1, p.color)
          ctx.fillStyle = grad
        }

        if (p.shape === 'dot') {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 1)
          ctx.fill()
        }

        ctx.restore()
      })

      frame++
      if (alive || frame < 120) {
        raf = requestAnimationFrame(draw)
      } else {
        canvas.remove()
      }
    }

    // Short delay so page renders first, then confetti pops
    const t = setTimeout(() => { raf = requestAnimationFrame(draw) }, 300)

    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
      canvas.remove()
    }
  }, [])

  return null
}
