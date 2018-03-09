/**
 * Notifications related reducers
 */
import {
  GET_NOTIFICATIONS,
  VISIT_NOTIFICATIONS,
  TOUCH_NOTIFICATION,
  SET_NOTIFICATIONS_FILTER_BY,
  MARK_ALL_NOTIFICATIONS_READ,
  TOGGLE_NOTIFICATION_READ,
  VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  NOTIFICATIONS_PENDING
} from '../../../config/constants'
import _ from 'lodash'


const initialState = {
  isLoading: false,
  initialized: false,
  filterBy: '',
  sources: [{ id: 'global', title: 'Global', total: 0 }],
  notifications: [],
  // ids of sources that will also show old notifications
  oldSourceIds: [],
  lastVisited: new Date(0),
  touchedIds: {},
  pending: false
}

// get sources from notifications
const getSources = (notifications) => {
  const sources = [{ id: 'global', title: 'Global', total: 0 }]
  _.each(notifications, notification => {
    if (!notification.isRead) {
      const source = _.find(sources, s => s.id === notification.sourceId)
      if (source) {
        source.total++
      } else {
        sources.push({ id: notification.sourceId, title: notification.sourceName, total: 1 })
      }
    }
  })
  return sources
}

export default (state = initialState, action) => {
  switch (action.type) {
  case GET_NOTIFICATIONS:
    return { ...state, initialized: true, notifications: action.payload, sources: getSources(action.payload) }

  case VISIT_NOTIFICATIONS:
    return {...state, lastVisited: _.maxBy(_.map(state.notifications, n => new Date(n.date)))}

  case TOUCH_NOTIFICATION:
    return {
      ...state,
      touchedIds: {...state.touchedIds, [action.payload]: true}
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
      notifications: state.notifications.map(n => (
        !action.payload || n.sourceId === action.payload ? { ...n, isRead: true } : n
      ))
    }
    newState.sources = getSources(newState.notifications)
    return newState
  }

  case TOGGLE_NOTIFICATION_READ: {
    const newState = {
      ...state,
      pending: false,
      notifications: state.notifications.map(n => (
        n.id === action.payload ? { ...n, isRead: true } : n
      ))
    }
    newState.sources = getSources(newState.notifications)
    return newState
  }

  case VIEW_OLDER_NOTIFICATIONS_SUCCESS:
    return {...state,
      oldSourceIds: [...state.oldSourceIds, action.payload]
    }

  default:
    return state
  }
}
