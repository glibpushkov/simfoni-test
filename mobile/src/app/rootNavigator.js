import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { SwitchNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation'
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import { Linking, Platform, AppState } from 'react-native'
import RNReferrer from 'react-native-referrer'

import { Session } from './session'
import { Home } from './home'
import WelcomeLoading from './WelcomeLoading'

import get from 'lodash/get'
// import { Error } from './common/widgets'

const appOptions = {
  initialRouteName: 'Home',
  navigationOptions: {
    gestureResponseDistance: {
      horizontal: 25,
      vertical: 160
    }
  }
}

const appRoutes = {
  Home: { screen: Home },
  Session: { screen: Session }
}

const AppNavigator = SwitchNavigator(appRoutes, appOptions)
const router = AppNavigator.router

const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
)
const addListener = createReduxBoundAddListener('root')

class AppWithNavigationState extends Component {
  constructor (props) {
    super(props)
    // this._handleRedirect = this._handleRedirect.bind(this)
    // this.handleLink = this.handleLink.bind(this)
    // this.handleAppStateChange = this.handleAppStateChange.bind(this)
  }
  // handleAppStateChange (nextAppState) {
  //   if (Platform.OS === 'ios') return
  //   if (nextAppState === 'active') {
  //     if (this.backgroundClearTimeout) {
  //       clearTimeout(this.backgroundClearTimeout)
  //       this.backgroundClearTimeout = null
  //     } else {
  //       if (this.props.session.token) return
  //       this.props.dispatch(setupNotifications())
  //     }
  //   } else {
  //     this.backgroundClearTimeout = setTimeout(() => {
  //       this.props.dispatch(removeListeners())
  //     }, 1000)
  //   }
  // }
  // handleLink (event) {
  //   this._handleRedirect(event.url)
  // }
  // componentDidMount () {
  //   if (!this.props.session.token) return
  //   this.props.dispatch(setupNotifications())
  //   AppState.addEventListener('change', this.handleAppStateChange)
  // }
  // componentWillMount () {
  //   if (Platform.OS !== 'ios') {
  //     RNReferrer.getReferrer()
  //       .then((playToken) => {
  //         if (playToken) {
  //           if (playToken.startsWith('token_')) {
  //             this.props.request({token: playToken.replace('token_', '')})
  //           } else {
  //             this.props.dispatch(NavigationActions.navigate({routeName: 'DemoStory',
  //               params: {
  //                 mobile_story_pk: playToken.replace('demostory_', '')
  //               }}))
  //           }
  //         }
  //       })
  //   }
  //   Linking.addEventListener('url', this.handleLink)
  //   Linking.getInitialURL().then((url) => {
  //     this._handleRedirect(url)
  //   })
  // }

  // componentWillUnmount () {
  //   Linking.removeEventListener('url', this.handleLink)
  //   this.props.dispatch(removeListeners())
  //   AppState.removeEventListener('change', this.handleAppStateChange)
  // }

  render () {
    if (!this.props.persisted) {
      return <WelcomeLoading />
    }
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
          addListener
        })}
      />
    )
  }
  // _handleRedirect (url) {
  //   if (!url) return
  //   if (url.includes('mobilestories')) {
  //     if (!this.props.session.token) return
  //     console.log(url)
  //     let query = getQuery(url)
  //     const mobile_story_pk = url.split('mobilestories/').pop().split('/').shift()
  //     const params = url.includes('/?') ? qs.parse(url.split('?').pop()) : {}
  //     const startWriteAction = NavigationActions.reset({
  //       index: 1,
  //       actions: [
  //         NavigationActions.navigate({routeName: 'Home'}),
  //         NavigationActions.navigate({
  //           routeName: 'CreateStory',
  //           params: { mobile_story_pk, ...params }
  //         })
  //       ]
  //     })
  //     this.props.dispatch(startWriteAction)
  //   } else {
  //     let query = getQuery(url)
  //     if (!get(query, 'token')) return
  //     this.props.request(query)
  //   }
  // }
}

export default connect(({ nav, session, persisted }) => ({ nav, session, persisted }))(AppWithNavigationState)

export { router, navigationMiddleware }
