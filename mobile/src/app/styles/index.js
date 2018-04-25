import { Platform, StatusBar } from 'react-native'
import Dimensions from 'Dimensions'
// Precalculate Device Dimensions for better performance
const PLATFORM = Platform.OS
const x = Dimensions.get('window').width
const y = Dimensions.get('window').height
const HEADER_HEIGHT = 77.5
const CONTENT_HEIGHT = y - HEADER_HEIGHT
const TEXT_OPACITY = PLATFORM === 'ios' ? 0.7 : 0.5
// Calculating ratio from iPhone breakpoints
const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1
const ratioY = y < 568 ? (y < 480 ? 0.75 : 0.875) : 1

// We set our base font size value
const base_unit = 16

// We're simulating EM by changing font size according to Ratio
const unit = base_unit * ratioX

// We add an em() shortcut function
function em (value) {
  return unit * value
}

const FONT_LINE_HEIGHT = (font = unit, num = 1) => {
  return PLATFORM === 'ios' ? font * num : Math.round(font * num)
}
// Then we set our styles with the help of the em() function
export default Style = {
  // GENERAL
  FONT_AMATIC: PLATFORM === 'ios' ? 'amatic SC' : 'amatic',
  FONT_CHILE: PLATFORM === 'ios' ? 'Chicle' : 'chicle',
  STATUSBAR_HEIGHT: PLATFORM === 'ios' ? 0 : StatusBar.currentHeight,
  DEVICE_WIDTH: x,
  DEVICE_HEIGHT: y,
  RATIO_X: ratioX,
  RATIO_Y: ratioY,
  UNIT: em(1),
  PADDING: em(1.25),
  HEADER_HEIGHT,
  CONTENT_HEIGHT,
  TEXT_OPACITY,
  MENU_OFFSET: em(1.5),

  IS_iOS: PLATFORM === 'ios',

  // CARD
  CARD_WIDTH: x - em(1.25) * 2,
  CARD_HEIGHT: (x - em(1.25) * 2) * (3 / 5),
  CARD_PADDING_X: em(1.875),
  CARD_PADDING_Y: em(1.25),
  // FONT
  FONT_SIZE: em(1),
  FONT_SIZE_SMALLER: em(0.75),
  FONT_SIZE_SMALL: em(0.875),
  FONT_SIZE_TITLE: em(1.25),
  FONT_LINE_HEIGHT,
  // colors
  COLOR_PRIMARY: '#00838f',
  COLOR_ERROR: '#ef0b3c',
  COLOR_FONT: '#333333',
  COLOR_WHITE: '#FFFFFF',
  COLOR_GREY: '#ccc',
  COLOR_SUCCESS: '#00c853'
}
