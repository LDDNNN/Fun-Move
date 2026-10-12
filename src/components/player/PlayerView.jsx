// #player: the full-screen smart-board view the kids see. No admin text here.
import { getCharacter, KID_QUESTIONS } from '../../data/characters.js'
import { dispatch, useLesson } from '../../engine/store.js'
import { answerQuestion, useScriptRunner } from '../../engine/useScriptRunner.js'
import ClassSuccessTracker from '../shared/ClassSuccessTracker.jsx'
import ClassVictoryCertificate from '../shared/ClassVictoryCertificate.jsx'
import AvatarStage from './AvatarStage.jsx'
import CountdownOverlay from './CountdownOverlay.jsx'
import GameDemoSimulations from './GameDemoSimulations.jsx'
import KidsHUD, { FormationMap } from './KidsHUD.jsx'
import TeacherRemote from './TeacherRemote.jsx'
import VictoryOverlay from './VictoryOverlay.jsx'

function StartScreen({ character, onStart }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="text-[140px] leading-none">{character.emoji}</div>
      <h1 className="font-display text-6xl text-chalk">{character.hud.what}</h1>
      <p className="max-w-2xl text-2xl text-chalk/80">{character.story}</p>
      <button
        type="button"
        onClick={onStart}
        className="pop-in min-h-[72px] rounded-3xl bg-gold px-12 font-display text-4xl text-board shadow-[0_0_40px_rgba(255,200,61,.5)] transition hover:scale-105"
      >
        ▶ מתחילים!
      </button>
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
    <div id="player" className="flex min-h-full flex-col bg-board text-chalk" dir="rtl">
      {notStarted ? (
        <StartScreen character={character} onStart={start} />
      ) : (
        <>
          <KidsHUD character={character} phase={s.phase} level={s.level} classPower={s.classPower} />

          <main className="grid flex-1 grid-cols-1 gap-5 p-5 lg:grid-cols-[minmax(260px,340px)_1fr_minmax(220px,280px)]">
            <section className="flex flex-col items-center justify-center">
              <AvatarStage character={character} isTalking={s.isTalking} />
            </section>

            <section className="min-h-[300px] overflow-hidden rounded-[28px] border-2 border-board-3 bg-board-2">
              {s.phase === 'summary' ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
                  <GameDemoSimulationsSmall formation={character.formation} cue={s.cue} cueAt={s.cueAt} />
                  <ClassSuccessTracker completed={s.completed} workedTags={s.workedTags} practiceTags={s.practiceTags} />
                </div>
              ) : (
                <GameDemoSimulations formation={character.formation} cue={s.cue} cueAt={s.cueAt} showSpacing={s.phase === 'setup'} />
              )}
            </section>

            <aside className="flex flex-col gap-4">
              <div className="rounded-3xl bg-board-2 p-4">
                <div className="text-sm font-bold text-gold">📍 איפה עומדים?</div>
                <div className="mt-1 text-xl font-bold">{character.formationLabel}</div>
                <div className="mt-2 aspect-[600/340] max-w-full"><FormationMap formation={character.formation} /></div>
              </div>
              <div className="rounded-3xl bg-board-2 p-4">
                <div className="text-sm font-bold text-gold">⏱️ מתי יוצאים?</div>
                <div className="mt-1 text-xl font-bold leading-snug">{character.hud.when}</div>
              </div>
              <div className="rounded-3xl bg-board-2 p-4">
                <div className="text-sm font-bold text-gold">🏃 איך מבצעים?</div>
                <ul className="mt-1 flex flex-col gap-1 text-lg font-medium">
                  {character.rules.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              </div>
            </aside>
          </main>

          <footer className="flex flex-col items-center gap-3 px-5 pb-5">
            <div className="flex min-h-[96px] w-full max-w-5xl items-center justify-center rounded-[28px] bg-chalk px-8 py-4 text-center shadow-xl" aria-live="polite">
              <p className="font-display text-3xl leading-snug text-board sm:text-4xl">{s.line || character.story}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {KID_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => answerQuestion(q.answer(character))}
                  className="min-h-[52px] rounded-2xl bg-board-3 px-5 text-lg font-bold text-chalk transition hover:bg-board-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                >
                  {q.label}
                </button>
              ))}
            </div>
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

function GameDemoSimulationsSmall(props) {
  return (
    <div className="aspect-[600/340] w-full max-w-md">
      <GameDemoSimulations {...props} />
    </div>
  )
}
