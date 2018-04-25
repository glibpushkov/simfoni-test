import { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Text, View } from 'react-native';

export default class BaseInput extends Component {
  constructor(props, context) {
    const value = props.value || props.defaultValue;
    super(props, context);
    this.state = {
      focusedAnim: new Animated.Value(value ? 1 : 0),
      error: undefined,
    };
    this._onLayout = this._onLayout.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this.focus = this.focus.bind(this);
    this.setError = this.setError.bind(this);
    this.hasError = this.hasError.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const newValue = nextProps.value;
    if (nextProps.hasOwnProperty('value') && newValue !== this.state.value) {
      const isFocused = this._input.isFocused();
      if (!isFocused) {
        const isActive = Boolean(newValue);
        if (isActive !== this.isActive) {
          this._toggle(isActive);
        }
      }
    }
  }
  _onLayout(event) {
    this.setState({
      width: event.nativeEvent.layout.width,
    });
  }
  _onChange(event) {
    const { onChange } = this.props;
    onChange && onChange(event.nativeEvent.text);
  }
  _onBlur(event) {
    this.props.value && this.afterEffects ? this._toggle(2) : this._toggle(0);
    const { onBlur } = this.props;
    onBlur && onBlur(event);
  }
  _onFocus(event) {
    this._toggle(1);
    this.setError();
    const { onFocus } = this.props;
    onFocus && onFocus(event);
  }
  _toggle(toValue) {
    const { animationDuration, easing, useNativeDriver } = this.props;
    this.isActive = toValue === 1;
    Animated.timing(this.state.focusedAnim, {
      toValue,
      duration: animationDuration,
      easing,
      useNativeDriver,
    }).start();
  }
  inputRef() {
    return this._input;
  }
  focus() {
    if (this.props.editable !== false) {
      this.inputRef().focus();
    }
  }
  blur() {
    this.inputRef().blur();
  }
  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }
  setError( error ) {
    this.setState({ error });
  }
  hasError(){
    return !!this.state.error
  }
}

BaseInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  inputStyle: Text.propTypes.style,
  labelStyle: Text.propTypes.style,
  easing: PropTypes.func,
  animationDuration: PropTypes.number,
  useNativeDriver: PropTypes.bool,
  editable: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
}