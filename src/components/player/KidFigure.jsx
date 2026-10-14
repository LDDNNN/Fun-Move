// A big front-facing kid the class copies like a mirror. Each cue is a pose:
// jump, ice-statue freeze, belly breathing, running, clapping, passing a ball...
import { useEffect, useState } from 'react'

function useTime(fps = 30) {
  const [t, setT] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let raf
    let last = 0
    const start = performance.now()
    const tick = (now) => {
      if (now - last > 1000 / fps) {
        last = now
        setT((now - start) / 1000)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fps])
  return t
}

const rad = (d) => (d * Math.PI) / 180

// Angles in degrees from "hanging straight down"; positive swings the limb outward.
function limb(origin, side, a1, len1, bend, len2) {
  const [ox, oy] = origin
  const ex = ox + side * Math.sin(rad(a1)) * len1
  const ey = oy + Math.cos(rad(a1)) * len1
  const a2 = a1 + bend
  const hx = ex + side * Math.sin(rad(a2)) * len2
  const hy = ey + Math.cos(rad(a2)) * len2
  return { elbow: [ex, ey], end: [hx, hy] }
}

// Pose for a cue at time t (seconds). Returns limb angles and body offsets.
export function poseFor(cue, t, phase = 0) {
  const w = (speed) => Math.sin((t + phase) * speed)
  const base = { y: 0, arms: [[12, -10], [12, -10]], legs: [[4, 0, 0], [4, 0, 0]], tint: null, belly: 1, ball: null, hands: false }
  switch (cue) {
    case 'jump': {
      const up = Math.max(0, w(5.2))
      return { ...base, y: -up * 46, arms: [[60 + up * 110, 10], [60 + up * 110, 10]], legs: [[8 + up * 6, -up * 40, 0], [8 + up * 6, -up * 40, 0]] }
    }
    case 'freeze':
      return { ...base, arms: [[95, 0], [95, 0]], legs: [[14, 0, 0], [14, 0, 0]], tint: '#8fd8ff' }
    case 'stop':
      return { ...base, arms: [[175, 0], [10, -6]], tint: '#ffb3b6' }
    case 'breathe': {
      const b = Math.sin(((t + phase) * Math.PI * 2) / 6)
      return { ...base, arms: [[18, -150], [18, -150]], belly: 1 + 0.09 * b, hands: true }
    }
    case 'run': {
      const s = w(9)
      return { ...base, y: -Math.abs(s) * 8, arms: [[20 + s * 30, -70], [20 - s * 30, -70]], legs: [[4, 0, Math.max(0, s) * 26], [4, 0, Math.max(0, -s) * 26]] }
    }
    case 'walk': {
      const s = w(4.5)
      return { ...base, arms: [[12 + s * 14, -20], [12 - s * 14, -20]], legs: [[4, 0, Math.max(0, s) * 12], [4, 0, Math.max(0, -s) * 12]] }
    }
    case 'clap': {
      const c = (w(6.5) + 1) / 2
      return { ...base, y: -c * 4, arms: [[120 + c * 25, -105 + c * 25], [120 + c * 25, -105 + c * 25]] }
    }
    case 'move': {
      const s = w(3)
      return { ...base, y: -Math.abs(s) * 6, arms: [[60 + s * 40, 30], [60 - s * 40, 30]], legs: [[8 + s * 4, 0, 0], [8 - s * 4, 0, 0]] }
    }
    case 'fine': {
      const s = w(10)
      return { ...base, arms: [[25, -125 + s * 6], [25, -125 - s * 6]], hands: true }
    }
    case 'pass': {
      const f = ((t + phase) * 0.7) % 1
      return { ...base, arms: [[70 - f * 40, 50], [20, -20]], ball: f }
    }
    case 'team':
      return { ...base, arms: [[165, 0], [165, 0]] }
    case 'stations': {
      const up = Math.max(0, w(4))
      return { ...base, y: -up * 30, arms: [[70, 40], [70, 40]], legs: [[10, -up * 30, 0], [10, -up * 30, 0]] }
    }
    default:
      return { ...base, y: w(2) * 1.5 }
  }
}

const INK = '#2b2140'

// A rounded, tapered limb segment from a (radius r1) to b (radius r2).
function capsule([ax, ay], [bx, by], r1, r2) {
  const len = Math.hypot(bx - ax, by - ay) || 0.001
  const nx = -(by - ay) / len
  const ny = (bx - ax) / len
  const p = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`
  return `M ${p(ax + nx * r1, ay + ny * r1)} L ${p(bx + nx * r2, by + ny * r2)} A ${r2} ${r2} 0 0 0 ${p(bx - nx * r2, by - ny * r2)} L ${p(ax - nx * r1, ay - ny * r1)} A ${r1} ${r1} 0 0 0 ${p(ax + nx * r1, ay + ny * r1)} Z`
}

const mix = (a, b, k) => {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [n(a), n(b)]
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('')}`
}

function Hair({ style, color, top }) {
  switch (style) {
    case 'curly':
      return (
        <g fill={color} stroke={INK} strokeWidth={2}>
          {[[-20, 6], [-12, -4], [0, -8], [12, -4], [20, 6], [-24, 18], [24, 18]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={top + y} r={10} />
          ))}
        </g>
      )
    case 'pigtails':
      return (
        <g fill={color} stroke={INK} strokeWidth={2}>
          <ellipse cx={-33} cy={top + 30} rx={9} ry={14} transform={`rotate(20 -33 ${top + 30})`} />
          <ellipse cx={33} cy={top + 30} rx={9} ry={14} transform={`rotate(-20 33 ${top + 30})`} />
          <path d={`M -27 ${top + 26} Q -28 ${top - 4} 0 ${top - 3} Q 28 ${top - 4} 27 ${top + 26} Q 14 ${top + 10} 0 ${top + 14} Q -14 ${top + 10} -27 ${top + 26} Z`} />
          <circle cx={-27} cy={top + 20} r={4} fill="#ff5a8a" stroke="none" />
          <circle cx={27} cy={top + 20} r={4} fill="#ff5a8a" stroke="none" />
        </g>
      )
    case 'long':
      return (
        <path
          d={`M -27 ${top + 26} Q -29 ${top - 4} 0 ${top - 3} Q 29 ${top - 4} 27 ${top + 26} Q 16 ${top + 8} -2 ${top + 12} Q -14 ${top + 16} -27 ${top + 26} Z`}
          fill={color}
          stroke={INK}
          strokeWidth={2}
        />
      )
    default:
      return (
        <path
          d={`M -26 ${top + 22} Q -27 ${top - 4} 0 ${top - 4} Q 27 ${top - 4} 26 ${top + 22} Q 20 ${top + 8} 6 ${top + 10} Q -6 ${top + 4} -14 ${top + 12} Q -20 ${top + 14} -26 ${top + 22} Z`}
          fill={color}
          stroke={INK}
          strokeWidth={2}
        />
      )
  }
}

// Joined segments: all outlines first, then all fills, so joints stay seamless.
function Limb({ parts }) {
  return (
    <g>
      {parts.map(([a, b, r1, r2], i) => (
        <path key={`o${i}`} d={capsule(a, b, r1, r2)} fill={INK} stroke={INK} strokeWidth={4.6} />
      ))}
      {parts.map(([a, b, r1, r2, fill], i) => (
        <path key={`f${i}`} d={capsule(a, b, r1, r2)} fill={fill} />
      ))}
    </g>
  )
}

// One illustrated child, front-facing, full body. Girls wear a knee-length skirt
// over leggings; boys wear long trousers. Both have sleeves to the elbow.
function Figure({ pose, kid, scale = 1, x = 0, y = 0 }) {
  const { shirt, skin, hair, style = 'short', bottom = '#2f4a8a', shoe = '#ff5a5f', skirt = null } = kid
  const ice = pose.tint === '#8fd8ff'
  const skinC = ice ? '#cdeeff' : skin
  const shirtC = pose.tint ?? shirt
  const bottomC = ice ? '#a8dcf5' : bottom
  const skirtC = skirt && (ice ? '#9fd6f2' : skirt)
  const shoeC = ice ? '#7cc4ea' : shoe
  const hairC = ice ? '#5fb4e0' : hair
  const shade = mix(shirtC, '#000000', 0.18)

  const shoulderY = -64
  const hipY = -2
  const arms = [-1, 1].map((side, i) => limb([side * 19, shoulderY + 6], side, pose.arms[i][0], 30, pose.arms[i][1], 28))
  const legs = [-1, 1].map((side, i) => {
    const [a, lift, knee] = pose.legs[i]
    const thigh = 36 - knee * 0.55
    return limb([side * 10, hipY], side, a, thigh, 0, 38 + lift * 0.1)
  })
  const headY = shoulderY - 32
  const hairTop = headY - 27
  const mouthOpen = pose.y < -18 || pose.tint === '#ffb3b6'

  // Skirt hem follows the knees so jumps and wide stances still read clearly.
  const kneeL = legs[0].elbow
  const kneeR = legs[1].elbow
  const hemY = Math.max(hipY + 26, (kneeL[1] + kneeR[1]) / 2 + 2)
  const hemL = Math.min(-28, kneeL[0] - 12)
  const hemR = Math.max(28, kneeR[0] + 12)

  return (
    <g transform={`translate(${x},${y + pose.y * scale}) scale(${scale})`} strokeLinejoin="round">
      <ellipse cx={0} cy={86 - pose.y} rx={36} ry={7} fill="#000" opacity={0.22} />

      {style === 'long' && (
        <path d={`M -27 ${headY - 6} Q -34 ${headY + 30} -24 ${shoulderY + 14} L 24 ${shoulderY + 14} Q 34 ${headY + 30} 27 ${headY - 6} Z`} fill={hairC} stroke={INK} strokeWidth={2} />
      )}

      {/* legs + shoes */}
      {legs.map((l, i) => {
        const side = [-1, 1][i]
        const hip = [side * 10, hipY]
        return (
          <g key={`l${i}`}>
            <Limb parts={[[hip, l.elbow, 9.5, 8, bottomC], [l.elbow, l.end, 8, 6.5, bottomC]]} />
            <ellipse cx={l.end[0] + side * 4} cy={l.end[1] + 4} rx={12} ry={7} fill={shoeC} stroke={INK} strokeWidth={2.4} />
            <path d={`M ${l.end[0] + side * 4 - 10} ${l.end[1] + 7} L ${l.end[0] + side * 4 + 10} ${l.end[1] + 7}`} stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
          </g>
        )
      })}

      {skirtC && (
        <g>
          <path
            d={`M -19 ${hipY - 10} L 19 ${hipY - 10} L ${hemR} ${hemY} Q 0 ${hemY + 8} ${hemL} ${hemY} Z`}
            fill={skirtC}
            stroke={INK}
            strokeWidth={2.4}
          />
          <path d={`M -7 ${hipY - 8} L ${hemL / 2.4} ${hemY + 2} M 7 ${hipY - 8} L ${hemR / 2.4} ${hemY + 2}`} stroke={mix(skirtC, '#000000', 0.2)} strokeWidth={2} fill="none" />
        </g>
      )}

      {/* neck + torso (the belly breathes in 'breathe') */}
      <rect x={-7} y={shoulderY - 12} width={14} height={14} fill={skinC} stroke={INK} strokeWidth={2} />
      <g transform={`translate(0 ${34 * (1 - pose.belly)}) scale(${pose.belly} 1)`}>
        <path
          d={`M -22 ${shoulderY} Q 0 ${shoulderY - 8} 22 ${shoulderY} Q 26 ${shoulderY + 30} 19 ${hipY + (skirtC ? -8 : 2)} L -19 ${hipY + (skirtC ? -8 : 2)} Q -26 ${shoulderY + 30} -22 ${shoulderY} Z`}
          fill={shirtC}
          stroke={INK}
          strokeWidth={2.4}
        />
        <path d={`M -9 ${shoulderY - 3} Q 0 ${shoulderY + 6} 9 ${shoulderY - 3}`} fill="none" stroke={shade} strokeWidth={3} strokeLinecap="round" />
        <circle cx={0} cy={shoulderY + 28} r={7} fill="#fff" opacity={0.85} />
        <path d={`M -3 ${shoulderY + 28} l 2 2 l 4 -4`} fill="none" stroke={shirtC} strokeWidth={2} strokeLinecap="round" />
      </g>

      {/* arms: sleeve to the elbow, then forearm and hand */}
      {arms.map((a, i) => {
        const shoulder = [[-1, 1][i] * 19, shoulderY + 6]
        return (
          <g key={`a${i}`}>
            <Limb parts={[[a.elbow, a.end, 6.5, 5.5, skinC], [shoulder, a.elbow, 10, 8, shirtC]]} />
            <circle cx={a.end[0]} cy={a.end[1]} r={8.5} fill={skinC} stroke={INK} strokeWidth={2.2} />
          </g>
        )
      })}

      {/* head */}
      <circle cx={-25} cy={headY + 2} r={6} fill={skinC} stroke={INK} strokeWidth={2} />
      <circle cx={25} cy={headY + 2} r={6} fill={skinC} stroke={INK} strokeWidth={2} />
      <ellipse cx={0} cy={headY} rx={25} ry={26} fill={skinC} stroke={INK} strokeWidth={2.4} />
      <Hair style={style} color={hairC} top={hairTop} />
      <g fill={INK}>
        <ellipse cx={-9} cy={headY + 2} rx={3.6} ry={4.4} />
        <ellipse cx={9} cy={headY + 2} rx={3.6} ry={4.4} />
      </g>
      <circle cx={-8} cy={headY + 0.5} r={1.3} fill="#fff" />
      <circle cx={10} cy={headY + 0.5} r={1.3} fill="#fff" />
      <path d={`M -14 ${headY - 7} q 5 -3 9 0 M 5 ${headY - 7} q 5 -3 9 0`} fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx={-15} cy={headY + 10} r={4.5} fill="#ff7a8a" opacity={0.35} />
      <circle cx={15} cy={headY + 10} r={4.5} fill="#ff7a8a" opacity={0.35} />
      {mouthOpen ? (
        <ellipse cx={0} cy={headY + 13} rx={5} ry={4.5} fill="#8a2a3a" stroke={INK} strokeWidth={1.6} />
      ) : (
        <path d={`M -7 ${headY + 11} Q 0 ${headY + 18} 7 ${headY + 11}`} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      )}

      {ice && (
        <rect x={-84} y={shoulderY - 70} width={168} height={166} rx={18} fill="#bfeaff" opacity={0.28} stroke="#e8f8ff" strokeWidth={3} />
      )}
    </g>
  )
}

// The class: a mix of boys and girls, different skin tones and hair.
const KIDS = [
  { shirt: '#ff8a3d', skin: '#f1c27d', hair: '#4a2c17', style: 'short', bottom: '#2f4a8a', shoe: '#ff5a5f' },
  { shirt: '#4cc9f0', skin: '#c68642', hair: '#1d1208', style: 'pigtails', bottom: '#3a3f6b', shoe: '#f15bb5', skirt: '#7b5cd6' },
  { shirt: '#f15bb5', skin: '#ffdbac', hair: '#a0522d', style: 'long', bottom: '#4a3a6b', shoe: '#ffd60a', skirt: '#2a9d8f' },
  { shirt: '#9ef01a', skin: '#8d5524', hair: '#140c06', style: 'curly', bottom: '#33415c', shoe: '#4cc9f0' },
  { shirt: '#ffd60a', skin: '#e0ac69', hair: '#3b2412', style: 'long', bottom: '#3a3f6b', shoe: '#ff8a3d', skirt: '#e63946' },
]

// The scene: one big kid demonstrating, the rest of the class doing it too.
export default function DemoStage({ cue, color = '#ffc83d' }) {
  const t = useTime()
  const pose = poseFor(cue, t)
  const breathingIn = Math.sin((t * Math.PI * 2) / 6) >= 0
  const f = pose.ball

  return (
    <svg viewBox="-300 -190 600 330" className="h-full w-full" role="img" aria-label="ילדים מדגימים את התנועה">
      <ellipse cx={0} cy={112} rx={290} ry={22} fill={color} opacity={0.12} />

      {/* the class, smaller and behind, copying the move */}
      {[-250, -150, 150, 250].map((x, i) => (
        <Figure key={x} pose={poseFor(cue, t, 0.18 * (i + 1))} kid={KIDS[i + 1]} scale={0.55} x={x} y={52} />
      ))}

      {cue === 'run' && (
        <g>
          <path d="M 120 100 A 60 18 0 1 1 240 100" fill="none" stroke="#f4f7ff" strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
          <polygon points="180,74 196,104 164,104" fill="#ff9f1c" />
        </g>
      )}
      {(cue === 'pass' || cue === 'team') && <Figure pose={poseFor(cue === 'team' ? 'team' : 'idle', t)} kid={KIDS[2]} scale={0.8} x={-170} y={20} />}
      {cue === 'pass' && f !== null && (
        <circle cx={-10 - f * 150} cy={-60 - Math.sin(f * Math.PI) * 70} r={13} fill="#fff" stroke="#ff5a5f" strokeWidth={4} />
      )}

      <Figure pose={pose} kid={KIDS[0]} scale={1.15} x={0} y={0} />

      {cue === 'breathe' && (
        <text x={0} y={-150} textAnchor="middle" fontSize={30} fontWeight={800} fill="#f4f7ff" fontFamily="Rubik, sans-serif">
          {breathingIn ? 'שואפים… 1, 2, 3' : 'נושפים… 1, 2, 3'}
        </text>
      )}
    </svg>
  )
}
