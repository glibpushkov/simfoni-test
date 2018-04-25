import { AsyncStorage } from 'react-native'
import Config from 'react-native-config'
import DeviceInfo from 'react-native-device-info'
import toPairs from 'lodash/toPairs'
import get from 'lodash/get'
import { createContext } from 'react'

const translations = {}
const country = (DeviceInfo.getDeviceCountry() || 'en').toLowerCase()

const { Provider, Consumer: Translator } = React.createContext({translations})

class TranslateProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      translations: {}
    }
    AsyncStorage.getItem('translations')
      .then(data => {
        if (data) { this.setState({ translations: JSON.parse(data) }) }
      })
    fetch(`${Config.API_URL}/api/v1/translations/`)
      .then(res => res.json())
      .then(data => {
        this.setState({ translations: data })
        AsyncStorage.setItem('translations', JSON.stringify(data))
      })
    this.gettext = this.gettext.bind(this)
  }
  render () {
    return (
      <Provider value={{translations: this.state.translations, gettext: this.gettext}}>
        {this.props.children}
      </Provider>
    )
  }
  gettext (text) {
    return get(this.state.translations, `[${text}].${country}`, get(this.state.translations, `[${text}].en`, text)) || ''
  }
}

export { Translator, TranslateProvider }

export default function gettext (text = '') {
  return (
    <Translator>
      {({ gettext }) => gettext(text)}
    </Translator>
  )
}
