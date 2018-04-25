import React, { Component,  Children, cloneElement } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import Overlay from './OverLay';

export default class Lightbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false,
      origin: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };
    this.animatedValue = new Animated.Value(1),
    this.open = this.open.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  open(){
    this._root.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isOpen: true,
        isAnimating: true,
        origin: {
          width,
          height,
          x: px,
          y: py,
        },
      },()=> this._root && this.animatedValue.setValue(0));
    })
  }
  onClose() {
    this.animatedValue.setValue(1);
    this.setState({ isOpen: false });
  }
  render() {
    return (
      <View
        ref={component => this._root = component}
        style={this.props.style}
        onLayout={() => {}}
      >
        <Animated.View style={{opacity: this.animatedValue}}>
          <TouchableOpacity onPress={this.open}>
            {this.props.children}
          </TouchableOpacity>
        </Animated.View>
        {this.state.isOpen &&  <Overlay {...this.state} onClose={this.onClose}>
           {this.props.children}
        </Overlay>}
      </View>
    )
  }
} 