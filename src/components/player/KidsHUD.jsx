// Top HUD answering the 5 questions every kid has: what, where, when, how, how much.
import { KID_STEPS, kidStepIndex } from '../../data/lesson.js'
import ClassPowerMeter from '../shared/ClassPowerMeter.jsx'
import { basePositions } from './GameDemoSimulations.jsx'

export function FormationMap({ formation }) {
  const kids = basePositions(formation)
  return (
    <svg viewBox="0 -40 600 380" className="h-full w-full" aria-hidden="true">
      {/* the board is at the front, so kids know which way they face */}
      <rect x={150} y={-36} width={300} height={28} rx={8} fill="#f4f7ff" />
      <text x={300} y={-16} textAnchor="middle" fontSize={18} fontWeight={800} fill="#0f1e3d" fontFamily="Rubik, sans-serif">הלוח</text>
      <rect x={4} y={4} width={592} height={332} rx={26} fill="#123a2a" />
      {kids.map((k) => (
        <g key={k.i} transform={`translate(${k.x},${k.y})`}>
          <circle r={formation === 'columns' ? 13 : 22} fill="none" stroke="#ffc83d" strokeWidth={3} strokeDasharray="6 6" opacity={0.7} />
          <circle r={11} fill={k.shirt} />
          <circle r={6} cy={-1} fill={k.skin} />
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
  const title = phase === 'practice' ? character.levelTitles[level - 1] : phase === 'play' ? character.finalTitle : character.gameTitle
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 bg-board-2/80 px-6 py-3">
      <h1 className="min-w-0 font-display text-[clamp(1.9rem,3vw,2.8rem)] leading-tight text-chalk">{title}</h1>
      <StepsBar phase={phase} />
      <div className="flex w-full items-center gap-5 sm:w-[440px]">
        {phase === 'practice' && (
          <div className="shrink-0 text-center" aria-label={`סבב ${level} מתוך 4`}>
            <div className="text-lg font-bold text-chalk tabular-nums">סבב {level} מתוך 4</div>
            <div className="mt-1 flex justify-center gap-1.5" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={`size-3.5 rounded-full ${n < level ? 'bg-go' : n === level ? 'bg-gold' : 'bg-board-3'}`} />
              ))}
            </div>
          </div>
        )}
        <ClassPowerMeter value={classPower} />
      </div>
    </header>
  )
}
