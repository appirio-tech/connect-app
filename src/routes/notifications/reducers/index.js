/**
 * Notifications related reducers
 */
import {
  SET_NOTIFICATIONS_FILTER_BY,
  MARK_ALL_NOTIFICATIONS_READ,
  TOGGLE_NOTIFICATION_READ,
  VIEW_OLDER_NOTIFICATIONS_PENDING,
  VIEW_OLDER_NOTIFICATIONS_SUCCESS,
  VIEW_OLDER_NOTIFICATIONS_FAILURE
} from '../../../config/constants'

const initialState = {
  isLoading: false,
  filterBy: '',
  sources: [],
  notifications: []
}

// TODO mocked source for demo purposes has to be removed when service is implemented
const mockedSources = [
  {
    id: 'global',
    title: 'Global',
    total: 7
  }, {
    id: 'projectId-01',
    title: 'IBM Mobile Project Part 1',
    total: 7
  }, {
    id: 'projectId-02',
    title: 'Unexpectedly Absolutely Extremely Ridiculous Very Long Project Name',
    total: 21
  }, {
    id: 'projectId-03',
    title: 'Connect v2 Specification Upgrade',
    total: 45
  }
]

// TODO mocked notifications for demo purposes has to be removed when service is implemented
import moment from 'moment'
const mockedNotificatons = [
  {
    id: 'global-01',
    sourceId: 'global',
    type: 'new-project',
    date: moment().subtract(2, 'hours').format('YYYY-MM-DD hh:mm'),
    isRead: false,
    content: 'A new project was created: <strong>System Something Other Name</strong>'
  }, {
    id: 'global-02',
    sourceId: 'global',
    type: 'new-project',
    date: moment().subtract(2, 'hours').format('YYYY-MM-DD hh:mm'),
    isRead: false,
    content: 'A new project was created: <strong>My iPad mobile drone controller app</strong> | Ref: EY2'
  }, {
    id: 'global-03',
    sourceId: 'global',
    type: 'review-pending',
    date: '2016-11-02 20:00',
    isRead: false,
    content: 'Project <strong>System Something Other Name 1</strong> was submitted for review'
  }, {
    id: 'global-04',
    sourceId: 'global',
    type: 'review-pending',
    date: '2016-11-02 20:00',
    isRead: false,
    content: 'Project <strong>System Something Other Name 3</strong> was submitted for review'
  }, {
    id: 'global-05',
    sourceId: 'global',
    type: 'review-pending',
    date: '2016-11-02 20:00',
    isRead: false,
    content: 'Project <strong>System Something Other Name 2</strong> was submitted for review'
  }, {
    id: 'global-06',
    sourceId: 'global',
    type: 'warning',
    date: '2017-10-26 20:00',
    isRead: false,
    content: 'Project <strong>Connect v2 Specification Declaration</strong> is missing a Copilot'
  }, {
    id: 'global-07',
    sourceId: 'global',
    type: 'member-added',
    date: '2017-10-26 20:00',
    isRead: false,
    content: 'You were added to the <strong>Connect v2 Specification Declaration</strong> project by <strong>Pat Monahan</strong>'
  },

  {
    id: 'projectId-01-01',
    sourceId: 'projectId-01',
    type: 'new-posts',
    date: moment().subtract(15, 'minutes').format('YYYY-MM-DD hh:mm'),
    isRead: false,
    content: '34 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-01-02',
    sourceId: 'projectId-01',
    type: 'updates',
    date: moment().subtract(1, 'hours').format('YYYY-MM-DD hh:mm'),
    isRead: false,
    content: '2 new project updates posted'
  }, {
    id: 'projectId-01-03',
    sourceId: 'projectId-01',
    type: 'updates',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '1 new project updates posted'
  }, {
    id: 'projectId-01-04',
    sourceId: 'projectId-01',
    type: 'new-posts',
    date: '2017-10-02 20:00',
    isRead: false,
    content: '4 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-01-05',
    sourceId: 'projectId-01',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'You were added to the project by <strong>Pat Monahan</strong>'
  }, {
    id: 'projectId-01-06',
    sourceId: 'projectId-01',
    type: 'updates',
    date: '2016-10-24 20:00',
    isRead: false,
    content: '<strong>Pat Monahan</strong> joined your project as a manager'
  }, {
    id: 'projectId-01-07',
    sourceId: 'projectId-01',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: 'Your project was reviewed'
  },

  {
    id: 'projectId-02-01',
    sourceId: 'projectId-02',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '34 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-02-02',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '2 new project updates posted'
  }, {
    id: 'projectId-02-03',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '1 new project updates posted'
  }, {
    id: 'projectId-02-04',
    sourceId: 'projectId-02',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '4 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-02-05',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'You were added to the project by <strong>Pat Monahan</strong>'
  }, {
    id: 'projectId-02-06',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: '<strong>Pat Monahan</strong> joined your project as a manager'
  }, {
    id: 'projectId-02-07',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'Your project was reviewed'
  },

  {
    id: 'projectId-03-01',
    sourceId: 'projectId-03',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '34 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-03-02',
    sourceId: 'projectId-03',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '2 new project updates posted'
  }, {
    id: 'projectId-03-03',
    sourceId: 'projectId-03',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '1 new project updates posted'
  }, {
    id: 'projectId-03-04',
    sourceId: 'projectId-03',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '4 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-03-05',
    sourceId: 'projectId-03',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'You were added to the project by <strong>Pat Monahan</strong>'
  }, {
    id: 'projectId-03-06',
    sourceId: 'projectId-03',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: '<strong>Pat Monahan</strong> joined your project as a manager'
  }, {
    id: 'projectId-03-07',
    sourceId: 'projectId-03',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'Your project was reviewed'
  }
]

// TODO init state with mocked data for demo purposes has to be removed when don't need anymore
initialState.sources = mockedSources
initialState.notifications = mockedNotificatons

export default (state = initialState, action) => {
  switch (action.type) {
  case SET_NOTIFICATIONS_FILTER_BY:
    return {...state,
        filterBy: action.payload
      }

  case MARK_ALL_NOTIFICATIONS_READ:
    return {...state,
        notifications: state.notifications.map(notification => (
          !action.payload || action.payload === notification.sourceId ? {
            ...notification,
            isRead: true
          } : notification
        )),
        sources: state.sources.map(source => (
          !action.payload || action.payload === source.id ? {
            ...source,
            total: 0
          } : source
        ))
      }

  case TOGGLE_NOTIFICATION_READ: {
    let changedNotification
    const newState = {...state,
      notifications: state.notifications.map(notification => {
        if (action.payload === notification.id) {
          changedNotification = {
            ...notification,
            isRead: !notification.isRead
          }
          return changedNotification
        } else {
          return notification
        }
      })
    }

    newState.sources = newState.sources.map(source => (
      changedNotification.sourceId === source.id ? {
        ...source,
        total: source.total + (changedNotification.isRead ? -1 : +1)
      } : source
    ))

    return newState
  }

  case VIEW_OLDER_NOTIFICATIONS_PENDING:
    return {...state,
        sources: state.sources.map(source => (
          action.payload.sourceId === source.id ? {
            ...source,
            isLoading: true
          } : source
        ))
      }

  case VIEW_OLDER_NOTIFICATIONS_SUCCESS:
  case VIEW_OLDER_NOTIFICATIONS_FAILURE:
    return {...state,
        sources: state.sources.map(source => (
          action.payload.sourceId === source.id ? {
            ...source,
            isLoading: false
          } : source
        )),
        notifications: [...state.notifications, ...(action.payload.notifications || [])]
      }

  default:
    return state
  }
}
