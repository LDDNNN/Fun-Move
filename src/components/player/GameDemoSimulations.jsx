// Top-down simulation of 30 kids that reacts to the avatar's current cue:
// "שליטה"/"אדום" freezes everyone into ice statues, "כחול" starts 3-3 breathing,
// a run call sends the front of each column around cone 2 for a high-five.
import { useEffect, useMemo, useState } from 'react'

const W = 600
const H = 340
const SHIRTS = ['#ff8a3d', '#4cc9f0', '#f15bb5', '#9ef01a', '#ffd60a', '#b388ff']
const SKIN = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac']

function useClock(fps = 30) {
  const [now, setNow] = useState(() => performance.now())
  useEffect(() => {
    let raf
    let last = 0
    const tick = (t) => {
      if (t - last > 1000 / fps) {
        last = t
        setNow(t)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fps])
  return now / 1000
}

// Snake path between the "sea" cones for Moshe's line.
const linePoint = (s) => {
  const x = 560 - s * 520
  const y = 170 + Math.sin(s * Math.PI * 2) * 70
  return [x, y]
}

export function basePositions(formation) {
  const kids = []
  if (formation === 'rows') {
    for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) kids.push({ x: 110 + c * 76, y: 70 + r * 52, row: r, col: c })
  } else if (formation === 'columns') {
    for (let c = 0; c < 6; c++) for (let r = 0; r < 5; r++) kids.push({ x: 75 + c * 90, y: 210 + r * 28, row: r, col: c })
  } else if (formation === 'circle') {
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2
      kids.push({ x: 300 + Math.cos(a) * 130, y: 170 + Math.sin(a) * 120, angle: a })
    }
  } else if (formation === 'pairs') {
    for (let p = 0; p < 15; p++) {
      const cx = 100 + (p % 5) * 100
      const cy = 80 + Math.floor(p / 5) * 95
      kids.push({ x: cx - 22, y: cy, pair: p, side: -1, cx, cy })
      kids.push({ x: cx + 22, y: cy, pair: p, side: 1, cx, cy })
    }
  } else if (formation === 'line') {
    for (let i = 0; i < 30; i++) {
      const s = 0.04 + i * 0.03
      const [x, y] = linePoint(s)
      kids.push({ x, y, s })
    }
  }
  return kids.map((k, i) => ({ ...k, i, shirt: SHIRTS[i % SHIRTS.length], skin: SKIN[(i * 7) % SKIN.length] }))
}

// Perimeter of the 4-station loop (Samson's gates).
const STATIONS = [
  { x: 110, y: 80, icon: '🦘', label: 'קפיצה' },
  { x: 490, y: 80, icon: '🐛', label: 'זחילה' },
  { x: 490, y: 270, icon: '🦩', label: 'שיווי משקל' },
  { x: 110, y: 270, icon: '🎯', label: 'זריקה' },
]
function loopPoint(u) {
  const seg = Math.floor(u * 4) % 4
  const f = u * 4 - Math.floor(u * 4)
  const a = STATIONS[seg]
  const b = STATIONS[(seg + 1) % 4]
  return [a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f]
}

function placeKid(k, cue, t, formation) {
  let { x, y } = k
  let scale = 1
  let tint = null
  let hands = false
  const ph = k.i * 0.37

  switch (cue) {
    case 'move':
      x += Math.sin(t * 1.7 + ph) * 9
      y += Math.cos(t * 1.3 + ph * 2) * 7
      break
    case 'jump':
      scale = 1 + 0.38 * Math.abs(Math.sin(t * 4.5 + ph * 0.3))
      break
    case 'freeze':
      tint = '#8fd8ff'
      break
    case 'stop':
      tint = '#ff9aa0'
      break
    case 'breathe':
      scale = 1 + 0.13 * Math.sin((t * Math.PI * 2) / 6)
      hands = true
      break
    case 'run':
      if (formation === 'columns' && k.row === 0) {
        const u = (t * 0.32 + k.col * 0.07) % 1
        const coneY = 70
        if (u < 0.42) {
          x = k.x + 16
          y = k.y - (u / 0.42) * (k.y - coneY)
        } else if (u < 0.58) {
          const a = ((u - 0.42) / 0.16) * Math.PI
          x = k.x + Math.cos(a) * 16
          y = coneY - Math.sin(a) * 16
        } else {
          x = k.x - 16
          y = coneY + ((u - 0.58) / 0.42) * (k.y - coneY)
        }
      } else {
        scale = 1 + 0.08 * Math.abs(Math.sin(t * 9 + ph))
        y += Math.sin(t * 9 + ph) * 1.5
      }
      break
    case 'clap':
      scale = 1 + 0.12 * Math.max(0, Math.sin(t * 6.3))
      if (formation === 'circle') {
        const a = k.angle + t * 0.18
        x = 300 + Math.cos(a) * 130
        y = 170 + Math.sin(a) * 120
      }
      break
    case 'walk':
      if (formation === 'line') {
        const [lx, ly] = linePoint((k.s + t * 0.018) % 0.93)
        x = lx
        y = ly
      } else {
        y += Math.sin(t * 4 + ph) * 3
      }
      break
    case 'fine':
      x += Math.sin(t * 14 + ph) * 1.4
      hands = true
      break
    case 'team':
      if (formation === 'pairs') {
        x = k.cx + k.side * (12 + 6 * Math.abs(Math.sin(t * 1.6 + k.pair)))
      } else {
        x += Math.sin(t * 2 + ph) * 5
      }
      break
    case 'stations': {
      const [sx, sy] = loopPoint((k.i / 30 + t * 0.025) % 1)
      x = sx
      y = sy
      break
    }
    case 'pass':
      if (formation === 'circle') scale = 1.02
      break
    default:
      y += Math.sin(t * 2 + ph) * 1.5
  }
  return { x, y, scale, tint, hands }
}

function Props({ formation, cue, t }) {
  const items = []

  if (formation === 'columns') {
    for (let c = 0; c < 6; c++) {
      const x = 75 + c * 90
      items.push(<Cone key={`c1-${c}`} x={x} y={150} color="#ff9f1c" />, <Cone key={`c2-${c}`} x={x} y={70} color="#ff9f1c" label="2" />)
    }
    items.push(<line key="start" x1={30} x2={570} y1={190} y2={190} stroke="#f4f7ff" strokeWidth={3} strokeDasharray="10 8" opacity={0.6} />)
  }

  if (formation === 'line') {
    const pts = Array.from({ length: 40 }, (_, i) => linePoint(i / 39).join(',')).join(' ')
    items.push(<polyline key="path" points={pts} fill="none" stroke="#f4f7ff" strokeWidth={34} strokeLinecap="round" opacity={0.18} />)
    for (let i = 0; i < 12; i++) {
      const [x, y] = linePoint(i / 11)
      items.push(<Cone key={`sa${i}`} x={x} y={y - 38} color="#2f8fff" />, <Cone key={`sb${i}`} x={x} y={y + 38} color="#2f8fff" />)
    }
  }

  if (cue === 'stations') {
    STATIONS.forEach((s, i) =>
      items.push(
        <g key={`st${i}`} transform={`translate(${s.x},${s.y})`}>
          <circle r={34} fill="#ffc83d" opacity={0.16} />
          <text y={8} textAnchor="middle" fontSize={26}>{s.icon}</text>
        </g>,
      ),
    )
  }

  if (cue === 'pass' && formation === 'circle') {
    const a = t * 1.3
    items.push(<Ball key="ball" x={300 + Math.cos(a) * 130} y={170 + Math.sin(a) * 120} />)
    const b = -t * 0.95 + Math.PI
    items.push(
      <g key="racers">
        <Kid x={300 + Math.cos(b) * 165} y={170 + Math.sin(b) * 152} shirt="#ffd60a" skin="#e0ac69" scale={1.1} />
        <Kid x={300 + Math.cos(b - 0.12) * 165} y={170 + Math.sin(b - 0.12) * 152} shirt="#ffd60a" skin="#c68642" scale={1.1} />
      </g>,
    )
  }

  return items
}

function Cone({ x, y, color, label }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <polygon points="0,-11 9,7 -9,7" fill={color} />
      <rect x={-11} y={6} width={22} height={4} rx={2} fill={color} opacity={0.7} />
      {label && <text y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f4f7ff">{label}</text>}
    </g>
  )
}

function Ball({ x, y }) {
  return <circle cx={x} cy={y} r={7} fill="#fff" stroke="#ff5a5f" strokeWidth={2.5} />
}

function Kid({ x, y, shirt, skin, scale = 1, tint, hands }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx={0} cy={12} rx={9} ry={3} fill="#000" opacity={0.25} />
      <circle r={11} fill={tint ?? shirt} stroke={tint ? '#ffffff' : 'rgba(0,0,0,.25)'} strokeWidth={tint ? 2.5 : 1.5} />
      <circle r={6} cy={-1} fill={skin} />
      {hands && <circle r={3} cx={0} cy={7} fill={skin} stroke="rgba(0,0,0,.3)" />}
    </g>
  )
}

const STATUS = {
  freeze: { text: '🧊 פסלי קרח!', color: '#8fd8ff' },
  stop: { text: '✋ עוצרים!', color: '#ff5a5f' },
  jump: { text: '🦘 קופצים!', color: '#ffc83d' },
  run: { text: '🏃 רצים!', color: '#3ccf7a' },
  move: { text: '🟢 זזים!', color: '#3ccf7a' },
  clap: { text: '👏 בקצב!', color: '#ffc83d' },
  pass: { text: '⚽ מוסרים!', color: '#ffc83d' },
  walk: { text: '🚶 הולכים!', color: '#3ccf7a' },
  fine: { text: '🧵 אצבעות עדינות', color: '#ffc83d' },
  team: { text: '🤝 גב אל גב!', color: '#ffc83d' },
  stations: { text: '🏁 4 תחנות ברצף', color: '#ffc83d' },
}

export default function GameDemoSimulations({ formation, cue, cueAt, showSpacing = false }) {
  useClock() // re-render every frame; time is measured from the moment the cue fired
  const t = Math.max(0, (Date.now() - (cueAt || 0)) / 1000)
  const kids = useMemo(() => basePositions(formation), [formation])
  const status = STATUS[cue]
  const breathingIn = Math.sin((t * Math.PI * 2) / 6) >= 0

  return (
    <div className="relative h-full w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="הדמיה של 30 ילדים במרחב">
        <rect x={6} y={6} width={W - 12} height={H - 12} rx={22} fill="#123a2a" stroke="#2e6b4f" strokeWidth={3} />
        <circle cx={W / 2} cy={H / 2} r={46} fill="none" stroke="#2e6b4f" strokeWidth={3} />
        <line x1={W / 2} x2={W / 2} y1={6} y2={H - 6} stroke="#2e6b4f" strokeWidth={3} />

        <Props formation={formation} cue={cue} t={t} />

        {showSpacing &&
          kids.map((k) => <circle key={`sp${k.i}`} cx={k.x} cy={k.y} r={formation === 'columns' ? 13 : 22} fill="none" stroke="#ffc83d" strokeDasharray="4 4" opacity={0.55} />)}

        {kids.map((k) => {
          const p = placeKid(k, cue, t, formation)
          return <Kid key={k.i} x={p.x} y={p.y} shirt={k.shirt} skin={k.skin} scale={p.scale} tint={p.tint} hands={p.hands} />
        })}

        {cue === 'pass' && formation === 'pairs' &&
          Array.from({ length: 15 }, (_, p) => {
            const k = kids[p * 2]
            const f = (Math.sin(t * 2.4 + p) + 1) / 2
            return <Ball key={`b${p}`} x={k.cx - 22 + f * 44} y={k.cy - Math.sin(f * Math.PI) * 22} />
          })}

        {cue === 'run' && formation === 'columns' &&
          kids
            .filter((k) => k.row === 0)
            .map((k) => {
              const u = (t * 0.32 + k.col * 0.07) % 1
              return u > 0.93 ? <text key={`hf${k.col}`} x={k.x} y={k.y - 20} textAnchor="middle" fontSize={20}>✋</text> : null
            })}
      </svg>

      {status && (
        <div className="pop-in absolute top-3 right-3 rounded-full px-4 py-1.5 text-lg font-bold text-board shadow-lg" key={cue} style={{ background: status.color }}>
          {status.text}
        </div>
      )}
      {cue === 'breathe' && (
        <div className="absolute bottom-3 right-3 rounded-full bg-calm px-4 py-1.5 text-lg font-bold text-white shadow-lg">
          {breathingIn ? '🫁 שואפים 1-2-3' : '🌬️ נושפים 1-2-3'}
        </div>
      )}
    </div>
  )
}
