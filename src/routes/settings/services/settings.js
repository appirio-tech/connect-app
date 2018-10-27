/**
 * Mocked service for settings
 *
 * TODO has to be replaced with the real service
 */
import _ from 'lodash'
import { RESET_PASSWORD_URL } from '../../../../config/constants/'
import { axiosInstance as axios } from '../../../api/requestInterceptor'
import { TC_NOTIFICATION_URL, TC_API_URL } from '../../../config/constants'

const getNotificationSettings = () => {
  return axios.get(`${TC_NOTIFICATION_URL}/settings`)
    .then(resp => resp.data)
}

const saveNotificationSettings = (data) => {
  return axios.put(`${TC_NOTIFICATION_URL}/settings`, data)
}

const getSystemSettings = (handle) => {
  return axios.get(`${TC_API_URL}/v3/members/${handle}`).then(resp => {
    return _.get(resp, 'data.result.content')
  })
}

const updateSystemSettings = (handle, profile) => {
  // `achievements` and `ratingSummary` are read-only and cannot be updated in member profile
  const updatedProfile = _.omit(profile, 'achievements', 'ratingSummary')

  return axios.put(`${TC_API_URL}/v3/members/${handle}`, { param: updatedProfile })
    .then(resp => resp.data)
}

const checkEmailValidity = (email) => {
  return axios.get(`${TC_API_URL}/v3/users/validateEmail?email=${email}`)
    .then(resp => resp.data)
}

const updatePassword = (credential, userId) => {
  return axios.patch(`${TC_API_URL}/v3/users/${userId}`, { param: { credential } })
}

const resetPassword = (email) => {
  const prefix = RESET_PASSWORD_URL
  const url =
    `${TC_API_URL}/v3/users/resetToken?email=${email}&resetPasswordUrlPrefix=${prefix}`
  return axios.get(url)
}

export default {
  getNotificationSettings,
  saveNotificationSettings,
  getSystemSettings,
  checkEmailValidity,
  updateSystemSettings,
  updatePassword,
  resetPassword,
}
