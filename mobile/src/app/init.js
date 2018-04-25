import { createStore, applyMiddleware, combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { createLogger } from 'redux-logger'
import { AsyncStorage } from 'react-native'
import storageMiddleware from './store/storage-middleware'
import authMiddleware from './store/auth-middleware'
import { reducers, epics } from './store'
import { router, navigationMiddleware } from './rootNavigator'
import { reducer as resources, epic as resourcesEpic } from './utils/resources'

const initialState = router.getStateForAction(router.getActionForPathAndParams('Home'))

const nav = (state = initialState, action) => {
  const nextState = router.getStateForAction(action, state)
  return nextState || state
}

const persisted = (state = false) => state

const combinedReducers = combineReducers({
  nav,
  form,
  persisted,
  resources,
  ...reducers
})

const PERSIST = 'SET_STORE'

const appReducer = (state = {}, action) => {
  switch (action.type) {
    case PERSIST:
      return {...state, ...action.payload, persisted: true}
    default:
      return combinedReducers(state, action)
  }
}

import API, { configure as configureApi } from './utils/api'

const createStoreWithMiddleware = applyMiddleware(
  createEpicMiddleware(combineEpics(...epics, resourcesEpic), { dependencies: { API } }),
  storageMiddleware,
  navigationMiddleware,
  authMiddleware,
  createLogger()
)(createStore)

const store = createStoreWithMiddleware(appReducer)
configureApi(store)

AsyncStorage.getItem('state')
  .then(data => {
    store.dispatch({ type: PERSIST, payload: { resources: data ? JSON.parse(data) : {} } })
  })

export default store
