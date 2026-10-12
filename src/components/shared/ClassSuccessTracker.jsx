// "X / 30 completed the course" plus what-worked / practise-next tags. Class-level only.
import { CLASS_SIZE, PRACTICE_TAGS, WORKED_TAGS } from '../../data/lesson.js'
import { dispatch } from '../../engine/store.js'

function Tag({ active, tone, children, onClick, readOnly }) {
  const tones = {
    good: active ? 'bg-go text-white border-go' : 'border-go/40 text-ink',
    next: active ? 'bg-[#ff9f1c] text-white border-[#ff9f1c]' : 'border-[#ff9f1c]/50 text-ink',
  }
  if (readOnly) return <span className={`rounded-full border px-4 py-2 text-lg font-bold ${tones[tone]}`}>{children}</span>
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`min-h-[44px] rounded-full border-2 px-3 text-sm font-bold transition ${tones[tone]}`}>
      {children}
    </button>
  )
}

export default function ClassSuccessTracker({ completed, workedTags, practiceTags, teacher = false }) {
  const pct = Math.round((completed / CLASS_SIZE) * 100)
  const set = (v) => dispatch({ type: 'SET_COMPLETED', value: v, max: CLASS_SIZE })

  if (!teacher) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="font-display text-6xl text-gold tabular-nums">{completed} / {CLASS_SIZE}</div>
        <div className="text-2xl font-bold text-chalk">ילדים השלימו את המסלול</div>
        {workedTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {workedTags.map((t) => <Tag key={t} active tone="good" readOnly>✓ {t}</Tag>)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => set(completed - 1)} className="h-[50px] w-[50px] rounded-xl border border-line bg-white text-2xl font-bold" aria-label="הורד אחד">−</button>
        <div className="flex-1 text-center">
          <div className="text-3xl font-bold tabular-nums text-ink">{completed} / {CLASS_SIZE}</div>
          <div className="text-sm text-muted">השלימו את המסלול ({pct}%)</div>
        </div>
        <button type="button" onClick={() => set(completed + 1)} className="h-[50px] w-[50px] rounded-xl bg-ink text-2xl font-bold text-white" aria-label="הוסף אחד">+</button>
        <button type="button" onClick={() => set(CLASS_SIZE)} className="h-[50px] rounded-xl border border-line bg-white px-3 text-sm font-bold">כולם ✓</button>
      </div>
      <div>
        <div className="mb-2 text-sm font-bold text-ink">מה עבד מעולה היום</div>
        <div className="flex flex-wrap gap-2">
          {WORKED_TAGS.map((t) => (
            <Tag key={t} tone="good" active={workedTags.includes(t)} onClick={() => dispatch({ type: 'TOGGLE_TAG', list: 'workedTags', tag: t })}>{t}</Tag>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-bold text-ink">דגשים לתרגול בפעם הבאה</div>
        <div className="flex flex-wrap gap-2">
          {PRACTICE_TAGS.map((t) => (
            <Tag key={t} tone="next" active={practiceTags.includes(t)} onClick={() => dispatch({ type: 'TOGGLE_TAG', list: 'practiceTags', tag: t })}>{t}</Tag>
          ))}
        </div>
      </div>
    </div>
  )
}
