import React, { PureComponent } from 'react'
import { StyleSheet, View, Modal, FlatList, TextInput, Text, KeyboardAvoidingView, StatusBar, I18nManager } from 'react-native'
import { Button, Icon } from '../../widgets'
import { AppHeader } from '../../../layouts'
import CountrieRow from './CountrieRow'
import countries from './counries.json'
import debounce from 'lodash/debounce'

export default class CountrieModal extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      search: '',
      countries
    }
    this.setFilter = this.setFilter.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.filterData = debounce(this.filterData.bind(this), 200)
  }

  renderItem ({item}) {
    return <CountrieRow item={item} onPress={this.props.selectCounrie.bind(null, item)} />
  }

  filterData () {
    const { search } = this.state
    if (!search) return this.setState({ countries })
    this.setState({ countries: countries.filter(({ country_name }) => country_name.includes(search)) })
  }

  handleClose () {
    this.props.close()
    return true
  }

  setFilter (search) {
    this.setState({ search }, this.filterData)
  }

  render () {
    const { active, close } = this.props
    return (
      <Modal
        visible={active}
        onRequestClose={this.handleClose}
        animationType='slide'
        presentationStyle='overFullScreen'
      >
        <KeyboardAvoidingView style={style.main} contentContainerStyle={[style.root, {backgroundColor: 'pink'}]} behavior='padding'>
          <View style={style.header}>
            <Button
              onPress={close}
              buttonStyle={style.buttonStyle}
            >
              <Icon
                name='back'
                color={styles.COLOR_WHITE}
                style={style.backIcon}
                size={styles.FONT_SIZE_TITLE}
                isRTL
              />
            </Button>
            <TextInput
              style={[style.textInput]}
              value={this.state.search}
              onChangeText={this.setFilter}
              underlineColorAndroid={'transparent'}
              blurOnSubmit
              clearButtonMode='while-editing'
              placeholder='Filter'
              selectionColor={styles.COLOR_WHIRE}
            />
          </View>
          <View style={[style.root, {paddingBottom: styles.STATUSBAR_HEIGHT}]}>
            <FlatList
              data={this.state.countries}
              renderItem={this.renderItem}
              ListEmptyComponent={ListEmptyComponent}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              removeClippedSubviews
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
}

const ListEmptyComponent = () => (
  <Text style={style.NoData}>
    No results
  </Text>
)

function keyExtractor ({ country_code, dialling_code }) {
  return country_code + dialling_code
}

const ITEM_HEIGHT = styles.FONT_SIZE * 3

function getItemLayout (data, index) {
  return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
}

const style = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 0
  },
  backIcon: {

  },
  header: {
    height: styles.HEADER_HEIGHT - styles.STATUSBAR_HEIGHT,
    width: styles.DEVICE_WIDTH,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: styles.FONT_SIZE,
    backgroundColor: styles.COLOR_PRIMARY
  },
  main: {
    width: styles.DEVICE_WIDTH,
    height: styles.DEVICE_HEIGHT - styles.STATUSBAR_HEIGHT
  },
  root: {
    flex: 1,
    alignSelf: 'stretch'
  },
  textInput: {
    flex: 1,
    color: styles.COLOR_WHITE,
    backgroundColor: 'transparent',
    fontSize: styles.FONT_SIZE_TITLE,
    backgroundColor: 'transparent',
    paddingVertical: styles.FONT_SIZE,
    borderBottomWidth: StyleSheet.haiLineWidth,
    borderBottomColor: styles.COLOR_WHITE,
    borderStyle: 'solid',
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  NoData: {
    fontSize: styles.FONT_SIZE,
    textAlign: 'center',
    alignSelf: 'stretch',
    padding: styles.FONT_SIZE_TITLE
  }
})
