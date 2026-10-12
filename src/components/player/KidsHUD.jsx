// Top HUD answering the 5 questions every kid has: what, where, when, how, how much.
import { KID_STEPS, kidStepIndex } from '../../data/lesson.js'
import ClassPowerMeter from '../shared/ClassPowerMeter.jsx'
import { basePositions } from './GameDemoSimulations.jsx'

export function FormationMap({ formation }) {
  const kids = basePositions(formation)
  return (
    <svg viewBox="0 0 600 340" className="h-full w-full" aria-hidden="true">
      <rect x={4} y={4} width={592} height={332} rx={26} fill="#123a2a" />
      {kids.map((k) => (
        <g key={k.i}>
          <circle cx={k.x} cy={k.y} r={formation === 'columns' ? 13 : 22} fill="none" stroke="#ffc83d" strokeWidth={3} strokeDasharray="6 6" opacity={0.6} />
          <circle cx={k.x} cy={k.y} r={10} fill={k.shirt} />
        </g>
      ))}
    </svg>
  )
}

export function StepsBar({ phase }) {
  const current = kidStepIndex(phase)
  return (
    <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2" aria-label="שלבי המשחק">
      {KID_STEPS.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'now' : 'next'
        return (
          <li key={s.id} className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-2xl px-2.5 py-1.5 text-base font-bold transition-[scale,background-color,color,box-shadow] duration-300 ease-[var(--ease-out)] sm:px-3 sm:py-2 sm:text-xl ${
                state === 'now' ? 'scale-105 bg-gold text-board shadow-[0_0_24px_rgba(255,200,61,.6)]' : state === 'done' ? 'bg-go/25 text-chalk' : 'bg-board-3 text-chalk/50'
              }`}
              aria-current={state === 'now' ? 'step' : undefined}
            >
              <span>{state === 'done' ? '✓' : s.icon}</span>
              <span>{i + 1}. {s.label}</span>
            </span>
            {i < KID_STEPS.length - 1 && <span className="hidden text-chalk/40 sm:inline">←</span>}
          </li>
        )
      })}
    </ol>
  )
}

export default function KidsHUD({ character, phase, level, classPower }) {
  const missionTitle =
    phase === 'practice' ? `שלב ${level}: ${character.levelTitles[level - 1]}` : phase === 'play' ? character.finalTitle : character.hud.what
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-board-2/80 px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {character.portrait ? (
          <img src={character.portrait} alt="" width={640} height={480} className="h-16 w-16 shrink-0 rounded-full border-[3px] border-gold object-cover object-top" />
        ) : (
          <span className="text-5xl">{character.emoji}</span>
        )}
        <div className="min-w-0">
          <div className="text-sm font-bold tracking-wide text-gold">מה עושים?</div>
          <h1 className="font-display text-3xl leading-tight text-chalk sm:text-4xl">{missionTitle}</h1>
        </div>
      </div>
      <StepsBar phase={phase} />
      <div className="flex w-full items-center gap-4 sm:w-[420px]">
        {phase === 'practice' && (
          <div className="shrink-0 rounded-2xl bg-board-3 px-4 py-2 text-center">
            <div className="text-xs font-bold text-gold">כמה חזרות?</div>
            <div className="text-xl font-bold text-chalk tabular-nums">סבב {level} מתוך 4</div>
          </div>
        )}
        <ClassPowerMeter value={classPower} />
      </div>
    </header>
  )
}
