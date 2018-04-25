import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, ImageBackground, Linking } from 'react-native'
import { TabBarIcon, Card, Button } from '../common/widgets'
import { AppHeader } from '../layouts'
import Images from '@images/images'

export default class ContactUs extends PureComponent {
  contact () {
    Linking.openURL('https:://google.com')
  }
  render () {
    return (
      <View style={style.root}>
        <AppHeader>
          <Text style={style.title}>{gettext('Azyan')}</Text>
        </AppHeader>
        <ImageBackground
          source={Images.map}
          style={style.content}
          imageStyle={style.content}

        >
          <Card>
            <Card.Title>{gettext('Welcome to Azyan!')}</Card.Title>
            <Card.Desc>{gettext('You’re one step away from activating your account and receiving requests. Please contact your delivery service organization to get activated')}</Card.Desc>
            <Button
              onPress={this.contact}
              title={gettext('CONTACT US')}
              textStyle={style.resend}
              buttonStyle={style.buttonStyle}
            />
          </Card>
        </ImageBackground>
      </View>
    )
  }
}

const style = StyleSheet.create({
  root: {
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT
  },
  title: {
    fontSize: styles.FONT_SIZE_TITLE,
    color: styles.COLOR_WHITE
  },
  content: {
    flex: 1,
    alignSelf: 'stretch'
  },
  buttonStyle: {
    backgroundColor: styles.COLOR_PRIMARY,
    alignSelf: 'center',
    paddingHorizontal: styles.FONT_SIZE_TITLE * 2,
    paddingVertical: styles.FONT_SIZE / 2,
    marginTop: styles.FONT_SIZE,
    elevation: 2
  },
  resend: {
    color: styles.COLOR_WHITE,
    fontWeight: '500'
  }
})
