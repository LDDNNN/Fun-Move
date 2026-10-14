// Teacher view: choose the character, run the 45-minute lesson, award class power
// and fill the success tracker. The kids only ever see #player.
import CharacterArt from '../shared/CharacterArt.jsx'
import { useEffect, useState } from 'react'
import { CHARACTER_MASTER_CONFIGS, getCharacter } from '../../data/characters.js'
import { LESSON_SEGMENTS, LEVELS, segmentForPhase } from '../../data/lesson.js'
import { hasHebrewVoice, useVoiceCommands, voiceCommandsSupported } from '../../engine/speech.js'
import { dispatch, useLesson } from '../../engine/store.js'
import { runTeacherCommand } from '../../engine/teacherActions.js'
import ClassPowerMeter from '../shared/ClassPowerMeter.jsx'
import ClassSuccessTracker from '../shared/ClassSuccessTracker.jsx'
import ClassVictoryCertificate from '../shared/ClassVictoryCertificate.jsx'

const PHASE_NAMES = { setup: 'התארגנות ובטיחות', watch: 'צפייה ודמיון מודרך', practice: 'תרגול בדרגות', play: 'משחק כיתתי מסכם', summary: 'סיכום ונשימה' }

function Panel({ title, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>}
      {children}
    </section>
  )
}

function useMinutes(since) {
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 15000)
    return () => clearInterval(id)
  }, [])
  return since ? Math.floor((Date.now() - since) / 60000) : 0
}

function LessonTimeline({ phase, started }) {
  const current = started ? segmentForPhase(phase)?.id : null
  const minutes = useMinutes(started)
  return (
    <div>
      <div className="flex overflow-hidden rounded-xl border border-line">
        {LESSON_SEGMENTS.map((seg) => (
          <div
            key={seg.id}
            className={`flex flex-col gap-0.5 border-l border-line p-3 last:border-l-0 ${seg.id === current ? 'bg-gold/25' : 'bg-paper'}`}
            style={{ flex: seg.minutes }}
          >
            <span className="text-xs font-bold text-muted tabular-nums">{seg.minutes} דק׳</span>
            <span className="text-sm font-bold leading-tight text-ink">{seg.title}</span>
            <span className="hidden text-xs leading-snug text-muted md:block">{seg.detail}</span>
          </div>
        ))}
      </div>
      {started && <p className="mt-2 text-sm text-muted tabular-nums">עברו {minutes} דקות מתחילת השיעור</p>}
    </div>
  )
}

export default function Dashboard() {
  const s = useLesson()
  const character = getCharacter(s.characterId)
  const [voice, setVoice] = useState(false)
  const { listening, heard } = useVoiceCommands(voice, runTeacherCommand)
  const started = Boolean(s.lessonStartedAt)

  const openBoard = () => window.open(`${location.pathname}#player`, 'class-power-board')

  return (
    <div className="min-h-full bg-paper text-ink" dir="rtl">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <div className="text-sm font-bold text-gold-deep">GameGuide Studio · לוח מורה</div>
            <h1 className="font-display text-3xl">כיף של תנועה: כוח הכיתה</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openBoard} className="min-h-[50px] rounded-xl bg-board px-5 font-bold text-white">🖥️ פתח לוח חכם בחלון</button>
            <a href="#player" className="flex min-h-[50px] items-center rounded-xl border border-line bg-white px-5 font-bold">▶ הצג כאן</a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6">
        <Panel title="בחירת דמות ומשחק">
          <div className="mb-3 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="סגנון הדמות">
            <span className="font-bold">סגנון הדמות:</span>
            {[
              ['photo', '📷 תמונה מקורית'],
              ['drawn', '🎨 דמות מצוירת'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={s.avatarStyle === value}
                onClick={() => dispatch({ type: 'SET_AVATAR_STYLE', value })}
                className={`min-h-[50px] rounded-xl border-2 px-4 font-bold transition-colors ${s.avatarStyle === value ? 'border-gold-deep bg-gold text-ink' : 'border-line bg-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {CHARACTER_MASTER_CONFIGS.map((c) => {
              const active = c.id === s.characterId
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => dispatch({ type: 'SELECT_CHARACTER', id: c.id })}
                  aria-pressed={active}
                  className={`group flex flex-col overflow-hidden rounded-2xl border-2 bg-white text-right transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-14px_rgba(27,34,54,.45)] ${active ? 'border-gold-deep shadow-[0_12px_28px_-14px_rgba(232,162,0,.7)]' : 'border-line'}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: `linear-gradient(160deg, ${c.color}, #0f1e3d)` }}>
                    <CharacterArt character={c} imgClassName="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-105" figureClassName="h-full w-full py-1" />
                    {active && <span className="absolute left-2 top-2 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-ink">נבחר</span>}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 p-3">
                    <span className="text-lg font-bold leading-tight">{c.name}</span>
                    <span className="text-xs font-bold text-gold-deep">{c.role}</span>
                    <span className="mt-1 text-sm font-medium">{c.gameTitle}</span>
                    <span className="text-xs leading-snug text-muted">{c.skill}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </Panel>

        <Panel title="מהלך השיעור (45 דקות)">
          <LessonTimeline phase={s.phase} started={s.lessonStartedAt} />
        </Panel>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Panel title={`${character.name}: ${character.gameTitle} ו${character.finalTitle}`}>
            <p className="-mt-2 mb-4 rounded-xl bg-paper p-3 text-sm leading-relaxed">“{character.opening}” <span className="font-bold text-gold-deep">· הרפתקה: {character.adventure}</span></p>
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div><dt className="font-bold text-muted">מיומנות</dt><dd>{character.skill}</dd></div>
              <div><dt className="font-bold text-muted">סידור הכיתה</dt><dd>{character.formationLabel}</dd></div>
              <div className="sm:col-span-2"><dt className="font-bold text-muted">חוקי המשחק</dt><dd>{character.rules.join(' · ')}</dd></div>
              <div className="sm:col-span-2"><dt className="font-bold text-muted">משפט החיזוק</dt><dd>{character.value}</dd></div>
            </dl>
            <h3 className="mb-2 mt-5 text-sm font-bold text-muted">דרגות התרגול (כל 30 הילדים יחד, בלי תורים)</h3>
            <ol className="grid gap-2 sm:grid-cols-2">
              {LEVELS.map((l, i) => {
                const now = s.phase === 'practice' && s.level === l.level
                return (
                  <li key={l.level} className={`rounded-xl border p-3 ${now ? 'border-gold-deep bg-gold/15' : 'border-line'}`}>
                    <div className="font-bold">דרגה {l.level}: {character.levelTitles[i]}</div>
                    <div className="text-xs text-muted">{l.name}</div>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 text-sm"><b>משחק מסכם:</b> {character.finalGame.map((l) => l.text).join(' ')}</p>
          </Panel>

          <Panel title="שליטה בשיעור">
            <div className="mb-4 rounded-xl bg-board p-4 text-chalk">
              <div className="text-xs font-bold text-gold">{started ? `עכשיו: ${PHASE_NAMES[s.phase]}${s.phase === 'practice' ? ` · דרגה ${s.level}` : ''}` : 'השיעור עוד לא התחיל'}</div>
              <div className="mt-1 min-h-[3rem] text-lg font-bold">{s.isTalking ? '🎤 ' : ''}{s.line || '—'}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {!started ? (
                <button type="button" onClick={() => dispatch({ type: 'START_LESSON' })} className="col-span-2 min-h-[50px] rounded-xl bg-gold font-bold sm:col-span-4">▶ התחלת שיעור</button>
              ) : (
                <>
                  <button type="button" onClick={() => runTeacherCommand('pause')} className="min-h-[50px] rounded-xl bg-ink font-bold text-white">{s.running ? '⏸ השהיה' : '▶ המשך'}</button>
                  <button type="button" onClick={() => runTeacherCommand('next')} className="min-h-[50px] rounded-xl bg-gold font-bold">⏭ הבא</button>
                  <button type="button" onClick={() => runTeacherCommand('replay')} className="min-h-[50px] rounded-xl border border-line font-bold">🔁 שוב</button>
                  <button type="button" onClick={() => dispatch({ type: 'RESET' })} className="min-h-[50px] rounded-xl border border-line font-bold">↺ איפוס</button>
                </>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(PHASE_NAMES).map(([id, name]) => (
                <button key={id} type="button" onClick={() => dispatch({ type: 'GO_PHASE', phase: id })} className={`min-h-[40px] rounded-full border px-3 text-sm font-bold ${s.phase === id && started ? 'border-gold-deep bg-gold/20' : 'border-line'}`}>
                  {name}
                </button>
              ))}
            </div>

            {voiceCommandsSupported && (
              <div className="mt-4 rounded-xl border border-line p-3">
                <label className="flex cursor-pointer items-center justify-between gap-3 font-bold">
                  <span>🎙️ פקודות קול למורה</span>
                  <input id="voice-toggle" type="checkbox" className="h-6 w-6 accent-[#e8a200]" checked={voice} onChange={(e) => setVoice(e.target.checked)} />
                </label>
                <p className="mt-1 text-xs text-muted">
                  אומרים "הבא", "עצור", "שוב" או "כל הכבוד". הזיהוי נעשה בדפדפן ולא נשמר.
                  {voice && <> {listening ? 'מקשיב…' : 'מתחבר…'}{heard && ` שמעתי: "${heard}"`}</>}
                </p>
              </div>
            )}
            {!hasHebrewVoice() && (
              <p className="mt-3 rounded-xl bg-[#fff4e0] p-3 text-xs text-ink">לא נמצא קול עברי בדפדפן הזה. הכתוביות יוצגו, אבל ההקראה עלולה לא להישמע. מומלץ Chrome או Edge.</p>
            )}
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="סרגל כוח הכיתה">
            <ClassPowerMeter value={s.classPower} teacher size="console" />
          </Panel>
          <Panel title="מד הצלחה כיתתי">
            <ClassSuccessTracker completed={s.completed} workedTags={s.workedTags} practiceTags={s.practiceTags} teacher />
            <button type="button" onClick={() => dispatch({ type: 'SHOW_CERTIFICATE', value: true })} className="mt-4 min-h-[50px] w-full rounded-xl bg-gold font-bold">📜 תעודת ניצחון כיתתית</button>
          </Panel>
        </div>

        <p className="text-center text-xs text-muted">המערכת לא שומרת שמות, תמונות או ציונים של תלמידים. נשמרים רק נתונים כיתתיים בזמן השיעור.</p>
      </main>

      {s.showCertificate && <ClassVictoryCertificate character={character} classPower={s.classPower} completed={s.completed} workedTags={s.workedTags} />}
    </div>
  )
}
