import React, { Component } from 'react'
import { StyleSheet, View, TextInput, I18nManager } from 'react-native'
import { Button, Icon } from '../../widgets'
import PropTypes from 'prop-types'

export default class CodeInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
    this.handleChange = this.handleChange.bind(this)
    this.dell = this.dell.bind(this)
  }

  handleChange (value) {
    this.setState({ value })
    this.props.onChange(value)
  }

  dell () {
    let { value } = this.state
    value = value.slice(0, -1)
    this.setState({ value })
    this.props.onChange(value)
  }

  render () {
    const { inputStyle, value, selectionColor, placeholder } = this.props
    return (
      <View style={style.wrapper}>
        <TextInput
          style={[style.textInput, inputStyle]}
          value={this.state.value}
          onChangeText={this.handleChange}
          underlineColorAndroid={'transparent'}
          blurOnSubmit
          clearButtonMode='while-editing'
          dataDetectorTypes='phoneNumber'
          keyboardType='phone-pad'
          selectionColor={selectionColor}
          placeholder={placeholder}
        />
        <Button
          onPress={this.dell}
          buttonStyle={style.buttonStyle}
        >
          <Icon name='delete' size={styles.FONT_SIZE_TITLE} isRTL />
        </Button>
      </View>
    )
  }
}

CodeInput.propTypes = {
  numberformat: PropTypes.string
}

CodeInput.defaultProps = {
  numberformat: '',
  placeholder: ''
}

const style = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    paddingVertical: styles.FONT_SIZE / 2,
    paddingRight: styles.FONT_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.12)'
  },
  buttonStyle: {
    paddingVertical: styles.FONT_SIZE
  },
  textInput: {
    flex: 1,
    alignSelf: 'stretch',
    color: styles.COLOR_FONT,
    backgroundColor: 'white',
    fontSize: styles.FONT_SIZE_TITLE,
    backgroundColor: 'transparent',
    padding: 0,
    marginLeft: styles.FONT_SIZE,
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  }
})
