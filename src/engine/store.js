// Shared lesson state. The teacher dashboard and the smart-board player can run
// in two windows; every action is mirrored between them over a BroadcastChannel.
// Nothing about individual students is stored: only class-level counts and tags.
import { useSyncExternalStore } from 'react'
import { PHASES } from '../data/lesson.js'

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

export const initialState = {
  characterId: 'samson',
  phase: 'setup',
  level: 1,
  running: false,
  runId: 0,
  resume: false,
  line: '',
  cue: 'idle',
  cueAt: 0,
  isTalking: false,
  countdown: null,
  classPower: 0,
  completed: 0,
  workedTags: [],
  practiceTags: [],
  showVictory: false,
  victoryShown: false,
  showCertificate: false,
  lessonStartedAt: null,
}

function addPower(state, points) {
  const classPower = clamp(state.classPower + points, 0, 100)
  const reached = classPower === 100 && !state.victoryShown
  return { ...state, classPower, showVictory: reached || state.showVictory, victoryShown: state.victoryShown || reached }
}

function goPhase(state, phase, level = 1) {
  return { ...state, phase, level, running: true, resume: false, runId: state.runId + 1, countdown: null, line: '', cue: 'idle', cueAt: Date.now() }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SYNC_STATE':
      return { ...action.state }
    case 'SELECT_CHARACTER':
      return { ...initialState, characterId: action.id, runId: state.runId + 1 }
    case 'START_LESSON':
      return { ...goPhase(state, 'setup'), lessonStartedAt: state.lessonStartedAt ?? Date.now() }
    case 'GO_PHASE':
      return goPhase(state, action.phase, action.level ?? 1)
    case 'NEXT': {
      if (state.phase === 'practice' && state.level < 4) return goPhase(state, 'practice', state.level + 1)
      const i = PHASES.indexOf(state.phase)
      if (i === PHASES.length - 1) return { ...state, showCertificate: true }
      return goPhase(state, PHASES[i + 1])
    }
    case 'TOGGLE_PAUSE':
      return state.running
        ? { ...state, running: false, isTalking: false, countdown: null }
        : { ...state, running: true, resume: true, runId: state.runId + 1 }
    case 'REPLAY':
      return goPhase(state, state.phase, state.level)
    case 'SET_LINE':
      return { ...state, line: action.text, cue: action.cue ?? state.cue, cueAt: Date.now() }
    case 'SET_CUE':
      return { ...state, cue: action.cue, cueAt: Date.now() }
    case 'SET_TALKING':
      return { ...state, isTalking: action.value }
    case 'SET_COUNTDOWN':
      return { ...state, countdown: action.value }
    case 'LEVEL_COMPLETE': {
      const next = addPower(state, 10)
      return action.level < 4 ? goPhase(next, 'practice', action.level + 1) : goPhase(next, 'play')
    }
    case 'PHASE_COMPLETE':
      return goPhase(state, action.next)
    case 'PAUSE':
      return { ...state, running: false, isTalking: false, countdown: null }
    case 'SCRIPT_DONE':
      return { ...state, running: false, isTalking: false }
    case 'ADD_POWER':
      return addPower(state, action.points)
    case 'HIDE_VICTORY':
      return { ...state, showVictory: false }
    case 'SET_COMPLETED':
      return { ...state, completed: clamp(action.value, 0, action.max ?? 30) }
    case 'TOGGLE_TAG': {
      const list = state[action.list]
      return { ...state, [action.list]: list.includes(action.tag) ? list.filter((t) => t !== action.tag) : [...list, action.tag] }
    }
    case 'SHOW_CERTIFICATE':
      return { ...state, showCertificate: action.value }
    case 'RESET':
      return { ...initialState, characterId: state.characterId, runId: state.runId + 1 }
    default:
      return state
  }
}

// ---- tiny external store ----
let state = initialState
const listeners = new Set()
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('class-power') : null

function apply(action) {
  state = reducer(state, action)
  listeners.forEach((l) => l())
}

export function dispatch(action) {
  apply(action)
  channel?.postMessage({ kind: 'action', action })
}

export const getState = () => state

if (channel) {
  channel.onmessage = ({ data }) => {
    if (data.kind === 'action') apply(data.action)
    if (data.kind === 'hello') channel.postMessage({ kind: 'action', action: { type: 'SYNC_STATE', state } })
  }
  channel.postMessage({ kind: 'hello' })
}

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useLesson(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(state))
}
