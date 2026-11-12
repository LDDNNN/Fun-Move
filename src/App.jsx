import { useEffect, useState } from 'react'
import PlayerView from './components/player/PlayerView.jsx'
import Dashboard from './components/teacher/Dashboard.jsx'
import QuickGames from './components/teacher/QuickGames.jsx'

const route = () => location.hash === '#player' ? 'player' : location.hash === '#quick-games' ? 'quick-games' : 'teacher'

export default function App() {
  const [view, setView] = useState(route)
  useEffect(() => {
    const onHash = () => setView(route())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (view === 'player') return <PlayerView />
  if (view === 'quick-games') return <QuickGames />
  return <Dashboard />
}
