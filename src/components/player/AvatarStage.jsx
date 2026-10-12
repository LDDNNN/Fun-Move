// The talking avatar: HeyGen MP4 when public/assets/<id>.mp4 exists, otherwise an
// animated character badge. A gold halo and sound waves show while it speaks.
import { useEffect, useRef, useState } from 'react'
import { avatarVideoSrc, VIDEO_CUES } from '../../data/characters.js'
import { dispatch } from '../../engine/store.js'

function Waveform({ active }) {
  return (
    <div className={`flex h-10 items-center gap-1.5 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
      {[0.5, 0.9, 0.6, 1, 0.7, 0.95, 0.55].map((h, i) => (
        <span key={i} className="wave-bar block w-2 rounded-full bg-gold" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.11}s` }} />
      ))}
    </div>
  )
}

export default function AvatarStage({ character, isTalking }) {
  const [hasVideo, setHasVideo] = useState(false)
  const video = useRef(null)
  const firedCue = useRef(-1)
  const cues = VIDEO_CUES[character.id] ?? []
  const narrated = cues.length > 0 // a cued video carries its own voice and drives the board

  useEffect(() => {
    setHasVideo(false)
    firedCue.current = -1
  }, [character.id])

  // Cued video: each timestamp crossed fires its line + simulation cue.
  const onTimeUpdate = () => {
    if (!narrated || !video.current) return
    const t = video.current.currentTime
    const idx = cues.findLastIndex((c) => c.t <= t)
    if (idx !== firedCue.current && idx >= 0) {
      firedCue.current = idx
      dispatch({ type: 'SET_LINE', text: cues[idx].text ?? '', cue: cues[idx].cue })
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-[32px] border-4 transition-colors duration-300 ${isTalking ? 'halo-talking border-gold' : 'border-board-3'}`}
        style={{ background: `radial-gradient(circle at 50% 35%, ${character.color}, #0f1e3d 75%)` }}
      >
        <video
          key={character.id}
          ref={video}
          src={avatarVideoSrc(character.id)}
          autoPlay
          loop={!narrated}
          muted={!narrated}
          playsInline
          onLoadedData={() => setHasVideo(true)}
          onError={() => setHasVideo(false)}
          onPlay={() => narrated && dispatch({ type: 'SET_TALKING', value: true })}
          onPause={() => narrated && dispatch({ type: 'SET_TALKING', value: false })}
          onEnded={() => narrated && dispatch({ type: 'SET_TALKING', value: false })}
          onTimeUpdate={onTimeUpdate}
          className={`absolute inset-0 h-full w-full object-cover ${hasVideo ? '' : 'hidden'}`}
        />
        {!hasVideo && character.portrait && (
          <img
            src={character.portrait}
            alt={character.name}
            width={640}
            height={480}
            className={`absolute inset-0 h-full w-full object-cover object-top ${isTalking ? 'avatar-talking' : 'avatar-idle'}`}
          />
        )}
        {!hasVideo && !character.portrait && (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <span className={`select-none text-[150px] leading-none drop-shadow-xl ${isTalking ? 'avatar-talking' : ''}`}>{character.emoji}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-board via-board/70 to-transparent px-4 pb-3 pt-10 text-center">
          <div className="font-display text-3xl text-chalk">{character.name}</div>
          <div className="text-sm font-bold text-gold">{character.role}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xl font-bold ${isTalking ? 'text-gold' : 'text-chalk/60'}`}>🎤 {character.name} {character.speaks ?? 'מדבר'} אליכם</span>
        <Waveform active={isTalking} />
      </div>
    </div>
  )
}
