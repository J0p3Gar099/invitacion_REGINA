'use client'
import { useState, useEffect } from 'react'
import { submitRSVP, deleteRSVP, getRSVPByEmail, type RSVPEntry } from '@/lib/firestore'
import { PARTY } from '@/lib/config'
import { useAuth } from './AuthProvider'

export default function RSVPForm() {
  const { user } = useAuth()
  const [existing, setExisting] = useState<RSVPEntry | null | 'loading'>('loading')
  const [name, setName] = useState('')
  const [guests, setGuests] = useState('1')
  const [attending, setAttending] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'deleting'>('idle')
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Buscar si el usuario ya tiene RSVP
  useEffect(() => {
    if (!user?.email) { setExisting(null); return }
    getRSVPByEmail(user.email).then(r => setExisting(r))
  }, [user])

  const handleSubmit = async () => {
    if (!name.trim()) return
    setStatus('sending')
    await submitRSVP({
      name: name.trim(),
      guests: Number(guests) || 1,
      attending,
      message: message.trim() || undefined,
      email: user?.email ?? undefined,
    })
    setStatus('done')
  }

  const handleDelete = async () => {
    if (!existing || existing === 'loading' || !existing.id) return
    setStatus('deleting')
    await deleteRSVP(existing.id)
    setExisting(null)
    setStatus('idle')
    setConfirmDelete(false)
    // Resetear el form para que puedan volver a registrarse
    setName('')
    setGuests('1')
    setAttending(true)
    setMessage('')
  }

  const soft = 'var(--text-soft, rgba(9,29,74,0.45))'
  const navy = 'var(--navy, #091d4a)'
  const partyDate = new Date(PARTY.date)

  // ── Cargando ─────────────────────────────────────────────
  if (existing === 'loading') {
    return (
      <div className="rsvp-form" style={{ textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ color: soft, fontSize: 14 }}>Cargando…</p>
      </div>
    )
  }

  // ── Ya está registrado ────────────────────────────────────
  if (existing) {
    return (
      <div className="rsvp-form" style={{ textAlign: 'center' }}>
        {existing.attending ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              ¡Ahí estarás, {existing.name}!
            </p>
            <p style={{ color: soft, fontSize: 14, marginBottom: '0.5rem' }}>
              Lugares reservados: <strong>{existing.guests ?? 1}</strong><br />
              Te esperamos el {partyDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💜</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Nos harás falta, {existing.name}
            </p>
            <p style={{ color: soft, fontSize: 14, marginBottom: '0.5rem' }}>
              Registrado como no asistente.
            </p>
          </>
        )}

        {/* Botón de eliminar */}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              marginTop: '1.2rem',
              background: 'transparent',
              border: '1.5px solid rgba(9,29,74,0.2)',
              borderRadius: 10, padding: '8px 18px',
              fontSize: 13, color: soft,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Cancelar registro
          </button>
        ) : (
          <div style={{ marginTop: '1.2rem' }}>
            <p style={{ fontSize: 13, color: soft, marginBottom: 10 }}>
              ¿Seguro? Podrás registrarte de nuevo después.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                onClick={handleDelete}
                disabled={status === 'deleting'}
                style={{
                  background: '#c0392b', color: '#fff',
                  border: 'none', borderRadius: 10,
                  padding: '8px 18px', fontSize: 13,
                  cursor: status === 'deleting' ? 'not-allowed' : 'pointer',
                  opacity: status === 'deleting' ? 0.6 : 1,
                  fontFamily: 'inherit',
                }}
              >
                {status === 'deleting' ? 'Eliminando…' : 'Sí, cancelar'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  background: 'transparent',
                  border: '1.5px solid rgba(9,29,74,0.2)',
                  borderRadius: 10, padding: '8px 18px',
                  fontSize: 13, color: soft,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                No, quedarme
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Recién enviado en esta sesión ─────────────────────────
  if (status === 'done') {
    return (
      <div className="rsvp-form" style={{ textAlign: 'center' }}>
        {attending ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              ¡Nos vemos ahí, {name}!
            </p>
            <p style={{ color: soft, fontSize: 14 }}>
              Reservamos {guests} lugar{Number(guests) > 1 ? 'es' : ''} para ti.<br />
              Te esperamos el {partyDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💜</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              ¡Nos harás falta, {name}!
            </p>
            <p style={{ color: soft, fontSize: 14 }}>
              Ya quedó registrado. ¡La próxima!
            </p>
          </>
        )}
      </div>
    )
  }

  // ── Formulario normal ─────────────────────────────────────
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
      <p style={{ fontSize: 12, color: soft, textAlign: 'center' }}>
        Confirma antes del {PARTY.rsvpDeadline}
      </p>
    </div>
  )
}
