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

function Figure({ pose, shirt = '#ff8a3d', skin = '#f1c27d', hair = '#4a2c17', scale = 1, x = 0, y = 0 }) {
  const stroke = 15
  const shoulderY = -64
  const hipY = 0
  const arms = [-1, 1].map((side, i) => limb([side * 19, shoulderY + 6], side, pose.arms[i][0], 30, pose.arms[i][1], 28))
  const legs = [-1, 1].map((side, i) => {
    const [a, lift, knee] = pose.legs[i]
    const thigh = 36 - knee * 0.55
    return limb([side * 11, hipY], side, a, thigh, 0, 36 + lift * 0.1)
  })
  const fill = pose.tint ?? shirt
  return (
    <g transform={`translate(${x},${y + pose.y * scale}) scale(${scale})`}>
      <ellipse cx={0} cy={86 - pose.y} rx={34} ry={7} fill="#000" opacity={0.22} />
      {legs.map((l, i) => (
        <polyline key={`l${i}`} points={`${[-1, 1][i] * 11},${hipY} ${l.elbow.join(',')} ${l.end.join(',')}`} fill="none" stroke="#24345f" strokeWidth={stroke + 2} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <rect x={-24} y={shoulderY - 2} width={48} height={70} rx={20} fill={fill} transform={`translate(0 ${34 * (1 - pose.belly)}) scale(${pose.belly} 1)`} />
      {arms.map((a, i) => (
        <g key={`a${i}`}>
          <polyline points={`${[-1, 1][i] * 19},${shoulderY + 6} ${a.elbow.join(',')} ${a.end.join(',')}`} fill="none" stroke={pose.tint ?? skin} strokeWidth={stroke - 2} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={a.end[0]} cy={a.end[1]} r={9} fill={pose.tint ?? skin} />
        </g>
      ))}
      <circle cx={0} cy={shoulderY - 30} r={25} fill={pose.tint ?? skin} />
      <path d={`M -25 ${shoulderY - 34} Q 0 ${shoulderY - 70} 25 ${shoulderY - 34} Q 10 ${shoulderY - 46} -25 ${shoulderY - 34}`} fill={pose.tint ? '#5fb4e0' : hair} />
      <circle cx={-9} cy={shoulderY - 30} r={3.2} fill="#1b2236" />
      <circle cx={9} cy={shoulderY - 30} r={3.2} fill="#1b2236" />
      <path d={`M -8 ${shoulderY - 20} Q 0 ${shoulderY - 14} 8 ${shoulderY - 20}`} fill="none" stroke="#1b2236" strokeWidth={2.6} strokeLinecap="round" />
      {pose.tint === '#8fd8ff' && (
        <rect x={-62} y={shoulderY - 64} width={124} height={160} rx={18} fill="#bfeaff" opacity={0.28} stroke="#e8f8ff" strokeWidth={3} />
      )}
    </g>
  )
}

const KIDS = [
  { shirt: '#ff8a3d', skin: '#f1c27d', hair: '#4a2c17' },
  { shirt: '#4cc9f0', skin: '#c68642', hair: '#1d1208' },
  { shirt: '#f15bb5', skin: '#ffdbac', hair: '#a0522d' },
  { shirt: '#9ef01a', skin: '#8d5524', hair: '#140c06' },
  { shirt: '#ffd60a', skin: '#e0ac69', hair: '#3b2412' },
]

// The scene: one big kid demonstrating, the rest of the class doing it too.
export default function DemoStage({ cue, color = '#ffc83d' }) {
  const t = useTime()
  const pose = poseFor(cue, t)
  const breathingIn = Math.sin((t * Math.PI * 2) / 6) >= 0
  const f = pose.ball

  return (
    <svg viewBox="-300 -190 600 330" className="h-full w-full" role="img" aria-label="ילד מדגים את התנועה">
      <ellipse cx={0} cy={112} rx={290} ry={22} fill={color} opacity={0.12} />

      {/* the class, smaller and behind, copying the move */}
      {[-250, -150, 150, 250].map((x, i) => (
        <Figure key={x} pose={poseFor(cue, t, 0.18 * (i + 1))} {...KIDS[i + 1]} scale={0.55} x={x} y={52} />
      ))}

      {cue === 'run' && (
        <g>
          <path d="M 120 100 A 60 18 0 1 1 240 100" fill="none" stroke="#f4f7ff" strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
          <polygon points="180,74 196,104 164,104" fill="#ff9f1c" />
        </g>
      )}
      {(cue === 'pass' || cue === 'team') && <Figure pose={poseFor(cue === 'team' ? 'team' : 'idle', t)} {...KIDS[2]} scale={0.8} x={-170} y={20} />}
      {cue === 'pass' && f !== null && (
        <circle cx={-10 - f * 150} cy={-60 - Math.sin(f * Math.PI) * 70} r={13} fill="#fff" stroke="#ff5a5f" strokeWidth={4} />
      )}

      <Figure pose={pose} {...KIDS[0]} scale={1.15} x={0} y={0} />

      {cue === 'breathe' && (
        <text x={0} y={-150} textAnchor="middle" fontSize={30} fontWeight={800} fill="#f4f7ff" fontFamily="Rubik, sans-serif">
          {breathingIn ? 'שואפים… 1, 2, 3' : 'נושפים… 1, 2, 3'}
        </text>
      )}
    </svg>
  )
}
