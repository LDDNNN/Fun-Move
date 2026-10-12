// What each cue means, in a 3rd grader's words: the giant action word and one
// plain sentence under the demo.
export const CUE_TEXT = {
  idle: { word: 'מקשיבים', how: 'עומדים במקום ומקשיבים', color: '#f4f7ff' },
  jump: { word: 'קופצים!', how: 'קופצים גבוה, כל הכיתה יחד', color: '#ffc83d' },
  freeze: { word: 'קופאים!', how: 'עומדים בלי לזוז, כמו פסל קרח', color: '#8fd8ff' },
  stop: { word: 'עוצרים!', how: 'עוצרים במקום ומרימים יד', color: '#ff7b80' },
  breathe: { word: 'נושמים', how: 'יד על הבטן, נושמים לאט', color: '#7cc0ff' },
  run: { word: 'רצים!', how: 'רצים ומקיפים את הכיפה מימין', color: '#3ccf7a' },
  walk: { word: 'הולכים', how: 'הולכים לאט בשביל, בלי לגעת בכיפות', color: '#3ccf7a' },
  clap: { word: 'מוחאים!', how: 'מוחאים כפיים בקצב', color: '#ffc83d' },
  move: { word: 'זזים!', how: 'רוקדים וזזים במקום', color: '#3ccf7a' },
  fine: { word: 'אצבעות', how: 'מזיזים אצבעות לאט ובעדינות', color: '#ffc83d' },
  pass: { word: 'מוסרים!', how: 'זורקים את הכדור לחבר', color: '#ffc83d' },
  team: { word: 'גב אל גב', how: 'עומדים גב אל גב ומעבירים לחבר', color: '#ffc83d' },
  stations: { word: '4 תחנות', how: 'קופצים, זוחלים, עומדים על רגל אחת וזורקים', color: '#ffc83d' },
}

// A short call like "כוח!" or "כוח־כוח!" is shown as the giant word itself.
export const isCommand = (line) => /!$/.test(line) && line.split(/\s+/).length <= 2 && line.length <= 14
