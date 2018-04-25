import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Text, Animated } from 'react-native'

class Error extends Component {
  constructor (props) {
    super(props)
    this.animated = new Animated.Value(0)
    this.state = {
      active: false
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.error !== this.props.error) {
      const active = !!nextProps.error
      if (active) {
        this.setState({ active }, () => Animated.spring(this.animated, { toValue: 1 }).start())
      } else {
        Animated.spring(this.animated, { toValue: 0 }).start(() => this.setState({ active }))
      }
    }
  }
  render () {
    if (!this.state.active) return null
    const opacity = this.animated.interpolate({
      inputRange: [ 0, 1 ],
      outputRange: [ 0, 1 ],
      extrapolate: 'clamp'
    })
    return (
      <View style={style.main}>
        <Animated.View style={[style.error, {opacity}]}>
          <Text style={style.text}>{this.props.error}</Text>
        </Animated.View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  main: {
    position: 'absolute',
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: styles.DEVICE_WIDTH,
    bottom: styles.HEADER_HEIGHT,
    paddingHorizontal: styles.FONT_SIZE * 2
  },
  error: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    maxWidth: styles.DEVICE_WIDTH * 0.8
  },
  text: {
    color: '#FFFFFF',
    fontSize: styles.FONT_SIZE_SMALL,
    lineHeight: styles.FONT_SIZE_SMALL * 2,
    textAlignVertical: 'center'
  }
})

export default connect(({error}) => ({error}), { })(Error)
