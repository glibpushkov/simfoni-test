import { Component } from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { startSubmit, stopSubmit, setSubmitSucceeded, setSubmitFailed } from 'redux-form'

import { fromPromise } from 'rxjs/observable/fromPromise'
import { concat } from 'rxjs/observable/concat'
// import { interval } from 'rxjs/observable/interval'
import { of } from 'rxjs/observable/of'

import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/takeUntil'

import pathToRegexp from 'path-to-regexp'

import omit from 'lodash/omit'
import pick from 'lodash/pick'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import values from 'lodash/values'
import get from 'lodash/get'
import has from 'lodash/has'

const REQUEST = '@ds-resource/request'
const SET_DATA = '@ds-resource/set-data'
const SET_ERRORS = '@ds-resource/set-errors'
const SET_LOADING = '@ds-resource/set-loading'
const SET_FILTERS = '@ds-resource/set-filters'

export function request (payload, meta) {
  return {
    type: REQUEST,
    meta,
    payload
  }
}

export function setData (payload, meta) {
  return {
    type: SET_DATA,
    meta,
    payload
  }
}

export function setFilters (payload, meta) {
  return {
    type: SET_FILTERS,
    meta,
    payload
  }
}

export function setErrors (payload, meta) {
  return {
    type: SET_ERRORS,
    meta,
    payload
  }
}

export function setLoading (payload, meta) {
  return {
    type: SET_LOADING,
    meta,
    payload
  }
}

function getNameSpaceFromResource (resource) {
  if (typeof resource === 'string') return resource
  return resource.namespace
}

function getDefaultState (resource) {
  if (has(resource, 'defaultState')) {
    return resource.defaultState
  }
  let defaultState = {
    isLoading: false,
    data: {}
  }
  if (has(resource, 'queries')) {
    defaultState = {...defaultState, data: {}, filters: {}}
  }
  return defaultState
}

function mapStateToProps (resources) {
  return function (state, props) {
    if (!Array.isArray(resources)) {
      resources = [resources]
    }
    return resources.reduce((res, resource) => {
      const key = getNameSpaceFromResource(resource)
      return {
        ...res,
        [key]: {...get(state.resources, key, getDefaultState(resource)), ...get(props, key, {})}
      }
    }, {})
    return data
  }
}

function getMetaFromResource (resource, options = {}) {
  if (typeof resource === 'string') {
    return { endPoint: resource, namespace: resource, ...options }
  }
  return {
    ...resource,
    ...options,
    endPoint: resource.endPoint || resource.namespace,
    namespace: resource.namespace
  }
}

function makeResourceActions (resource, options = {}) {
  let meta = getMetaFromResource(resource, options)
  let actions = {
    create: makeRequestAction('POST', meta),
    fetch: makeRequestAction('GET', meta),
    update: makeRequestAction('PATCH', meta),
    remove: makeRequestAction('DELETE', meta),
    replace: makeRequestAction('PUT', meta),
    setData: (payload, actionmeta = {}) => setData(payload, { ...meta, ...actionmeta })
  }
  if (get(resource, 'form')) {
    actions.onSubmit = makeRequestAction('submitForm', meta)
  }
  if (has(resource, 'queries')) {
    actions.setFilters = payload => setFilters(payload, meta)
  }
  return actions
}

function mapDispatchToProps (resources, dispatch, options) {
  if (!Array.isArray(resources)) {
    resources = [resources]
  }
  const actions = resources.reduce((res, resource) => {
    const key = getNameSpaceFromResource(resource)
    const { onSubmit, ...actions } = makeResourceActions(resource, options)
    return {
      ...res,
      [key]: bindActionCreators(actions, dispatch),
      onSubmit: res.onSubmit || bindActionCreators({ onSubmit }, dispatch).onSubmit
    }
  }, {})
  return actions
}

export default function connectResouces (resource, options = {}) {
  return compose(
    connect(null, (dispatch, props) => mapDispatchToProps(resource, dispatch, options)),
    connect(mapStateToProps(resource))
  )
}

export function reducer (state = {}, { type, payload = {}, meta = {} }) {
  switch (type) {
    case SET_ERRORS:
    case SET_DATA: {
      const currentData = state[meta.namespace]
      const dataKey = {
        [SET_DATA]: 'data',
        [SET_ERRORS]: 'errors',
        [SET_FILTERS]: 'filters'
      }[type]

      return {
        ...state,
        [meta.namespace]: {
          ...currentData,
          [dataKey]: payload
        }
      }
    }

    case SET_LOADING: {
      const currentData = state[meta.namespace]
      return {
        ...state,
        [meta.namespace]: {
          ...currentData,
          isLoading: payload
        }
      }
    }
  }

  return state
}

function getFormRequestType (form = {}, data) {
  const { formAction, switchActionByKey } = form
  if (!switchActionByKey) {
    return formAction || 'POST'
  }
  return get(data, switchActionByKey) ? get(formAction, 'update', 'PUT') : get(formAction, 'create', 'POST')
}

export function epic (action$, store, { API }) { // FIXME API
  return action$.ofType(REQUEST)
    // .debounce(() => interval(100)) // FIXME: FAIL on different requests types
    .mergeMap(function ({ meta, payload }) {
      let { type, endpoint, form, namespace, queries = [], afterActions = [], useGlobalErrors, isList } = meta
      if (endpoint.search(/\/:/) > -1) {
        endpoint = pathToRegexp.compile(resource.endpoint)(payload)
      }
      const isFormAction = type === 'submitForm'
      if (isFormAction) {
        type = getFormRequestType(form, get(store.getState(), `resources.${namespace}.data`))
      }
      return concat(
        of(
          setLoading(true, meta),
          isFormAction && startSubmit(form.name),
          !isEmpty(queries) && setFilters(pick(payload, queries), meta)
        ),
        fromPromise(API(endpoint).request(type, pick(payload, queries), omit(payload, queries)))
          .switchMap(response => of(
            (isList && type !== 'GET') ? request(undefined, {...meta, type: 'GET'}) : setData(response, meta),
            setLoading(false, meta),
            ...afterActions,
            !!form && stopSubmit(form.name),
            !!form && setSubmitSucceeded(form.name)
          ))
          .catch(err => of(
            setErrors(err.errors || err, meta),
            setLoading(false, meta),
            !!form && stopSubmit(form.name, err.errors || err),
            !!form && setSubmitFailed(form.name) // TODO fields list
          ))
      ).filter(Boolean)
    })
}

function makeRequestAction (type, meta) {
  return function (payload, actionmeta = {}) {
    return request(payload, { ...meta, type, ...actionmeta })
  }
}
