import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Image, Text, StyleSheet, Linking, WebView, TouchableOpacity } from 'react-native'
import HTMLView from 'react-native-htmlview'
import ImageLoaders from './ImageLoaders'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import _ from 'lodash'
import uuidv4 from 'uuid/v4'

export default class HTMLParser extends Component {
  constructor (props) {
    super(props)
    this.renderNode = this.renderNode.bind(this)
    this.renderImage = this.renderImage.bind(this)
    this.renderImageWrapper = this.renderImageWrapper.bind(this)
    this.renderText = this.renderText.bind(this)
    this.renderTextElemets = this.renderTextElemets.bind(this)
    this.renderLink = this.renderLink.bind(this)
    this.handleLinkPress = this.handleLinkPress.bind(this)
    this.renderQuote = this.renderQuote.bind(this)
  }
  handleLinkPress (uri) {
    return () => Linking.openURL(uri)
  }
  renderNode (node, index, siblings, parent, defaultRenderer) {
    if (node.type === 'text' && node.data) {
      return this.renderText(node.data, (!parent) ? style.defaultTextStyles : {})
    }
    switch (node.name) {
      case 'img':
        return this.renderImage(node)
      case 'iframe':
        return null
      case 'table':
        return null
      case 'blockquote':
        return this.renderQuote(node)
      case 'span':
      case 'label':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'p':
      case 'strong':
      case 'em':
      case 'u':
        return this.renderTextElemets(node, style[node.name])
      case 'br':
        return null
      case 'div':
        return this.renderView(node)
      case 'a':
        return this.renderLink(node)
      case 'ul':
        return this.renderLists(node)
      default:
        return undefined
    }
  }
  renderLists (node) {
    return (
      <View style={style.ul} key={uuidv4()}>
        {
          node.children.filter(x => x.type === 'tag').map(item => (
            <View style={style.li} key={uuidv4()}>
              <Text style={style.defaultTextStyles}>•</Text>
              <View style={style.stretch}>
                {this.renderTextElemets(item)}
              </View>
            </View>
          ))
        }
      </View>
    )
  }
  renderImageWrapper (node) {
    return (
      <View style={style.imageWrapper} key={uuidv4()}>
        {node.children.map((node, index) => this.renderNode(node, index))}
      </View>
    )
  }
  renderView (node) {
    return (
      <View style={style.div} key={uuidv4()}>
        {node.children.map((node, index) => this.renderNode(node, index))}
      </View>
    )
  }
  renderLink (node) {
    const isView = hasImagesImside(node.children)
    const { defaultStyles = {} } = this.props
    const uri = get(node, 'attribs.href', '')
    const text = get(node, 'children[0].data', '')
    if (isView) {
      return (
        <TouchableOpacity
          style={style.imageWrapper}
          key={uuidv4()}
          onPress={this.handleLinkPress(uri)}
        >
          {node.children.map((node, index) => this.renderNode(node, index))}
        </TouchableOpacity>
      )
    } else {
      return (
        <Text
          key={uuidv4()}
          style={[style.defaultTextStyles, defaultStyles[node.name], style[node.name] ]}
          onPress={this.handleLinkPress(uri)}
        >
          {text}
        </Text>
      )
    }
  }
  renderTextElemets (node, ComponentStyle = style.defaultTextStyles) {
    const isView = hasImagesImside(node.children)
    const { defaultStyles } = this.props
    if (!isView) {
      return (
        <Text
          key={uuidv4()}
          style={[style.defaultTextStyles, defaultStyles[node.name], ComponentStyle ]}
        >
          {node.children.map((node, index) => this.renderNode(node, index))}
        </Text>
      )
    } else {
      return (
        <View style={style.view} key={uuidv4()}>
          {node.children.map((node, index) => this.renderNode(node, index))}
        </View>
      )
    }
  }
  renderQuote (node) {
    return (
      <View style={[style.view, style.blockquote]} key={uuidv4()}>
        {node.children.map((node, index) => this.renderNode(node, index))}
      </View>
    )
  }
  renderText (text, styles = {}) {
    if (urlRegex.test(text)) return this.renderLink({name: 'a', attribs: {href: text}, children: [{data: text}]})
    return (<Text key={uuidv4()} style={styles}>{text.replace('&nbsp;', ' ')}</Text>)
  }
  renderImage ({attribs = {}}) {
    const { 'data-uuid': uuid, src } = attribs
    const { photos, maxWidth } = this.props
    const imageData = uuid ? photos.find(x => x.uuid === uuid) : {}
    const isgif = get(imageData, 'img.full', '').endsWith('.gif')
    const uri = uuid ? get(imageData, isgif ? 'img.full' : 'img.l') : src
    return uri ? (
      <ImageLoaders
        uri={uri}
        key={uuid || uri}
        maxWidth={maxWidth}
      />
    ) : null
  }
  render () {
    const { content, wrapperStyles, defaultStyles } = this.props
    const defaultProps = {
      style: [style.defaultTextStyles, defaultStyles]
    }
    return (
      <View style={[style.mainContent, wrapperStyles]}>
        <HTMLView
          value={content}
          stylesheet={style}
          textComponentProps={defaultProps}
          nodeComponentProps={defaultProps}
          renderNode={this.renderNode}
          paragraphBreak={null}
        />
      </View>
    )
  }
}

const hasImagesImside = (array = []) => {
  if (!Array.isArray(array)) return false
  return array.findIndex(x => x.name === 'img' || x.name === 'blockquote' || x.name === 'ul' || hasImagesImside(x.children)) > -1
}

const isInline = tagName => {
  switch (tagName) {
    case 'span':
    case 'label':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'p':
    case 'strong':
    case 'em':
    case 'u':
      return true
    default:
      return false
  }
}

const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g

HTMLParser.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  photos: PropTypes.array,
  maxWidth: PropTypes.number
}

HTMLParser.defaultProps = {
  content: '',
  title: '',
  photos: [],
  maxWidth: styles.DEVICE_WIDTH - 2 * styles.FONT_SIZE_TITLE,
  defaultStyles: {}
}

const style = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignSelf: 'stretch',
    padding: styles.FONT_SIZE_TITLE
  },
  defaultTextStyles: {
    fontSize: styles.FONT_SIZE * 1.2,
    lineHeight: parseInt(styles.FONT_SIZE * 1.8, 10),
    color: styles.COLOR_FONT,
    textAlign: 'justify'
  },
  view: {
    alignSelf: 'stretch'
  },
  a: {
    color: styles.COLOR_PRIMARY
  },
  imageWrapper: {
    alignSelf: 'stretch',
    marginVertical: styles.FONT_SIZE / 2,
    flexDirection: 'column'
  },
  div: {
    flex: 1,
    alignSelf: 'stretch'
  },
  h1: {
    fontSize: styles.FONT_SIZE * 2,
    lineHeight: parseInt(styles.FONT_SIZE * 2.5, 10),
    fontWeight: 'bold'
  },
  h2: {
    fontSize: styles.FONT_SIZE * 1.4,
    lineHeight: parseInt(styles.FONT_SIZE * 2, 10),
    fontWeight: 'bold'
  },
  h3: {
    fontSize: styles.FONT_SIZE * 1.3,
    lineHeight: parseInt(styles.FONT_SIZE * 1.9, 10),
    textAlign: 'center'
  },
  h4: {
    fontSize: styles.FONT_SIZE * 1.2,
    lineHeight: parseInt(styles.FONT_SIZE * 1.8, 10),
    textAlign: 'center'
  },
  p: {
    paddingBottom: styles.FONT_SIZE
  },
  strong: {
    fontWeight: 'bold'
  },
  em: {
    fontStyle: 'italic'
  },
  u: {
    textDecorationLine: 'underline'
  },
  li: {
    flexDirection: 'row',
    paddingBottom: styles.FONT_SIZE
  },
  stretch: {
    alignSelf: 'stretch'
  },
  webViewWrapper: {
    width: styles.DEVICE_WIDTH - 2 * styles.FONT_SIZE_TITLE,
    height: styles.DEVICE_WIDTH - 2 * styles.FONT_SIZE_TITLE
  },
  blockquote: {
    borderLeftWidth: 2,
    borderLeftColor: styles.COLOR_SECONDARY,
    paddingLeft: styles.FONT_SIZE,
    paddingBottom: styles.FONT_SIZE
  }
})
