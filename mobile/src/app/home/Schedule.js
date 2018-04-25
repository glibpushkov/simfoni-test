import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, Image, Linking } from 'react-native'
import { TabBarIcon } from '../common/widgets'
import Images from '@images/images'

export default class Schedule extends PureComponent {
  render () {
    return (
      <View style={style.root}>
        <Image
          source={Images.logo}
          stype={style.logo}
        />
        <Text>Schedule</Text>
      </View>
    )
  }
}

Schedule.navigationOptions = {
  tabBarIcon: TabBarIcon('schedule')
}

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
