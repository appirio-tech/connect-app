/**
 * Notifications related reducers
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
  MARK_NOTIFICATIONS_READ,
} from '../../../config/constants'
import _ from 'lodash'


const initialState = {
  isLoading: false,
  initialized: false,
  filterBy: '',
  sources: [{ id: 'global', title: 'Global' }],
  notifications: [],
  // ids of sources that will also show old notifications
  oldSourceIds: [],
  lastVisited: new Date(0),
  pending: false,
  readers: {},
}

// get sources from notifications
const getSources = (notifications) => {
  const sources = [
    ...initialState.sources,
    ..._.uniqBy(
      notifications.map((notification) => ({ 
        id: notification.sourceId, 
        title: notification.sourceName 
      })),
      'id'
    )
  ]
  return sources
}

// check if no unread notifications available in the filtered section
const isNotificationSectionCleared = (notifications, filterBy) => {
  if (filterBy && notifications.filter(n => !n.isRead).map(n => n.sourceId).indexOf(filterBy) >= 0) {
    return false
  }

  return true
}

// get notifications and updated filterBy based on the unread notifications in current filter
const getNotificationsAndFilterBy = (notifications, filterBy) => {
  if (isNotificationSectionCleared(notifications, filterBy)) {
    return { notifications, filterBy: '' }
  }

  return { notifications }
}

export default (state = initialState, action) => {
  switch (action.type) {
  case GET_NOTIFICATIONS_PENDING:
    return { ...state, isLoading: true }
  case GET_NOTIFICATIONS_SUCCESS:
    return { ...state, initialized: true, isLoading: false, notifications: action.payload, sources: getSources(action.payload) }
  case GET_NOTIFICATIONS_FAILURE:
    return { ...state, isLoading: false }

  case VISIT_NOTIFICATIONS:
    return {...state, lastVisited: _.maxBy(_.map(state.notifications, n => new Date(n.date)))}

  case TOGGLE_NOTIFICATION_SEEN: {
    const ids = action.payload.split('-')
    const newState = {
      ...state,
      pending: false,
      notifications: state.notifications.map(n => (
        ids.indexOf(n.id) >= 0 ? { ...n, seen: true } : n
      ))
    }
    return newState
  }

  case SET_NOTIFICATIONS_FILTER_BY:
    return {...state,
      filterBy: action.payload
    }

  case NOTIFICATIONS_PENDING:
    return {...state,
      pending: true
    }

  case MARK_ALL_NOTIFICATIONS_READ: {
    const newState = {
      ...state,
      pending: false,
      ...getNotificationsAndFilterBy(state.notifications.map(n => (
        !action.payload || n.sourceId === action.payload ? { ...n, isRead: action.isRead } : n
      )), state.filterBy)
    }
    return newState
  }

  case TOGGLE_NOTIFICATION_READ: {
    const newState = {
      ...state,
      pending: false,
      ...getNotificationsAndFilterBy(state.notifications.map(n => (
        n.id === action.payload ? { ...n, isRead: action.isRead } : n
      )), state.filterBy)
    }
    return newState
  }

  case MARK_NOTIFICATIONS_READ: {
    const newState = {
      ...state,
      pending: false,
      ...getNotificationsAndFilterBy(state.notifications.map(n => (
        _.includes(action.payload, n.id) ? { ...n, isRead: action.isRead } : n
      )), state.filterBy)
    }
    return newState
  }

  case VIEW_OLDER_NOTIFICATIONS_SUCCESS:
    return {...state,
      oldSourceIds: [...state.oldSourceIds, action.payload]
    }

  case HIDE_OLDER_NOTIFICATIONS_SUCCESS:
    return {...state,
      oldSourceIds: []
    }

  default:
    return state
  }
}
