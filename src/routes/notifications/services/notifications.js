/**
 * Mocked service for notifications
 *
 * TODO has to be replaced with the real service
 */

// mock test data
const mockOlderNotifications = [
  {
    id: 'projectId-02-08',
    sourceId: 'projectId-02',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '34 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-02-09',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '2 new project updates posted'
  }, {
    id: 'projectId-02-10',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '1 new project updates posted'
  }, {
    id: 'projectId-02-11',
    sourceId: 'projectId-02',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '4 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-02-12',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'You were added to the project by <strong>Pat Monahan</strong>'
  }, {
    id: 'projectId-02-13',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: '<strong>Pat Monahan</strong> joined your project as a manager'
  }, {
    id: 'projectId-02-14',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'Your project was reviewed'
  }, {
    id: 'projectId-02-15',
    sourceId: 'projectId-02',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '34 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-02-16',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '2 new project updates posted'
  }, {
    id: 'projectId-02-17',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2016-11-02 20:00',
    isRead: false,
    content: '1 new project updates posted'
  }, {
    id: 'projectId-02-18',
    sourceId: 'projectId-02',
    type: 'new-posts',
    date: '2017-11-02 20:00',
    isRead: false,
    content: '4 new posts in <strong>Architecture Map Specification</strong>'
  }, {
    id: 'projectId-02-19',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'You were added to the project by <strong>Pat Monahan</strong>'
  }, {
    id: 'projectId-02-20',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: '<strong>Pat Monahan</strong> joined your project as a manager'
  }, {
    id: 'projectId-02-21',
    sourceId: 'projectId-02',
    type: 'updates',
    date: '2017-10-24 20:00',
    isRead: false,
    content: 'Your project was reviewed'
  }
]

// mocked fetching timeout
const mockedTimeout = 1000

const mockedFetch = (errorMessage, data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (errorMessage) {
      reject(new Error(errorMessage))
    } else {
      resolve(data)
    }
  }, mockedTimeout)
})

const getOlderNotigications = (sourceId) => {
  let mockedResponse

  // for demo throw error when sourceId is not like this
  if (sourceId !== 'projectId-02') {
    mockedResponse = mockedFetch('This is mocked request error when sourceId is not "projectId-02".')
  } else {
    mockedResponse = mockedFetch(null, mockOlderNotifications)
  }

  return mockedResponse
}

export default {
  getOlderNotigications
}
