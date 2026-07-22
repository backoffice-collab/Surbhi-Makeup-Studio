'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { GREETING, QUICK_REPLIES, type ChatMessage } from '@/lib/chat/knowledge'
import { site, whatsappUrl, telUrl } from '@/lib/site'
import styles from './Chatbot.module.css'

/** Floating AI assistant. Bottom-left so it clears the WhatsApp/Call FABs. */
export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: GREETING },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [showQuick, setShowQuick] = useState(true)

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Auto-scroll to the newest message.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  // Focus the input when opened; close on Escape.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 120)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    setShowQuick(false)
    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setBusy(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: next.slice(-10, -1), // prior turns, excluding the new message
        }),
      })
      const data = await res.json()
      const replyText =
        typeof data.reply === 'string'
          ? data.reply
          : `Sorry, something went wrong. Please WhatsApp us at ${site.whatsappDisplay}.`
      setMessages((m) => [...m, { role: 'assistant', content: replyText }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: `I'm having trouble connecting. Please WhatsApp us at ${site.whatsappDisplay} or call ${site.phoneDisplay}.`,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={open}
        whileTap={reduce ? undefined : { scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className={styles.pulse} aria-hidden="true" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-label="Chat with the Surbhi Makeup Studio assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.avatar} aria-hidden="true">S</div>
              <div className={styles.headText}>
                <p className={styles.headName}>{site.shortName}</p>
                <p className={styles.headStatus}>
                  <span className={styles.dot} aria-hidden="true" /> Beauty Assistant
                </p>
              </div>
              <button type="button" className={styles.headClose} onClick={() => setOpen(false)} aria-label="Close chat">
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className={styles.messages} ref={listRef} aria-live="polite" aria-atomic="false">
              {messages.map((m, i) => (
                <div key={i} className={`${styles.row} ${m.role === 'user' ? styles.rowUser : ''}`}>
                  <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                    {m.content}
                  </div>
                </div>
              ))}

              {busy && (
                <div className={styles.row}>
                  <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`} aria-label="Assistant is typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              {showQuick && (
                <div className={styles.quickWrap}>
                  {QUICK_REPLIES.map((q) => (
                    <button key={q} type="button" className={styles.quick} onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Persistent CTAs */}
            <div className={styles.ctaRow}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaWa}>
                WhatsApp
              </a>
              <a href={telUrl} className={styles.ctaCall}>Call</a>
              <Link href="/contact" className={styles.ctaBook} onClick={() => setOpen(false)}>Book</Link>
            </div>

            {/* Composer */}
            <form
              className={styles.composer}
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <label htmlFor="chat-input" className={styles.srOnly}>Type your message</label>
              <input
                id="chat-input"
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about bridal, courses, timings…"
                autoComplete="off"
                maxLength={1000}
                disabled={busy}
              />
              <button type="submit" className={styles.sendBtn} disabled={busy || !input.trim()} aria-label="Send message">
                <SendIcon />
              </button>
            </form>

            <p className={styles.disclaimer}>
              AI assistant · for exact pricing &amp; dates, please WhatsApp or call us.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---- Inline icons ---- */
function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3c5 0 9 3.4 9 7.6 0 4.2-4 7.6-9 7.6a10.6 10.6 0 0 1-3-.43L4 20l1.1-3.3A7 7 0 0 1 3 10.6C3 6.4 7 3 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="8.5" cy="10.6" r="1.1" fill="currentColor" />
      <circle cx="12" cy="10.6" r="1.1" fill="currentColor" />
      <circle cx="15.5" cy="10.6" r="1.1" fill="currentColor" />
    </svg>
  )
}
function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}
function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12 20 4l-3 16-5-5-4 3 0-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
