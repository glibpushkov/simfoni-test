import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, StyleSheet } from 'react-native'
import Radio from './Radio'

export default class RadioGroup extends Component{
  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this);
  }
  onChange(key){
    return ()=>{
      this.props.onChange(key)
    }
  }
  render(){
    return (
      <ScrollView style={style.wrapper}>
        {
          this.props.variants.map((item,index)=>{
            const key = this.props.getRadiokey(item,index);
            return (
              <Radio
                key={key}
                text={this.props.getRadioText(item)}
                active={key===this.props.active}
                onChange={this.onChange(key)}
              />
            )
          })
        }
      </ScrollView>
    )
  }
}

RadioGroup.propTypes = {
  variants: PropTypes.array,
  active: PropTypes.string,
  onChange: PropTypes.func,
  getRadioText: PropTypes.func,
  getRadiokey: PropTypes.func,
}

RadioGroup.defaultProps = {
  variants: [],
  active: '',
  getRadioText: (item)=>item.text,
  getRadiokey: (item, index) => index,
}

const style = StyleSheet.create({
  style: {
    flex: 1,
    alignSelf: 'stretch',
  }
})