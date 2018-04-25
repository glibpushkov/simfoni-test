import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm'
import DeviceInfo from 'react-native-device-info'
import { createAction } from 'redux-actions'
import get from 'lodash/get'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { of } from 'rxjs/observable/of'
import { initSegmentUser } from './utils/configureAnalytics'
import { NavigationActions } from 'react-navigation'
import { Platform } from 'react-native'
import { setError } from './modules/errors'

const commentsNavigateAction = (params) => NavigationActions.navigate({
  routeName: 'ReadStory',
  params
})

const storiesResetnavigateAction = (params) => NavigationActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({routeName: 'Home'}),
    NavigationActions.navigate({routeName: 'Teezers', params})
  ]
})

const commentsResetnavigateAction = (params) => NavigationActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({routeName: 'Home'}),
    NavigationActions.navigate({routeName: 'ReadStory', params})
  ]
})

const device_id = DeviceInfo.getUniqueID()
const setupNotifications = createAction('SETUP_PUSH_NOTIFICATIONS')
const FCMTokenChange = createAction('CHANGE_PUSH_NOTIFICATIONS_TOKEN')
const handleNotification = createAction('HANDLE_PUSH_NOTIFICATION')
const removeListeners = createAction('CLEAR_PUSH_NOTIFICATIONS_LISTENER')
const clearClientNotification = createAction('SET_NOTIFICATION_DATA')

let FCMTokenHandler, FCMNotificationHandler

const clearNotificationsClientDataEpik = (action$, store, { API }) => {
  return action$
    .ofType(clearClientNotification().type)
    .mergeMap(function (action) {
      FCMTokenHandler && FCMTokenHandler.remove()
      FCMNotificationHandler && FCMNotificationHandler.remove()
      return fromPromise(FCM.deleteInstanceId())
      .flatMap(() => [])
      .catch(err => of(setError('Error while clear notifications')))
    })
}

const clearNotificationsListenersEpik = (action$, store, { API }) => {
  return action$
    .ofType(removeListeners().type)
    .switchMap(function (action) {
      FCMTokenHandler && FCMTokenHandler.remove()
      FCMNotificationHandler && FCMNotificationHandler.remove()
      return []
    })
}

const handleNotificationEpik = (action$, store, { API }) => {
  return action$
    .ofType(handleNotification().type)
    .mergeMap(function (action) {
      const notification = action.payload
      if (!get(notification, 'category_id') && !get(notification, 'mobile_story_pk')) return []
      const {category_id, comment_id, story_id, initial_notif, opened_from_tray, local_notification, _notificationType} = notification
      const nav = get(store.getState(), 'nav')
      const currentRoute = getCurrentRoute(nav)
      if (opened_from_tray || (Platform.OS === 'ios' && initial_notif)) {
        if (get(notification, 'mobile_story_pk')) {
          const { mobile_story_pk, story_pk, go_next_chapter_pk, category_pk, user_mobile_story_pk } = notification
          const startWriteAction = NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({routeName: 'Home'}),
              NavigationActions.navigate({
                routeName: 'CreateStory',
                params: {
                  mobile_story_pk,
                  story_pk,
                  go_next_chapter_pk,
                  category_pk,
                  user_mobile_story_pk
                }
              })
            ]
          })
          return of(startWriteAction)
        }
        if (comment_id && story_id) {
          const navigationAction = get(nav, 'routes', []).findIndex(x => x.routeName === 'Home') < 0
            ? commentsResetnavigateAction({category_id, comment_id, story_id})
            : commentsNavigateAction({category_id, comment_id, story_id})
          return of(navigationAction)
        }
        if (story_id) {
          return of(storiesResetnavigateAction({story_id, pk: category_id}))
        }
        return []
      }
      if (local_notification) {
        return []
      }
      if (Platform.OS === 'ios') {
        switch (_notificationType) {
          case NotificationType.Remote:
            notification.finish(RemoteNotificationResult.NewData)
            break
          case NotificationType.NotificationResponse:
            notification.finish()
            break
          case NotificationType.WillPresent:
            notification.finish(WillPresentNotificationResult.All)
            break
        }
      }
      if (get(notification, 'mobile_story_pk')) {
        showLocalNotification(notification)
      }
      if (story_id && currentRoute.routeName === 'ReadStory' && get(currentRoute, 'params.story_id') === story_id) {
        return []
      }
      if (story_id && currentRoute.routeName !== 'Teezers') {
        showLocalNotification(notification)
      }
      if (story_id && currentRoute.routeName === 'Teezers') {
        if (story_id === get(store.getState(), 'stories.detailedStory.pk')) {
          return []
        } else {
          showLocalNotification(notification)
        }
      }
      return []
    })
}

const FCMTokenChangeEpik = (action$, store, { API }) => {
  return action$
    .ofType(FCMTokenChange().type)
    .mergeMap(function ({payload: token}) {
      return fromPromise(API('push_notifications/tokens').post({ token, device_id }))
        .flatMap(() => [])
        .catch(err => [])
    })
}

const setupNotificationsEpic = (action$, store, { API }) => {
  return action$
    .ofType(setupNotifications().type)
    .mergeMap(function (action) {
      const ApiToken = get(store.getState(), 'session.token')
      if (!ApiToken) return []
      let checkToken
      return fromPromise(
        FCM.requestPermissions({badge: false, sound: true, alert: true})
          .then(() => FCM.getFCMToken())
          .then(token => {
            FCMTokenHandler = FCM.on(FCMEvent.RefreshToken, (token_) => {
              store.dispatch(FCMTokenChange(token_))
            })
            FCMNotificationHandler = FCM.on(FCMEvent.Notification, async (notif) => {
              store.dispatch(handleNotification(notif))
            })
            FCM.getInitialNotification().then(notification => {
              store.dispatch(handleNotification({...notification, initial_notif: true}))
            })
            if (token) {
              API('push_notifications/tokens').post({ token, device_id })
                .then(({ device_id: ID, token: _token_ } = {}) => {
                  if (device_id !== ID || _token_ !== token) {
                    setTimeout(() => store.dispatch(FCMTokenChange(token)), 5000)
                  }
                })
                .catch(err => {})
            }
            const user = get(store.getState(), 'session.user', {})
            initSegmentUser({...user, token})
            return true
          })
        )
        .flatMap(() => [])
        .catch(err => [])
    })
}

const getCurrentRoute = (nav) => {
  const { index, routes } = nav || {}
  return routes && routes[index] || {}
}

const showLocalNotification = notification => {
  const {fcm, title: del, body: dell, big_text: delll, ...extraData } = notification || {}
  const { title = '', body = '', big_text = '' } = fcm || {}
  FCM.presentLocalNotification({
    title,
    body: body || '',
    big_text: big_text || '',
    priority: 'high',
    sound: 'bell.mp3',
    large_icon: 'https://storytold-production-media.s3.amazonaws.com/media/comment_photo/97623936-95c1-46ad-af0a-99da6f55ac32/ST_iOS_final.png',
    show_in_foreground: true,
    number: 10,
    ...extraData
  })
}

const notificationsEpics = [FCMTokenChangeEpik, setupNotificationsEpic, handleNotificationEpik, clearNotificationsListenersEpik, clearNotificationsClientDataEpik]
export { notificationsEpics, setupNotifications, removeListeners, clearClientNotification }
