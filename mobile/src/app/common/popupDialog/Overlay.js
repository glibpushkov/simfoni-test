import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

const Overlay = props => (
  <TouchableOpacity 
    onPress={props.onOverlayPress}
    style={overlayStyles.wrapper}
    activeOpacity={0.5}
  >
    <View style={[overlayStyles.root,props.style]}></View>
  </TouchableOpacity>
)

Overlay.propTypes = {
  onOverlayPress:PropTypes.func.isRequired,
  style:PropTypes.object,
}

Overlay.defaultProps = {
  style:{}
}

const overlayStyles = StyleSheet.create({
  root:{
    flex:1,
    opacity:0
  },
  wrapper:{
    flex:1,
  }
});

export default Overlay