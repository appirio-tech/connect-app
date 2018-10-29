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
  TOGGLE_NOTIFICATION_READ,
  VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  HIDE_OLDER_NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_PENDING,
  TOGGLE_NOTIFICATIONS_DROPDOWN_MOBILE,
  TOGGLE_NOTIFICATIONS_DROPDOWN_WEB,
  START_READING_NOTIFICATIONS,
  STOP_READING_NOTIFICATIONS,
  MARK_NOTIFICATIONS_READ,
} from '../../../config/constants'
import notificationsService from '../services/notifications.js'
import { 
  filterNotificationsByCriteria, 
  filterReadNotifications 
} from '../helpers/notifications'
import Alert from 'react-s-alert'
import _ from 'lodash'

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

export const toggleBundledNotificationRead = (bundledNotificationId, bundledIds) => (dispatch) => {
  dispatch({
    type: NOTIFICATIONS_PENDING
  })

  notificationsService.markNotificationsRead(bundledIds.join('-')).then(() => {
    dispatch({
      type: TOGGLE_NOTIFICATION_READ,
      payload: bundledNotificationId
    })
  }).catch(err => {
    Alert.error(`Failed to mark notification read. ${err.message}`)
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
  }).catch(err => {
    Alert.error(`Failed to mark notification seen. ${err.message}`)
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

  notificationsService.markNotificationsRead(notificationIds.join('-')).then(() => {
    dispatch({
      type: MARK_NOTIFICATIONS_READ,
      payload: notificationIds
    })
  }).catch(err => {
    Alert.error(`Failed to mark notification read. ${err.message}`)
  })
}

/**
 * After this action is performed all notification which met the provided criteria
 * will be marked as read.
 * New notifications which are loaded will be also marked as read if met the provided criteria.
 * 
 * @param {Object|Array} criteria rules or list of rules for notifications which has to be marked as read
 * 
 * @returns {String}              this action returns uid which can be used to stop reading notifications
 */
export const startReadingNotifications = (criteria, id) => (dispatch, getState) => {
  // if custom id was provided, make sure it's unique
  if (id) {
    const existentReader = _.get(getState(), `notifications.readers[${id}]`)

    if (existentReader) {
      console.warn(`Notification reader with id '${id}' is already registered.`)
      return null
    }
  }
  
  // if id wasn't provided, generate unique id
  const uid = id ? id : _.uniqueId('reader-')

  dispatch({
    type: START_READING_NOTIFICATIONS,
    payload: {
      uid,
      criteria,
    }
  })

  markNotificationsReadByCriteria(criteria)(dispatch, getState)

  return uid
}

/**
 * This action will stop marking notifications as read.
 * 
 * @param {String} uid uid of the notification reader
 */
export const stopReadingNotifications = (uid) => (dispatch) => dispatch({
  type: STOP_READING_NOTIFICATIONS,
  payload: {
    uid,
  }
})