import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'

export default function BaseFieldLayout (props) {
  const {
    customLabel,
    required,
    inputComponent: InputComponent
  } = props

  return (
    <View>
      {customLabel && <Text style={style.desc}>{customLabel}</Text>}
      <InputComponent
        {...props}
        {...props.input}
      />
    </View>
  )
}

const style = StyleSheet.create({
  desc: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'column'
  }
})
