import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoMoonConfig from './selection.json'
import { I18nManager } from 'react-native'
import VectorIconComponent from './VectorIconComponent'

const Icon_ = createIconSetFromIcoMoon(icoMoonConfig)

export default class Icon extends PureComponent {
  render () {
    const { name, style, size, color, allowFontScaling, isRTL } = this.props
    const VectorIcon = VectorIconComponent.get()
    const rtlStyle = isRTL ? {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]} : {}
    return (
      <Icon_
        name={name}
        size={size}
        color={color}
        style={[ rtlStyle, style ]}
        allowFontScaling={allowFontScaling}
      />
    )
  }
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  allowFontScaling: PropTypes.bool,
  isRTL: PropTypes.bool
}

Icon.defaultProps = {
  size: 30,
  color: '#757575',
  allowFontScaling: true,
  style: {},
  isRTL: false
}
