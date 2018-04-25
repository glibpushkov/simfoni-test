import { NavigationActions } from 'react-navigation'
import SmsListener from 'react-native-android-sms-listener'
import connect from '../utils/resources'
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, I18nManager } from 'react-native'
import { Button, Icon } from '../common/widgets'
import { CodeInput } from '../common/form/input'

import { AppHeader } from '../layouts'
import get from 'lodash/get'
import debounce from 'lodash/debounce'

class ReceiveSMS extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      passcode: ''
    }
    this.readSMS = this.readSMS.bind(this)
    this.resendSMS = debounce(this.resendSMS.bind(this), 200)
    this.onCodeChange = this.onCodeChange.bind(this)
    this.register = this.register.bind(this)
  }

  onCodeChange (passcode) {
    this.setState({ passcode })
    if (passcode.length === 4) {
      this.register(passcode)
    }
  }

  register (passcode) {
    const { id } = this.props.phone.data
    this.props.session.create({ user_id: id, passcode })
    TextInput.State.currentlyFocusedField() && TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField())
  }

  readSMS ({ originatingAddress, body }) {
    if (body) {
      this.register(body)
      this.subscription.remove()
    }
  }

  componentDidMount () {
    this.subscription = SmsListener.addListener(this.readSMS)
  }

  resendSMS () {
    const { cellphone } = this.props.phone.data
    this.props.phone.create({ cellphone })
  }

  componentWillUnmount () {
    this.subscription.remove()
  }

  render () {
    return (
      <ScrollView
        style={style.main}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={false}
      >
        <View style={style.root}>
          <AppHeader>
            <View style={style.leftmenu}>
              <Button onPress={this.props.navigation.goBack}>
                <Icon
                  name='back'
                  color={styles.COLOR_WHITE}
                  style={[style.backIcon]}
                  size={styles.FONT_SIZE_TITLE}
                  isRTL
                />
              </Button>
              <Text style={style.title}>{gettext('Edit number')}</Text>
            </View>
            {
              this.state.valid && (
                <Button onPress={this.props.handleSubmit}>
                  <Icon
                    name='done'
                    color={styles.COLOR_WHITE}
                    style={[style.backIcon]}
                    size={styles.FONT_SIZE_TITLE}
                  />
                </Button>
              )
            }
          </AppHeader>
          <View style={style.form}>
            <Text style={[style.warn, style.success]}>{gettext('We have sent you an SMS with a code to the number above.')}</Text>
            <Text style={style.desc}>{gettext('To complite your phone number verification, please enter 4-digit activation code')}</Text>
            <Translator>
              {
              ({gettext}) => (
                <CodeInput
                  name='passcode'
                  onChange={this.onCodeChange}
                  placeholder={gettext('- - - -')}
                />
              )
            }
            </Translator>
            <Button
              onPress={this.resendSMS}
              title={gettext('RESEND CODE')}
              textStyle={style.resend}
              buttonStyle={style.buttonStyle}
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  main: {
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT
  },
  root: {
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT,
    alignItems: 'center',
    flexDirection: 'column'
  },
  title: {
    fontSize: styles.FONT_SIZE_TITLE,
    color: styles.COLOR_WHITE
  },
  desc: {
    fontSize: styles.FONT_SIZE,
    color: styles.COLOR_FONT,
    marginHorizontal: styles.FONT_SIZE,
    marginTop: styles.FONT_SIZE,
    marginBottom: styles.FONT_SIZE * 2,
    textAlign: 'left'
  },
  warn: {
    fontSize: styles.FONT_SIZE_SMALL,
    color: styles.COLOR_ERROR,
    marginHorizontal: styles.FONT_SIZE,
    marginTop: 0,
    marginBottom: styles.FONT_SIZE / 2,
    textAlign: 'left'
  },
  form: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: styles.FONT_SIZE_TITLE * 1.5,
    backgroundColor: styles.COLOR_WHITE
  },
  leftmenu: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start'
  },
  success: {
    color: styles.COLOR_SUCCESS
  },
  resend: {
    color: styles.COLOR_PRIMARY,
    fontSize: styles.FONT_SIZE
  },
  buttonStyle: {
    alignSelf: 'flex-end',
    marginTop: styles.FONT_SIZE / 2
  }
})

export default connect([
  {
    endpoint: 'drivers/register',
    namespace: 'phone'
  },
  {
    endpoint: 'drivers/auth',
    namespace: 'session',
    form: {
      name: 'auth'
    },
    afterActions: [NavigationActions.navigate({ routeName: 'Home'})]
  }
])(ReceiveSMS)
