'use client'
import { useEffect, useState, useRef } from 'react'
import { PARTY } from '@/lib/config'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function getTimeLeft(): TimeLeft {
  const target = new Date(PARTY.date).getTime()
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  }
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  const prevRef = useRef(display)
  const [flipping, setFlipping] = useState(false)
  const [showNext, setShowNext] = useState(display)

  useEffect(() => {
    if (prevRef.current !== display) {
      setFlipping(true)
      const t = setTimeout(() => {
        setShowNext(display)
        setFlipping(false)
        prevRef.current = display
      }, 250)
      return () => clearTimeout(t)
    }
  }, [display])

  return (
    <div className="cd-block">
      <span
        className="cd-num"
        style={{
          display: 'block',
          transition: flipping ? 'transform 0.25s ease-in, opacity 0.25s ease-in' : 'none',
          transform: flipping ? 'translateY(-8px) scaleY(0.6)' : 'translateY(0) scaleY(1)',
          opacity: flipping ? 0 : 1,
        }}
      >
        {showNext}
      </span>
      <span className="cd-label">{label}</span>
    </div>
  )
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) {
    return (
      <div className="countdown">
        {['días', 'horas', 'minutos', 'segundos'].map(l => (
          <div key={l} className="cd-block">
            <span className="cd-num">--</span>
            <span className="cd-label">{l}</span>
          </div>
        ))}
      </div>
    )
  }

  if (time.expired) {
    return (
      <p style={{ textAlign: 'center', fontSize: '2rem', fontFamily: 'var(--font-display)' }}>
        🎉 ¡Es hoy!
      </p>
    )
  }

  const blocks = [
    { num: time.days, label: 'días' },
    { num: time.hours, label: 'horas' },
    { num: time.minutes, label: 'minutos' },
    { num: time.seconds, label: 'segundos' },
  ]

  return (
    <div className="countdown" role="timer" aria-label="Tiempo para la fiesta">
      {blocks.map(b => (
        <FlipDigit key={b.label} value={b.num} label={b.label} />
      ))}
    </div>
  )
}
