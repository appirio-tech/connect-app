/**
 * Notification related actions
 */
import {
  SET_NOTIFICATIONS_FILTER_BY,
  MARK_ALL_NOTIFICATIONS_READ,
  TOGGLE_NOTIFICATION_READ,
  VIEW_OLDER_NOTIFICATIONS_PENDING,
  VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  VIEW_OLDER_NOTIFICATIONS_FAILURE
} from '../../../config/constants'
import notificationsService from '../services/notifications.js'
import Alert from 'react-s-alert'

export const setNotificationsFilterBy = (filterBy) => (dispatch) => dispatch({
  type: SET_NOTIFICATIONS_FILTER_BY,
  payload: filterBy
})

export const markAllNotificationsRead = (sourceId) => (dispatch) => dispatch({
  type: MARK_ALL_NOTIFICATIONS_READ,
  payload: sourceId
})

export const toggleNotificationRead = (notificationId) => (dispatch) => dispatch({
  type: TOGGLE_NOTIFICATION_READ,
  payload: notificationId
})

export const viewOlderNotifications = (sourceId, currentTotal) => (dispatch) => {
  dispatch({
    type: VIEW_OLDER_NOTIFICATIONS_PENDING,
    payload: { sourceId }
  })

  notificationsService.getOlderNotigications(sourceId, currentTotal).then(notifications => {
    dispatch({
      type: VIEW_OLDER_NOTIFICATIONS_SUCCESS,
      payload: { sourceId, notifications }
    })
  }).catch(err => {
    Alert.error(`Failed to load older notifications. ${err.message}`)
    dispatch({
      type: VIEW_OLDER_NOTIFICATIONS_FAILURE,
      payload: { sourceId }
    })
  })
}
