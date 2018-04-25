import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, Image, Linking } from 'react-native'
import { TabBarIcon } from '../common/widgets'
import Images from '@images/images'
import connect from '../utils/resources'
import get from 'lodash/get'

class Home extends PureComponent {
  componentDidMount () {
    if (!get(this.props, 'session.data.user.is_activated')) {
      this.props.navigation.navigate('ContactUs')
    }
  }
  render () {
    return (
      <View style={style.root}>
        <Image
          source={Images.logo}
          stype={style.logo}
        />
        <Text style={style.text}>Home</Text>
      </View>
    )
  }
}

Home.navigationOptions = {
  tabBarIcon: TabBarIcon('home')
}

export default connect(['session'])(Home)

const style = StyleSheet.create({
  root: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: styles.COLOR_PRIMARY,
    justifyContent: 'center'
  },
  logo: {

  }
})
