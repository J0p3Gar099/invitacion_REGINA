'use client'
import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import {
  getTriviaResult, saveTriviaProgress, subscribeLeaderboard,
  saveCheer, saveNoteSent, submitNote as firestoreSubmitNote,
  type TriviaResult
} from '@/lib/firestore'

const QUESTIONS = [
  {
    q: '¿Cuántos ligues tuvo Regina que no llegaron a absolutamente nada?',
    opts: ['2', '5', '8', 'Perdió la cuenta y nosotros también 😍'],
    correct: 3,
  },
  {
    q: '¿Qué frase representa mejor su historial amoroso?',
    opts: ['"La tercera es la vencida."', '"No era el momento."', '"Casi algo FC."', '"Siguiente participante."'],
    correct: 3,
  },
  {
    q: '¿Qué frase describe mejor su forma de ver la vida?',
    opts: ['"Todo pasa por algo."', '"Ay x, si el problema tiene solución para qué te estresas y si no tiene, también para qué te estresas."', '"Pos ya que."', '"Wey fluye como el agua."'],
    correct: 2,
  },
  {
    q: '¿Qué valora más Regina en una amistad?',
    opts: ['Diversión', 'Lealtad', 'Honestidad', 'Respeto'],
    correct: 1,
  },
  {
    q: 'Si Regina fuera una estación del año, ¿cuál sería?',
    opts: ['Primavera 🌸', 'Verano ☀️', 'Otoño 🍂', 'Invierno ❄️'],
    correct: 2,
  },
  {
    q: '¿Qué ha durado más?',
    opts: ['Una serie que empezó', 'Una dieta', 'Un ligue', 'Su paciencia'],
    correct: 0,
  },
  {
    q: '¿Qué describe mejor a Regina?',
    opts: ['Organizada pero caótica', 'Fuerte pero sensible', 'Social pero selectiva', 'Todas las anteriores'],
    correct: 3,
  },
]

const MEDAL = ['🥇', '🥈', '🥉']

// ─── Colores ──────────────────────────────────────────────────
const navy  = '#091d4a'
const soft  = 'rgba(9,29,74,0.45)'
const border = 'rgba(9,29,74,0.12)'
const cardBg = 'rgba(255,255,255,0.72)'
const green  = '#22863a'
const red    = '#c0392b'
const gold   = '#b8860b'

export default function Trivia() {
  const { user } = useAuth()
  const [mode, setMode] = useState<'lobby' | 'playing' | 'done'>('lobby')
  const [result, setResult] = useState<TriviaResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [leaderboard, setLeaderboard] = useState<TriviaResult[]>([])

  // juego
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [answered, setAnswered] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // nota anónima
  const [note, setNote] = useState('')
  const [noteSent, setNoteSent] = useState(false)

  // mensaje de ánimo
  const [cheer, setCheer] = useState('')
  const [cheerSaved, setCheerSaved] = useState(false)

  const total = QUESTIONS.length

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getTriviaResult(user.uid).then(r => {
      if (r) {
        setResult(r)
        if (r.cheer) { setCheer(r.cheer); setCheerSaved(true) }
        if (r.noteSent) { setNoteSent(true) }
        if (!r.completed) {
          setAnswers(r.answers)
          setAnswered(r.answeredIndices)
          setScore(r.score)
          const next = QUESTIONS.findIndex((_, i) => !r.answeredIndices.includes(i))
          setCurrentIdx(next === -1 ? 0 : next)
        }
      }
      setLoading(false)
    })
  }, [user])

  useEffect(() => {
    const unsub = subscribeLeaderboard(setLeaderboard)
    return unsub
  }, [])

  // ── Contestar ────────────────────────────────────────────────
  const handleAnswer = async (optIdx: number) => {
    if (!user || showFeedback) return
    setSelected(optIdx)
    setShowFeedback(true)

    const isCorrect = optIdx === QUESTIONS[currentIdx].correct
    const newScore = isCorrect ? score + 1 : score
    const newAnswers = { ...answers, [currentIdx]: optIdx }
    const newAnswered = [...answered, currentIdx]
    const isLast = newAnswered.length === total

    setScore(newScore)
    setAnswers(newAnswers)
    setAnswered(newAnswered)

    setSaving(true)
    await saveTriviaProgress(user.uid, {
      userId: user.uid,
      displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Invitado',
      score: newScore,
      total,
      answeredIndices: newAnswered,
      answers: newAnswers,
      completed: isLast,
    })
    setSaving(false)

    setTimeout(() => {
      setShowFeedback(false)
      setSelected(null)
      if (isLast) {
        setMode('done')
      } else {
        const next = QUESTIONS.findIndex((_, i) => !newAnswered.includes(i))
        setCurrentIdx(next)
      }
    }, 1200)
  }

  // ── Mensaje de ánimo ─────────────────────────────────────────
  const handleCheer = async () => {
    if (!user || !cheer.trim() || cheerSaved) return
    await saveCheer(user.uid, cheer.trim())
    setCheerSaved(true)
  }

  // ── Nota anónima ─────────────────────────────────────────────
  const submitNote = async () => {
    if (!note.trim()) return
    await firestoreSubmitNote(note.trim())
    if (user) await saveNoteSent(user.uid)
    setNoteSent(true)
  }

  // ── Guards ───────────────────────────────────────────────────
  if (!user) return (
    <p style={{ textAlign: 'center', color: soft, fontSize: 14, padding: '1rem 0' }}>
      Inicia sesión para participar en la trivia.
    </p>
  )
  if (loading) return (
    <p style={{ textAlign: 'center', color: soft, fontSize: 14, padding: '1rem 0' }}>Cargando…</p>
  )

  const question = QUESTIONS[currentIdx]

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>

      {/* ════════════ LOBBY ════════════ */}
      {mode === 'lobby' && (
        <div style={{ textAlign: 'center' }}>

          {/* Tarjeta principal */}
          <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: 18, padding: '1.8rem', marginBottom: '1.2rem', backdropFilter: 'blur(8px)' }}>
            {result?.completed ? (
              <>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: navy, marginBottom: 4 }}>
                  ¡Ya jugaste!
                </p>
                <p style={{ color: soft, fontSize: 14 }}>
                  Tu puntuación: <strong style={{ color: navy }}>{result.score}/{result.total}</strong>
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🧠</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: navy, marginBottom: 4 }}>
                  {answered.length > 0
                    ? `Continúas en la pregunta ${answered.length + 1} de ${total}`
                    : `${total} preguntas sobre Regina`}
                </p>
                <p style={{ color: soft, fontSize: 13, marginBottom: '1.2rem' }}>
                  Solo puedes contestar una vez. ¡Sin trampa!
                </p>
                <button onClick={() => setMode('playing')} style={btnStyle}>
                  {answered.length > 0 ? '▶ Continuar trivia' : '▶ Hacer trivia'}
                </button>
              </>
            )}
          </div>

          {/* Leaderboard + mensaje de ánimo */}
          <LeaderboardPanel
            leaderboard={leaderboard}
            currentUid={user.uid}
            cheer={cheer}
            setCheer={setCheer}
            cheerSaved={cheerSaved}
            onCheer={handleCheer}
            hasResult={!!result}
          />

          {/* Nota anónima (solo si ya completó) */}
          {result?.completed && (
            <NotePanel note={note} setNote={setNote} noteSent={noteSent} onSubmit={submitNote} />
          )}
        </div>
      )}

      {/* ════════════ PLAYING ════════════ */}
      {mode === 'playing' && (
        <div>
          {/* Barra de progreso */}
          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: soft, marginBottom: 6 }}>
              <span>Pregunta {answered.length + 1} de {total}</span>
              <span>✓ {score} correctas</span>
            </div>
            <div style={{ background: border, borderRadius: 99, height: 5, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99, background: navy,
                width: `${(answered.length / total) * 100}%`,
                transition: 'width .4s ease',
              }} />
            </div>
          </div>

          {/* Pregunta */}
          <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: 18, padding: '1.6rem', backdropFilter: 'blur(8px)' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: navy, marginBottom: '1.2rem', lineHeight: 1.55 }}>
              {question.q}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.opts.map((opt, i) => {
                let bg2 = 'rgba(9,29,74,0.04)'
                let b2 = border
                let col = navy
                if (showFeedback) {
                  if (i === question.correct) { bg2 = 'rgba(34,134,58,0.12)'; b2 = green; col = green }
                  else if (i === selected) { bg2 = 'rgba(192,57,43,0.09)'; b2 = red; col = red }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)}
                    disabled={showFeedback || saving}
                    style={{
                      background: bg2, border: `1.5px solid ${b2}`,
                      borderRadius: 12, padding: '12px 16px',
                      textAlign: 'left', fontSize: 14, color: col,
                      cursor: showFeedback ? 'default' : 'pointer',
                      fontFamily: 'inherit', transition: 'all .15s',
                      fontWeight: i === question.correct && showFeedback ? 600 : 400,
                    }}>
                    <span style={{ marginRight: 8, opacity: .45 }}>{['A', 'B', 'C', 'D'][i]}.</span>
                    {opt}
                    {showFeedback && i === question.correct && ' ✓'}
                    {showFeedback && i === selected && i !== question.correct && ' ✗'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════ DONE ════════════ */}
      {mode === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: 18, padding: '2rem', backdropFilter: 'blur(8px)', marginBottom: '1.2rem' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {score === total ? '🏆' : score >= total * 0.7 ? '🎉' : '💪'}
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: navy, marginBottom: 4 }}>
              ¡Terminaste!
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: navy, marginBottom: 4 }}>
              {score}<span style={{ fontSize: '1rem', color: soft }}>/{total}</span>
            </p>
            <p style={{ color: soft, fontSize: 14 }}>
              {score === total
                ? '¡Perfecto! Te sabes todo sobre Regina 🎊'
                : score >= total * 0.7
                  ? '¡Muy bien! Claramente la conoces bien 🎈'
                  : '¡Aún hay tiempo de conocerla mejor! 😄'}
            </p>
          </div>

          <LeaderboardPanel
            leaderboard={leaderboard}
            currentUid={user.uid}
            cheer={cheer}
            setCheer={setCheer}
            cheerSaved={cheerSaved}
            onCheer={handleCheer}
            hasResult={true}
          />

          <NotePanel note={note} setNote={setNote} noteSent={noteSent} onSubmit={submitNote} />
        </div>
      )}
    </div>
  )
}

// ─── Leaderboard + mensaje de ánimo ───────────────────────────
function LeaderboardPanel({
  leaderboard, currentUid, cheer, setCheer, cheerSaved, onCheer, hasResult
}: {
  leaderboard: TriviaResult[]
  currentUid: string
  cheer: string
  setCheer: (v: string) => void
  cheerSaved: boolean
  onCheer: () => void
  hasResult: boolean
}) {
  return (
    <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: 16, padding: '1.3rem', backdropFilter: 'blur(8px)', marginBottom: '1.2rem' }}>

      {/* Encabezado */}
      <p style={{ fontSize: 12, fontWeight: 700, color: soft, letterSpacing: 2, textTransform: 'uppercase', marginBottom: '1rem' }}>
        🏆 Participantes
      </p>

      {/* Lista */}
      {leaderboard.length === 0 ? (
        <p style={{ color: soft, fontSize: 13, textAlign: 'center', marginBottom: '1rem' }}>
          Sé el primero en participar 🎯
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.2rem' }}>
          {leaderboard.map((r, i) => {
            const isMe = r.userId === currentUid
            const medal = i < 3 ? MEDAL[i] : null
            return (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '8px 10px', borderRadius: 10,
                background: isMe ? 'rgba(9,29,74,0.06)' : 'transparent',
                border: isMe ? '1.5px solid rgba(9,29,74,0.14)' : '1.5px solid transparent',
              }}>
                {/* Medalla o número */}
                <span style={{ fontSize: 16, minWidth: 26, paddingTop: 1 }}>
                  {medal ?? <span style={{ color: soft, fontSize: 13 }}>{i + 1}</span>}
                </span>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 14, color: navy, fontWeight: isMe ? 700 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {r.displayName}
                      {isMe && <span style={{ fontSize: 10, color: soft, marginLeft: 5 }}>(tú)</span>}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? gold : navy, marginLeft: 8, flexShrink: 0 }}>
                      {r.score}/{r.total}
                      {!r.completed && <span style={{ fontSize: 10, color: soft, fontWeight: 400, marginLeft: 3 }}>en curso</span>}
                    </span>
                  </div>
                  {/* Mensaje de ánimo */}
                  {r.cheer && (
                    <p style={{ fontSize: 12, color: soft, marginTop: 3, fontStyle: 'italic', lineHeight: 1.4 }}>
                      "{r.cheer}"
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Input de mensaje de ánimo — solo si tiene resultado guardado */}
      {hasResult && (
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>
          <p style={{ fontSize: 12, color: soft, marginBottom: 8 }}>
            💬 Tu mensaje de ánimo (aparece junto a tu nombre)
          </p>
          {cheerSaved ? (
            <p style={{ fontSize: 13, color: navy, fontStyle: 'italic', background: 'rgba(9,29,74,0.04)', borderRadius: 8, padding: '8px 12px' }}>
              "{cheer}"
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={cheer}
                onChange={e => setCheer(e.target.value)}
                maxLength={80}
                placeholder="Ej: ¡Que viva Regina! 🎉"
                style={{
                  flex: 1, borderRadius: 10, border: `1.5px solid ${border}`,
                  padding: '9px 12px', fontSize: 13,
                  fontFamily: 'inherit', color: navy,
                  background: 'rgba(255,255,255,0.85)', outline: 'none',
                }}
                onKeyDown={e => e.key === 'Enter' && onCheer()}
              />
              <button
                onClick={onCheer}
                disabled={!cheer.trim()}
                style={{
                  background: navy, color: '#fff',
                  border: 'none', borderRadius: 10,
                  padding: '9px 16px', fontSize: 13,
                  fontWeight: 600, cursor: cheer.trim() ? 'pointer' : 'not-allowed',
                  opacity: cheer.trim() ? 1 : 0.4,
                  fontFamily: 'inherit', flexShrink: 0,
                }}
              >
                Enviar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Nota anónima ─────────────────────────────────────────────
function NotePanel({ note, setNote, noteSent, onSubmit }: {
  note: string
  setNote: (v: string) => void
  noteSent: boolean
  onSubmit: () => void
}) {
  return (
    <div style={{ background: cardBg, border: `1.5px solid ${border}`, borderRadius: 16, padding: '1.4rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
      <p style={{ fontSize: 22, marginBottom: 6 }}>✉️</p>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: navy, marginBottom: 4 }}>
        Deja una nota para Regina
      </p>
      <p style={{ fontSize: 12, color: soft, marginBottom: '1rem' }}>
        La leerá después de su cumpleaños. Es completamente anónima 🤫
      </p>
      {noteSent ? (
        <p style={{ fontSize: 14, color: navy, fontWeight: 600 }}>
          💌 ¡Enviada! Regina la leerá después.
        </p>
      ) : (
        <>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Escríbele algo bonito, gracioso o lo que sea… solo tú sabes que lo escribiste."
            maxLength={400}
            style={{
              width: '100%', minHeight: 90, resize: 'vertical',
              borderRadius: 10, border: `1.5px solid ${border}`,
              padding: '10px 12px', fontSize: 13,
              fontFamily: 'inherit', color: navy,
              background: 'rgba(255,255,255,0.8)',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: soft }}>{note.length}/400</span>
            <button onClick={onSubmit} disabled={!note.trim()} style={{
              background: navy, color: '#fff',
              border: 'none', borderRadius: 10,
              padding: '9px 20px', fontSize: 13,
              fontWeight: 600, cursor: note.trim() ? 'pointer' : 'not-allowed',
              opacity: note.trim() ? 1 : 0.4,
              fontFamily: 'inherit',
            }}>
              Enviar nota →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: navy, color: '#fff',
  border: 'none', borderRadius: 12,
  padding: '12px 28px', fontSize: 15,
  fontWeight: 600, cursor: 'pointer',
  fontFamily: 'inherit',
  boxShadow: '0 4px 16px rgba(9,29,74,0.2)',
}
