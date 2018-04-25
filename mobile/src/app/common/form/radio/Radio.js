import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, View, Animated, StyleSheet } from 'react-native'

export default class Radio extends Component {
  constructor (props) {
    super(props)
    this.animationValue = new Animated.Value(props.active ? 1 : 0)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.active !== this.props.active) {
      const toValue = nextProps.active ? 1 : 0
      toValue ? Animated.spring(this.animationValue, {
        toValue,
        friction: 4,
        tension: 100
      }).start() : Animated.timing(this.animationValue, { toValue }).start()
    }
  }
  render () {
    const scale = this.animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.01, 1]
    })
    const transform = [{ scale }]
    return (
      <TouchableOpacity style={style.root} activeOpacity={1} onPress={this.props.onChange}>
        <View style={style.circle}>
          <Animated.View style={[style.dot, {transform}]} />
        </View>
        <Text style={style.text}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}

Radio.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

Radio.defaultProps = {
  active: false,
  text: ''
}

const style = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: styles.FONT_SIZE * 0.8,
    marginVertical: styles.FONT_SIZE * 0.6
  },
  circle: {
    width: styles.FONT_SIZE_TITLE * 1.3,
    height: styles.FONT_SIZE_TITLE * 1.3,
    backgroundColor: '#F1FBFF',
    borderWidth: 1,
    borderColor: styles.COLOR_PRIMARY,
    borderRadius: styles.FONT_SIZE_TITLE * 0.65,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: styles.FONT_SIZE_TITLE * 0.35
  },
  dot: {
    width: styles.FONT_SIZE_TITLE * 0.65,
    height: styles.FONT_SIZE_TITLE * 0.65,
    backgroundColor: styles.COLOR_PRIMARY,
    borderRadius: styles.FONT_SIZE_TITLE * 0.65 / 2,
    overflow: 'hidden'
  },
  text: {
    marginHorizontal: styles.FONT_SIZE * 0.5,
    fontSize: styles.FONT_SIZE,
    flex: 1,
    lineHeight: parseInt(styles.FONT_SIZE * 1.4, 10)
  }
})
