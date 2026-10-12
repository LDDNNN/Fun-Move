// Small collapsible remote for running the board without the dashboard.
// Closed, it is a single icon in the corner so the kids' view stays clean.
import { useState } from 'react'
import { REWARDS } from '../../data/lesson.js'
import { voiceCommandsSupported, useVoiceCommands } from '../../engine/speech.js'
import { dispatch } from '../../engine/store.js'
import { runTeacherCommand } from '../../engine/teacherActions.js'

const btn = 'min-h-[50px] min-w-[50px] rounded-xl bg-board-3 px-3 text-lg font-bold text-chalk transition hover:bg-board-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold'

export default function TeacherRemote({ running, completed }) {
  const [open, setOpen] = useState(false)
  const [voice, setVoice] = useState(false)
  const { listening, heard } = useVoiceCommands(voice, runTeacherCommand)

  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 flex flex-col items-start gap-2">
      {open && (
        <div className="pop-in flex w-[min(92vw,380px)] flex-col gap-2 rounded-2xl border border-board-3 bg-board/95 p-3 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-4 gap-2">
            <button type="button" className={btn} onClick={() => runTeacherCommand('pause')} aria-label={running ? 'השהיה' : 'המשך'}>{running ? '⏸' : '▶'}</button>
            <button type="button" className={btn} onClick={() => runTeacherCommand('next')} aria-label="השלב הבא">⏭</button>
            <button type="button" className={btn} onClick={() => runTeacherCommand('replay')} aria-label="שוב מההתחלה">🔁</button>
            <button type="button" className={btn} onClick={fullscreen} aria-label="מסך מלא">⛶</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {REWARDS.map((r) => (
              <button key={r.id} type="button" className={btn} onClick={() => dispatch({ type: 'ADD_POWER', points: r.points })} title={r.label}>
                {r.icon} +{r.points}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button type="button" className={btn} onClick={() => dispatch({ type: 'SET_COMPLETED', value: completed - 1 })} aria-label="הורד מסיים">−</button>
            <div className="col-span-2 flex items-center justify-center rounded-xl bg-board-2 text-lg font-bold text-chalk tabular-nums">🏁 {completed}/30</div>
            <button type="button" className={btn} onClick={() => dispatch({ type: 'SET_COMPLETED', value: completed + 1 })} aria-label="הוסף מסיים">+</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={btn} onClick={() => dispatch({ type: 'SHOW_CERTIFICATE', value: true })}>📜 תעודה</button>
            {voiceCommandsSupported ? (
              <button type="button" className={`${btn} ${voice ? 'bg-stop' : ''}`} onClick={() => setVoice((v) => !v)} aria-pressed={voice}>
                🎙️ {voice ? (listening ? 'מקשיב…' : 'מפעיל…') : 'פקודות קול'}
              </button>
            ) : (
              <a className={`${btn} flex items-center justify-center`} href="#">🏠 למורה</a>
            )}
          </div>
          {voice && <p className="text-sm text-chalk/70">אמרו: "הבא", "עצור", "שוב", "כל הכבוד"{heard && <> · שמעתי: "{heard}"</>}</p>}
          <a href="#" className="text-center text-sm text-chalk/60 underline">חזרה ללוח המורה</a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-12 w-12 rounded-full bg-board-3/70 text-xl text-chalk/80 shadow-lg transition hover:bg-board-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        aria-expanded={open}
        aria-label="שלט מורה"
      >
        {open ? '✕' : '🎛'}
      </button>
    </div>
  )
}
