'use client'
import { useEffect, useState } from 'react'
import { GIFTS } from '@/lib/config'
import { claimGift, releaseGift, subscribeGifts, type GiftClaim } from '@/lib/firestore'

export default function GiftsList() {
  const [claims, setClaims] = useState<Record<string, GiftClaim>>({})
  const [claiming, setClaiming] = useState<string | null>(null)
  const [namePrompt, setNamePrompt] = useState<string | null>(null)
  const [inputName, setInputName] = useState('')

  useEffect(() => {
    const unsub = subscribeGifts(setClaims)
    return unsub
  }, [])

  const handleClick = (giftId: string) => {
    if (claims[giftId]?.claimedBy) {
      // release
      releaseGift(giftId)
    } else {
      setNamePrompt(giftId)
      setInputName('')
    }
  }

  const confirmClaim = async () => {
    if (!namePrompt || !inputName.trim()) return
    setClaiming(namePrompt)
    await claimGift(namePrompt, inputName.trim())
    setClaiming(null)
    setNamePrompt(null)
    setInputName('')
  }

  return (
    <>
      <div className="gifts-grid">
        {GIFTS.map(g => {
          const claim = claims[g.id]
          const isClaimed = !!claim?.claimedBy

          return (
            <div
              key={g.id}
              className={`card clickable ${isClaimed ? 'taken' : ''}`}
              onClick={() => handleClick(g.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleClick(g.id)}
              aria-label={`${g.name} — ${isClaimed ? 'tomado por ' + claim.claimedBy : 'disponible'}`}
            >
              <span className="gift-emoji">{g.emoji}</span>
              <div className="gift-name">{g.name}</div>
              <div className="gift-hint">{g.hint}</div>
              <span className={`tag ${isClaimed ? 'claimed' : 'free'}`}>
                {isClaimed ? `✓ ${claim.claimedBy}` : 'Disponible'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Name prompt modal */}
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
            border: '1px solid rgba(180,138,255,0.3)',
            borderRadius: 20,
            padding: '2.5rem',
            width: '100%',
            maxWidth: 380,
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>
              ¿Quién lo lleva?
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              {GIFTS.find(g => g.id === namePrompt)?.name}
            </p>
            <input
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmClaim()}
              placeholder="Tu nombre"
              autoFocus
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setNamePrompt(null)}>Cancelar</button>
              <button
                className="btn"
                onClick={confirmClaim}
                disabled={!inputName.trim() || claiming === namePrompt}
                style={{ flex: 1 }}
              >
                {claiming === namePrompt ? 'Guardando…' : 'Confirmar 🎁'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
