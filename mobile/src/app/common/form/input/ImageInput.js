import React from 'react'
import PropTypes from 'prop-types'
import { Animated, TextInput, TouchableWithoutFeedback, View, StyleSheet, Text } from 'react-native'
import BaseInput from './BaseInput'
import Icon from '../icon'
import style from '../../../styles'

export default class ImageInput extends BaseInput {
  render() {
    const { value, iconColor, iconSize, iconName, iconBackgroundColor, style: containerStyle, wrapInputstyles, inputStyle, height: inputHeight, ...rest } = this.props;
    const { focusedAnim, error } = this.state;
    const AnimatedIcon = Animated.createAnimatedComponent(Icon);
    return (
      <View style={[styles.main, containerStyle]}>
        <View style={[styles.container, wrapInputstyles, error && styles.errorContainerStyle ]}>
          <TouchableWithoutFeedback onPress={this.focus}>
            <Animated.View
              style={{
                backgroundColor: iconBackgroundColor,
                justifyContent: 'center',
                alignItems: 'center',
                height: inputHeight,
                width: focusedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 40],
                }),
              }}
            >
              <AnimatedIcon
                name={iconName}
                color={iconColor}
                size={ 
                  focusedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [iconSize, iconSize * 0.6],
                  })
                }
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <TextInput
            ref={ref=>this._input = ref}
            {...rest}
            style={[styles.textInput, inputStyle]}
            value={value}
            onBlur={this._onBlur}
            onChange={this._onChange}
            onFocus={this._onFocus}
            underlineColorAndroid={'transparent'}
          />
        </View>
        {error && (<Text style={styles.errorText}>{error}</Text>)}
      </View>
    )
  }
}

ImageInput.propTypes = {
  iconBackgroundColor: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number,
}
ImageInput.defaultProps = {
  iconColor: '#FFFFFF',
  iconSize: 25,
  iconBackgroundColor: '#899dda',
  height: 48,
  animationDuration: 200,
}
const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    alignSelf: 'stretch'
  },
  container: {
    flexDirection: 'row',
    borderRadius: 4,
    borderColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
  },
  errorContainerStyle: {
    borderColor: style.COLOR_ERROR,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: style.FONT_SIZE,
    paddingVertical: 0,
    color: 'black',
    backgroundColor: 'white',
    fontSize: style.FONT_SIZE,
    backgroundColor: 'transparent'
  },
  errorText: {
    color: style.COLOR_ERROR,
    fontSize: style.FONT_SIZE_SMALL,
    lineHeight: style.FONT_SIZE*2,
    textAlign: 'right',
    backgroundColor: 'transparent'
  },
});