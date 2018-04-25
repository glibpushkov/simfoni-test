import isEmpty from 'lodash/isEmpty'

const convertValueFor = ['ordering']

export function parseQueryParams (str) {
  if (str.length <= 2) {
    return {} // '' || '?'
  }

  return str
    .substr(1) // symbol '?'
    .split('&')
    .reduce(function (params, param) {
      var paramSplit = param.split('=').map(function (chunk) {
        return decodeURIComponent(chunk.replace('+', '%20'))
      })
      const name = paramSplit[0]
      let value = paramSplit[1]
      params[name] = params.hasOwnProperty(name) ? [].concat(params[name], value) : value
      return params
    }, {})
}

export function buildQueryParams (params) {
  if (isEmpty(params)) {
    return ''
  }

  return Object.keys(params).reduce(function (ret, key) {
    let value = params[key]

    if (value === null || value === undefined) {
      return ret
    }

    if (!Array.isArray(value)) {
      value = [value]
    }

    value.forEach(function (val) {
      ret.push(
        encodeURIComponent(_key) +
        '=' +
        encodeURIComponent(val)
      )
    })
    // TODO null should not be here, check field components

    return ret
  }, []).join('&')
}
