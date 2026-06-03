'use client'
import { useEffect, useState } from 'react'
import { DRINKS } from '@/lib/config'
import { voteDrink, subscribeDrinks } from '@/lib/firestore'

export default function DrinksList() {
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [voted, setVoted] = useState<string | null>(null)
  const [namePrompt, setNamePrompt] = useState<string | null>(null)
  const [inputName, setInputName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsub = subscribeDrinks(setVotes)
    return unsub
  }, [])

  const handleVote = (drinkId: string) => {
    if (voted) return
    setNamePrompt(drinkId)
    setInputName('')
  }

  const confirmVote = async () => {
    if (!namePrompt || !inputName.trim()) return
    setSaving(true)
    await voteDrink(namePrompt, inputName.trim())
    setVoted(namePrompt)
    setSaving(false)
    setNamePrompt(null)
    setInputName('')
  }

  return (
    <>
      <div className="drinks-grid">
        {DRINKS.map(d => {
          const count = votes[d.id] ?? 0
          const isVoted = voted === d.id

          return (
            <div
              key={d.id}
              className={`card clickable ${isVoted ? 'voted' : ''}`}
              style={{ textAlign: 'center', opacity: voted && !isVoted ? 0.55 : 1 }}
              onClick={() => handleVote(d.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleVote(d.id)}
              aria-label={`${d.name}, ${count} personas llevan`}
            >
              <span className="drink-emoji">{d.emoji}</span>
              <div className="drink-name">{d.name}</div>
              <div className="drink-desc">{d.desc}</div>
              <div className="drink-votes">◆ {count} llevan</div>
            </div>
          )
        })}
      </div>

      {voted && (
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 14, color: 'var(--text-muted)' }}>
          ¡Gracias! Ya anotamos que llevas {DRINKS.find(d => d.id === voted)?.name} 🥂
        </p>
      )}

      {namePrompt && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(10,5,18,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
          onClick={e => e.target === e.currentTarget && setNamePrompt(null)}
        >
          <div style={{
            background: '#130c24',
            border: '1px solid rgba(255,133,194,0.3)',
            borderRadius: 20,
            padding: '2.5rem',
            width: '100%',
            maxWidth: 380,
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>
              ¿Tú quién eres?
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Llevas {DRINKS.find(d => d.id === namePrompt)?.name} {DRINKS.find(d => d.id === namePrompt)?.emoji}
            </p>
            <input
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmVote()}
              placeholder="Tu nombre"
              autoFocus
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setNamePrompt(null)}>Cancelar</button>
              <button
                className="btn"
                onClick={confirmVote}
                disabled={!inputName.trim() || saving}
                style={{ flex: 1 }}
              >
                {saving ? 'Guardando…' : '¡Lo llevo! 🎉'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
