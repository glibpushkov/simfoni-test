import { handleActions } from 'redux-actions'
import { of } from 'rxjs/observable/of'
import createAsyncAction from '../actionCreator'
import Error from './Error' 

const actions = createAsyncAction('ERRORS_')

const error = handleActions({
  [actions.success().type]: (state, {payload = ''}) => payload,
  [actions.abort().type]:()=>(''),
}, '')


const clearErrorEpic = (action$) => {
  return action$.ofType(actions.success().type)
  .switchMap((action) => {
    return of(actions.abort()).delay(4000)
  })
}

const errorEpics = [clearErrorEpic]
const { success: setError, abort: clearError } = actions

export default Error
export { setError, clearError, error, errorEpics }
