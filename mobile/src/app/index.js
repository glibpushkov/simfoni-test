import React, { Component } from 'react'
import { TranslateProvider } from 'gettext'
import { Provider } from 'react-redux'
import { StatusBar, TextInput, Keyboard, Platform } from 'react-native'
import App from './rootNavigator'
import store from './init'

console.ignoredYellowBox = ['Warning:', 'Remote']

export default class StoryToldApp extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    Keyboard.addListener('keyboardDidHide', this.blurInputs)
    StatusBar.setBarStyle('light-content')
    if (Platform.OS !== 'ios') {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor('rgba(0,0,0,0.2)')
    }
  }

  render () {
    return (
      <Provider store={store}>
        <TranslateProvider>
          <App />
        </TranslateProvider>
      </Provider>
    )
  }

  blurInputs () {
    if (TextInput.State.currentlyFocusedField() && Platform.OS === 'android') {
      TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField())
    }
  }

  componentWillUnmount () {
    Keyboard.removeListener('keyboardDidHide', this.blurInputs)
  }
}
