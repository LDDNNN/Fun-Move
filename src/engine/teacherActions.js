// One place for the teacher's controls, shared by the dashboard, the board remote
// and voice commands.
import { dispatch } from './store.js'

export function runTeacherCommand(command) {
  switch (command) {
    case 'next':
      return dispatch({ type: 'NEXT' })
    case 'pause':
      return dispatch({ type: 'TOGGLE_PAUSE' })
    case 'replay':
      return dispatch({ type: 'REPLAY' })
    case 'cheer':
      return dispatch({ type: 'ADD_POWER', points: 10 })
    default:
  }
}
