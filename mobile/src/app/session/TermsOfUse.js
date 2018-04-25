import { NavigationActions } from 'react-navigation'
import connect from '../utils/resources'
import { Text, View, StyleSheet, Image, Linking } from 'react-native'
import { Button } from '../common/widgets'
import Images from '@images/images'

class TermsOfUse extends PureComponent {
  constructor (props) {
    super(props)
    this.agreeWithTermsOfUse = this.agreeWithTermsOfUse.bind(this)
  }

  readDocs () {
    Linking.openURL('https:://google.com')
  }

  agreeWithTermsOfUse () {
    this.props.agreement.setData(true)
    this.props.navigation.navigate('Login')
  }

  render () {
    return (
      <View style={style.root}>
        <View style={[StyleSheet.absoluteFill, style.imageWrapper ]}>
          <Image source={Images.logo} />
        </View>
        <View>
          <Text style={style.desc}>
            {gettext('Tap "Agry & Continue" to accept the Azyan')}
            <Text onPress={this.readDocs} style={style.bold}>{gettext('Term of servise and Privacy Policy')}</Text>
          </Text>
          <Button
            title={gettext('AGREE & CONTINUE')}
            buttonStyle={style.button}
            textStyle={style.buttonTitle}
            onPress={this.agreeWithTermsOfUse}
          />
        </View>
      </View>
    )
  }
}

export default connect('agreement')(TermsOfUse)

const style = StyleSheet.create({
  root: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: styles.COLOR_PRIMARY,
    padding: styles.FONT_SIZE * 2
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  desc: {
    fontSize: styles.FONT_SIZE,
    fontWeight: '300',
    lineHeight: parseInt(styles.FONT_SIZE * 1.43, 10),
    color: styles.COLOR_WHITE,
    textAlign: 'center'
  },
  bold: {
    fontWeight: '500'
  },
  buttonTitle: {
    color: styles.COLOR_WHITE
  },
  button: {
    marginVertical: styles.FONT_SIZE

  }
})
