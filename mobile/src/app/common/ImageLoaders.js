import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CachedImage } from 'react-native-cached-image'
import { Image } from 'react-native'
import FullScreanImage from './imageViewer'
import { Observable } from 'rxjs/Rx'


export default class ImageLoaders extends Component { 
  constructor(props){
    super(props)
    this.state = {
      aspectRatio: undefined,
    }
  }
  componentWillMount() {
    this.subscription = Observable.fromPromise(getImageSize(this.props.uri))
      .subscribe(
        (aspectRatio) => {
          this.setState({ aspectRatio })
        },
        (err) => {console.log(err)}
      )
  }
  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe()
  }
  render(){
    const { aspectRatio } = this.state
    const { uri } = this.props
    if(!uri) return null;
    return (
      <FullScreanImage>
        <CachedImage
          source={{uri}}
          resizeMode='contain'
          style={{
            alignSelf: 'stretch',
            aspectRatio
          }}
        />
      </FullScreanImage>
    )
  }
}

function getImageSize(uri){
  return new Promise((resolve,reject)=>{
    Image.getSize(uri, (width, height) => {
      resolve(width / height)
    },(err)=>reject(err))
  })
}

ImageLoaders.propTypes = {
  uri: PropTypes.string.isRequired,
}
