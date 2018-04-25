import { StackNavigator, SwitchNavigator } from 'react-navigation'
import LoginScreen from './LoginScreen'
import ReceiveSMS from './ReceiveSMS'
import TermsOfUse from './TermsOfUse'

const routes = {
  Login: { screen: LoginScreen },
  ReceiveSMS: { screen: ReceiveSMS }
}

const options = {
  initialRouteName: 'Login',
  headerMode: 'none',
  navigationOptions: {
    gestureResponseDistance: {
      horizontal: 25,
      vertical: 160
    }
  }
}

const LoginNavigation = StackNavigator(routes, options)

const UathNavigation = SwitchNavigator({
  SignIn: { screen: LoginNavigation },
  TermsOfUse: { screen: TermsOfUse}
})

export default UathNavigation
