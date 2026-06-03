import ParticlesBg from '@/components/ParticlesBg'
import Countdown from '@/components/Countdown'
import GiftsList from '@/components/GiftsList'
import DrinksList from '@/components/DrinksList'
import MessageWall from '@/components/MessageWall'
import RSVPForm from '@/components/RSVPForm'
import { PARTY } from '@/lib/config'
import DrinkRoulette from '@/components/DrinkRoulette'

import Link from 'next/link'

export default function Home() {
  const partyDate = new Date(PARTY.date)
  const dateStr = partyDate.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <>
      <ParticlesBg />

      <main className="page">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="hero">
          <div className="glow-orb" aria-hidden="true" />

          <p className="pre-title fade-up">Estás invitado/a a celebrar a</p>
          <h1 className="hero-name display fade-up delay-1">{PARTY.name}</h1>

          <div className="years-badge fade-up delay-2">
            <strong>{PARTY.age}</strong>
            &nbsp;años de pura magia ✨
          </div>

          <p className="hero-date fade-up delay-3">
            {dateStr} · {PARTY.place}
          </p>

          <div className="scroll-hint" aria-hidden="true">↓</div>
        </section>

        <hr className="divider" />

        {/* ── Countdown ─────────────────────────────────── */}
        <section className="section" aria-labelledby="cd-title">
          <p className="section-label" id="cd-title">Faltan</p>
          <Countdown />
        </section>

        <hr className="divider" />

        {/* ── Location ──────────────────────────────────── */}
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

        {/* ── Gifts ─────────────────────────────────────── */}
        <section className="section" aria-labelledby="gifts-title">
          <p className="section-label" id="gifts-title">Mesa de regalos</p>
          <GiftsList />
        </section>

        <hr className="divider" />

        {/* ── Drinks ────────────────────────────────────── */}
        <section className="section" aria-labelledby="drinks-title">
          <p className="section-label" id="drinks-title">¿Qué llevas de tomar?</p>
          <DrinksList />
        </section>
        <hr className="divider" />

<section className="section" aria-labelledby="roulette-title">
  <DrinkRoulette />
</section>

        {/* ── Message Wall ──────────────────────────────── */}
        <section className="wall-section" aria-labelledby="wall-title">
          <MessageWall />
        </section>

        {/* ── RSVP ──────────────────────────────────────── */}
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
