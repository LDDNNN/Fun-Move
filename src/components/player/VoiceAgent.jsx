// "Ask the character": one big mic button and four ready questions. Typing is
// tucked behind the keyboard button for the aide; kids just tap or talk.
import { Keyboard, Loader2, Mic, Send, Square } from 'lucide-react'
import { useId, useState } from 'react'
import { KID_QUESTIONS } from '../../data/characters.js'
import { dispatch } from '../../engine/store.js'
import { askCharacter, stopCharacter } from '../../engine/useScriptRunner.js'
import { canListen, listenOnce } from '../../engine/voiceAgent.js'

const MIC_ERRORS = {
  'not-allowed': 'המיקרופון חסום. לחצו על שאלה מוכנה.',
  'service-not-allowed': 'המיקרופון חסום. לחצו על שאלה מוכנה.',
  'no-speech': 'לא שמעתי. נסו שוב, קרוב יותר.',
  'audio-capture': 'אין מיקרופון. לחצו על שאלה מוכנה.',
}

const thinking = (c) => (c.speaks === 'מדברת' ? 'חושבת' : c.speaks === 'מדברים' ? 'חושבים' : 'חושב')

// Shown inside the speech bubble, above the answer.
export function AgentQuestion({ character, status, question }) {
  if (!question || status === 'listening' || status === 'idle') return null
  return (
    <p className="relative mb-1 text-base text-muted">
      שאלתם: <b className="text-ink">"{question}"</b>
      {status === 'thinking' && (
        <span className="mr-2 inline-flex items-center gap-1 font-bold text-gold-deep">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {character.name} {thinking(character)}…
        </span>
      )}
    </p>
  )
}

export default function VoiceAgent({ character, status }) {
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [hint, setHint] = useState('')
  const inputId = useId()
  const busy = status === 'thinking' || status === 'speaking'
  const listening = status === 'listening'

  const ask = (q) => {
    setHint('')
    setDraft('')
    askCharacter(q)
  }

  const listen = async () => {
    if (listening) return
    setHint('')
    dispatch({ type: 'SET_AGENT', status: 'listening', question: '' })
    try {
      const said = await listenOnce()
      if (said) ask(said)
      else {
        dispatch({ type: 'SET_AGENT', status: 'idle' })
        setHint(MIC_ERRORS['no-speech'])
      }
    } catch (e) {
      dispatch({ type: 'SET_AGENT', status: 'idle' })
      setHint(MIC_ERRORS[e.message] ?? 'אי אפשר להקשיב עכשיו. לחצו על שאלה מוכנה.')
    }
  }

  return (
    <section aria-label={`שאלות ל${character.name}`} className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {canListen && (
          <button
            type="button"
            onClick={listen}
            aria-pressed={listening}
            className={`relative flex h-16 items-center gap-3 rounded-full pl-7 pr-3 font-display text-2xl shadow-[0_12px_26px_-12px_rgba(0,0,0,.7)] ${listening ? 'bg-stop text-white' : 'bg-gold text-board hover:bg-[#ffd466]'}`}
          >
            <span className="relative grid size-11 place-items-center rounded-full bg-board/10">
              {listening && <span className="absolute inset-0 animate-ping rounded-full bg-white/40 motion-reduce:hidden" aria-hidden="true" />}
              <Mic className="relative size-6" strokeWidth={2.5} aria-hidden="true" />
            </span>
            {listening ? 'מקשיבים… דברו' : `שאלו את ${character.name}`}
          </button>
        )}

        {KID_QUESTIONS.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => ask(q.question)}
            className="h-14 rounded-full bg-board-3 px-6 text-xl font-bold text-chalk hover:bg-board-2"
          >
            {q.question}
          </button>
        ))}

        {busy ? (
          <button type="button" onClick={stopCharacter} className="flex h-14 items-center gap-2 rounded-full bg-chalk px-5 text-lg font-bold text-board">
            <Square className="size-4 fill-current" aria-hidden="true" />
            עצירה
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setTyping((v) => !v)}
            aria-expanded={typing}
            aria-label="הקלדת שאלה"
            title="הקלדת שאלה"
            className="grid size-14 place-items-center rounded-full bg-board-3/60 text-chalk/80 hover:bg-board-3"
          >
            <Keyboard className="size-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {typing && (
        <form
          className="flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-board-2 p-1.5 ring-1 ring-board-3 focus-within:ring-2 focus-within:ring-gold"
          onSubmit={(e) => {
            e.preventDefault()
            if (draft.trim()) ask(draft)
          }}
        >
          <label htmlFor={inputId} className="sr-only">שאלה ל{character.name}</label>
          <input
            id={inputId}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`כתבו שאלה ל${character.name}…`}
            autoComplete="off"
            className="h-12 min-w-0 flex-1 bg-transparent px-3 text-xl text-chalk placeholder:text-chalk/45 focus:outline-none"
          />
          <button type="submit" disabled={!draft.trim()} aria-label="שליחת השאלה" className="grid size-12 shrink-0 place-items-center rounded-xl bg-chalk text-board disabled:opacity-35">
            <Send className="size-5 -scale-x-100" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </form>
      )}

      {hint && <p role="status" className="text-lg font-medium text-[#ffb4a8]">{hint}</p>}
    </section>
  )
}
