import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Modal, TouchableOpacity, Text, BackHandler } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import Overlay from './Overlay'
import Container from './Container'
import animations from './animations'

export default class PopUpDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: props.active
    }
    this.androidBackPressListener = 'backPress'
    this.animateContent = this.animateContent.bind(this)
    this.fadeout = this.fadeout.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.onOverlayClick = this.onOverlayClick.bind(this)
  }
  componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.onOverlayClick)
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.onOverlayClick)
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.active !== this.props.active) {
      nextProps.active ? nextState.active = true : this.fadeout()
    }
  }
  render () {
    if (!this.state.active) return null
    return (
      <View style={popUpStyles.modal}>
        <View style={{flex: 1, backgroundColor: '#000', opacity: this.props.opacity}} />
        <AnimatedView
          ref={ref => (this.root = ref)}
          animation={this.props.animation}
          duration={this.props.duration}
          onAnimationEnd={this.animateContent}
          style={[popUpStyles.root, {height: this.props.height}]}
        >
          <Overlay
            style={this.props.overlayStyle}
            onOverlayPress={this.onOverlayClick}
          />
          <Container
            ref={ref => (this.container = ref)}
            close={this.close}
            showClose={this.props.showClose}
            postAnimation={this.props.contentAnimation}
          >
            {this.props.children}
          </Container>
        </AnimatedView>
      </View>
    )
  }
  fadeout () {
    if (!this.root) return
    this.root[getOutAnimation(this.props.animation)](this.props.duration)
        .then(() => this.setState({active: false}, () => this.props.afterClose && this.props.afterClose()))
  }
  open () {
    this.setState({active: true})
  }
  close () {
    this.fadeout()
  }
  onOverlayClick () {
    if (this.props.closeOnOverLay && this.state.active) {
      this.close()
      return true
    }
    return false
  }
  animateContent () {
    if (this.props.contentAnimation) {
      this.container.animate()
    }
  }
}

PopUpDialog.propTypes = {
  animation: PropTypes.oneOf(Object.keys(animations)),
  active: PropTypes.bool.isRequired,
  duration: PropTypes.number,
  overlayStyle: PropTypes.object,
  closeOnBackPress: PropTypes.bool,
  closeOnOverLay: PropTypes.bool,
  height: PropTypes.number,
  showClose: PropTypes.bool,
  forFilters: PropTypes.bool,
  contentAnimation: PropTypes.oneOf(['bounce', 'flash', 'jello', 'pulse', 'rotate', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', null, undefined]),
  opacity: PropTypes.number
}

PopUpDialog.defaultProps = {
  animation: 'zoomIn',
  duration: 200,
  overlayStyle: {},
  closeOnBackPress: true,
  closeOnOverLay: true,
  height: styles.DEVICE_HEIGHT,
  showClose: false,
  forFilters: false,
  opacity: 0.5
}

const popUpStyles = StyleSheet.create({
  modal: {
    position: 'absolute',
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT,
    zIndex: 101
  },
  root: {
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'center'
  }
})

const getOutAnimation = animation => animations[animation]
