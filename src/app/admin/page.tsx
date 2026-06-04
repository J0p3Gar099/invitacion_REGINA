'use client'
import { useEffect, useState } from 'react'
import { subscribeRSVPs, subscribeAllMessages, approveMessage, rejectMessage, type RSVPEntry, type WallMessage } from '@/lib/firestore'
import { loginAdmin, logoutAdmin, onAuthChange } from '@/lib/auth'
import Link from 'next/link'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([])
  const [messages, setMessages] = useState<WallMessage[]>([])
  const [tab, setTab] = useState<'rsvps' | 'messages'>('rsvps')

  useEffect(() => {
    const unsub = onAuthChange(user => { setAuthed(!!user); setLoading(false) })
    return unsub
  }, [])

  useEffect(() => {
    if (!authed) return
    const u1 = subscribeRSVPs(setRsvps)
    const u2 = subscribeAllMessages(setMessages)
    return () => { u1(); u2() }
  }, [authed])

  const tryLogin = async () => {
    if (!email.trim() || !pwd.trim()) return
    setSigningIn(true); setError('')
    try {
      await loginAdmin(email.trim(), pwd)
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code
      setError(code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
        ? 'Email o contraseña incorrectos' : 'Error al iniciar sesión')
    } finally { setSigningIn(false) }
  }

  const attending    = rsvps.filter(r => r.attending)
  const notAttending = rsvps.filter(r => !r.attending)
  const totalGuests  = attending.reduce((s, r) => s + (r.guests ?? 1), 0)
  const pending      = messages.filter(m => !m.approved)
  const approved     = messages.filter(m => m.approved)

  /* ── shared inline tokens (match globals.css vars) ── */
  const navy      = '#091d4a'
  const navyLight = '#1a4090'
  const silver    = '#9ba8b8'
  const bg        = '#f0eeeb'
  const white     = '#ffffff'
  const border    = 'rgba(9,29,74,0.12)'
  const borderNav = 'rgba(9,29,74,0.25)'
  const muted     = 'rgba(9,29,74,0.5)'
  const soft      = 'rgba(9,29,74,0.28)'

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: white,
    border: `1.5px solid ${border}`,
    borderRadius: 10,
    padding: '12px 16px',
    color: navy,
    fontSize: 14,
    outline: 'none',
    marginBottom: 10,
    fontFamily: 'inherit',
  }

  const card: React.CSSProperties = {
    background: white,
    border: `1.5px solid ${border}`,
    borderRadius: 14,
    padding: '1.25rem 1.5rem',
    marginBottom: 10,
    boxShadow: '0 2px 10px rgba(9,29,74,0.05)',
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: soft, fontFamily: 'system-ui', letterSpacing: 3, fontSize: 13, textTransform: 'uppercase' }}>Cargando…</p>
    </div>
  )

  if (!authed) return (
    <div style={{
      minHeight: '100vh', background: bg,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'var(--font-dm), system-ui, sans-serif',
    }}>
      <div style={{
        background: white,
        border: `1.5px solid ${borderNav}`,
        borderRadius: 20, padding: '2.5rem',
        width: '100%', maxWidth: 380,
        textAlign: 'center', color: navy,
        boxShadow: '0 8px 40px rgba(9,29,74,0.1)',
      }}>
        <p style={{ fontSize: 28, marginBottom: 8 }}>⚙️</p>
        <h1 style={{ fontSize: '1.4rem', fontFamily: 'Georgia, serif', fontWeight: 700, marginBottom: 24, color: navy }}>
          Panel de administración
        </h1>
        <input type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && tryLogin()}
          placeholder="Correo electrónico" style={inputStyle} />
        <input type="password" value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && tryLogin()}
          placeholder="Contraseña" style={inputStyle} />
        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 10 }}>{error}</p>}
        <button onClick={tryLogin}
          disabled={signingIn || !email.trim() || !pwd.trim()}
          style={{
            width: '100%', background: navy,
            border: 'none', borderRadius: 10,
            padding: '13px', color: white,
            fontSize: 14, fontWeight: 600,
            cursor: signingIn ? 'not-allowed' : 'pointer',
            opacity: signingIn ? 0.5 : 1,
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(9,29,74,0.2)',
          }}>
          {signingIn ? 'Entrando…' : 'Entrar'}
        </button>
        <Link href="/" style={{ display: 'block', marginTop: 16, fontSize: 12, color: soft, textDecoration: 'none' }}>
          ← Volver a la invitación
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: bg,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      color: navy, fontFamily: 'var(--font-dm), system-ui, sans-serif',
      padding: '2rem 1.5rem',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.8rem', fontWeight: 700, color: navy }}>
            Panel de admin
          </h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={logoutAdmin} style={{
              background: 'transparent', border: `1.5px solid ${borderNav}`,
              borderRadius: 100, padding: '6px 16px', fontSize: 12,
              color: muted, cursor: 'pointer', fontFamily: 'inherit',
            }}>Cerrar sesión</button>
            <Link href="/" style={{ fontSize: 12, color: muted, textDecoration: 'none' }}>← Ver invitación</Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12, marginBottom: '2.5rem' }}>
          {[
            { label: 'Confirmados',        value: attending.length,    color: navyLight },
            { label: 'Total invitados',     value: totalGuests,         color: navy      },
            { label: 'No asisten',          value: notAttending.length, color: silver    },
            { label: 'Mensajes pendientes', value: pending.length,      color: '#c0392b' },
          ].map(s => (
            <div key={s.label} style={{ ...card, marginBottom: 0, textAlign: 'center' }}>
              <p style={{ fontSize: 32, fontWeight: 700, color: s.color, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: soft, marginTop: 6, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
          {(['rsvps', 'messages'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? navy : 'transparent',
              border: `1.5px solid ${tab === t ? navy : borderNav}`,
              borderRadius: 100, padding: '8px 20px', fontSize: 13,
              color: tab === t ? white : muted,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              fontWeight: tab === t ? 600 : 400,
            }}>
              {t === 'rsvps' ? `RSVPs (${rsvps.length})` : `Mensajes (${messages.length})`}
            </button>
          ))}
        </div>

        {/* RSVPs */}
        {tab === 'rsvps' && (
          <>
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: navyLight, marginBottom: '1.25rem', fontWeight: 600 }}>
              Confirmados ({attending.length})
            </p>
            {attending.length === 0 && (
              <p style={{ textAlign: 'center', color: soft, padding: '2rem 0' }}>Aún no hay confirmaciones</p>
            )}
            {attending.map(r => (
              <div key={r.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15, color: navy }}>{r.name}</p>
                    {r.message && <p style={{ fontSize: 13, color: muted, marginTop: 4, fontStyle: 'italic' }}>"{r.message}"</p>}
                  </div>
                  <span style={{ background: navy, color: white, borderRadius: 100, padding: '4px 14px', fontSize: 12, fontWeight: 500 }}>
                    {r.guests} persona{(r.guests ?? 0) > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}

            {notAttending.length > 0 && (
              <>
                <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: silver, margin: '2rem 0 1.25rem', fontWeight: 600 }}>
                  No asisten ({notAttending.length})
                </p>
                {notAttending.map(r => (
                  <div key={r.id} style={{ ...card, opacity: 0.65 }}>
                    <p style={{ fontWeight: 600, fontSize: 15, color: navy }}>{r.name}</p>
                    {r.message && <p style={{ fontSize: 13, color: muted, marginTop: 4, fontStyle: 'italic' }}>"{r.message}"</p>}
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
                <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#c0392b', marginBottom: '1.25rem', fontWeight: 600 }}>
                  Pendientes de revisión ({pending.length})
                </p>
                {pending.map(m => (
                  <div key={m.id} style={{ ...card, borderColor: 'rgba(192,57,43,0.25)' }}>
                    <p style={{ fontSize: 13, color: muted, marginBottom: 6, fontWeight: 500 }}>{m.author}</p>
                    <p style={{ fontStyle: 'italic', fontSize: 15, color: navy }}>"{m.text}"</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button onClick={() => m.id && approveMessage(m.id)} style={{
                        background: navy, border: 'none', color: white,
                        borderRadius: 8, padding: '7px 18px', fontSize: 12,
                        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                      }}>✓ Aprobar</button>
                      <button onClick={() => m.id && rejectMessage(m.id)} style={{
                        background: 'transparent', border: `1.5px solid ${borderNav}`,
                        color: muted, borderRadius: 8, padding: '7px 18px', fontSize: 12,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>✗ Rechazar</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {approved.length > 0 && (
              <>
                <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: navyLight, margin: `${pending.length > 0 ? '2rem' : '0'} 0 1.25rem`, fontWeight: 600 }}>
                  Aprobados en el muro ({approved.length})
                </p>
                {approved.map(m => (
                  <div key={m.id} style={{ ...card, opacity: 0.75 }}>
                    <p style={{ fontSize: 13, color: muted, marginBottom: 4, fontWeight: 500 }}>{m.author}</p>
                    <p style={{ fontStyle: 'italic', fontSize: 14, color: navy }}>"{m.text}"</p>
                  </div>
                ))}
              </>
            )}

            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: soft, padding: '3rem 0' }}>Aún no hay mensajes</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
