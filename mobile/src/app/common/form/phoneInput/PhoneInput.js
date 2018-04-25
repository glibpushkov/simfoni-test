import React, { Component } from 'react'
import DeviceInfo from 'react-native-device-info'
import { StyleSheet, View, TextInput, Modal, FlatList, I18nManager } from 'react-native'
import { Button, Flag } from '../../widgets'
import CountrieModal from './CountrieModal'
import PropTypes from 'prop-types'
import { AsYouType, formatNumber, isValidNumber } from 'libphonenumber-js'
import counries from './counries.json'
import find from 'lodash/find'
import get from 'lodash/get'

const country = DeviceInfo.getDeviceCountry()
const PhoneNumber = DeviceInfo.getPhoneNumber() || get(find(counries, ['country_code', country]), 'dialling_code', '')
const phone = formatNumber((PhoneNumber.startsWith('+') ? '' : '+') + PhoneNumber, 'International')

export default class PhoneInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      active: false,
      code: country,
      value: props.value || phone
    }
    props.validatePhone(isValidNumber(this.state.value))
    this.toggleModal = this.toggleModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.selectCounrie = this.selectCounrie.bind(this)
  }

  toggleModal () {
    this.setState({active: !this.state.active})
  }

  selectCounrie (item) {
    this.setState({
      code: item.country_code,
      active: false
    })
    this.props.onChange(item.dialling_code)
  }

  handleChange (value) {
    const asYouType = new AsYouType()
    const val_ = (value.startsWith('+') ? '' : '+') + value.replace(/[^0-9+\s]/g, '')
    const val = asYouType.input(val_)
    const { code } = this.state
    this.setState({ code: asYouType.country || code, value: val })
    this.props.onChange(val)
    this.props.validatePhone(isValidNumber(val))
  }

  render () {
    const { inputStyle, value, placeholder, placeholderTextColor, selectionColor } = this.props
    return (
      <View style={style.wrapper}>
        <Button
          onPress={this.toggleModal}
          buttonStyle={style.buttonStyle}
        >
          <Flag code={this.state.code} size={32} />
        </Button>
        <TextInput
          style={[style.textInput, inputStyle]}
          value={this.state.value}
          onChangeText={this.handleChange}
          underlineColorAndroid={'transparent'}
          blurOnSubmit
          clearButtonMode='while-editing'
          dataDetectorTypes='phoneNumber'
          keyboardType='phone-pad'
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          selectionColor={selectionColor}
        />
        <CountrieModal
          selectCounrie={this.selectCounrie}
          close={this.toggleModal}
          active={this.state.active}
        />
      </View>
    )
  }
}

PhoneInput.propTypes = {
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string
}

PhoneInput.defaultProps = {
  placeholder: 'your phone number',
  placeholderTextColor: styles.COLOR_GREY,
  selectionColor: styles.COLOR_PRIMARY
}

const style = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
    paddingVertical: styles.FONT_SIZE,
    paddingRight: styles.FONT_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.12)'
  },
  buttonStyle: {
    paddingVertical: 0
  },
  textInput: {
    flex: 1,
    alignSelf: 'stretch',
    color: styles.COLOR_FONT,
    backgroundColor: 'white',
    fontSize: styles.FONT_SIZE_TITLE,
    backgroundColor: 'transparent',
    padding: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  backIcon: {

  }
})
