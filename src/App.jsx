import { useEffect, useState } from 'react'
import PlayerView from './components/player/PlayerView.jsx'
import Dashboard from './components/teacher/Dashboard.jsx'

const route = () => (location.hash === '#player' ? 'player' : 'teacher')

export default function App() {
  const [view, setView] = useState(route)
  useEffect(() => {
    const onHash = () => setView(route())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return view === 'player' ? <PlayerView /> : <Dashboard />
}
