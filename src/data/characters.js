// CHARACTER_MASTER_CONFIGS: the 8 characters, their skill, formation and game script.
//
// Every spoken line is { text, cue }. The cue drives GameDemoSimulations:
//   idle · move · jump · freeze · breathe · run · clap · pass · walk · stop · fine · team · stations
// Commands are the words the avatar calls during practice levels 1-4; the
// level-up engine (engine/script.js) builds each level's sequence from them.

import davidImg from '../assets/portraits/david.jpg'
import devorahImg from '../assets/portraits/devorah.jpg'
import estherImg from '../assets/portraits/esther.jpg'
import miriamImg from '../assets/portraits/miriam.jpg'
import mosheImg from '../assets/portraits/moshe.jpg'
import samsonImg from '../assets/portraits/samson.jpg'
import yosefImg from '../assets/portraits/yosef.jpg'

const PORTRAITS = { david: davidImg, devorah: devorahImg, esther: estherImg, miriam: miriamImg, moshe: mosheImg, samson: samsonImg, yosef: yosefImg }

export const CUES = {
  idle: 'idle',
  move: 'move',
  jump: 'jump',
  freeze: 'freeze',
  breathe: 'breathe',
  run: 'run',
  clap: 'clap',
  pass: 'pass',
  walk: 'walk',
  stop: 'stop',
  fine: 'fine',
  team: 'team',
  stations: 'stations',
}

const SHARED_SAFETY = [
  { text: 'שלום כיתה! לפני שמתחילים, עומדים כל אחד במקום שלו.', cue: 'idle' },
  { text: 'פותחים ידיים לצדדים. אם נוגעים בחבר, זזים צעד קטן.', cue: 'move' },
  { text: 'מעולה! יש לכולם מקום. מתחילים!', cue: 'idle' },
]

const SHARED_DISTRACTORS = ['תפוח', 'צהוב', 'מטריה', 'גלידה']

export const CHARACTER_MASTER_CONFIGS = [
  {
    id: 'samson',
    name: 'שמשון',
    emoji: '🦁',
    color: '#f59e0b',
    gameTitle: 'כוח בשליטה',
    finalTitle: 'שערי שמשון',
    skill: 'מוטוריקה גסה, ויסות ושליטה',
    formation: 'rows',
    formationLabel: '5 שורות של 6',
    value: 'כוח אמיתי הוא לדעת מתי לעצור!',
    safety: SHARED_SAFETY,
    intro: [
      { text: 'אני שמשון, ואני הכי חזק כשאני יודע לעצור.', cue: 'idle' },
      { text: 'כשאני אומר כוח, קופצים גבוה!', cue: 'jump' },
      { text: 'כשאני אומר שליטה, קופאים כמו פסל קרח.', cue: 'freeze' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. דמיינו שאתם אריה גדול ורגוע.', cue: 'breathe' },
      { text: 'האריה מרגיש כוח בכל הגוף, ונושם לאט.', cue: 'breathe' },
      { text: 'פוקחים עיניים. האריה מוכן!', cue: 'idle' },
    ],
    commands: [
      { word: 'כוח', cue: 'jump' },
      { word: 'שליטה', cue: 'freeze' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת האומץ', 'כוח־כוח!', 'אוזניים של אריה', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: שערי שמשון! ארבע תחנות ברצף אחד.', cue: 'stations' },
      { text: 'קופצים, זוחלים, עומדים על רגל אחת וזורקים למטרה.', cue: 'stations' },
      { text: 'כל הכיתה עוברת יחד, ואף אחד לא מחכה בתור!', cue: 'stations' },
    ],
  },
  {
    id: 'david',
    name: 'דוד',
    emoji: '🎯',
    color: '#ef4444',
    gameTitle: 'ריצה חכמה',
    finalTitle: 'צלפי הדיוק',
    skill: 'קואורדינציה, אומץ ותיאום עין־יד',
    formation: 'columns',
    formationLabel: '6 טורים של 5',
    value: 'אומץ זה לנסות, גם כשזה קשה!',
    safety: SHARED_SAFETY,
    intro: [
      { text: 'אני דוד, ואני אוהב לכוון בדיוק.', cue: 'idle' },
      { text: 'רצים מימין לכיפות, נוגעים בכיפה השנייה, וחוזרים.', cue: 'run' },
      { text: 'בחזרה נותנים לחבר הבא כיף!', cue: 'run' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. אתם רואים מטרה רחוקה.', cue: 'breathe' },
      { text: 'מכוונים אליה את העיניים ואת הלב.', cue: 'breathe' },
      { text: 'פוקחים עיניים. העין חדה ומוכנה!', cue: 'idle' },
    ],
    commands: [
      { word: 'רצים', cue: 'run' },
      { word: 'עצור', cue: 'freeze' },
      { word: 'כיף', cue: 'clap' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת האומץ', 'ריצה מהירה', 'עין של צלף', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: צלפי הדיוק! מתחלקים לזוגות.', cue: 'pass' },
      { text: 'מוסרים כדור מעל קו האמצע, ואז זורקים למטרה.', cue: 'pass' },
      { text: 'כל זוג עובד יחד, וכל הכיתה משחקת בבת אחת!', cue: 'pass' },
    ],
  },
  {
    id: 'esther',
    speaks: 'מדברת',
    name: 'אסתר',
    emoji: '👑',
    color: '#a855f7',
    gameTitle: 'ארמון הפוקוס',
    finalTitle: 'אומץ שקט',
    skill: 'קשב, ריכוז ועיכוב תגובה',
    formation: 'rows',
    formationLabel: '5 שורות של 6',
    value: 'מי שמקשיב, יודע מתי לפעול!',
    safety: SHARED_SAFETY,
    intro: [
      { text: 'אני אסתר, וזה ארמון הפוקוס שלי.', cue: 'idle' },
      { text: 'ירוק, זזים במקום. אדום, עוצרים לגמרי.', cue: 'move' },
      { text: 'כחול, יד על הבטן ונושמים עמוק.', cue: 'breathe' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. אתם נכנסים לארמון שקט.', cue: 'breathe' },
      { text: 'שואפים שלוש, נושפים שלוש.', cue: 'breathe' },
      { text: 'פוקחים עיניים. האוזניים פתוחות!', cue: 'idle' },
    ],
    commands: [
      { word: 'ירוק', cue: 'move' },
      { word: 'אדום', cue: 'freeze' },
      { word: 'כחול', cue: 'breathe' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת הצבעים', 'צבעים כפולים', 'מילים מבלבלות', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: אומץ שקט! כולם זזים בחדר.', cue: 'move' },
      { text: 'כשהמורה מרים כרטיס צבע, עושים את מה שהצבע אומר.', cue: 'freeze' },
      { text: 'אם שומעים מילה אחרת, קופאים במקום!', cue: 'freeze' },
    ],
  },
  {
    id: 'miriam',
    speaks: 'מדברת',
    name: 'מרים',
    emoji: '🥁',
    color: '#ec4899',
    gameTitle: 'מעגל הקצב',
    finalTitle: 'המירוץ נגד הכדור',
    skill: 'קצב, תיאום דו־צדדי ושמחה',
    formation: 'circle',
    formationLabel: 'מעגל כיתתי אחד',
    value: 'כשכולנו בקצב אחד, אנחנו חזקים!',
    safety: [
      { text: 'שלום כיתה! עומדים במעגל גדול אחד.', cue: 'idle' },
      { text: 'מחזיקים ידיים ופותחים את המעגל עד שהידיים ישרות.', cue: 'move' },
      { text: 'עכשיו משחררים ידיים. המעגל מוכן!', cue: 'idle' },
    ],
    intro: [
      { text: 'אני מרים, והתוף שלי מוביל את הקצב.', cue: 'clap' },
      { text: 'מוחאים כפיים וצועדים בדיוק בקצב התוף.', cue: 'clap' },
      { text: 'כשהתוף שותק, עוצרים.', cue: 'freeze' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. שומעים תוף רחוק.', cue: 'breathe' },
      { text: 'הלב דופק יחד עם התוף. בום, בום.', cue: 'breathe' },
      { text: 'פוקחים עיניים. מוכנים לרקוד!', cue: 'idle' },
    ],
    commands: [
      { word: 'תוף', cue: 'clap' },
      { word: 'שקט', cue: 'freeze' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת הקצב', 'קצב כפול', 'אוזן מוזיקלית', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: המירוץ נגד הכדור!', cue: 'pass' },
      { text: 'מעבירים כדור מיד ליד מסביב למעגל.', cue: 'pass' },
      { text: 'זוג אחד רץ מסביב מבחוץ. מי יגיע ראשון, הזוג או הכדור?', cue: 'run' },
    ],
  },
  {
    id: 'devorah',
    speaks: 'מדברת',
    name: 'דבורה',
    emoji: '🐝',
    color: '#eab308',
    gameTitle: 'משימת הצבעים והשמות',
    finalTitle: 'כוורת המנהיגות',
    skill: 'מנהיגות, עבודת צוות ותקשורת',
    formation: 'pairs',
    formationLabel: '15 זוגות',
    value: 'מנהיגה טובה עוזרת לכולם להצליח!',
    safety: SHARED_SAFETY,
    intro: [
      { text: 'אני דבורה, ובכוורת שלי כולם עובדים יחד.', cue: 'idle' },
      { text: 'מוסרים כדור לבן הזוג. כשהכדור באוויר אני אומרת צבע.', cue: 'pass' },
      { text: 'מי שתופס, מקיף את הכיפה בצבע הזה ומוסר חזרה.', cue: 'run' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. אתם דבורים בכוורת גדולה.', cue: 'breathe' },
      { text: 'כל דבורה עוזרת לחברה שלה.', cue: 'breathe' },
      { text: 'פוקחים עיניים. הכוורת מוכנה!', cue: 'idle' },
    ],
    commands: [
      { word: 'מוסרים', cue: 'pass' },
      { word: 'כחול', cue: 'run' },
      { word: 'אדום', cue: 'run' },
      { word: 'עוצרים', cue: 'freeze' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת המסירה', 'צבעים מהירים', 'שמות מבלבלים', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: כוורת המנהיגות!', cue: 'pass' },
      { text: 'בכל סבב, ילד אחר בזוג הוא המנהיג ואומר את הצבע.', cue: 'pass' },
      { text: 'מעודדים את בן הזוג בכל מסירה!', cue: 'clap' },
    ],
  },
  {
    id: 'moshe',
    name: 'משה',
    emoji: '🌊',
    color: '#0ea5e9',
    gameTitle: 'הדרך הבטוחה',
    finalTitle: 'מסע הסיום',
    skill: 'התמצאות במרחב, רצף תנועתי ועזרה הדדית',
    formation: 'line',
    formationLabel: 'טור אחד ארוך',
    value: 'יחד עוברים כל ים!',
    safety: [
      { text: 'שלום כיתה! עומדים בטור אחד, אחד אחרי השני.', cue: 'idle' },
      { text: 'יד ישרה קדימה, בלי לגעת בחבר שמלפנים.', cue: 'move' },
      { text: 'מעולה! הטור מוכן למסע.', cue: 'idle' },
    ],
    intro: [
      { text: 'אני משה. הכיפות הכחולות הן הים.', cue: 'idle' },
      { text: 'הולכים בשביל הלבן בין הכיפות, בלי לגעת במים.', cue: 'walk' },
      { text: 'בסימן עצור, כל הטור עוצר יחד.', cue: 'stop' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. הים נפתח לפניכם.', cue: 'breathe' },
      { text: 'השביל יבש ובטוח, והולכים בו יחד.', cue: 'breathe' },
      { text: 'פוקחים עיניים. יוצאים לדרך!', cue: 'idle' },
    ],
    commands: [
      { word: 'הולכים', cue: 'walk' },
      { word: 'עצור', cue: 'stop' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת השביל', 'שביל מהיר', 'שביל מבלבל', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: מסע הסיום!', cue: 'walk' },
      { text: 'כל הטור עובר את הים יחד ועוזר למי שמתקשה.', cue: 'walk' },
      { text: 'בסוף המסע, כל הכיתה מקבלת חותמת מסע!', cue: 'clap' },
    ],
  },
  {
    id: 'yosef',
    name: 'יוסף',
    emoji: '🧵',
    color: '#14b8a6',
    gameTitle: 'תפרים קטנים',
    finalTitle: 'מעבדת החלומות',
    skill: 'מוטוריקה עדינה, דיוק וסבלנות',
    formation: 'pairs',
    formationLabel: '15 זוגות',
    value: 'סבלנות הופכת חלום למציאות!',
    safety: [
      { text: 'שלום כיתה! יושבים בזוגות, פנים מול פנים.', cue: 'idle' },
      { text: 'מניחים את הידיים על הברכיים.', cue: 'fine' },
      { text: 'מעולה! האצבעות מוכנות.', cue: 'idle' },
    ],
    intro: [
      { text: 'אני יוסף, ואני תופר חלומות קטנים.', cue: 'fine' },
      { text: 'מזיזים אצבעות לאט, כמו מחט עם חוט.', cue: 'fine' },
      { text: 'כשאני אומר ידיים למעלה, מרימים ומחכים.', cue: 'freeze' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. בידיים שלכם חוט זהב.', cue: 'breathe' },
      { text: 'תופרים לאט, תפר אחרי תפר.', cue: 'fine' },
      { text: 'פוקחים עיניים. הידיים מוכנות!', cue: 'idle' },
    ],
    commands: [
      { word: 'תופרים', cue: 'fine' },
      { word: 'ידיים למעלה', cue: 'freeze' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת האצבעות', 'תפרים מהירים', 'אצבעות חכמות', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: מעבדת החלומות!', cue: 'team' },
      { text: 'בכל זוג בונים מגדל כוסות, כוס אחרי כוס.', cue: 'fine' },
      { text: 'לאט ובסבלנות, עד שהמגדל עומד!', cue: 'fine' },
    ],
  },
  {
    id: 'ruth',
    speaks: 'מדברים',
    name: 'רות ויהושע',
    emoji: '🌾',
    color: '#84cc16',
    gameTitle: 'שדה החברות',
    finalTitle: 'מסע ואתגר',
    skill: 'אקלים כיתתי, שייכות ועבודת צוות',
    formation: 'pairs',
    formationLabel: '15 זוגות',
    value: 'אף חבר לא נשאר מאחור!',
    safety: SHARED_SAFETY,
    intro: [
      { text: 'אנחנו רות ויהושע, ובשדה שלנו כולם חברים.', cue: 'idle' },
      { text: 'עומדים גב אל גב עם בן הזוג ומעבירים חפץ.', cue: 'team' },
      { text: 'אוספים שיבולי חברות ועוזרים לכל זוג.', cue: 'team' },
    ],
    imagery: [
      { text: 'עוצמים עיניים. אתם בשדה זהב גדול.', cue: 'breathe' },
      { text: 'כל שיבולת היא חבר שאתם עוזרים לו.', cue: 'breathe' },
      { text: 'פוקחים עיניים. יוצאים לקטוף!', cue: 'idle' },
    ],
    commands: [
      { word: 'גב אל גב', cue: 'team' },
      { word: 'אוספים', cue: 'move' },
      { word: 'עוצרים', cue: 'freeze' },
    ],
    distractors: SHARED_DISTRACTORS,
    levelTitles: ['משימת הזוגות', 'קטיף מהיר', 'שדה מבלבל', 'שיא כוח הכיתה'],
    finalGame: [
      { text: 'משחק הסיום: מסע ואתגר!', cue: 'team' },
      { text: 'כל קבוצה אוספת שיבולים ומעבירה אותן גב אל גב.', cue: 'team' },
      { text: 'מנצחים רק כשכל הקבוצות מסיימות. אף אחד לא נשאר מאחור!', cue: 'clap' },
    ],
  },
]

// Kid-facing answers to the 5 HUD questions, the opening story line and the rules.
const KID_GUIDE = {
  samson: {
    story: 'הכוח האמיתי הוא לדעת לשלוט בגוף, לעצור בזמן ולעזור לחבר.',
    rules: ['קופצים חזק ב"כוח"', 'קופאים כמו פסל 🧊 ב"שליטה"', '4 תחנות: קפיצה, זחילה, שיווי משקל, זריקה'],
    hud: { what: 'משימת כוח בשליטה', when: 'יוצאים רק כששומעים "כוח"!', how: 'קופצים ב"כוח", קופאים ב"שליטה"' },
  },
  david: {
    story: 'אומץ זה לזוז מהר, להישאר בשליטה ולדייק במטרה!',
    rules: ['רצים בטורים', 'מקיפים 2 כיפות מימין', 'נוגעים בכיפה 2 ונותנים כיף ✋ לבא בתור'],
    hud: { what: 'משימת ריצה חכמה', when: 'יוצאים רק אחרי שמקבלים כיף ✋', how: 'רצים, מקיפים מימין, נוגעים ונותנים כיף' },
  },
  esther: {
    story: 'אומץ שקט זה לעצור ולחשוב לפני שזזים.',
    rules: ['🟢 ירוק = זזים', '🔴 אדום = עוצרים', '🔵 כחול = נשימה 3-3', 'מילה אחרת = קופאים!'],
    hud: { what: 'ארמון הפוקוס', when: 'זזים רק כששומעים את הצבע הנכון!', how: 'ירוק זזים, אדום עוצרים, כחול נושמים' },
  },
  miriam: {
    story: 'כשזזים יחד בקצב התוף, כל הכיתה היא קבוצה אחת שמחה!',
    rules: ['עומדים במעגל אחד', 'מוחאים וצועדים בקצב התוף', 'הזוג רץ מסביב לפני שהכדור מסיים סיבוב'],
    hud: { what: 'מעגל הקצב', when: 'זזים בדיוק עם התוף!', how: 'מוחאים כפיים, צועדים ומעבירים כדור' },
  },
  devorah: {
    story: 'מנהיגה טובה מסתכלת, חושבת ובוחרת את הדרך הנכונה!',
    rules: ['מוסרים בזוגות', 'מקשיבים לצבע כשהכדור באוויר', 'מקיפים את הכיפה הנכונה ומוסרים חזרה'],
    hud: { what: 'משימת הצבעים', when: 'רצים ברגע שהצבע נשמע!', how: 'מוסרים, שומעים צבע, מקיפים ומוסרים חזרה' },
  },
  moshe: {
    story: 'מנהיג שומר על הדרך ועוזר לכל הקבוצה להגיע יחד!',
    rules: ['הולכים בטור בשביל הלבן', 'לא נוגעים בכיפות הכחולות (הים)', 'בסימן "עצור" עוצרים'],
    hud: { what: 'הדרך הבטוחה', when: 'הולכים ב"הולכים", עוצרים ב"עצור"!', how: 'הולכים בשביל בלי לגעת בים' },
  },
  yosef: {
    story: 'גם תנועה קטנה בונה הצלחה גדולה!',
    rules: ['מזיזים אצבעות וכפות ידיים', 'ממיינים צבעים במסלול אצבעות', 'בונים מגדל כוסות בזוגות'],
    hud: { what: 'מעבדת החלומות', when: 'עובדים לאט ובדיוק!', how: 'אצבעות עדינות, מיון ובניית מגדל' },
  },
  ruth: {
    story: 'בכיתה חזקה לא משאירים אף אחד מאחור!',
    rules: ['משימות בזוגות', 'אוספים שיבולי חברות', 'עוזרים ומעודדים כל חבר'],
    hud: { what: 'שדה החברות', when: 'פועלים יחד כל הזמן!', how: 'מעבירים גב אל גב ואומרים מילה טובה' },
  },
}

// Role, opening line and adventure name from the original GameGuide Studio site.
const ORIGINAL = {
  samson: { role: 'גיבור תיאטרלי', opening: 'אני שמשון! היום נגלה שכוח אמיתי הוא כוח בשליטה. זזים חזק, עוצרים בזמן, ועוזרים לחברים.', adventure: 'השער שמחכה לסימן' },
  david: { role: 'מאמן קצבי', opening: 'אני דוד! היום אני מסביר משחק פשוט וברור: עומדים בטורים, רצים למטרה, חוזרים לקבוצה ונותנים כיף.', adventure: 'התזמורת שהתבלבלה' },
  esther: { role: 'מדריכת פוקוס', opening: 'אני אסתר. היום נתרגל אומץ שקט: לעצור, לנשום, להקשיב, ולפעול בדיוק בזמן הנכון.', adventure: 'הקוד של הארמון' },
  miriam: { role: 'מדריכת קצב ושמחה', opening: 'אני מרים! היום אנחנו מכניסים קצב לגוף ושמחה לכיתה. מקשיבים לתוף, זזים יחד, ומרגישים איך הקבוצה הופכת למעגל אחד.', adventure: 'גשר המקצבים' },
  devorah: { role: 'מדריכת החלטות', opening: 'אני דבורה! היום אני עוזרת לכם לחשוב מהר, למסור מדויק, ולמצוא צבע בלי להילחץ.', adventure: 'מפת הצבעים' },
  moshe: { role: 'מנהיג דרך', opening: 'אני משה. כשיש אתגר גדול, לא נבהלים. מקשיבים, מסתדרים, עוברים צעד אחרי צעד, ועוזרים לכל הקבוצה להגיע לצד השני.', adventure: 'מסע של שלושה צעדים' },
  yosef: { role: 'מדריך דיוק', opening: 'אני יוסף. חלום גדול נבנה מפרטים קטנים, והיום האצבעות שלנו ילמדו דיוק וסבלנות.', adventure: 'החלום שבנוי מצורות' },
  ruth: { role: 'מדריכי חברות', opening: 'אנחנו רות ויהושע. בשדה שלנו כולם חברים, ואף אחד לא נשאר מאחור.', adventure: 'השדה שמחכה לכולם' },
}

for (const c of CHARACTER_MASTER_CONFIGS) {
  Object.assign(c, KID_GUIDE[c.id], ORIGINAL[c.id])
  c.portrait = PORTRAITS[c.id] ?? null
  // The character opens the lesson with their own line from the original site.
  c.intro = [{ text: c.opening, cue: 'idle' }, ...c.intro.slice(1)]
}

// Questions kids ask from the board; the avatar answers out loud.
export const KID_QUESTIONS = [
  { id: 'where', label: '🏃 איפה עומדים?', answer: (c) => `עומדים ב${c.formationLabel}, עם רווח ידיים מכל חבר.` },
  { id: 'when', label: '✋ מתי יוצאים?', answer: (c) => c.hud.when },
  { id: 'hard', label: '🦁 מה עושים אם קשה?', answer: () => 'נושמים עמוק, מנסים שוב, ומבקשים עזרה מחבר. כל ניסיון מוסיף כוח לכיתה!' },
  { id: 'win', label: '🏆 איך מנצחים?', answer: () => 'מנצחים יחד! כשכל הכיתה עובדת טוב, סרגל כוח הכיתה מתמלא.' },
]

export const getCharacter = (id) =>
  CHARACTER_MASTER_CONFIGS.find((c) => c.id === id) ?? CHARACTER_MASTER_CONFIGS[0]

// Optional HeyGen avatar video per character: put the MP4 at public/assets/<id>.mp4
// (samson.mp4, david.mp4, ...). VIDEO_CUES ties moments in a video to the simulation,
// e.g. samson: [{ t: 4.2, cue: 'freeze', text: 'שליטה!' }].
export const avatarVideoSrc = (id) => `${import.meta.env.BASE_URL}assets/${id}.mp4`
export const VIDEO_CUES = {}
