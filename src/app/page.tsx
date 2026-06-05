'use client'
import ParticlesBg from '@/components/ParticlesBg'
import HeroParallax from '@/components/HeroParallax'
import ConfettiBlast from '@/components/ConfettiBlast'
import DiscoSpotlights from '@/components/DiscoSpotlights'
import Countdown from '@/components/Countdown'
import Trivia from '@/components/Trivia'
import MessageWall from '@/components/MessageWall'
import RSVPForm from '@/components/RSVPForm'
import { PARTY } from '@/lib/config'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

// Disco ball SVG — tileSize adapts to size
function DiscoBall({ size = 200, style = {} }: { size?: number; style?: React.CSSProperties }) {
  const tileSize = Math.max(8, Math.floor(size / 18))
  const cols = Math.floor(size / tileSize)
  const rows = Math.floor(size / tileSize)
  const tiles = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) / cols - 0.5
      const cy = (r + 0.5) / rows - 0.5
      if (cx * cx + cy * cy > 0.23) continue
      const brightness = 0.4 + (1 - Math.abs(cx * 1.5)) * (1 - Math.abs(cy * 1.5)) * 0.6
      const shine = (Math.sin(c * 0.9) * Math.cos(r * 0.9) + 1) / 2
      const lightVal = Math.floor((brightness * 0.6 + shine * 0.4) * 220 + 20)
      const blueShift = Math.floor(lightVal * 1.05)
      tiles.push(
        <rect key={`${r}-${c}`} x={c * tileSize + 1} y={r * tileSize + 1}
          width={tileSize - 2} height={tileSize - 2}
          fill={`rgb(${lightVal},${lightVal},${Math.min(blueShift, 255)})`} rx={1} />
      )
    }
  }

  const uid = `ball-${size}`
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}
      style={{ borderRadius: '50%', display: 'block', ...style }}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`glow-${uid}`} cx="38%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="60%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${uid}`}>
          <circle cx={size / 2} cy={size / 2} r={size * 0.48} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${uid})`}>
        {tiles}
        <circle cx={size / 2} cy={size / 2} r={size * 0.48} fill={`url(#glow-${uid})`} />
      </g>
    </svg>
  )
}

function MetalStar({ size = 60, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', ...style }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#c8d4e0" />
          <stop offset="55%" stopColor="#8898ae" />
          <stop offset="75%" stopColor="#dde8f0" />
          <stop offset="100%" stopColor="#9ba8b8" />
        </linearGradient>
      </defs>
      <path d="M50 5 L61 35 L95 35 L68 57 L79 91 L50 70 L21 91 L32 57 L5 35 L39 35 Z"
        fill="url(#starGrad)" filter="drop-shadow(0 3px 8px rgba(9,29,74,0.22))" />
    </svg>
  )
}

function BalloonNumber({ n, style = {} }: { n: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 220 190" width="100%" height="100%"
      style={{ display: 'block', ...style }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ballGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#e8eff7" />
          <stop offset="18%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#9baec0" />
          <stop offset="58%" stopColor="#d0dce8" />
          <stop offset="72%" stopColor="#ffffff" />
          <stop offset="88%" stopColor="#7a92aa" />
          <stop offset="100%" stopColor="#b0c0ce" />
        </linearGradient>
        <filter id="ballShadow">
          <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="rgba(9,29,74,0.16)" />
        </filter>
      </defs>
      <text x="110" y="158" textAnchor="middle" fontFamily="Georgia, serif"
        fontWeight="900" fontSize="170"
        fill="url(#ballGrad)" filter="url(#ballShadow)">{n}</text>
    </svg>
  )
}

export default function Home() {
  const { admin } = useAuth()
  const partyDate = new Date(PARTY.date)
  const dateStr = partyDate.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <>
      <ParticlesBg />
      <HeroParallax />
      <ConfettiBlast />
      <DiscoSpotlights />

      <main className="page">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="hero">

          {/* Disco ball top-left — clipped to edge */}
          <div className="deco-ball deco-ball--tl" aria-hidden="true">
            <DiscoBall size={240} />
          </div>

          {/* Disco ball bottom-right */}
          <div className="deco-ball deco-ball--br" aria-hidden="true">
            <DiscoBall size={160} />
          </div>

          {/* Metallic stars — hidden on very small screens via CSS */}
          <div className="deco-star deco-star--tr1" aria-hidden="true">
            <MetalStar size={52} />
          </div>
          <div className="deco-star deco-star--tr2" aria-hidden="true">
            <MetalStar size={36} />
          </div>
          <div className="deco-star deco-star--bl" aria-hidden="true">
            <MetalStar size={40} />
          </div>

          {/* Balloon number — bottom right, contained */}
          <div className="deco-num" aria-hidden="true">
            <BalloonNumber n={PARTY.age} />
          </div>

          {/* Content */}
          <p className="pre-title fade-up">Estás invitado/a a celebrar a</p>
          <h1 className="hero-name display fade-up delay-1">{PARTY.name}</h1>

          <div className="years-badge fade-up delay-2">
            <strong>{PARTY.age}</strong>
            &nbsp;años ✨
          </div>

          <p className="hero-date fade-up delay-3">
            {dateStr} · {PARTY.place}
          </p>

          <div className="dresscode-badge fade-up delay-4">
            <span>⬛</span> Dress code: Blanco / Negro <span>⬜</span>
          </div>

          <div className="scroll-hint" aria-hidden="true">↓</div>
        </section>

        <hr className="divider" />

        {/* ── Countdown ────────────────────────────────────────── */}
        <section className="section" aria-labelledby="cd-title">
          <p className="section-label" id="cd-title">Faltan</p>
          <Countdown />
        </section>

        <hr className="divider" />

        {/* ── Location ─────────────────────────────────────────── */}
        <section className="section" aria-labelledby="loc-title">
          <p className="section-label" id="loc-title">El lugar de la fiesta</p>
          <div className="card location-card" style={{ cursor: 'default' }}>
            <div className="location-pin" aria-hidden="true">📍</div>
            <div className="location-info">
              <h3>{PARTY.place}</h3>
              <p>{PARTY.address}</p>
              <span className="pill">{PARTY.time}</span>
            </div>
          </div>

          {/* Map embed */}
          <div style={{
            width: '100%', borderRadius: '1rem', overflow: 'hidden',
            marginTop: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.8368300093066!2d-99.23483230000001!3d19.505654699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d2030023b3ea07%3A0x39327d3cd2aa9fb0!2sMezontle%20Sat%C3%A9lite!5e0!3m2!1ses-419!2smx!4v1780680276388!5m2!1ses-419!2smx"
              width="100%"
              height="280"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de la fiesta"
            />
          </div>

          {/* Link to open in Google Maps */}
          <a
            href="https://maps.app.goo.gl/2D3VyiduaZjdFiHfA"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', marginTop: '0.75rem',
              fontSize: '0.85rem', color: 'var(--accent)',
              textDecoration: 'none', opacity: 0.85
            }}
          >
            📍 Abrir en Google Maps →
          </a>
        </section>

        <hr className="divider" />

        {/* ── Trivia ───────────────────────────────────────────── */}
        <section className="section" aria-labelledby="trivia-title">
          <p className="section-label" id="trivia-title">¿Cuánto sabes de la fiesta?</p>
          <Trivia />
        </section>

        {/* ── Message Wall ─────────────────────────────────────── */}
        <section className="wall-section" aria-labelledby="wall-title">
          <MessageWall />
        </section>

        {/* ── RSVP ─────────────────────────────────────────────── */}
        <section className="rsvp-section" aria-labelledby="rsvp-title">
          <h2 className="rsvp-title display" id="rsvp-title">¿Vas a venir?</h2>
          <p className="rsvp-sub">Confirma tu asistencia antes del {PARTY.rsvpDeadline}</p>
          <RSVPForm />
        </section>

        <footer>
          <p>Hecho con amor para {PARTY.name} · {partyDate.getFullYear()}</p>
        </footer>

      </main>

      {admin && (
        <Link href="/admin" className="admin-link" aria-label="Panel de administración">
          ⚙ admin
        </Link>
      )}
    </>
  )
}
