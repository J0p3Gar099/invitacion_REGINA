import ParticlesBg from '@/components/ParticlesBg'
import Countdown from '@/components/Countdown'
import DrinksList from '@/components/DrinksList'
import MessageWall from '@/components/MessageWall'
import RSVPForm from '@/components/RSVPForm'
import { PARTY } from '@/lib/config'
import DrinkRoulette from '@/components/DrinkRoulette'
import Link from 'next/link'

// Disco ball SVG component
function DiscoBall({ size = 200, style = {} }: { size?: number; style?: React.CSSProperties }) {
  const tileSize = 12
  const cols = Math.floor(size / tileSize)
  const rows = Math.floor(size / tileSize)
  const tiles = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Calculate if inside circle
      const cx = (c + 0.5) / cols - 0.5
      const cy = (r + 0.5) / rows - 0.5
      if (cx * cx + cy * cy > 0.23) continue

      // Vary brightness for 3D effect
      const brightness = 0.4 + (1 - Math.abs(cx * 1.5)) * (1 - Math.abs(cy * 1.5)) * 0.6
      const shine = (Math.sin(c * 0.9) * Math.cos(r * 0.9) + 1) / 2
      const lightVal = Math.floor((brightness * 0.6 + shine * 0.4) * 220 + 20)
      const blueShift = Math.floor(lightVal * 1.05)
      const color = `rgb(${lightVal},${lightVal},${Math.min(blueShift, 255)})`

      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={c * tileSize + 1}
          y={r * tileSize + 1}
          width={tileSize - 2}
          height={tileSize - 2}
          fill={color}
          rx={1}
        />
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ borderRadius: '50%', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="discoGlow" cx="38%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="60%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ballClip">
          <circle cx={size / 2} cy={size / 2} r={size * 0.48} />
        </clipPath>
      </defs>
      <g clipPath="url(#ballClip)">
        {tiles}
        {/* Shine overlay */}
        <circle cx={size / 2} cy={size / 2} r={size * 0.48} fill="url(#discoGlow)" />
      </g>
    </svg>
  )
}

// Silver metallic star
function MetalStar({ size = 60, style = {} }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#c8d4e0" />
          <stop offset="55%" stopColor="#8898ae" />
          <stop offset="75%" stopColor="#dde8f0" />
          <stop offset="100%" stopColor="#9ba8b8" />
        </linearGradient>
      </defs>
      <path
        d="M50 5 L61 35 L95 35 L68 57 L79 91 L50 70 L21 91 L32 57 L5 35 L39 35 Z"
        fill="url(#starGrad)"
        filter="drop-shadow(0 3px 8px rgba(9,29,74,0.25))"
      />
    </svg>
  )
}

// Metallic balloon number
function BalloonNumber({ n, style = {} }: { n: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 180" width={200} height={180} style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="balloonGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#e8eff7" />
          <stop offset="18%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#9baec0" />
          <stop offset="58%" stopColor="#d0dce8" />
          <stop offset="72%" stopColor="#ffffff" />
          <stop offset="88%" stopColor="#7a92aa" />
          <stop offset="100%" stopColor="#b0c0ce" />
        </linearGradient>
        <filter id="balloonShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(9,29,74,0.18)" />
        </filter>
      </defs>
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="900"
        fontSize="170"
        fill="url(#balloonGrad)"
        filter="url(#balloonShadow)"
      >
        {n}
      </text>
    </svg>
  )
}

export default function Home() {
  const partyDate = new Date(PARTY.date)
  const dateStr = partyDate.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <>
      <ParticlesBg />

      <main className="page">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="hero">
          {/* Disco balls decorations */}
          <div style={{ position: 'absolute', top: -50, left: -60, opacity: 0.8, zIndex: 0 }}>
            <DiscoBall size={240} />
          </div>
          <div style={{ position: 'absolute', bottom: 20, right: -30, opacity: 0.65, zIndex: 0 }}>
            <DiscoBall size={170} />
          </div>

          {/* Metallic stars */}
          <MetalStar size={55} style={{ position: 'absolute', top: '18%', right: '8%', '--dur': '5s', '--delay': '-1s', '--rot': '12deg', animation: 'starFloat 5s ease-in-out infinite -1s' } as React.CSSProperties} />
          <MetalStar size={38} style={{ position: 'absolute', top: '25%', right: '14%', '--dur': '7s', '--delay': '-3s', '--rot': '-8deg', animation: 'starFloat 7s ease-in-out infinite -3s' } as React.CSSProperties} />
          <MetalStar size={42} style={{ position: 'absolute', bottom: '28%', left: '7%', '--dur': '6s', '--delay': '-2s', '--rot': '20deg', animation: 'starFloat 6s ease-in-out infinite -2s' } as React.CSSProperties} />

          {/* Balloon number */}
          <div style={{ position: 'absolute', bottom: '22%', right: '10%', zIndex: 1, opacity: 0.9 }}>
            <BalloonNumber n={PARTY.age} />
          </div>

          <p className="pre-title fade-up">Estás invitado/a a celebrar a</p>
          <h1 className="hero-name display fade-up delay-1">{PARTY.name}</h1>

          <div className="years-badge fade-up delay-2">
            <strong>{PARTY.age}</strong>
            &nbsp;años ✨
          </div>

          <p className="hero-date fade-up delay-3">
            {dateStr} · {PARTY.place}
          </p>

          {/* Dress code badge */}
          <div className="dresscode-badge fade-up delay-4">
            <span>⬛</span> Dress code: Blanco / Negro <span>⬜</span>
          </div>

          <div className="scroll-hint" aria-hidden="true">↓</div>
        </section>

        <hr className="divider" />

        {/* ── Countdown ─────────────────────────────────────────────── */}
        <section className="section" aria-labelledby="cd-title">
          <p className="section-label" id="cd-title">Faltan</p>
          <Countdown />
        </section>

        <hr className="divider" />

        {/* ── Location ──────────────────────────────────────────────── */}
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
        </section>

        <hr className="divider" />

        {/* ── Drinks ────────────────────────────────────────────────── */}
        <section className="section" aria-labelledby="drinks-title">
          <p className="section-label" id="drinks-title">¿Qué llevas de tomar?</p>
          <DrinksList />
        </section>

        <hr className="divider" />

        <section className="section" aria-labelledby="roulette-title">
          <DrinkRoulette />
        </section>

        {/* ── Message Wall ──────────────────────────────────────────── */}
        <section className="wall-section" aria-labelledby="wall-title">
          <MessageWall />
        </section>

        {/* ── RSVP ──────────────────────────────────────────────────── */}
        <section className="rsvp-section" aria-labelledby="rsvp-title">
          <h2 className="rsvp-title display" id="rsvp-title">¿Vas a venir?</h2>
          <p className="rsvp-sub">Confirma tu asistencia antes del {PARTY.rsvpDeadline}</p>
          <RSVPForm />
        </section>

        <footer>
          <p>Hecho con amor para {PARTY.name} · {partyDate.getFullYear()}</p>
        </footer>

      </main>

      {/* Admin link — bottom right corner */}
      <Link href="/admin" className="admin-link" aria-label="Panel de administración">
        ⚙ admin
      </Link>
    </>
  )
}
