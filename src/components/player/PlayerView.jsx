// #player: the smart board. One idea per moment, readable from the back row:
// what we do now (giant word + a kid showing it), who is talking, how far we are.
import { getCharacter } from '../../data/characters.js'
import { CUE_TEXT, isCommand } from '../../data/cues.js'
import { dispatch, useLesson } from '../../engine/store.js'
import { useScriptRunner } from '../../engine/useScriptRunner.js'
import ClassSuccessTracker from '../shared/ClassSuccessTracker.jsx'
import ClassVictoryCertificate from '../shared/ClassVictoryCertificate.jsx'
import CountdownOverlay from './CountdownOverlay.jsx'
import DemoStage from './KidFigure.jsx'
import KidsHUD, { FormationMap } from './KidsHUD.jsx'
import TeacherRemote from './TeacherRemote.jsx'
import VictoryOverlay from './VictoryOverlay.jsx'
import VoiceAgent, { AgentQuestion } from './VoiceAgent.jsx'

function StartScreen({ character, onStart }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      {character.portrait ? (
        <img src={character.portrait} alt={character.name} width={640} height={480} className="h-[38vh] w-auto max-w-full rounded-[32px] border-4 border-gold object-cover shadow-[0_24px_60px_-20px_rgba(0,0,0,.6)]" />
      ) : (
        <div className="text-[140px] leading-none">{character.emoji}</div>
      )}
      <h1 className="font-display text-6xl text-balance text-chalk">{character.gameTitle}</h1>
      <p className="max-w-[40ch] text-2xl leading-relaxed text-chalk/85">{character.opening}</p>
      <button
        type="button"
        onClick={onStart}
        className="pop-in min-h-[80px] rounded-3xl bg-gold px-14 font-display text-4xl text-board shadow-[0_18px_40px_-14px_rgba(255,200,61,.8)] hover:bg-[#ffd466]"
      >
        מתחילים!
      </button>
    </div>
  )
}

// The one thing to look at: the action, shown and named.
function ActionPanel({ character, s }) {
  if (s.phase === 'setup') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <h2 className="font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-none text-chalk">איפה עומדים?</h2>
        <p className="text-3xl font-bold text-gold">{character.formationLabel}</p>
        <div className="aspect-[600/340] w-full max-w-3xl min-h-0 shrink"><FormationMap formation={character.formation} /></div>
        <p className="text-2xl font-medium text-chalk/90">פותחים ידיים לצדדים. לא נוגעים באף חבר.</p>
      </div>
    )
  }

  if (s.phase === 'summary') {
    return (
      <div className="grid h-full grid-cols-1 items-center gap-4 p-6 md:grid-cols-2">
        <div className="aspect-[600/330] w-full"><DemoStage cue="breathe" color={character.color} /></div>
        <ClassSuccessTracker completed={s.completed} workedTags={s.workedTags} practiceTags={s.practiceTags} />
      </div>
    )
  }

  const cue = CUE_TEXT[s.cue] ?? CUE_TEXT.idle
  const word = isCommand(s.line) ? s.line : cue.word
  return (
    <div className="flex h-full flex-col items-center gap-1 px-6 pb-5 pt-4 text-center">
      <div
        key={word}
        className="pop-in font-display leading-none drop-shadow-[0_6px_0_rgba(0,0,0,.25)]"
        style={{ color: cue.color, fontSize: 'clamp(3.5rem, 8vw, 7.5rem)' }}
        aria-live="polite"
      >
        {word}
      </div>
      <div className="min-h-[220px] w-full flex-1"><DemoStage cue={s.cue} color={cue.color} /></div>
      <p className="text-[clamp(1.4rem,2.4vw,2.2rem)] font-bold text-chalk">{cue.how}</p>
    </div>
  )
}

function CharacterColumn({ character, s }) {
  return (
    <div className="flex min-h-0 flex-col items-center gap-4">
      <div
        className={`relative aspect-[4/5] w-full max-w-[280px] shrink-0 overflow-hidden rounded-[28px] border-4 transition-colors duration-300 lg:max-h-[46vh] ${s.isTalking ? 'halo-talking border-gold' : 'border-board-3'}`}
        style={{ background: `radial-gradient(circle at 50% 35%, ${character.color}, #0f1e3d 75%)` }}
      >
        {character.portrait ? (
          <img src={character.portrait} alt={character.name} width={640} height={480} className={`absolute inset-0 h-full w-full object-cover object-top ${s.isTalking ? 'avatar-talking' : 'avatar-idle'}`} />
        ) : (
          <span className="flex h-full items-center justify-center text-[120px]">{character.emoji}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-board via-board/70 to-transparent px-3 pb-2 pt-8 text-center font-display text-3xl text-chalk">
          {character.name}
        </div>
      </div>

      {/* speech bubble: what the character is saying right now */}
      <div className="relative w-full rounded-[24px] bg-chalk px-5 py-4 text-center shadow-[0_16px_34px_-18px_rgba(0,0,0,.7)]">
        <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 rounded-[4px] bg-chalk" aria-hidden="true" />
        <AgentQuestion character={character} status={s.agentStatus} question={s.agentQuestion} />
        <p className="relative font-display text-[clamp(1.35rem,2vw,1.9rem)] leading-snug text-board" aria-live="polite">
          {s.line || character.story}
        </p>
      </div>
    </div>
  )
}

export default function PlayerView() {
  useScriptRunner()
  const s = useLesson()
  const character = getCharacter(s.characterId)
  const notStarted = !s.lessonStartedAt

  const start = () => {
    document.documentElement.requestFullscreen?.().catch(() => {})
    dispatch({ type: 'START_LESSON' })
  }

  return (
    <div id="player" className="flex min-h-full flex-col overflow-x-hidden bg-board text-chalk lg:h-[100dvh] lg:min-h-0" dir="rtl">
      {notStarted ? (
        <StartScreen character={character} onStart={start} />
      ) : (
        <>
          <KidsHUD character={character} phase={s.phase} level={s.level} classPower={s.classPower} />

          <main className="grid flex-1 grid-cols-1 gap-5 px-5 py-4 lg:min-h-0 lg:grid-cols-[minmax(240px,290px)_1fr]">
            <CharacterColumn character={character} s={s} />
            <section className="min-h-[420px] overflow-hidden rounded-[32px] bg-board-2 lg:min-h-0">
              <ActionPanel character={character} s={s} />
            </section>
          </main>

          <footer className="px-5 pb-4">
            <VoiceAgent character={character} status={s.agentStatus} />
          </footer>
        </>
      )}

      <CountdownOverlay value={s.countdown} />
      {s.showVictory && <VictoryOverlay character={character} />}
      {s.showCertificate && <ClassVictoryCertificate character={character} classPower={s.classPower} completed={s.completed} workedTags={s.workedTags} />}
      <TeacherRemote running={s.running} completed={s.completed} />
    </div>
  )
}
