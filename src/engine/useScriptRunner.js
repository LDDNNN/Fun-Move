// Runs the current phase's script on the smart board: speaks each line, shows the
// subtitle, fires the simulation cue and runs the 3-2-1 countdown. Only the
// player window runs this, so a second open dashboard never doubles the voice.
import { useEffect } from 'react'
import { getCharacter } from '../data/characters.js'
import { buildScript } from './script.js'
import { dispatch, getState, useLesson } from './store.js'
import { sleep, speak, stopSpeaking } from './speech.js'

// Kept between runs so a paused script resumes from the same line.
const memory = { key: '', steps: [], index: 0 }

export function useScriptRunner() {
  const runId = useLesson((s) => s.runId)
  const running = useLesson((s) => s.running)

  useEffect(() => {
    if (!running) {
      stopSpeaking()
      return
    }
    const { characterId, phase, level, resume } = getState()
    const key = `${characterId}:${phase}:${level}`
    if (!(resume && memory.key === key)) {
      memory.key = key
      memory.steps = buildScript(getCharacter(characterId), phase, level)
      memory.index = 0
    }

    let cancelled = false
    const alive = () => !cancelled && getState().runId === runId

    ;(async () => {
      for (; memory.index < memory.steps.length; memory.index++) {
        if (!alive()) return
        const step = memory.steps[memory.index]

        if (step.type === 'say') {
          dispatch({ type: 'SET_LINE', text: step.text, cue: step.cue })
          await speak(step.text, { onStart: () => alive() && dispatch({ type: 'SET_TALKING', value: true }) })
          if (!alive()) return
          dispatch({ type: 'SET_TALKING', value: false })
          await sleep(step.pauseAfter)
        } else if (step.type === 'countdown') {
          dispatch({ type: 'SET_CUE', cue: 'idle' })
          for (const n of [3, 2, 1, 0]) {
            if (!alive()) return
            dispatch({ type: 'SET_COUNTDOWN', value: n })
            speak(n === 0 ? 'צא!' : String(n), { rate: 1.1 })
            await sleep(n === 0 ? 700 : 950)
          }
          dispatch({ type: 'SET_COUNTDOWN', value: null })
        } else if (step.type === 'levelComplete') {
          memory.index++
          dispatch({ type: 'LEVEL_COMPLETE', level: step.level })
          return
        } else if (step.type === 'phaseComplete') {
          memory.index++
          dispatch({ type: 'PHASE_COMPLETE', next: step.next })
          return
        }
      }
      if (alive()) dispatch({ type: 'SCRIPT_DONE' })
    })()

    return () => {
      cancelled = true
      stopSpeaking()
    }
  }, [runId, running])
}

// Kid question chips: pause the lesson, answer out loud, then pick up where it stopped.
export async function answerQuestion(text) {
  const wasRunning = getState().running
  if (wasRunning) dispatch({ type: 'PAUSE' })
  stopSpeaking()
  dispatch({ type: 'SET_LINE', text, cue: getState().cue })
  await speak(text, { onStart: () => dispatch({ type: 'SET_TALKING', value: true }) })
  dispatch({ type: 'SET_TALKING', value: false })
  if (wasRunning && !getState().running) dispatch({ type: 'TOGGLE_PAUSE' })
}
