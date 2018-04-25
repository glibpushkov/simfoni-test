import MaterialIcons from './IcomoonCreator'

let _iconComponent = MaterialIcons

export default {
  set (component) {
    _iconComponent = component
  },
  get () {
    return _iconComponent
  }
}
