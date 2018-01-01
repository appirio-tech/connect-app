/**
 * Notification related actions
 */
import {
  GET_NOTIFICATIONS,
  SET_NOTIFICATIONS_FILTER_BY,
  MARK_ALL_NOTIFICATIONS_READ,
  TOGGLE_NOTIFICATION_READ,
  VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_PENDING
} from '../../../config/constants'
import notificationsService from '../services/notifications.js'
import Alert from 'react-s-alert'
import _ from 'lodash'

export const getNotifications = () => (dispatch) => {
  notificationsService.getNotifications().then(notifications => {
    dispatch({
      type: GET_NOTIFICATIONS,
      payload: notifications
    })
  }).catch(err => {
    Alert.error(`Failed to load notifications. ${err.message}`)
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

  notificationsService.markNotificationsRead(ids).then(() => {
    dispatch({
      type: MARK_ALL_NOTIFICATIONS_READ,
      payload: sourceId
    })
  }).catch(err => {
    Alert.error(`Failed to mark notifications read. ${err.message}`)
  })
}

export const toggleNotificationRead = (notificationId) => (dispatch) => {
  dispatch({
    type: NOTIFICATIONS_PENDING
  })

  notificationsService.markNotificationsRead(notificationId).then(() => {
    dispatch({
      type: TOGGLE_NOTIFICATION_READ,
      payload: notificationId
    })
  }).catch(err => {
    Alert.error(`Failed to mark notification read. ${err.message}`)
  })
}

export const viewOlderNotifications = (sourceId) => (dispatch) => dispatch({
  type: VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  payload: sourceId
})
