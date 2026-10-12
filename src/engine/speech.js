// Voice layer: Hebrew text-to-speech for the avatar and Hebrew voice commands for
// the teacher. Everything runs in the browser; no audio leaves the device.
import { useEffect, useRef, useState } from 'react'

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
let hebrewVoice = null

function loadVoice() {
  if (!synth) return
  const voices = synth.getVoices()
  hebrewVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('he')) ?? null
}
loadVoice()
synth?.addEventListener?.('voiceschanged', loadVoice)

export const hasHebrewVoice = () => Boolean(hebrewVoice)

const estimateMs = (text) => 500 + text.length * 75

// Speaks one line and resolves when it ends. Browsers sometimes drop the `end`
// event (or have no Hebrew voice at all), so a timer always finishes the line.
export function speak(text, { onStart, rate = 0.95 } = {}) {
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(guard)
      resolve()
    }
    const guard = setTimeout(finish, estimateMs(text) * 2.2 + 1500)

    if (!synth) {
      onStart?.()
      setTimeout(finish, estimateMs(text))
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'he-IL'
    if (hebrewVoice) u.voice = hebrewVoice
    u.rate = rate
    u.pitch = 1.05
    u.onstart = () => onStart?.()
    u.onend = finish
    u.onerror = finish
    synth.speak(u)
    // No Hebrew voice installed: still show the line for a readable amount of time.
    if (!hebrewVoice) {
      onStart?.()
      setTimeout(finish, estimateMs(text))
    }
  })
}

export function stopSpeaking() {
  synth?.cancel()
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---- teacher voice commands ----
const Recognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined
export const voiceCommandsSupported = Boolean(Recognition)

const VOICE_COMMANDS = [
  { words: ['הבא', 'הלאה', 'המשך'], action: 'next' },
  { words: ['עצור', 'הפסק', 'השהה'], action: 'pause' },
  { words: ['שוב', 'מחדש'], action: 'replay' },
  { words: ['כל הכבוד', 'יופי', 'מעולה'], action: 'cheer' },
]

export function useVoiceCommands(enabled, onCommand) {
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const handler = useRef(onCommand)
  handler.current = onCommand

  useEffect(() => {
    if (!enabled || !Recognition) return
    const rec = new Recognition()
    rec.lang = 'he-IL'
    rec.continuous = true
    rec.interimResults = false
    let stopped = false
    rec.onstart = () => setListening(true)
    rec.onend = () => {
      setListening(false)
      if (!stopped) setTimeout(() => !stopped && rec.start(), 300)
    }
    rec.onerror = (e) => {
      setListening(false)
      // Microphone blocked or unavailable: stop instead of retrying forever.
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') stopped = true
    }
    rec.onresult = (e) => {
      const said = e.results[e.results.length - 1][0].transcript.trim()
      setHeard(said)
      const match = VOICE_COMMANDS.find((c) => c.words.some((w) => said.includes(w)))
      if (match) handler.current(match.action)
    }
    try {
      rec.start()
    } catch {
      /* already started */
    }
    return () => {
      stopped = true
      rec.abort()
    }
  }, [enabled])

  return { listening, heard }
}
