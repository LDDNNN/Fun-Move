// The character's voice agent: kids ask by voice, by typing or with a chip, and
// the character answers out loud in short, simple Hebrew.
//
// Answers come from Claude when the page runs inside a Claude viewer (the
// artifact's `sample` capability); everywhere else, and whenever Claude is
// unavailable, a built-in answer bank keeps the agent working offline.
// Questions are processed in the browser and never stored.
import { LEVELS } from '../data/lesson.js'

const PHASE_WORDS = {
  setup: 'מתארגנים ובודקים רווח ידיים',
  watch: 'צופים ומקשיבים לדמות',
  practice: 'מתרגלים בדרגות',
  play: 'משחקים את משחק הסיום',
  summary: 'מסכמים ונושמים',
}

// ---- offline answer bank ----
const TOPICS = [
  { id: 'hard', words: ['קשה', 'התבלבל', 'מתבלבל', 'לא מצליח', 'לא הצלחתי', 'פחד', 'מפחד', 'טעיתי', 'טעות'] },
  { id: 'safety', words: ['כואב', 'נפל', 'נפלתי', 'מכה', 'נתקע', 'בטיחות', 'דחף', 'נגע בי'] },
  { id: 'where', words: ['איפה', 'לאן', 'עומד', 'עומדים', 'מקום', 'שורה', 'טור', 'מעגל'] },
  { id: 'when', words: ['מתי', 'יוצא', 'יוצאים', 'מתחיל', 'מתחילים', 'תור'] },
  { id: 'win', words: ['מנצח', 'מנצחים', 'ניצחון', 'נקודות', 'ניקוד', 'כוח הכיתה', 'פרס', 'תעודה'] },
  { id: 'howMany', words: ['כמה', 'עוד הרבה', 'מתי נגמר', 'סבב'] },
  { id: 'allowed', words: ['מותר', 'אסור', 'חוק', 'חוקים'] },
  { id: 'who', words: ['מי אתה', 'מי את', 'מי אתם', 'מה השם', 'איך קוראים'] },
  { id: 'how', words: ['איך', 'מה עושים', 'מה צריך', 'מה המשחק', 'להסביר', 'הסבר'] },
  { id: 'why', words: ['למה', 'בשביל מה'] },
]

export function localAnswer(character, question, state = {}) {
  const q = question.replace(/[?!.,]/g, ' ')
  const topic = TOPICS.find((t) => t.words.some((w) => q.includes(w)))?.id
  const cmd = character.commands.map((c) => `"${c.word}"`).join(' ו')
  switch (topic) {
    case 'hard':
      return 'זה בסדר להתבלבל! עוצרים, נושמים עמוק ומנסים שוב. כל ניסיון מוסיף כוח לכיתה.'
    case 'safety':
      return 'עוצרים מיד ומרימים יד למורה. שומרים על רווח ידיים, ולא דוחפים אף פעם.'
    case 'where':
      return `עומדים ב${character.formationLabel}, עם רווח ידיים מכל חבר.`
    case 'when':
      return character.hud.when
    case 'win':
      return 'מנצחים יחד, כל הכיתה! כשעובדים טוב ומעודדים חברים, סרגל כוח הכיתה מתמלא.'
    case 'howMany':
      return state.phase === 'practice'
        ? `אנחנו בסבב ${state.level} מתוך 4. עוד קצת, ואתם כבר אלופים!`
        : 'יש 4 סבבים של תרגול, ואחר כך משחק סיום של כל הכיתה.'
    case 'allowed':
      return `מותר: ${character.rules[0]}. אסור לדחוף, ושומרים תמיד על רווח מחברים.`
    case 'who':
      return character.opening
    case 'how':
      return `${character.hud.how}. מקשיבים למילים ${cmd}.`
    case 'why':
      return character.value
    default:
      return `שאלה טובה! ${character.hud.how}. ואם משהו לא ברור, שואלים את המורה.`
  }
}

// ---- Claude, when the page runs inside a Claude viewer ----
let samplePromise
function getSample() {
  if (!samplePromise) {
    samplePromise = typeof window !== 'undefined' && window.claude?.use
      ? window.claude.use('sample').catch(() => null)
      : Promise.resolve(null)
  }
  return samplePromise
}
let claudeOff = false // set after a permanent refusal; the bank answers from then on

function buildPrompt(character, question, state) {
  const level = state.phase === 'practice' ? ` (דרגה ${state.level}: ${LEVELS[state.level - 1].name})` : ''
  return `את/ה ${character.name}, ${character.role}, דמות שמדריכה שיעור תנועה בכיתות א'-ג' על לוח חכם.
ענה/י לשאלה של ילד או ילדה בעברית פשוטה, חמה ומעודדת, בגוף ראשון כמו ${character.name}.
כללים: לכל היותר 2 משפטים קצרים (עד 25 מילים). בלי תחרות בין ילדים, הכיתה מנצחת יחד. לא לבקש שמות או פרטים אישיים.
אם השאלה על בטיחות או כאב: לעצור ולקרוא למורה. אם השאלה לא קשורה לשיעור: להחזיר בעדינות למשחק.
ענה/י בטקסט בלבד, בלי אימוג'י ובלי סימני עיצוב.

המשחק: ${character.gameTitle}, ומשחק הסיום: ${character.finalTitle}.
מיומנות: ${character.skill}. סידור: ${character.formationLabel}.
חוקים: ${character.rules.join('; ')}.
פקודות: ${character.commands.map((c) => c.word).join(', ')}. מתי יוצאים: ${character.hud.when}
עכשיו בשיעור: ${PHASE_WORDS[state.phase] ?? 'לפני ההתחלה'}${level}.
משפט הערך: ${character.value}

השאלה: ${question}`
}

/**
 * Answers a question. `onText` streams Claude's partial answer for the subtitle.
 * Resolves { text, source: 'claude' | 'local' }.
 */
export async function askAgent(character, question, state, { onText, signal } = {}) {
  const sample = claudeOff ? null : await getSample()
  if (sample) {
    try {
      const { text } = await sample(buildPrompt(character, question, state), { modelTier: 'quick', onText, signal })
      return { text: text.trim(), source: 'claude' }
    } catch (e) {
      if (e?.code === 'cancelled') throw e
      if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(e?.code)) claudeOff = true
    }
  }
  return { text: localAnswer(character, question, state), source: 'local' }
}

// ---- one-shot listening for a kid's spoken question ----
const Recognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined
export const canListen = Boolean(Recognition)

export function listenOnce() {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error('unsupported'))
    const rec = new Recognition()
    rec.lang = 'he-IL'
    rec.interimResults = false
    rec.maxAlternatives = 1
    let said = ''
    rec.onresult = (e) => { said = e.results[0][0].transcript.trim() }
    rec.onerror = (e) => reject(new Error(e.error))
    rec.onend = () => resolve(said)
    try { rec.start() } catch (e) { reject(e) }
  })
}
