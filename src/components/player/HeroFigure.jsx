// The lesson's lead characters, drawn in the same illustrated style as the demo
// kids: full body, long modest robes, each with the object from their story.
// They breathe and sway at rest, move their mouth while talking, and can mirror
// any simulation cue through the shared poseFor engine.
import { useId } from 'react'
import { INK, Limb, capsule, limb, mix, poseFor, useTime } from './KidFigure.jsx'

const HEROES = {
  samson: { robe: '#c8955a', sash: '#f59e0b', skin: '#e0ac69', hair: '#5a3418', head: 'mane', beard: true, prop: 'lion' },
  david: { robe: '#d94848', sash: '#ffc83d', skin: '#f1c27d', hair: '#a0522d', head: 'curly', prop: 'harp' },
  esther: { robe: '#8b5cf6', sash: '#ffd60a', skin: '#f3cfa6', hair: '#3b2412', head: 'scarf', scarf: '#c4b5fd', crown: true, prop: 'scroll' },
  miriam: { robe: '#e04f9a', sash: '#ffd60a', skin: '#e8b98a', hair: '#2a1a0e', head: 'scarf', scarf: '#ffd1e8', prop: 'drum' },
  devorah: { robe: '#e3b20b', sash: '#2a9d8f', skin: '#c68642', hair: '#1d1208', head: 'scarf', scarf: '#2a9d8f', prop: 'ball' },
  moshe: { robe: '#2f86c9', sash: '#f4f7ff', skin: '#e0ac69', hair: '#eeeeee', head: 'elder', beard: true, prop: 'staff' },
  yosef: { robe: '#14b8a6', sash: '#ffc83d', skin: '#d9a066', hair: '#2a1a0e', head: 'curly', stripes: ['#ff5a5f', '#ffc83d', '#4cc9f0', '#9ef01a', '#f15bb5'], prop: 'cup' },
  ruth: { robe: '#7cb518', sash: '#ffd60a', skin: '#f1c27d', hair: '#7a4a24', head: 'scarf', scarf: '#f4e3b2', prop: 'wheat' },
  yehoshua: { robe: '#5b6ee1', sash: '#ff8a3d', skin: '#c68642', hair: '#140c06', head: 'curly', prop: 'shofar' },
}

function HeadBack({ h, headY, color }) {
  if (h.head === 'scarf')
    return <path d={`M -31 ${headY - 6} Q -36 ${headY + 40} -30 ${headY + 62} L 30 ${headY + 62} Q 36 ${headY + 40} 31 ${headY - 6} Z`} fill={h.scarf} stroke={INK} strokeWidth={2.4} />
  if (h.head === 'mane')
    return <path d={`M -32 ${headY - 10} Q -46 ${headY + 40} -30 ${headY + 70} Q -10 ${headY + 58} 0 ${headY + 64} Q 10 ${headY + 58} 30 ${headY + 70} Q 46 ${headY + 40} 32 ${headY - 10} Z`} fill={color} stroke={INK} strokeWidth={2.4} />
  return null
}

function HeadFront({ h, headY, color }) {
  const top = headY - 29
  switch (h.head) {
    case 'scarf':
      return (
        <path
          d={`M -30 ${headY + 22} Q -36 ${top - 8} 0 ${top - 6} Q 36 ${top - 8} 30 ${headY + 22} L 24 ${headY + 22} Q 26 ${top + 10} 0 ${top + 10} Q -26 ${top + 10} -24 ${headY + 22} Z`}
          fill={h.scarf}
          stroke={INK}
          strokeWidth={2.4}
        />
      )
    case 'curly':
      return (
        <g fill={color} stroke={INK} strokeWidth={2}>
          {[[-20, 8], [-11, -2], [0, -5], [11, -2], [20, 8]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={top + y} r={10} />
          ))}
        </g>
      )
    case 'elder':
      return <path d={`M -26 ${headY - 2} Q -30 ${top + 4} -14 ${top + 4} L -20 ${headY - 2} Z M 26 ${headY - 2} Q 30 ${top + 4} 14 ${top + 4} L 20 ${headY - 2} Z`} fill={color} stroke={INK} strokeWidth={2} />
    case 'mane':
      return <path d={`M -26 ${headY - 4} Q -28 ${top - 6} 0 ${top - 4} Q 28 ${top - 6} 26 ${headY - 4} Q 20 ${top + 6} 4 ${top + 8} Q -10 ${top + 4} -26 ${headY - 4} Z`} fill={color} stroke={INK} strokeWidth={2.2} />
    default:
      return null
  }
}

// Story objects, held in the right hand (viewer's right) or set beside the feet.
function Prop({ kind, hand, t }) {
  const [hx, hy] = hand
  switch (kind) {
    case 'lion':
      return (
        <g transform={`translate(-64 ${58 + Math.sin(t * 2) * 1.5})`}>
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={Math.cos((i * Math.PI) / 6) * 19} cy={Math.sin((i * Math.PI) / 6) * 19} r={9} fill="#c8641a" stroke={INK} strokeWidth={2} />
          ))}
          <circle cx={-12} cy={-13} r={5} fill="#ffc46b" stroke={INK} strokeWidth={1.8} />
          <circle cx={12} cy={-13} r={5} fill="#ffc46b" stroke={INK} strokeWidth={1.8} />
          <circle r={17} fill="#ffc46b" stroke={INK} strokeWidth={2.2} />
          <circle cx={-6} cy={-4} r={2.4} fill={INK} />
          <circle cx={6} cy={-4} r={2.4} fill={INK} />
          <ellipse cx={0} cy={4} rx={9} ry={6.5} fill="#fff1d6" stroke={INK} strokeWidth={1.6} />
          <path d="M -3 1 L 3 1 L 0 4 Z" fill={INK} />
          <path d="M 0 4 L 0 7 M -4 8 q 4 3 8 0" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      )
    case 'harp':
      return (
        <g transform={`translate(${hx + 4} ${hy - 26})`}>
          <path d="M -12 30 L -12 -8 Q 0 -22 16 -6 L 16 30 Z" fill="none" stroke="#c98a1a" strokeWidth={6} strokeLinejoin="round" />
          {[-6, 0, 6, 11].map((x) => (
            <line key={x} x1={x} y1={-10 + Math.abs(x) * 0.2} x2={x} y2={30} stroke="#fff4d6" strokeWidth={1.6} />
          ))}
        </g>
      )
    case 'scroll':
      return (
        <g transform={`translate(${hx} ${hy - 4}) rotate(-15)`}>
          <rect x={-6} y={-18} width={12} height={36} fill="#fff4d6" stroke={INK} strokeWidth={2} />
          <rect x={-9} y={-22} width={18} height={6} rx={3} fill="#a0522d" stroke={INK} strokeWidth={1.6} />
          <rect x={-9} y={16} width={18} height={6} rx={3} fill="#a0522d" stroke={INK} strokeWidth={1.6} />
        </g>
      )
    case 'drum': {
      const tap = Math.max(0, Math.sin(t * 7)) * 4
      return (
        <g transform={`translate(${hx + 6} ${hy - 4 - tap})`}>
          <circle r={20} fill="#ffd60a" stroke={INK} strokeWidth={2.4} />
          <circle r={14} fill="#fff4d6" stroke={INK} strokeWidth={1.6} />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 17} cy={Math.sin((a * Math.PI) / 180) * 17} r={2.6} fill="#c0c7d6" stroke={INK} strokeWidth={1} />
          ))}
        </g>
      )
    }
    case 'ball':
      return (
        <g>
          <circle cx={hx + 6} cy={hy - 14} r={14} fill="#fff" stroke="#ff5a5f" strokeWidth={4} />
          <g transform={`translate(${-58 + Math.sin(t * 1.5) * 6} ${-120 + Math.sin(t * 3) * 5})`}>
            <ellipse rx={9} ry={7} fill="#ffd60a" stroke={INK} strokeWidth={1.8} />
            <path d="M -3 -6 L -3 6 M 3 -6 L 3 6" stroke={INK} strokeWidth={1.8} />
            <ellipse cx={-3} cy={-10} rx={6} ry={4} fill="#e8f8ff" opacity={0.9} stroke={INK} strokeWidth={1} />
            <ellipse cx={5} cy={-10} rx={6} ry={4} fill="#e8f8ff" opacity={0.9} stroke={INK} strokeWidth={1} />
          </g>
        </g>
      )
    case 'staff':
      return <path d={`M ${hx + 2} ${hy - 50} Q ${hx + 14} ${hy - 62} ${hx + 18} ${hy - 48} M ${hx + 2} ${hy - 50} L ${hx + 4} 86`} fill="none" stroke="#8a5a2b" strokeWidth={7} strokeLinecap="round" />
    case 'cup':
      return (
        <g transform={`translate(${hx + 2} ${hy - 12})`}>
          <path d="M -10 -10 L 10 -10 L 6 8 L -6 8 Z" fill="#ffc83d" stroke={INK} strokeWidth={2} />
          <rect x={-8} y={8} width={16} height={4} rx={2} fill="#e8a200" stroke={INK} strokeWidth={1.6} />
        </g>
      )
    case 'wheat':
      return (
        <g transform={`translate(${hx} ${hy}) rotate(${-10 + Math.sin(t * 2) * 4})`}>
          {[-8, 0, 8].map((dx, i) => (
            <g key={dx} transform={`rotate(${dx * 1.6})`}>
              <line x1={0} y1={0} x2={0} y2={-46} stroke="#c9a227" strokeWidth={2.4} />
              {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} cx={k % 2 ? 3 : -3} cy={-48 + k * 6 - i} rx={3} ry={5} fill="#f2c94c" stroke={INK} strokeWidth={1} />
              ))}
            </g>
          ))}
        </g>
      )
    case 'shofar':
      return <path d={`M ${hx - 4} ${hy} Q ${hx + 10} ${hy - 30} ${hx + 32} ${hy - 30} L ${hx + 34} ${hy - 20} Q ${hx + 14} ${hy - 20} ${hx + 6} ${hy + 4} Z`} fill="#f4e3b2" stroke={INK} strokeWidth={2.2} />
    default:
      return null
  }
}

function Hero({ id, pose, t, talking, x = 0, scale = 1 }) {
  const clip = useId()
  const h = HEROES[id] ?? HEROES.samson
  const shoulderY = -70
  const hipY = -2
  const headY = shoulderY - 34
  const hairC = h.hair
  const arms = [-1, 1].map((side, i) => limb([side * 22, shoulderY + 6], side, pose.arms[i][0], 34, pose.arms[i][1], 32))
  const legs = [-1, 1].map((side, i) => {
    const [a, lift, knee] = pose.legs[i]
    return limb([side * 11, hipY], side, a, 42 - knee * 0.55, 0, 42 + lift * 0.1)
  })
  const feet = legs.map((l) => l.end)
  const hemY = Math.max(hipY + 52, Math.min(feet[0][1], feet[1][1]) - 14)
  const hemL = Math.min(-34, feet[0][0] - 16)
  const hemR = Math.max(34, feet[1][0] + 16)
  const robePath = `M -24 ${shoulderY} Q 0 ${shoulderY - 8} 24 ${shoulderY} Q 30 ${shoulderY + 34} 24 ${hipY - 6} L ${hemR} ${hemY} Q 0 ${hemY + 8} ${hemL} ${hemY} L -24 ${hipY - 6} Q -30 ${shoulderY + 34} -24 ${shoulderY} Z`
  const mouthOpen = talking && Math.sin(t * 15) > -0.2

  return (
    <g transform={`translate(${x} ${pose.y * scale}) scale(${scale})`} strokeLinejoin="round">
      <ellipse cx={0} cy={92 - pose.y} rx={44} ry={8} fill="#000" opacity={0.25} />
      <HeadBack h={h} headY={headY} color={hairC} />

      {/* legs below the robe, with sandals */}
      {legs.map((l, i) => {
        const side = [-1, 1][i]
        return (
          <g key={`l${i}`}>
            <Limb parts={[[[side * 11, hipY], l.elbow, 10, 8, h.skin], [l.elbow, l.end, 8, 6.5, h.skin]]} />
            <ellipse cx={l.end[0] + side * 4} cy={l.end[1] + 4} rx={13} ry={6.5} fill="#8a5a2b" stroke={INK} strokeWidth={2.4} />
            <path d={`M ${l.end[0] - 5} ${l.end[1] - 4} L ${l.end[0] + 5} ${l.end[1] + 2}`} stroke="#8a5a2b" strokeWidth={3} strokeLinecap="round" />
          </g>
        )
      })}

      {/* long robe; Yosef's is striped in many colours */}
      <rect x={-7} y={shoulderY - 12} width={14} height={14} fill={h.skin} stroke={INK} strokeWidth={2} />
      <g transform={`translate(0 ${34 * (1 - pose.belly)}) scale(${pose.belly} 1)`}>
        <path d={robePath} fill={h.robe} stroke={INK} strokeWidth={2.6} />
        {h.stripes && (
          <>
            <clipPath id={clip}>
              <path d={robePath} />
            </clipPath>
            <g clipPath={`url(#${clip})`}>
              {h.stripes.map((c, i) => (
                <rect key={c} x={-80} y={shoulderY + 4 + i * 30} width={160} height={11} fill={c} transform={`rotate(-12 0 ${shoulderY + 10 + i * 30})`} />
              ))}
            </g>
            <path d={robePath} fill="none" stroke={INK} strokeWidth={2.6} />
          </>
        )}
        <path d={`M -10 ${shoulderY - 3} Q 0 ${shoulderY + 8} 10 ${shoulderY - 3}`} fill="none" stroke={mix(h.robe, '#000000', 0.25)} strokeWidth={3} strokeLinecap="round" />
        <path d={`M -27 ${hipY - 14} Q 0 ${hipY - 6} 27 ${hipY - 14} L 27 ${hipY - 4} Q 0 ${hipY + 4} -27 ${hipY - 4} Z`} fill={h.sash} stroke={INK} strokeWidth={2.2} />
        <path d={`M 8 ${hipY - 2} l -4 18 l 9 -2 Z`} fill={h.sash} stroke={INK} strokeWidth={2} />
      </g>

      {/* long sleeves to the wrist */}
      {arms.map((a, i) => (
        <g key={`a${i}`}>
          <Limb parts={[[a.elbow, a.end, 9, 8.5, h.robe], [[[-1, 1][i] * 22, shoulderY + 6], a.elbow, 11, 9, h.robe]]} />
          <circle cx={a.end[0]} cy={a.end[1]} r={8.5} fill={h.skin} stroke={INK} strokeWidth={2.2} />
        </g>
      ))}

      {/* head */}
      {h.head !== 'scarf' && (
        <>
          <circle cx={-26} cy={headY + 2} r={6} fill={h.skin} stroke={INK} strokeWidth={2} />
          <circle cx={26} cy={headY + 2} r={6} fill={h.skin} stroke={INK} strokeWidth={2} />
        </>
      )}
      <ellipse cx={0} cy={headY} rx={25} ry={28} fill={h.skin} stroke={INK} strokeWidth={2.4} />
      {h.beard && (
        <path
          d={`M -24 ${headY + 2} Q -26 ${headY + 36} 0 ${headY + 44} Q 26 ${headY + 36} 24 ${headY + 2} Q 18 ${headY + 22} 0 ${headY + 20} Q -18 ${headY + 22} -24 ${headY + 2} Z`}
          fill={hairC}
          stroke={INK}
          strokeWidth={2.2}
        />
      )}
      <HeadFront h={h} headY={headY} color={hairC} />
      {h.crown && <path d={`M -16 ${headY - 34} L -16 ${headY - 48} L -8 ${headY - 40} L 0 ${headY - 52} L 8 ${headY - 40} L 16 ${headY - 48} L 16 ${headY - 34} Z`} fill="#ffc83d" stroke={INK} strokeWidth={2.2} />}
      <g fill={INK}>
        <ellipse cx={-9} cy={headY - 2} rx={3.6} ry={4.4} />
        <ellipse cx={9} cy={headY - 2} rx={3.6} ry={4.4} />
      </g>
      <circle cx={-8} cy={headY - 3.5} r={1.3} fill="#fff" />
      <circle cx={10} cy={headY - 3.5} r={1.3} fill="#fff" />
      <path d={`M -14 ${headY - 12} q 5 -3 9 0 M 5 ${headY - 12} q 5 -3 9 0`} fill="none" stroke={h.head === 'elder' ? '#9aa3b5' : INK} strokeWidth={2.4} strokeLinecap="round" />
      {!h.beard && (
        <>
          <circle cx={-15} cy={headY + 7} r={4.5} fill="#ff7a8a" opacity={0.35} />
          <circle cx={15} cy={headY + 7} r={4.5} fill="#ff7a8a" opacity={0.35} />
        </>
      )}
      {mouthOpen ? (
        <ellipse cx={0} cy={headY + 11} rx={5.5} ry={4 + Math.abs(Math.sin(t * 15)) * 2} fill="#8a2a3a" stroke={INK} strokeWidth={1.6} />
      ) : (
        <path d={`M -7 ${headY + 9} Q 0 ${headY + 16} 7 ${headY + 9}`} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      )}

      <Prop kind={h.prop} hand={arms[1].end} t={t} />
    </g>
  )
}

// Ruth and Yehoshua appear together; everyone else stands alone.
export default function HeroFigure({ id, cue = 'idle', talking = false, className = 'h-full w-full', label }) {
  const t = useTime()
  const pose = poseFor(cue, t)
  const pair = id === 'ruth'
  return (
    <svg viewBox={pair ? '-170 -180 340 290' : '-110 -180 220 290'} className={className} role="img" aria-label={label}>
      {pair ? (
        <>
          <Hero id="yehoshua" pose={poseFor(cue, t, 0.3)} t={t} talking={talking} x={60} scale={0.92} />
          <Hero id="ruth" pose={pose} t={t} talking={talking} x={-60} scale={0.92} />
        </>
      ) : (
        <Hero id={id} pose={pose} t={t} talking={talking} />
      )}
    </svg>
  )
}
