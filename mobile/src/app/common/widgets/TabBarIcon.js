import Icon from './icon'
import { Text } from 'react-native'

export default function (iconName) {
  return ({ focused, tintColor }) => (
    <Icon
      name={iconName}
      color={tintColor}
      size={24}
    />
  )
}
