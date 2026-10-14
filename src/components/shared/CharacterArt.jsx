// The character's picture: the original portrait, or the illustrated figure when
// the teacher picks "מצויר" (or the character has no portrait yet).
import HeroFigure from '../player/HeroFigure.jsx'
import { useLesson } from '../../engine/store.js'

export default function CharacterArt({ character, talking = false, cue = 'idle', imgClassName = '', figureClassName = 'h-full w-full' }) {
  const style = useLesson((s) => s.avatarStyle)
  if (character.portrait && style !== 'drawn') {
    return <img src={character.portrait} alt={character.name} width={640} height={480} className={imgClassName} />
  }
  return <HeroFigure id={character.id} cue={cue} talking={talking} className={figureClassName} label={character.name} />
}
