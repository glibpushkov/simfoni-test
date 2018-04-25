import React from 'react'
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native'
import Images from '@images/images'

function WelcomeLoading () {
  return (
    <View style={style.root}>
      <Image
        source={Images.logo}
        style={style.logo}
      />
      <ActivityIndicator
        animating
        size='large'
        color='#ffffff'
      />
    </View>
  )
}

const style = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT,
    backgroundColor: styles.COLOR_PRIMARY
  },
  logo: {
    marginVertical: styles.FONT_SIZE * 1.5
  }
})

export default WelcomeLoading
