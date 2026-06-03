'use client'
import { useEffect, useState } from 'react'
import { subscribeRSVPs, subscribeAllMessages, approveMessage, rejectMessage, type RSVPEntry, type WallMessage } from '@/lib/firestore'
import Link from 'next/link'

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'fiesta2025'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')

  const [rsvps, setRsvps] = useState<RSVPEntry[]>([])
  const [messages, setMessages] = useState<WallMessage[]>([])
  const [tab, setTab] = useState<'rsvps' | 'messages'>('rsvps')

  useEffect(() => {
    if (!authed) return
    const u1 = subscribeRSVPs(setRsvps)
    const u2 = subscribeAllMessages(setMessages)
    return () => { u1(); u2() }
  }, [authed])

  const tryLogin = () => {
    if (pwd === ADMIN_PASS) { setAuthed(true); setError('') }
    else setError('Contraseña incorrecta')
  }

  const attending = rsvps.filter(r => r.attending)
  const notAttending = rsvps.filter(r => !r.attending)
  const totalGuests = attending.reduce((s, r) => s + (r.guests ?? 1), 0)
  const pending = messages.filter(m => !m.approved)
  const approved = messages.filter(m => m.approved)

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0512',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-dm), system-ui, sans-serif',
      }}>
        <div style={{
          background: 'rgba(180,138,255,0.07)',
          border: '1px solid rgba(180,138,255,0.25)',
          borderRadius: 20,
          padding: '2.5rem',
          width: '100%',
          maxWidth: 380,
          textAlign: 'center',
          color: '#f0e8ff',
        }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>⚙️</p>
          <h1 style={{ fontSize: '1.4rem', fontFamily: 'Georgia, serif', fontWeight: 400, marginBottom: 24 }}>
            Panel de administración
          </h1>
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && tryLogin()}
            placeholder="Contraseña"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#f0e8ff',
              fontSize: 14,
              outline: 'none',
              marginBottom: 10,
              fontFamily: 'inherit',
            }}
          />
          {error && <p style={{ color: '#ff85c2', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <button
            onClick={tryLogin}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #b48aff, #ff85c2)',
              border: 'none',
              borderRadius: 10,
              padding: '13px',
              color: 'white',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Entrar
          </button>
          <Link href="/" style={{ display: 'block', marginTop: 16, fontSize: 12, color: 'rgba(240,232,255,0.3)', textDecoration: 'none' }}>
            ← Volver a la invitación
          </Link>
        </div>
      </div>
    )
  }

  const S: React.CSSProperties = {
    minHeight: '100vh',
    background: '#0a0512',
    color: '#f0e8ff',
    fontFamily: 'var(--font-dm), system-ui, sans-serif',
    padding: '2rem 1.5rem',
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '1.25rem 1.5rem',
    marginBottom: 10,
  }

  return (
    <div style={S}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.8rem', fontWeight: 400 }}>
            Panel de admin
          </h1>
          <Link href="/" style={{ fontSize: 12, color: 'rgba(240,232,255,0.4)', textDecoration: 'none' }}>
            ← Ver invitación
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: '2.5rem' }}>
          {[
            { label: 'Confirmados', value: attending.length, color: '#78e0a4' },
            { label: 'Total invitados', value: totalGuests, color: '#b48aff' },
            { label: 'No asisten', value: notAttending.length, color: '#ff85c2' },
            { label: 'Mensajes pendientes', value: pending.length, color: '#ffd580' },
          ].map(s => (
            <div key={s.label} style={{ ...card, marginBottom: 0, textAlign: 'center' }}>
              <p style={{ fontSize: 30, fontWeight: 700, color: s.color, fontFamily: 'Georgia, serif' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'rgba(240,232,255,0.45)', marginTop: 4, letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
          {(['rsvps', 'messages'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? 'rgba(180,138,255,0.15)' : 'transparent',
                border: `1px solid ${tab === t ? 'rgba(180,138,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 100,
                padding: '8px 20px',
                fontSize: 13,
                color: tab === t ? '#d4b8ff' : 'rgba(240,232,255,0.45)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {t === 'rsvps' ? `RSVPs (${rsvps.length})` : `Mensajes (${messages.length})`}
            </button>
          ))}
        </div>

        {/* RSVPs */}
        {tab === 'rsvps' && (
          <>
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#b48aff', marginBottom: '1.25rem' }}>
              Confirmados ({attending.length})
            </p>
            {attending.map(r => (
              <div key={r.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 15 }}>{r.name}</p>
                    {r.message && <p style={{ fontSize: 13, color: 'rgba(240,232,255,0.5)', marginTop: 4, fontStyle: 'italic' }}>"{r.message}"</p>}
                  </div>
                  <span style={{ background: 'rgba(120,224,164,0.15)', color: '#78e0a4', borderRadius: 100, padding: '4px 12px', fontSize: 12 }}>
                    {r.guests} persona{(r.guests ?? 0) > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}

            {notAttending.length > 0 && (
              <>
                <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#ff85c2', margin: '2rem 0 1.25rem' }}>
                  No asisten ({notAttending.length})
                </p>
                {notAttending.map(r => (
                  <div key={r.id} style={{ ...card, opacity: 0.65 }}>
                    <p style={{ fontWeight: 500, fontSize: 15 }}>{r.name}</p>
                    {r.message && <p style={{ fontSize: 13, color: 'rgba(240,232,255,0.5)', marginTop: 4, fontStyle: 'italic' }}>"{r.message}"</p>}
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* Messages */}
        {tab === 'messages' && (
          <>
            {pending.length > 0 && (
              <>
                <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#ffd580', marginBottom: '1.25rem' }}>
                  Pendientes de revisión ({pending.length})
                </p>
                {pending.map(m => (
                  <div key={m.id} style={{ ...card, borderColor: 'rgba(255,213,128,0.25)' }}>
                    <p style={{ fontSize: 13, color: 'rgba(240,232,255,0.55)', marginBottom: 6 }}>{m.author}</p>
                    <p style={{ fontStyle: 'italic', fontSize: 15 }}>"{m.text}"</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => m.id && approveMessage(m.id)}
                        style={{ background: 'rgba(120,224,164,0.15)', border: '1px solid rgba(120,224,164,0.3)', color: '#78e0a4', borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        ✓ Aprobar
                      </button>
                      <button
                        onClick={() => m.id && rejectMessage(m.id)}
                        style={{ background: 'rgba(255,133,194,0.1)', border: '1px solid rgba(255,133,194,0.25)', color: '#ff85c2', borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        ✗ Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {approved.length > 0 && (
              <>
                <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#78e0a4', margin: `${pending.length > 0 ? '2rem' : '0'} 0 1.25rem` }}>
                  Aprobados en el muro ({approved.length})
                </p>
                {approved.map(m => (
                  <div key={m.id} style={{ ...card, opacity: 0.7 }}>
                    <p style={{ fontSize: 13, color: 'rgba(240,232,255,0.45)', marginBottom: 4 }}>{m.author}</p>
                    <p style={{ fontStyle: 'italic', fontSize: 14 }}>"{m.text}"</p>
                  </div>
                ))}
              </>
            )}

            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(240,232,255,0.3)', padding: '3rem 0' }}>
                Aún no hay mensajes
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
