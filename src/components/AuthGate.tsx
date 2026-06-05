'use client'
import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { loginWithGoogle, loginAdmin, logoutUser } from '@/lib/auth'
import { PARTY } from '@/lib/config'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, admin } = useAuth()
  const [mode, setMode] = useState<'google' | 'admin'>('google')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) {
    return (
      <div className="auth-loading" aria-label="Cargando…">
        <span className="auth-spinner" />
      </div>
    )
  }

  if (user) {
    return (
      <>
        {/* Subtle user badge — top left */}
        <div className="user-badge" title={user.email ?? ''}>
          {user.photoURL
            ? <img src={user.photoURL} alt="" className="user-avatar" referrerPolicy="no-referrer" />
            : <span className="user-initials">{(user.displayName ?? user.email ?? '?')[0].toUpperCase()}</span>
          }
          <span className="user-name">
            {user.displayName?.split(' ')[0] ?? user.email?.split('@')[0]}
          </span>
          {admin && <span className="user-admin-pill">admin</span>}
          <button className="user-logout" onClick={() => logoutUser()} title="Cerrar sesión">×</button>
        </div>
        {children}
      </>
    )
  }

  async function handleGoogle() {
    setBusy(true); setError('')
    try { await loginWithGoogle() }
    catch { setError('No se pudo iniciar sesión con Google.') }
    finally { setBusy(false) }
  }

  async function handleAdmin(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try { await loginAdmin(email, password) }
    catch { setError('Email o contraseña incorrectos.') }
    finally { setBusy(false) }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="auth-eyebrow">Estás invitado/a a celebrar a</p>
        <h1 className="auth-title">{PARTY.name}</h1>
        <p className="auth-sub">Inicia sesión para ver la invitación ✨</p>

        {mode === 'google' ? (
          <>
            <button className="btn-google" onClick={handleGoogle} disabled={busy}>
              <GoogleIcon />
              {busy ? 'Conectando…' : 'Continuar con Google'}
            </button>
            <button className="auth-switch" onClick={() => { setError(''); setMode('admin') }}>
              Acceso administrador
            </button>
          </>
        ) : (
          <form onSubmit={handleAdmin} className="auth-form">
            <input
              type="email" placeholder="Correo" required autoFocus
              value={email} onChange={e => setEmail(e.target.value)}
              className="auth-input"
            />
            <input
              type="password" placeholder="Contraseña" required
              value={password} onChange={e => setPassword(e.target.value)}
              className="auth-input"
            />
            <button type="submit" className="btn-submit" disabled={busy}>
              {busy ? 'Entrando…' : 'Entrar'}
            </button>
            <button type="button" className="auth-switch" onClick={() => { setError(''); setMode('google') }}>
              ← Volver
            </button>
          </form>
        )}

        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
