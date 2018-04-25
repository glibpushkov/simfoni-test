
import pick from 'lodash/pick'
import get from 'lodash/get'
import { AsyncStorage } from 'react-native'

export default function ({ getState }) {
  return (next) => (action) => {
    const result = next(action)
    AsyncStorage.setItem('state', JSON.stringify(
      pick(get(getState(), 'resources', {}), [
        'session',
        'agreement'
      ])
    ))
    return result
  }
}
