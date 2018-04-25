import React from 'react'
import PropTypes from 'prop-types'
import { Animated, Text, TextInput, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import BaseInput from './BaseInput'
import style from '../../../styles'

const LABEL_HEIGHT = style.FONT_SIZE*2;
const PADDING = 0;

export default class TitleInput extends BaseInput {
  constructor(props){
    super(props);
    this.afterEffects = true;
    if(props.value){
      this.state.focusedAnim.setValue(2)
    }
  }
  render() {
    const { value, placeHolder, style: containerStyle, height: inputHeight, inputStyle, labelStyle, borderColors, widths } = this.props;
    const { width, focusedAnim, error } = this.state;
    const [ color1, color2 ] = borderColors;
    const opacity = focusedAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [1, 0, 1],
    })
    const borderColor = error ? style.COLOR_ERROR : focusedAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [...borderColors, style.COLOR_SECONDARY],
    })
    const borderWidth = focusedAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [...widths, StyleSheet.hairlineWidth]
    })
    return (
      <View style={styles.root}>
        <View style={[styles.root, containerStyle]} onLayout={this._onLayout}>
          <TouchableWithoutFeedback onPress={this.focus}>
            <Animated.View
              style={{
                alignSelf: 'stretch',
                height: LABEL_HEIGHT,
                opacity,
              }}
            >
              <Text style={[styles.label, labelStyle]}>{placeHolder}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
          <Animated.View style={{ borderWidth, borderColor, borderRadius: 6 }}>
            <TextInput
              ref={ref=>this._input=ref}
              {...this.props}
              style={[
                styles.textInput,
                inputStyle,
                {
                  width,
                  height: inputHeight,
                },
              ]}
              value={value}
              onBlur={this._onBlur}
              onChange={this._onChange}
              onFocus={this._onFocus}
              underlineColorAndroid={'transparent'}
            />
          </Animated.View>
        </View>
        {error && (<Text style={styles.errorText}>{error}</Text>)}
      </View>
    );
  }
}

TitleInput.propTypes = {
  borderColors: PropTypes.arrayOf(PropTypes.string),
  height: PropTypes.number,
  placeHolder: PropTypes.string,
  widths: PropTypes.arrayOf(PropTypes.number),
}

TitleInput.defaultProps = {
  borderColors: [style.COLOR_SECONDARY, style.COLOR_PRIMARY],
  height: style.FONT_SIZE*3,
  animationDuration: 200,
  placeHolder: '',
  widths: [2,StyleSheet.hairlineWidth]
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch'
  },
  label: {
    backgroundColor: 'transparent',
    fontSize: style.FONT_SIZE,
    color: style.COLOR_FONT,
    textAlign: 'center',
  },
  textInput: {
    paddingHorizontal: PADDING,
    padding: 0,
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: style.COLOR_ERROR,
    fontSize: style.FONT_SIZE_SMALL,
    lineHeight: style.FONT_SIZE*2,
    textAlign: 'right',
    backgroundColor: 'transparent'
  },
});