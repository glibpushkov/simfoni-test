import React from 'react'
import { PropTypes } from 'prop-types'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

export default function Header ({ children }) {
  return (
    <View style={style.main}>
      {children}
    </View>
  )
}

Header.propTypes = {

}

Header.defaultProps = {

}

const style = StyleSheet.create({
  main: {
    height: styles.HEADER_HEIGHT,
    width: styles.DEVICE_WIDTH,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: styles.FONT_SIZE,
    backgroundColor: styles.COLOR_PRIMARY,
    paddingTop: styles.STATUSBAR_HEIGHT
  }
})
