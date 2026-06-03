'use client'
import { useEffect, useState } from 'react'
import { submitMessage, subscribeApprovedMessages, type WallMessage } from '@/lib/firestore'

export default function MessageWall() {
  const [messages, setMessages] = useState<WallMessage[]>([])
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    const unsub = subscribeApprovedMessages(setMessages)
    return unsub
  }, [])

  const handleSubmit = async () => {
    if (!author.trim() || !text.trim()) return
    setStatus('sending')
    await submitMessage({ author: author.trim(), text: text.trim() })
    setStatus('sent')
    setAuthor('')
    setText('')
    setTimeout(() => setStatus('idle'), 4000)
  }

  // Duplicate for seamless loop
  const displayMsgs = messages.length > 0
    ? [...messages, ...messages]
    : [
        { author: 'Ana', text: '¡Eres lo mejor que me pasó en la vida!' },
        { author: 'Carlos', text: '25 años y sigues sorprendiéndonos' },
        { author: 'Sofi', text: 'Que este año sea el mejor de todos' },
        { author: 'Diego', text: '¡Felicidades! Brindemos juntos' },
        { author: 'Ana', text: '¡Eres lo mejor que me pasó en la vida!' },
        { author: 'Carlos', text: '25 años y sigues sorprendiéndonos' },
        { author: 'Sofi', text: 'Que este año sea el mejor de todos' },
        { author: 'Diego', text: '¡Felicidades! Brindemos juntos' },
      ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <p className="section-label">Muro de mensajes</p>

      <div className="marquee-wrap" aria-live="polite">
        <div className="marquee-inner">
          {displayMsgs.map((m, i) => (
            <span key={i} className="msg-quote">
              <span>{m.author}</span>
              &ldquo;{m.text}&rdquo;
            </span>
          ))}
        </div>
      </div>

      {status === 'sent' ? (
        <div className="success-msg">
          💌 ¡Gracias! Tu mensaje está en revisión y pronto aparecerá aquí.
        </div>
      ) : (
        <div className="form-row">
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Tu nombre"
            style={{ maxWidth: 200, flexShrink: 0 }}
          />
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Deja tu mensaje para Valentina…"
            style={{ flex: 1 }}
          />
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={status === 'sending' || !author.trim() || !text.trim()}
          >
            {status === 'sending' ? 'Enviando…' : 'Enviar 💌'}
          </button>
        </div>
      )}
    </div>
  )
}
