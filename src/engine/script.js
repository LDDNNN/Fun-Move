// Level-Up Engine: turns a character config into the step list the player runs.
// All 30 kids act on every call, so no step ever waits on a single child's turn.
import { LEVELS } from '../data/lesson.js'

const pick = (arr, i) => arr[i % arr.length]

function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Alternate commands so the same call never repeats back to back.
function callSequence(commands, count) {
  const out = []
  let pool = shuffled(commands)
  for (let i = 0; i < count; i++) {
    if (i % pool.length === 0 && i > 0) {
      const last = out[out.length - 1]
      pool = shuffled(commands)
      if (pool[0] === last && pool.length > 1) pool.push(pool.shift())
    }
    out.push(pool[i % pool.length])
  }
  return out
}

const say = (text, cue = 'idle', pauseAfter = 500) => ({ type: 'say', text, cue, pauseAfter })

function practiceLevel(character, level) {
  const { gapMs } = LEVELS[level - 1]
  const title = character.levelTitles[level - 1]
  const steps = [
    { type: 'countdown' },
    say(`שלב ${level}: ${title}!`, 'idle', 400),
  ]

  if (level === 1) {
    steps.push(say('מקשיבים טוב ועושים יחד. לאט ובדיוק.', 'idle', 600))
    for (const c of callSequence(character.commands, 6)) steps.push(say(`${c.word}!`, c.cue, gapMs))
  }

  if (level === 2) {
    steps.push(say('עכשיו מהר יותר, ועם פקודות כפולות!', 'idle', 500))
    callSequence(character.commands, 7).forEach((c, i) => {
      const text = i % 2 === 0 ? `${c.word}־${c.word}!` : `${c.word}!`
      steps.push(say(text, c.cue, gapMs))
    })
  }

  if (level === 3) {
    steps.push(say('זהירות! אם שומעים מילה שלא שייכת למשחק, קופאים במקום.', 'freeze', 600))
    const calls = callSequence(character.commands, 6)
    const distractors = shuffled(character.distractors)
    calls.forEach((c, i) => {
      steps.push(say(`${c.word}!`, c.cue, gapMs))
      if (i % 2 === 1) steps.push(say(`${pick(distractors, i)}!`, 'freeze', gapMs))
    })
  }

  if (level === 4) {
    steps.push(say('שיא כיתתי! כל הכיתה יחד, בלי טעויות!', 'idle', 400))
    for (const c of callSequence(character.commands, 9)) steps.push(say(`${c.word}!`, c.cue, gapMs))
    steps.push(say('וואו! זה היה שיא של כל הכיתה!', 'clap', 600))
  }

  steps.push({ type: 'levelComplete', level })
  return steps
}

export function buildScript(character, phase, level = 1) {
  switch (phase) {
    case 'setup':
      return character.safety.map((l) => say(l.text, l.cue, 900))
    case 'watch':
      return [
        ...character.intro.map((l) => say(l.text, l.cue, 700)),
        say('עכשיו דמיון מודרך של דקה.', 'idle', 600),
        ...character.imagery.map((l) => say(l.text, l.cue, 3500)),
        { type: 'phaseComplete', next: 'practice' },
      ]
    case 'practice':
      return practiceLevel(character, level)
    case 'play':
      return [{ type: 'countdown' }, ...character.finalGame.map((l) => say(l.text, l.cue, 900))]
    case 'summary':
      return [
        say('כל הכבוד כיתה! עכשיו נושמים יחד.', 'breathe', 600),
        say('שואפים... שתיים... שלוש.', 'breathe', 1500),
        say('נושפים... שתיים... שלוש.', 'breathe', 1500),
        say('שוב: שואפים... שתיים... שלוש.', 'breathe', 1500),
        say('נושפים... שתיים... שלוש.', 'breathe', 1500),
        say(character.value, 'clap', 800),
      ]
    default:
      return []
  }
}
