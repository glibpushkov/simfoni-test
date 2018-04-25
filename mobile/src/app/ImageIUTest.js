import React from 'react'
import {Image, Modal } from 'react-native'

const ImageIUTest = (props) => {
  const image = require('../assets/img/logo.png')
  // const image = require ('../icons/support_ticket_scrl.jpg');
  return (
    <Modal visible animationType={'none'}transparent>
      <Image
        resizeMode='stretch'
        source={image}
        style={{
          flex: 1,
          width: styles.DEVICE_WIDTH,
          height: styles.DEVICE_HEIGHT,
          position: 'absolute',
          opacity: 0.2
        }}
      />
    </Modal>
  )
}
export default ImageIUTest
