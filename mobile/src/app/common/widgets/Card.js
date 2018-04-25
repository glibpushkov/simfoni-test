import { View, Text, StyleSheet } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import PropTypes from 'prop-types'

export default class Card extends PureComponent {
  constructor (props) {
    super(props)
  }
  positionStyle (position) {
    return {[position]: 0}
  }
  animationType ({position}) {
    return position === 'bottom' ? 'fadeInUpBig' : 'fadeInDownBig'
  }
  render () {
    const { children, position } = this.props
    return (
      <AnimatedView
        style={[style.card, this.positionStyle(position)]}
        animation={this.animationType(this.props)}
      >
        {this.props.children}
      </AnimatedView>
    )
  }
}

Card.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom'])
}

Card.defaultProps = {
  position: 'bottom'
}

function Title ({ children }) {
  return (
    <Text style={style.title}>
      {children}
    </Text>
  )
}

function Desc ({ children }) {
  return (
    <Text style={style.desc}>
      {children}
    </Text>
  )
}

Card.Title = Title
Card.Desc = Desc

const style = StyleSheet.create({
  card: {
    padding: styles.FONT_SIZE,
    margin: styles.FONT_SIZE,
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: styles.COLOR_WHITE,
    elevation: 2,
    borderRadius: 2
  },
  title: {
    fontSize: styles.FONT_SIZE,
    color: styles.COLOR_FONT,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: parseInt(styles.FONT_SIZE_TITLE * 1.5, 10)
  },
  desc: {
    fontSize: styles.FONT_SIZE,
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    lineHeight: parseInt(styles.FONT_SIZE_TITLE * 1.25, 10)
  }
})
