// Gold "class power" bar (0-100%). Teacher mode adds the one-tap reward buttons.
import { REWARDS } from '../../data/lesson.js'
import { dispatch } from '../../engine/store.js'

export default function ClassPowerMeter({ value, teacher = false, size = 'board' }) {
  const big = size === 'board'
  return (
    <div className="flex w-full flex-col gap-2">
      <div className={`flex items-center justify-between font-bold ${big ? 'text-lg text-chalk' : 'text-sm text-ink'}`}>
        <span className="whitespace-nowrap">⭐ {big ? "כוח הכיתה" : "סרגל כוח הכיתה"}</span>
        <span className="tabular-nums" style={{ color: big ? 'var(--color-gold)' : undefined }}>{value}%</span>
      </div>
      <div className={`relative w-full overflow-hidden rounded-full ${big ? 'h-6 bg-board-3' : 'h-4 bg-line'}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="כוח הכיתה">
        <div
          className="h-full rounded-full bg-gradient-to-l from-gold to-gold-deep transition-[width] duration-700 ease-out"
          style={{ width: `${value}%`, boxShadow: value > 0 ? '0 0 18px rgba(255,200,61,.7)' : 'none' }}
        />
        {[25, 50, 75].map((m) => (
          <span key={m} className="absolute top-0 h-full w-0.5 bg-black/20" style={{ right: `${m}%` }} />
        ))}
      </div>
      {teacher && (
        <div className="flex flex-wrap gap-2">
          {REWARDS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => dispatch({ type: 'ADD_POWER', points: r.points })}
              className="min-h-[50px] flex-1 rounded-xl border border-line bg-white px-3 font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-gold-deep active:translate-y-0"
            >
              {r.icon} {r.label} <span className="text-muted">+{r.points}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
