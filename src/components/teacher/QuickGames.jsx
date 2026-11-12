import { useEffect, useState } from 'react'
import { QUICK_GAMES } from '../../data/quickGames.js'
import { getCharacter } from '../../data/characters.js'
import CharacterArt from '../shared/CharacterArt.jsx'
import { hasHebrewVoice, speak, stopSpeaking } from '../../engine/speech.js'

function Child({ x, y, color = '#4cc9f0', name }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle cx="0" cy="0" r="19" fill={color} stroke="#fff" strokeWidth="3" />
    <circle cx="0" cy="-6" r="9" fill="#f2bd8b" />
    <path d="M-10 9L-20 19M10 9L20 19" stroke="#f2bd8b" strokeWidth="5" strokeLinecap="round" />
    {name && <text y="39" textAnchor="middle" fontSize="12" fill="#fff">{name}</text>}
  </g>
}
function MovingBall({ path, hoop = false, duration = '4s' }) {
  return <g>
    {hoop ? <circle r="23" fill="none" stroke="#ffdf56" strokeWidth="8" /> : <circle r="14" fill="#fff" stroke="#f59e0b" strokeWidth="4" />}
    <animateMotion dur={duration} repeatCount="indefinite" path={path} />
  </g>
}
function Demo({ id }) {
  const kids = ['#4cc9f0', '#fb7185', '#a78bfa', '#86efac', '#fdba74']
  const circle = [[300,57],[440,135],[385,255],[215,255],[160,135]]
  const line = [[80,110],[190,110],[300,110],[410,110],[520,110]]
  const showLine = (points) => points.map(([x,y],i)=><Child key={i} x={x} y={y} color={kids[i]} />)
  return <div className="relative overflow-hidden rounded-3xl border-2 border-white/10 bg-[#123a2a] p-3">
    <svg viewBox="0 0 600 310" className="w-full" role="img" aria-label="הדמיה מונפשת של סידור הילדים והעברת החפץ">
      <rect x="8" y="8" width="584" height="294" rx="20" fill="none" stroke="#3e8666" strokeWidth="2" />
      {id === 'hoop' && <>
        <polygon points={circle.map(p=>p.join(',')).join(' ')} fill="none" stroke="#f5e9b0" strokeWidth="5" strokeDasharray="7 7" />
        {showLine(circle)}
        <MovingBall hoop path="M300 57 L440 135 L385 255 L215 255 L160 135 Z" duration="8s" />
      </>}
      {id === 'circleball' && <>
        {showLine(circle)}
        <MovingBall path="M300 57 L440 135 L385 255 L215 255 L160 135 Z" duration="8s" />
      </>}
      {(id === 'over' || id === 'under') && <>
        {showLine(line)}
        <MovingBall path={id === 'over' ? 'M80 50 Q135 15 190 50 Q245 15 300 50 Q355 15 410 50 Q465 15 520 50' : 'M80 145 L190 145 L300 145 L410 145 L520 145'} duration="6s" />
        <text x="300" y="237" fill="#fff" fontSize="24" fontWeight="700" textAnchor="middle">{id === 'over' ? 'מעל הראש' : 'מגלגלים בין הרגליים'}</text>
      </>}
      {id === 'relay' && <>
        <path d="M100 245 L500 245" stroke="#fff" strokeWidth="5" strokeDasharray="9 9" />
        <path d="M478 95L500 52L522 95Z" fill="#f59e0b" />
        <Child x={100} y={245} color={kids[0]} />
        <Child x={65} y={275} color={kids[1]} />
        <g><circle r="20" fill="#4cc9f0"/><circle cy="-7" r="9" fill="#f2bd8b"/><animateMotion dur="5s" repeatCount="indefinite" path="M100 245 L500 245 L500 120 L500 245 L100 245"/></g>
        <text x="300" y="207" textAnchor="middle" fontSize="22" fill="#fff">הלוך וחזור לקונוס</text>
      </>}
      {id === 'rings' && <>
        {[115,235,355,475].map((x,i)=><ellipse key={x} cx={x} cy="180" rx="48" ry="27" fill="none" stroke={['#fbbf24','#4cc9f0','#f472b6','#a78bfa'][i]} strokeWidth="9"/>)}
        <g><circle r="20" fill="#4cc9f0"/><circle cy="-7" r="9" fill="#f2bd8b"/><animateMotion dur="6s" repeatCount="indefinite" path="M115 160 L235 160 L355 160 L475 160"/></g>
        <text x="300" y="262" textAnchor="middle" fontSize="22" fill="#fff">מחישוק לחישוק</text>
      </>}
      {id === 'mirror' && <>
        <Child x={190} y={155} color="#4cc9f0" /><Child x={410} y={155} color="#fb7185" />
        <g stroke="#f2bd8b" strokeWidth="11" strokeLinecap="round">
          <path d="M175 172 L150 126"><animate attributeName="d" values="M175 172 L150 126;M175 172 L140 210;M175 172 L150 126" dur="3s" repeatCount="indefinite"/></path>
          <path d="M425 172 L450 126"><animate attributeName="d" values="M425 172 L450 126;M425 172 L460 210;M425 172 L450 126" dur="3s" repeatCount="indefinite"/></path>
        </g>
        <text x="300" y="235" textAnchor="middle" fontSize="23" fill="#fff">מחקים את התנועה</text>
      </>}
      {id === 'snake' && <>
        <path d="M65 220 C150 50 260 270 350 120 S500 130 550 90" fill="none" stroke="#fff" strokeDasharray="8 9" strokeWidth="4"/>
        {kids.map((color,i)=><g key={i}><circle r="17" fill={color}/><circle cy="-5" r="8" fill="#f2bd8b"/><animateMotion dur="8s" repeatCount="indefinite" begin={`-${i*0.8}s`} path="M65 220 C150 50 260 270 350 120 S500 130 550 90"/></g>)}
        <text x="300" y="288" textAnchor="middle" fontSize="22" fill="#fff">הולכים בעקבות המוביל</text>
      </>}
    </svg>
    <p className="text-center text-sm text-white/80">ההדמיה חוזרת מעצמה כדי שאפשר יהיה לצפות שוב.</p>
  </div>
}
export default function QuickGames() {
  const [selected, setSelected] = useState(null)
  const [readMode, setReadMode] = useState('children')
  const game = QUICK_GAMES.find(g => g.id === selected)
  const character = game ? getCharacter(game.characterId) : null
  useEffect(() => () => stopSpeaking(), [])
  const play = (text) => { stopSpeaking(); speak(text) }
  return <main dir="rtl" className="min-h-screen bg-paper p-4 text-ink sm:p-8">
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><p className="font-bold text-gold-deep">כיף של תנועה · הפעלה מהירה לסייעת</p><h1 className="font-display text-3xl sm:text-4xl">משחקי חברה בתנועה</h1></div>
        <a href="#" className="rounded-xl border border-line bg-white px-4 py-3 font-bold">לשיעור המלא</a>
      </header>
      {!game ? <>
        <p className="mb-5 text-lg">בחרי משחק, צפי בהדמיה והקריאי את ההוראה. בלי ניקוד, בלי טיימר ובלי להוציא ילדים מהמשחק.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_GAMES.map(g=><button type="button" key={g.id} onClick={()=>{setSelected(g.id);setReadMode('children')}} className="flex items-center gap-4 rounded-2xl border-2 border-line bg-white p-5 text-right shadow-sm hover:border-gold-deep">
            <span className="text-5xl">{g.icon}</span><span><strong className="block text-2xl">{g.title}</strong><span className="text-sm text-muted">{g.equipment} · {g.formation}</span></span>
          </button>)}
        </div>
      </> : <>
        <button onClick={()=>{stopSpeaking();setSelected(null)}} className="mb-5 rounded-xl bg-white px-5 py-3 font-bold">→ בחירת משחק אחר</button>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="rounded-3xl bg-board p-4 text-chalk sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-24 w-20 overflow-hidden rounded-xl bg-board-3"><CharacterArt character={character} imgClassName="h-full w-full object-cover" figureClassName="h-full w-full" /></div>
              <div><p className="text-sm text-gold">הדמות מסבירה: {character.name}</p><h2 className="font-display text-3xl">{game.title}</h2></div>
            </div>
            <Demo id={game.id} />
            <div className="mt-4 rounded-2xl bg-white/10 p-4"><p className="mb-1 text-sm font-bold text-gold">הדמות אומרת לילדים</p><p className="text-xl leading-relaxed">{game.speech}</p></div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={()=>play(game.speech)} className="rounded-xl bg-gold px-5 py-4 text-lg font-bold text-board">🔊 השמיעי הסבר לילדים</button>
              <button onClick={stopSpeaking} className="rounded-xl border border-white/30 px-4 py-4 font-bold">עצירת קול</button>
            </div>
            {!hasHebrewVoice() && <p className="mt-2 text-sm text-amber-200">הקראה בעברית תלויה בקול עברי המותקן בדפדפן. ההוראות מוצגות גם בכתב.</p>}
          </section>
          <section className="rounded-3xl border border-line bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold">הכנה לסייעת</h3>
            <div className="mb-5 grid gap-2 text-base">
              <p><b>ציוד:</b> {game.equipment}</p><p><b>מקום:</b> {game.space}</p><p><b>סידור:</b> {game.formation}</p>
            </div>
            <ol className="list-decimal space-y-3 pr-5 text-lg leading-relaxed">{game.teacher.map((step,i)=><li key={i}>{step}</li>)}</ol>
            <div className="mt-5 rounded-xl bg-paper p-4"><b>מתי מסיימים?</b><p>{game.finish}</p></div>
            <div className="mt-3 rounded-xl bg-[#fff4e0] p-4"><b>שימי לב:</b><p>{game.safety}</p></div>
            <button onClick={()=>play(game.teacher.join(' '))} className="mt-5 w-full rounded-xl border-2 border-line px-4 py-3 font-bold">🔊 השמיעי גם את הוראות הסייעת</button>
          </section>
        </div>
      </>}
    </div>
  </main>
}
