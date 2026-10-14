// End-of-lesson class certificate: score, % completed and the values the class showed.
import CharacterArt from './CharacterArt.jsx'
import { useRef } from 'react'
import { CLASS_SIZE } from '../../data/lesson.js'
import { dispatch } from '../../engine/store.js'

export default function ClassVictoryCertificate({ character, classPower, completed, workedTags }) {
  const card = useRef(null)
  const date = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })
  const pct = Math.round((completed / CLASS_SIZE) * 100)
  const values = workedTags.length ? workedTags : ['עבודת צוות', 'הקשבה']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-board/90 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-labelledby="cert-title">
      <div ref={card} className="print-area pop-in relative w-full max-w-2xl overflow-hidden rounded-[28px] border-[6px] border-gold bg-[#fffaf0] p-8 text-center text-ink shadow-2xl">
        <div className="pointer-events-none absolute inset-3 rounded-[20px] border-2 border-dashed border-gold-deep/60" />
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-gold" style={{ background: character.color }}>
          <CharacterArt character={character} imgClassName="h-full w-full object-cover object-top" figureClassName="h-full w-full" />
        </div>
        <h2 id="cert-title" className="mt-2 font-display text-4xl text-gold-deep">תעודת כוח הכיתה</h2>
        <p className="mt-2 text-xl">הכיתה שלנו השלימה את המשימה <b>{character.gameTitle}</b> עם {character.name}!</p>

        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gold/20 p-4">
            <div className="font-display text-4xl tabular-nums">{classPower}%</div>
            <div className="text-sm font-bold text-muted">כוח הכיתה</div>
          </div>
          <div className="rounded-2xl bg-go/15 p-4">
            <div className="font-display text-4xl tabular-nums">{pct}%</div>
            <div className="text-sm font-bold text-muted">השלימו את המסלול</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-bold text-muted">ערכים מצטיינים</div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {values.map((v) => <span key={v} className="rounded-full bg-ink px-4 py-1.5 font-bold text-white">⭐ {v}</span>)}
          </div>
        </div>

        <p className="mt-6 font-display text-2xl">"{character.value}"</p>
        <p className="mt-2 text-sm text-muted">{date}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
          <button type="button" onClick={() => card.current?.requestFullscreen?.().catch(() => {})} className="min-h-[50px] rounded-xl bg-ink px-5 font-bold text-white">⛶ מסך מלא</button>
          <button type="button" onClick={() => window.print()} className="min-h-[50px] rounded-xl bg-gold px-5 font-bold text-ink">🖨️ הדפסה ללוח המודעות</button>
          <button type="button" onClick={() => dispatch({ type: 'SHOW_CERTIFICATE', value: false })} className="min-h-[50px] rounded-xl border border-line px-5 font-bold">סגירה</button>
        </div>
      </div>
    </div>
  )
}
