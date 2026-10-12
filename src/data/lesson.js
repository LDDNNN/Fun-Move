// The 45-minute lesson and how its phases map onto the kids' 4-step bar.

export const PHASES = ['setup', 'watch', 'practice', 'play', 'summary']

export const LESSON_SEGMENTS = [
  { id: 'setup', minutes: 5, title: 'התארגנות ובטיחות', detail: 'סידור 30 ילדים, בדיקת רווח ידיים ופינוי מכשולים' },
  { id: 'practice', minutes: 15, title: 'פעילות מונחית', detail: 'אווטר מדבר, דמיון מודרך ותרגול בדרגות 1-4', phases: ['watch', 'practice'] },
  { id: 'play', minutes: 20, title: 'משחק כיתתי מסכם', detail: '100% השתתפות במקביל, בלי תורים' },
  { id: 'summary', minutes: 5, title: 'סיכום ונשימה', detail: 'נשימה 3-3, מד הצלחה ותעודת ניצחון' },
]

export const segmentForPhase = (phase) =>
  LESSON_SEGMENTS.find((s) => s.id === phase || s.phases?.includes(phase))

// Kids' step bar: צופים → מתרגלים → משחקים → מנצחים
export const KID_STEPS = [
  { id: 'watch', label: 'צופים', icon: '👁️', phases: ['setup', 'watch'] },
  { id: 'practice', label: 'מתרגלים', icon: '🏃', phases: ['practice'] },
  { id: 'play', label: 'משחקים', icon: '🏆', phases: ['play'] },
  { id: 'win', label: 'מנצחים', icon: '📜', phases: ['summary'] },
]

export const kidStepIndex = (phase) => KID_STEPS.findIndex((s) => s.phases.includes(phase))

export const LEVELS = [
  { level: 1, name: 'בסיס והיכרות', gapMs: 2600 },
  { level: 2, name: 'קצב ורצף', gapMs: 1800 },
  { level: 3, name: 'מסיחים ועיכוב תגובה', gapMs: 1700 },
  { level: 4, name: 'שיא כיתתי', gapMs: 1300 },
]

export const CLASS_SIZE = 30

export const WORKED_TAGS = ['הקשבה מעולה', 'עידוד חברים', 'עצירה מדויקת', 'עבודת צוות', 'שמירה על רווח', 'אנרגיה טובה']
export const PRACTICE_TAGS = ['עצירה מהירה יותר', 'שמירה על הטור', 'קצב אחיד', 'הקשבה למילים מבלבלות', 'מסירות מדויקות']

export const REWARDS = [
  { id: 'cheer', icon: '👏', label: 'עידוד חברים', points: 10 },
  { id: 'task', icon: '🎯', label: 'ביצוע משימה', points: 10 },
  { id: 'retry', icon: '🦁', label: 'ניסיון חוזר', points: 5 },
]
