/**
 * Mocked service for settings
 *
 * TODO has to be replaced with the real service
 */
import _ from 'lodash'
import { axiosInstance as axios } from '../../../api/requestInterceptor'
import { TC_NOTIFICATION_URL } from '../../../config/constants'

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

const checkEmailAvailability = (email) => {
  // for demo we only treat these emails as available
  const isAvailable = ['p.monahan@incrediblereality.com', 'good@test.com', 'bad@test.com'].indexOf(email) > -1
  let mockedResponse

  // for demo throw error when email like this
  if (email === 'error@test.com') {
    mockedResponse = mockedFetch('This is mocked request error when email "error@test.com" is entered.')
  } else {
    mockedResponse = mockedFetch(null, isAvailable)
  }

  return mockedResponse
}

const changeEmail = (email) => {
  let mockedResponse

  // for demo throw error when email like this
  if (email === 'bad@test.com') {
    mockedResponse = mockedFetch('This is mocked request error when email is changed to "bad@test.com".')
  } else {
    mockedResponse = mockedFetch(null, email)
  }

  return mockedResponse
}

const changePassword = (password) => {
  let mockedResponse

  // for demo throw error when password like this
  if (password === 'fake-password') {
    mockedResponse = mockedFetch('This is mocked request error when password is changed to "fake-password".')
  } else {
    mockedResponse = mockedFetch(null)
  }

  return mockedResponse
}

const getNotificationSettings = () => {
  return axios.get(`${TC_NOTIFICATION_URL}/settings`)
    .then(resp => resp.data)
}

// TODO move this list to constants together with the same list in NotificationSettingsForm.jsx
const topics = [
  'notifications.connect.project.created',
  'notifications.connect.project.updated',
  'notifications.connect.project.canceled',
  'notifications.connect.project.approved',
  'notifications.connect.project.paused',
  'notifications.connect.project.completed',
  'notifications.connect.project.submittedForReview',
  'notifications.connect.project.active',

  'notifications.connect.project.fileUploaded',
  'notifications.connect.project.specificationModified',
  'notifications.connect.project.linkCreated',

  'notifications.connect.project.member.joined',
  'notifications.connect.project.member.left',
  'notifications.connect.project.member.removed',
  'notifications.connect.project.member.managerJoined',
  'notifications.connect.project.member.copilotJoined',
  'notifications.connect.project.member.assignedAsOwner',

  'notifications.connect.project.topic.created',
  'notifications.connect.project.topic.deleted',
  'notifications.connect.project.post.created',
  'notifications.connect.project.post.edited',
  'notifications.connect.project.post.deleted'
]

const saveNotificationSettings = (data) => {
  const body = []
  _.each(topics, (topic) => {
    body.push({ topic, deliveryMethod: 'email', value: data[topic] && data[topic].email === 'yes' ? 'yes' : 'no' })
    body.push({ topic, deliveryMethod: 'web', value: data[topic] && data[topic].web === 'yes' ? 'yes' : 'no' })
  })
  return axios.put(`${TC_NOTIFICATION_URL}/settings`, body)
}

export default {
  checkEmailAvailability,
  changeEmail,
  changePassword,
  getNotificationSettings,
  saveNotificationSettings
}
