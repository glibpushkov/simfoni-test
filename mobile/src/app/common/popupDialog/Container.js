import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Icon } from '../index'

class Container extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <View style={constinerStyle.wrapper}>
        { this.props.showClose
          ? <TouchableOpacity onPress={this.props.close} style={constinerStyle.closeButton}>
            <Icon
              name='close'
              color='#7f7f7f'
              size={styles.FONT_SIZE * 1.2}
            />
          </TouchableOpacity>
          : null
        }
        {this.props.children}
      </View>
    )
  }
}

Container.propTypes = {
  close: PropTypes.func,
  showClose: PropTypes.bool,
  duration: PropTypes.number,
  postAnimation: PropTypes.string
}

Container.defaultProps = {
  showClose: true,
  duration: 200
}

const calculateWidth = () => {
  const { DEVICE_WIDTH: W, FONT_SIZE_TITLE: F } = styles
  return W > 420 ? 420 : W - F * 2
}

const constinerStyle = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    opacity: 1,
    marginHorizontal: styles.FONT_SIZE_TITLE,
    minHeight: styles.FONT_SIZE * 2.5,
    maxHeight: styles.DEVICE_HEIGHT - styles.HEADER_HEIGHT,
    width: calculateWidth(),
    left: (styles.DEVICE_WIDTH - calculateWidth() - 2 * styles.FONT_SIZE_TITLE) / 2,
    borderRadius: 8
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: styles.FONT_SIZE_TITLE,
    zIndex: 10
  }
})

export default Container
