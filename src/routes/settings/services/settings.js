/**
 * Mocked service for settings
 *
 * TODO has to be replaced with the real service
 */
import _ from 'lodash'
import { RESET_PASSWORD_URL } from '../../../../config/constants/'
import { axiosInstance as axios } from '../../../api/requestInterceptor'
import { TC_NOTIFICATION_URL, TC_API_URL } from '../../../config/constants'

const extractConnectTrait = (resp) => {
  const traits = _.get(resp, 'result.content')
  const connectTrait = _.find(traits, ['traitId', 'connect_info'])
  let data = {}
  if (connectTrait) {
    const traitData = _.get(connectTrait, 'traits.data')
    if (traitData && traitData.length > 0) {
      data = traitData[0]
    }
  }
  return data
}

const getNotificationSettings = () => {
  return axios.get(`${TC_NOTIFICATION_URL}/settings`)
    .then(resp => resp.data)
}

const saveNotificationSettings = (data) => {
  return axios.put(`${TC_NOTIFICATION_URL}/settings`, data)
}

const getProfileSettings = (handle) => {
  return axios.get(`${TC_API_URL}/v3/members/${handle}/traits`).then(resp => extractConnectTrait(resp.data))
}

const saveProfileSettings = (handle, settings) => {
  const body = {
    param: [{
      traitId: 'connect_info',
      categoryName: 'Connect User Information',
      traits: {
        data: [settings],
      },
    }],
  }
  return axios.put(`${TC_API_URL}/v3/members/${handle}/traits`, body)
    .then(resp => {
      return extractConnectTrait(resp.data)
    })
}

const uploadFileToS3 = ({preSignedURL, file}) => {
  _.noop(this)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('PUT', preSignedURL, true)
    xhr.setRequestHeader('Content-Type', file.type)

    xhr.onreadystatechange = () => {
      const { status } = xhr
      if (((status >= 200 && status < 300) || status === 304) && xhr.readyState === 4) {
        resolve(preSignedURL)
      } else if (status >= 400) {
        const err = new Error('Could not upload image')
        err.status = status
        reject(err)
      }
    }
    xhr.onerror = (err) => {
      reject(err)
    }
    xhr.send(file)
  })
}

const uploadProfilePhoto = (handle, file) => {
  return axios.post(`${TC_API_URL}/v3/members/${handle}/photoUploadUrl`, { param: { contentType: file.type } })
    .then(resp => resp.data.result.content)
    .then(data => ({
      preSignedURL: data.preSignedURL,
      token: data.token,
      file,
      userHandle: handle,
    }))
    .then(uploadFileToS3)
    .then(url => {
      return /^[^?]+/.exec(url)[0]
    })
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
  getProfileSettings,
  saveProfileSettings,
  uploadProfilePhoto,
  getSystemSettings,
  checkEmailValidity,
  updateSystemSettings,
  updatePassword,
  resetPassword,
}
