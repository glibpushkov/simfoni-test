import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, Modal, PanResponder, Platform, StatusBar, StyleSheet, View } from 'react-native'

const DRAG_DISMISS_THRESHOLD = 150
const isIOS = Platform.OS === 'ios'

export default class OverLay extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAnimating: false,
      isPanning: false,
      target: {
        x: 0,
        y: 0,
        opacity: 1
      }
    }
    this.lastScale = 1
    this.scale = new Animated.Value(1)
    this.scaleValue = 1
    this.scale.addListener(({value}) => { this.scaleValue = value })

    this.lastX = 0
    this.lastY = 0
    this.valueX = 0
    this.valueY = 0
    this.offset = new Animated.ValueXY({x: 0, y: 0})
    this.offset.x.addListener(({value}) => { this.valueX = value })
    this.offset.y.addListener(({value}) => { this.valueY = value })

    this.openVal = new Animated.Value(0)
    this.pan = new Animated.Value(0)
    this.distant = 150
    this.delay = 300
    this.radius = 20
    this.prevTouchInfo = {
      prevTouchX: 0,
      prevTouchY: 0,
      prevTouchTimeStamp: 0
    }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }
  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => !this.state.isAnimating,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (this.state.isAnimating) return false
        return gestureState.dx > 2 || gestureState.dy > 2 || gestureState.numberActiveTouches === 2
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => !this.state.isAnimating,
      onPanResponderGrant: (evt, gestureState) => {
        const currentTouchTimeStamp = Date.now()
        this.pan.setValue(0)
        this.setState({
          isPanning: true
        })
        if (this.isDoubleTap(currentTouchTimeStamp, gestureState)) {
          this.doubleTapZoom()
        }
        this.prevTouchInfo = {
          prevTouchX: gestureState.x0,
          prevTouchY: gestureState.y0,
          prevTouchTimeStamp: currentTouchTimeStamp
        }
        if (gestureState.numberActiveTouches === 2) {
          this.distant = this.distance(evt.nativeEvent.touches[0].pageX, evt.nativeEvent.touches[0].pageY, evt.nativeEvent.touches[1].pageX, evt.nativeEvent.touches[1].pageY)
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          let distant = this.distance(evt.nativeEvent.touches[0].pageX, evt.nativeEvent.touches[0].pageY, evt.nativeEvent.touches[1].pageX, evt.nativeEvent.touches[1].pageY)
          let scale = distant / this.distant * this.lastScale
          this.scale.setValue(scale)
        } else if (gestureState.numberActiveTouches === 1 && this.scaleValue > 1) {
          let x = this.lastX + gestureState.dx / this.scaleValue
          let y = this.lastY + gestureState.dy / this.scaleValue
          this.offset.setValue({ x, y })
        } else {
          this.pan.setValue(gestureState.dy)
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        if (this.scaleValue > 1) {
          let realScale = Math.max(Math.min(this.scaleValue, 3), 0.5)
          if (realScale !== this.scaleValue) {
            Animated.spring(
              this.scale,
              { toValue: realScale, ...this.props.springConfig }
            ).start()
          }
          this.lastX = this.valueX
          this.lastY = this.valueY
          this.lastScale = realScale
        } else {
          this.resetOverlay()
          if (Math.abs(gestureState.dy) > DRAG_DISMISS_THRESHOLD) {
            this.setState({
              isPanning: false,
              target: {
                y: gestureState.dy,
                x: gestureState.dx,
                opacity: 1 - Math.abs(gestureState.dy / styles.DEVICE_HEIGHT)
              }
            })
            this.close()
          } else {
            Animated.spring(
              this.pan,
              { toValue: 0, ...this.props.springConfig }
            ).start(() => { this.setState({ isPanning: false }) })
          }
        }
      },
      onShouldBlockNativeResponder: evt => false
    })
  }
  componentDidMount () {
    if (this.props.isOpen) {
      this.open()
    }
  }
  distance (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
  }
  isDoubleTap (currentTouchTimeStamp, {x0, y0}) {
    const { prevTouchX, prevTouchY, prevTouchTimeStamp } = this.prevTouchInfo
    const dt = currentTouchTimeStamp - prevTouchTimeStamp
    return (dt < this.delay && this.distance(prevTouchX, prevTouchY, x0, y0) < this.radius)
  }
  doubleTapZoom () {
    if (this.scaleValue !== 1) {
      this.resetOverlay()
    } else {
      Animated.spring(
        this.scale,
        { toValue: 1.8, ...this.props.springConfig }
      ).start()
      this.lastScale = 1.8
    }
  }
  resetOverlay () {
    Animated.spring(
      this.scale,
      { toValue: 1, ...this.props.springConfig }
    ).start()
    this.lastScale = 1
    this.offset.setValue({x: 0, y: 0})
    this.lastX = 0
    this.lastY = 0
  }
  open () {
    if (isIOS) {
      StatusBar.setHidden(true, 'fade')
    } else {
      StatusBar.setBackgroundColor('#000')
    }
    this.pan.setValue(0)
    this.setState({
      isAnimating: true,
      target: {
        x: 0,
        y: 0,
        opacity: 1
      }
    })
    Animated.spring(
      this.openVal,
      { toValue: 1, ...this.props.springConfig }
    ).start(() => {
      this.setState({ isAnimating: false })
    })
  }
  close () {
    if (isIOS) {
      StatusBar.setHidden(false, 'fade')
    } else {
      StatusBar.setBackgroundColor('transparent')
      StatusBar.setTranslucent(true)
    }
    this.setState({
      isAnimating: true
    })
    Animated.spring(
      this.openVal,
      { toValue: 0, ...this.props.springConfig }
    ).start(() => {
      this.props.onClose()
    })
  }
  componentWillReceiveProps (props) {
    if (this.props.isOpen != props.isOpen && props.isOpen) {
      this.open()
    }
  }
  render () {
    const { isOpen, origin } = this.props
    const { isPanning, isAnimating, target } = this.state
    const lightboxOpacityStyle = {
      opacity: this.openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity]})
    }
    let dragStyle
    if (isPanning) {
      dragStyle = {
        top: this.pan
      }
      lightboxOpacityStyle.opacity = this.pan.interpolate({inputRange: [-styles.DEVICE_HEIGHT, 0, styles.DEVICE_HEIGHT], outputRange: [0, 1, 0]})
    }
    const openStyle = [style.open, {
      left: this.openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
      top: this.openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y + styles.STATUSBAR_HEIGHT, target.y + styles.STATUSBAR_HEIGHT]}),
      width: this.openVal.interpolate({inputRange: [0, 1], outputRange: [origin.width, styles.DEVICE_WIDTH]}),
      height: this.openVal.interpolate({inputRange: [0, 1], outputRange: [origin.height, styles.DEVICE_HEIGHT]})
    }]
    return (
      <Modal visible={isOpen} transparent onRequestClose={() => this.close()}>
        <Animated.View style={[style.background, lightboxOpacityStyle]} />
        <Animated.View style={[
          openStyle,
          dragStyle, {
            transform: [
              {scaleX: this.scale},
              {scaleY: this.scale},
              ...this.offset.getTranslateTransform()
            ]
          }]}
          {...this._panResponder.panHandlers}
        >
          {this.props.children}
        </Animated.View>
      </Modal>
    )
  }
  componentWillUnmount () {
    this.scale.removeAllListeners()
    this.offset.x.removeAllListeners()
    this.offset.y.removeAllListeners()
  }
}

OverLay.propTypes = {
  origin: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }),
  springConfig: PropTypes.shape({
    tension: PropTypes.number,
    friction: PropTypes.number
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}

OverLay.defaultProps = {
  springConfig: { tension: 30, friction: 7 }
}

const style = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT,
    backgroundColor: '#000000'
  },
  open: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
})
