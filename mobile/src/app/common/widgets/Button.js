import { StyleSheet, Text, View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native'
import PropTypes from 'prop-types'

const ButtonElement = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback
})

export default function Button ({ onPress, title, children, buttonStyle, textStyle, ...rest }) {
  return (
    <ButtonElement onPress={onPress}>
      <View style={[style.button, buttonStyle]}>
        {children || <Text style={[style.title, textStyle]}>{title}</Text>}
      </View>
    </ButtonElement>
  )
}

const style = StyleSheet.create({
  button: {
    padding: styles.FONT_SIZE,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 2
  },
  title: {
    fontSize: styles.FONT_SIZE_TITLE,
    fontWeight: '500',
    textAlign: 'center'
  }
})

Button.propTypes = {
  onPress: PropTypes.func.isRequired
}

Button.defaultProps = {
  title: '',
  buttonStyle: {},
  textStyle: {}
}
