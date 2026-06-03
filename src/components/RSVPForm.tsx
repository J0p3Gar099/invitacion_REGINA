'use client'
import { useState } from 'react'
import { submitRSVP } from '@/lib/firestore'
import { PARTY } from '@/lib/config'

export default function RSVPForm() {
  const [name, setName] = useState('')
  const [guests, setGuests] = useState('1')
  const [attending, setAttending] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  const handleSubmit = async () => {
    if (!name.trim()) return
    setStatus('sending')
    await submitRSVP({
      name: name.trim(),
      guests: Number(guests) || 1,
      attending,
      message: message.trim() || undefined,
    })
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="rsvp-form" style={{ textAlign: 'center' }}>
        {attending ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              ¡Nos vemos ahí, {name}!
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Reservamos {guests} lugar{Number(guests) > 1 ? 'es' : ''} para ti.<br />
              Te esperamos el {new Date(PARTY.date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💜</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              ¡Nos harás falta, {name}!
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Ya quedó registrado. ¡La próxima!
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="rsvp-form">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Tu nombre completo"
      />
      {attending && (
        <input
          type="number"
          min="1"
          max="6"
          value={guests}
          onChange={e => setGuests(e.target.value)}
          placeholder="¿Cuántos van? (1, 2, 3…)"
        />
      )}
      <div className="rsvp-btns">
        <button
          className={`btn-ghost ${attending ? 'active' : ''}`}
          onClick={() => setAttending(true)}
        >
          ✓ Ahí estaré
        </button>
        <button
          className={`btn-ghost ${!attending ? 'active' : ''}`}
          onClick={() => setAttending(false)}
        >
          ✗ No puedo ir
        </button>
      </div>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Mensaje opcional para la cumpleañera… 💬"
        style={{ minHeight: 70 }}
      />
      <button
        className="btn"
        onClick={handleSubmit}
        disabled={!name.trim() || status === 'sending'}
      >
        {status === 'sending' ? 'Guardando…' : 'Confirmar asistencia →'}
      </button>
      <p style={{ fontSize: 12, color: 'var(--text-soft)', textAlign: 'center' }}>
        Confirma antes del {PARTY.rsvpDeadline}
      </p>
    </div>
  )
}
