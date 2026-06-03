'use client'
import { useState, useRef } from 'react'
import { DRINKS } from '@/lib/config'

export default function DrinkRoulette() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<typeof DRINKS[0] | null>(null)
  const [rotation, setRotation] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const spinRef = useRef(0)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setShowResult(false)
    setResult(null)

    const extraSpins = 5 + Math.floor(Math.random() * 5) // 5-10 vueltas completas
    const randomIndex = Math.floor(Math.random() * DRINKS.length)
    const segmentAngle = 360 / DRINKS.length
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2)
    const totalRotation = spinRef.current + (extraSpins * 360) + targetAngle - (spinRef.current % 360)

    spinRef.current = totalRotation
    setRotation(totalRotation)

    setTimeout(() => {
      setResult(DRINKS[randomIndex])
      setShowResult(true)
      setSpinning(false)
    }, 3500)
  }

  const size = 280
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 8
  const n = DRINKS.length
  const colors = ['#b48aff', '#ff85c2', '#78e0a4', '#ffd580', '#85cbff', '#f0a8ff']

  const slices = DRINKS.map((drink, i) => {
    const startAngle = (i / n) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const midAngle = (startAngle + endAngle) / 2
    const tx = cx + (r * 0.65) * Math.cos(midAngle)
    const ty = cy + (r * 0.65) * Math.sin(midAngle)
    const largeArc = 1 / n > 0.5 ? 1 : 0

    return { drink, x1, y1, x2, y2, tx, ty, midAngle, largeArc, color: colors[i % colors.length] }
  })

  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
      <p className="section-label">Ruleta de bebidas</p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '2rem' }}>
        ¿No sabes qué llevar? Gira y el universo decide 🌀
      </p>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          fontSize: 24,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}>▼</div>

        {/* Wheel */}
        <svg
          width={size}
          height={size}
          style={{
            borderRadius: '50%',
            boxShadow: '0 0 40px rgba(180,138,255,0.2), 0 0 0 3px rgba(180,138,255,0.3)',
            transition: `transform ${spinning ? '3.5s cubic-bezier(0.17, 0.67, 0.12, 1.0)' : '0s'}`,
            transform: `rotate(${rotation}deg)`,
            display: 'block',
          }}
        >
          {slices.map(({ drink, x1, y1, x2, y2, tx, ty, largeArc, color }, i) => (
            <g key={drink.id}>
              <path
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={color}
                opacity={0.85}
                stroke="rgba(10,5,18,0.4)"
                strokeWidth={1.5}
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={18}
                style={{ userSelect: 'none' }}
              >
                {drink.emoji}
              </text>
            </g>
          ))}
          {/* Center circle */}
          <circle cx={cx} cy={cy} r={22} fill="#0a0512" stroke="rgba(180,138,255,0.4)" strokeWidth={2} />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={14}>✨</text>
        </svg>
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <button
          onClick={spin}
          disabled={spinning}
          className="btn"
          style={{ fontSize: 15, padding: '14px 36px', opacity: spinning ? 0.6 : 1 }}
        >
          {spinning ? 'Girando…' : '¡Girar! 🎰'}
        </button>
      </div>

      {showResult && result && (
        <div style={{
          marginTop: '1.5rem',
          background: 'rgba(180,138,255,0.08)',
          border: '1px solid rgba(180,138,255,0.3)',
          borderRadius: 16,
          padding: '1.5rem',
          maxWidth: 300,
          margin: '1.5rem auto 0',
          animation: 'fadeUp 0.4s ease both',
        }}>
          <p style={{ fontSize: 36, marginBottom: 8 }}>{result.emoji}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 4 }}>
            {result.name}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{result.desc}</p>
          <p style={{ fontSize: 12, color: 'var(--purple)', marginTop: 10 }}>
            ¡El universo habló! 🌌
          </p>
        </div>
      )}
    </div>
  )
}
