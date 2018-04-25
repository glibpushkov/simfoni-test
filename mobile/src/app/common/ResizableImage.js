import React, { Component } from 'react'
import { Image } from 'react-native'
import { CachedImage } from 'react-native-cached-image'
import { Observable } from 'rxjs/Rx'

export default class ResizableImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      aspectRatio: undefined
    }
  }
  componentWillMount() {
    this.subscription = Observable.fromPromise(getImageSize(this.props.source.uri))
      .subscribe(
        (aspectRatio) => {
          this.setState({ aspectRatio })
        },
        (err) => {}
      )
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe()
  }
  render() {
    const { style, ...other } = this.props
    const { aspectRatio } = this.state
    return (
      <CachedImage
        resizeMode="contain"
        style={[ { alignSelf: 'stretch' }, style, { aspectRatio } ]}
        {...other}
      />
    )
  }
}

function getImageSize(uri){
  return new Promise((resolve,reject)=>{
    Image.getSize(uri, (width, height) => {
      resolve(width / height)
    })
  })
}
