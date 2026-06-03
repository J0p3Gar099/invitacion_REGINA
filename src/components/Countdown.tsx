'use client'
import { useEffect, useState } from 'react'
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

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const labels = ['días', 'horas', 'minutos', 'segundos']

  if (!time) {
    return (
      <div className="countdown">
        {labels.map(l => (
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
        <div key={b.label} className="cd-block">
          <span className="cd-num">{String(b.num).padStart(2, '0')}</span>
          <span className="cd-label">{b.label}</span>
        </div>
      ))}
    </div>
  )
}