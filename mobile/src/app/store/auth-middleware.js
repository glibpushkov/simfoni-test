import { NavigationActions } from 'react-navigation'
import get from 'lodash/get'

const authMiddleware = ({ getState, dispatch }) => next => action => {
  const prevState = getState()
  let result = next(action)
  const nextState = getState()
  if (get(prevState, 'resources.session.data.token') !== get(nextState, 'resources.session.data.token') ||
    (!get(nextState, 'resources.session.data.token') && action.type === 'SET_STORE')) {
    const sessionNavigateAction = NavigationActions.navigate({
      routeName: get(nextState, 'resources.session.data.token') ? 'Home' : 'Session'
    })

    dispatch(sessionNavigateAction)
  }
  return result
}

export default authMiddleware
