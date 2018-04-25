import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Button, Flag } from '../../widgets'

export default function ({item, onPress}) {
  return (
    <Button onPress={onPress} buttonStyle={style.buttonStyle}>
      <Flag
        code={item.country_code}
        size={32}
        style={style.flag}
      />
      <Text style={style.text}>{item.country_name} ({item.dialling_code})</Text>
    </Button>
  )
}

const style = StyleSheet.create({
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: styles.FONT_SIZE * 3
  },
  text: {
    fontSize: styles.FONT_SIZE,
    flex: 1,
    paddingHorizontal: styles.FONT_SIZE,
    textAlign: 'left'
  },
  flag: {
    marginLeft: styles.FONT_SIZE
  }
})
