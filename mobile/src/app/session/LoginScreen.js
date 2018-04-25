import connect from '../utils/resources'
import { NavigationActions } from 'react-navigation'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native'
import { Button, Icon } from '../common/widgets'
import { PhoneInputField } from '../common/form/fields'

import { AppHeader } from '../layouts'
import get from 'lodash/get'

class LoginScreen extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      valid: false
    }
    this.validate = this.validate.bind(this)
    this.submit = this.submit.bind(this)
  }

  submit () {
    this.props.handleSubmit()
    TextInput.State.currentlyFocusedField() && TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField())
  }

  validate (valid) {
    this.setState({ valid })
  }

  componentDidMount () {
    if (get(this.props, 'agreement.data') !== true) {
      this.props.navigation.navigate('TermsOfUse')
    }
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
            <Text style={style.title}>{gettext('Please enter your phone number ')}</Text>
            {
              this.state.valid && (
                <Button onPress={this.submit}>
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
            <Text style={style.desc}>{gettext('Please enter your phone number')}</Text>
            <Translator>
              {
                ({gettext}) => (
                  <PhoneInputField
                    placeholderTextColor='rgba(0, 0, 0, 0.87)'
                    name='cellphone'
                    validatePhone={this.validate}
                    placeholder={gettext('your phone number')}
                  />
                )
              }
            </Translator>
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
  form: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: styles.FONT_SIZE_TITLE * 2,
    backgroundColor: styles.COLOR_WHITE
  }
})

export default compose(
  connect(['agreement', {
    endpoint: 'drivers/register',
    namespace: 'phone',
    form: {
      name: 'register'
    },
    afterActions: [NavigationActions.navigate({ routeName: 'ReceiveSMS'})]
  }]),
  reduxForm({
    form: 'register'
  })
)(LoginScreen)
