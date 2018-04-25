import React from 'react'
import { Image } from 'react-native'
import PropTypes from 'prop-types'
import { flags } from '@images/flags'

function Flag ({ size = 64, code, style }) {
  const flag = flags[`icons${size}`][code]
  const unknownFlag = flags[`icons${size}`]['unknown']

  return (
    <Image
      source={flag || unknownFlag}
      style={[{ width: size, height: size }, style]}
    />
  )
}

export default Flag
