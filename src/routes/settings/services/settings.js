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

const saveNotificationSettings = (data) => {
  return axios.put(`${TC_NOTIFICATION_URL}/settings`, data)
}

export default {
  checkEmailAvailability,
  changeEmail,
  changePassword,
  getNotificationSettings,
  saveNotificationSettings
}
