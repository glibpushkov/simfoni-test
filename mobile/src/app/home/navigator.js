import { TabNavigator, SwitchNavigator } from 'react-navigation'
import Home from './Home'
import Earnings from './Earnings'
import Schedule from './Schedule'
import ContactUs from './ContactUs'

const routes = {
  Main: { screen: Home },
  Earnings: { screen: Earnings },
  Schedule: { screen: Schedule }

}

const tabBarOptions = {
  activeTintColor: styles.COLOR_PRIMARY,
  inactiveTintColor: '#888888',
  upperCaseLabel: false,
  showIcon: true,
  indicatorStyle: {
    backgroundColor: 'transparent'
  },
  style: {
    height: 56,
    backgroundColor: '#f5f5f5'
  },
  tabStyle: {
    backgroundColor: 'transparent'
  },
  labelStyle: {
    margin: 0,
    fontSize: styles.FONT_SIZE_SMALL,
    lineHeight: parseInt(styles.FONT_SIZE_SMALL * 1.14, 10)
  }
}

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  initialRouteName: 'Main',
  order: ['Main', 'Earnings', 'Schedule'],
  tabBarOptions
}

const homeNavigator = TabNavigator(routes, options)

export default SwitchNavigator({
  Home: { screen: homeNavigator },
  ContactUs: { screen: ContactUs}
}, {initialRouteName: 'Home'})
