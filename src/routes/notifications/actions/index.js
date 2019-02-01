/**
 * Notification related actions
 */
import {
  GET_NOTIFICATIONS_PENDING,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAILURE,
  VISIT_NOTIFICATIONS,
  TOGGLE_NOTIFICATION_SEEN,
  SET_NOTIFICATIONS_FILTER_BY,
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATIONS_READ,
  TOGGLE_NOTIFICATION_READ,
  VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  HIDE_OLDER_NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_PENDING,
  TOGGLE_NOTIFICATIONS_DROPDOWN_MOBILE,
  TOGGLE_NOTIFICATIONS_DROPDOWN_WEB,
} from '../../../config/constants'
import notificationsService from '../services/notifications.js'
import {
  filterNotificationsByCriteria,
  filterReadNotifications
} from '../helpers/notifications'
import Alert from 'react-s-alert'
import _ from 'lodash'

const handleDispatchNotificationReadByType = (type, dispatch, payload, isRead) => {
  dispatch({
    type,
    payload,
    isRead
  })
}

const handleDispatchNotificationRead = handleDispatchNotificationReadByType.bind(this, TOGGLE_NOTIFICATION_READ)
const handleDispatchMarkAllNotificationsRead = handleDispatchNotificationReadByType.bind(this, MARK_ALL_NOTIFICATIONS_READ)
const handleDispatchMarkNotificationsRead = handleDispatchNotificationReadByType.bind(this, MARK_NOTIFICATIONS_READ)

export const getNotifications = () => (dispatch) => {
  dispatch({ type: GET_NOTIFICATIONS_PENDING })
  notificationsService.getNotifications().then(notifications => {
    dispatch({
      type: GET_NOTIFICATIONS_SUCCESS,
      payload: notifications
    })
  }).catch(err => {
    dispatch({
      type: GET_NOTIFICATIONS_FAILURE,
      payload: err
    })
    console.error(`Failed to load notifications. ${err.message}`)
  })
}

export const visitNotifications = () => (dispatch) => {
  dispatch({
    type: VISIT_NOTIFICATIONS
  })
}

export const setNotificationsFilterBy = (filterBy) => (dispatch) => dispatch({
  type: SET_NOTIFICATIONS_FILTER_BY,
  payload: filterBy
})

export const markAllNotificationsRead = (sourceId, notifications = []) => (dispatch) => {
  let ids = null
  if (sourceId) {
    const sourceNfs = _.filter(notifications, n => n.sourceId === sourceId && !n.isRead)
    if (sourceNfs.length === 0) {
      return
    }
    ids = _.map(sourceNfs, n => n.id).join('-')
  }

  dispatch({
    type: NOTIFICATIONS_PENDING
  })
  handleDispatchMarkAllNotificationsRead(dispatch, sourceId, true)
  notificationsService.markNotificationsRead(ids).catch(err => {
    Alert.error(`Failed to mark notifications read. ${err.message}`)
    handleDispatchMarkAllNotificationsRead(dispatch, sourceId, false)
  })
}

export const toggleNotificationRead = (notificationId) => (dispatch) => {
  handleDispatchNotificationRead(dispatch, notificationId, true)
  notificationsService.markNotificationsRead(notificationId).catch(err => {
    Alert.error(`Failed to mark notification read. ${err.message}`)
    handleDispatchNotificationRead(dispatch, notificationId, false)
  })
}

export const toggleBundledNotificationRead = (bundledNotificationId, bundledIds) => (dispatch) => {
  dispatch({
    type: NOTIFICATIONS_PENDING
  })
  handleDispatchNotificationRead(dispatch, bundledNotificationId, true)
  notificationsService.markNotificationsRead(bundledIds.join('-')).catch(err => {
    Alert.error(`Failed to mark notification read. ${err.message}`)
    handleDispatchNotificationRead(dispatch, bundledNotificationId, false)
  })
}

export const toggleNotificationSeen = (notificationId) => (dispatch) => {
  dispatch({
    type: NOTIFICATIONS_PENDING
  })

  notificationsService.markNotificationsSeen(notificationId).then(() => {
    dispatch({
      type: TOGGLE_NOTIFICATION_SEEN,
      payload: notificationId
    })
  }).catch(() => {
    // ignored
    // any network error will still be logged by the browser/client
  })
}

export const viewOlderNotifications = (sourceId) => (dispatch) => dispatch({
  type: VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  payload: sourceId
})

export const hideOlderNotifications = () => (dispatch) => dispatch({
  type: HIDE_OLDER_NOTIFICATIONS_SUCCESS
})

export const toggleNotificationsDropdownMobile = (isOpen) => (dispatch) => dispatch({
  type: TOGGLE_NOTIFICATIONS_DROPDOWN_MOBILE,
  payload: isOpen
})

export const toggleNotificationsDropdownWeb = (isOpen) => (dispatch) => dispatch({
  type: TOGGLE_NOTIFICATIONS_DROPDOWN_WEB,
  payload: isOpen
})

export const markNotificationsReadByCriteria = (criteria) => (dispatch, getState) => {
  const notifications = getState().notifications.notifications
  const notificationsToRead = filterReadNotifications(filterNotificationsByCriteria(notifications, criteria))

  if (notificationsToRead.length > 0) {
    const notificationIds = _.map(notificationsToRead, 'id')
    markNotificationsRead(notificationIds)(dispatch, getState)
  }
}

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  dispatch({
    type: NOTIFICATIONS_PENDING
  })
  handleDispatchMarkNotificationsRead(dispatch, notificationIds, true)
  notificationsService.markNotificationsRead(notificationIds.join('-')).catch(err => {
    Alert.error(`Failed to mark notification read. ${err.message}`)
    handleDispatchMarkNotificationsRead(dispatch, notificationIds, false)
  })
}