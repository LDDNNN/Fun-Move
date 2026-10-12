// "Ask the character": the board's voice agent. Kids tap the mic and ask out loud,
// type a question, or tap a ready-made one; the character answers in its own voice.
import { Loader2, Mic, Send, Square } from 'lucide-react'
import { useId, useState } from 'react'
import { KID_QUESTIONS } from '../../data/characters.js'
import { dispatch } from '../../engine/store.js'
import { askCharacter, stopCharacter } from '../../engine/useScriptRunner.js'
import { canListen, listenOnce } from '../../engine/voiceAgent.js'

const MIC_ERRORS = {
  'not-allowed': 'המיקרופון חסום. אפשר להקליד את השאלה.',
  'service-not-allowed': 'המיקרופון חסום. אפשר להקליד את השאלה.',
  'no-speech': 'לא שמעתי. נסו שוב, קרוב יותר למיקרופון.',
  'audio-capture': 'לא נמצא מיקרופון. אפשר להקליד את השאלה.',
}

export function AgentQuestion({ character, status, question }) {
  if (!question || status === 'listening' || status === 'idle') return null
  const thinkingWord = character.speaks === 'מדברת' ? 'חושבת' : character.speaks === 'מדברים' ? 'חושבים' : 'חושב'
  return (
        <p className="text-lg text-chalk/75">
          שאלתם: <span className="font-bold text-chalk">"{question}"</span>
          {status === 'thinking' && <span className="mr-2 inline-flex items-center gap-1.5 text-gold"><Loader2 className="size-4 animate-spin" aria-hidden="true" />{character.name} {thinkingWord}…</span>}
        </p>
  )
}

export default function VoiceAgent({ character, status, question }) {
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
      setHint(MIC_ERRORS[e.message] ?? 'אי אפשר להקשיב עכשיו. אפשר להקליד את השאלה.')
    }
  }

  return (
    <section aria-label={`שאלות ל${character.name}`} className="flex w-full max-w-6xl flex-col items-center gap-2.5">
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        {canListen && (
          <button
            type="button"
            onClick={listen}
            aria-label={listening ? 'מקשיב…' : `לשאול את ${character.name} בקול`}
            aria-pressed={listening}
            className={`relative grid size-16 shrink-0 place-items-center rounded-full text-board shadow-[0_10px_24px_-10px_rgba(0,0,0,.6)] ${listening ? 'bg-stop text-white' : 'bg-gold hover:bg-[#ffd466]'}`}
          >
            {listening && <span className="absolute inset-0 animate-ping rounded-full bg-stop/50 motion-reduce:hidden" aria-hidden="true" />}
            <Mic className="relative size-7" strokeWidth={2.4} aria-hidden="true" />
          </button>
        )}

        <form
          className="flex min-w-0 flex-1 basis-[280px] items-center gap-2 rounded-2xl bg-board-2 p-1.5 ring-1 ring-board-3 focus-within:ring-2 focus-within:ring-gold"
          onSubmit={(e) => {
            e.preventDefault()
            if (draft.trim()) ask(draft)
          }}
        >
          <label htmlFor={inputId} className="sr-only">שאלה ל{character.name}</label>
          <input
            id={inputId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={listening ? 'מקשיב… דברו עכשיו' : `כתבו שאלה ל${character.name}…`}
            autoComplete="off"
            className="h-[52px] min-w-0 flex-1 bg-transparent px-3 text-xl text-chalk placeholder:text-chalk/45 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="שליחת השאלה"
            className="grid size-[52px] shrink-0 place-items-center rounded-xl bg-chalk text-board disabled:opacity-35"
          >
            <Send className="size-5 -scale-x-100" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </form>

        {busy && (
          <button
            type="button"
            onClick={stopCharacter}
            className="flex h-[52px] items-center gap-2 rounded-2xl bg-board-3 px-5 text-lg font-bold text-chalk hover:bg-board-2"
          >
            <Square className="size-4 fill-current" aria-hidden="true" />
            עצירה
          </button>
        )}
      </div>

      {hint && <p role="status" className="text-base font-medium text-[#ffb4a8]">{hint}</p>}

      <div className="flex flex-wrap justify-center gap-2">
        {KID_QUESTIONS.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => ask(q.question)}
            className="min-h-[48px] rounded-full bg-board-3 px-5 text-lg font-bold text-chalk hover:bg-board-2"
          >
            {q.question}
          </button>
        ))}
      </div>
    </section>
  )
}
