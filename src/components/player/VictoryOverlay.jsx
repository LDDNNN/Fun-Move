// Fires once when the class power bar hits 100%.
import { useEffect } from 'react'
import { dispatch } from '../../engine/store.js'

const SPARKS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2
  const d = 160 + (i % 4) * 60
  return { dx: `${Math.cos(a) * d}px`, dy: `${Math.sin(a) * d}px`, delay: `${(i % 7) * 0.18}s`, color: ['#ffc83d', '#ff5a5f', '#3ccf7a', '#5aa9ff'][i % 4] }
})

export default function VictoryOverlay({ character }) {
  useEffect(() => {
    const id = setTimeout(() => dispatch({ type: 'HIDE_VICTORY' }), 8000)
    return () => clearTimeout(id)
  }, [])
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'HIDE_VICTORY' })}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-board/85 text-center"
      aria-label="סגירת מסך הניצחון"
    >
      <div className="absolute left-1/2 top-1/2">
        {SPARKS.map((s, i) => (
          <span key={i} className="spark absolute h-4 w-4 rounded-full" style={{ '--dx': s.dx, '--dy': s.dy, animationDelay: s.delay, background: s.color }} />
        ))}
      </div>
      <div className="pop-in relative flex flex-col items-center gap-4 px-6">
        <div className="text-[120px] leading-none">🏆</div>
        <div className="font-display text-6xl text-gold drop-shadow-[0_0_30px_rgba(255,200,61,.7)] sm:text-7xl">ניצחון כיתתי!</div>
        <div className="text-3xl font-bold text-chalk">סרגל כוח הכיתה מלא 100%</div>
        <div className="mt-2 rounded-3xl bg-gold px-8 py-4 font-display text-3xl text-board">
          {character.emoji} {character.value}
        </div>
      </div>
    </button>
  )
}
