/**
 * Settings related actions
 */
import _ from 'lodash'
import {
  CHECK_EMAIL_AVAILABILITY_PENDING,
  CHECK_EMAIL_AVAILABILITY_SUCCESS,
  CHECK_EMAIL_AVAILABILITY_FAILURE,
  CHANGE_EMAIL_PENDING,
  CHANGE_EMAIL_SUCCESS,
  CHANGE_EMAIL_FAILURE,
  CHANGE_PASSWORD_PENDING,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  GET_NOTIFICATION_SETTINGS_PENDING,
  GET_NOTIFICATION_SETTINGS_SUCCESS,
  GET_NOTIFICATION_SETTINGS_FAILURE,
  SAVE_NOTIFICATION_SETTINGS_PENDING,
  SAVE_NOTIFICATION_SETTINGS_SUCCESS,
  SAVE_NOTIFICATION_SETTINGS_FAILURE,
  GET_PROFILE_SETTINGS_PENDING,
  GET_PROFILE_SETTINGS_SUCCESS,
  GET_PROFILE_SETTINGS_FAILURE,
  SAVE_PROFILE_SETTINGS_PENDING,
  SAVE_PROFILE_SETTINGS_SUCCESS,
  SAVE_PROFILE_SETTINGS_FAILURE,
  SAVE_PROFILE_PHOTO_PENDING,
  SAVE_PROFILE_PHOTO_SUCCESS,
  SAVE_PROFILE_PHOTO_FAILURE,
  GET_SYSTEM_SETTINGS_PENDING,
  GET_SYSTEM_SETTINGS_SUCCESS,
  RESET_PASSWORD_PENDING,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from '../../../config/constants'
import settingsSerivce from '../services/settings'
import Alert from 'react-s-alert'

export const getSystemSettings = () => (dispatch, getState) => {
  dispatch({
    type: GET_SYSTEM_SETTINGS_PENDING
  })
  const state = getState()
  const handle = _.get(state, 'loadUser.user.handle')
  settingsSerivce.getSystemSettings(handle)
    .then(data => {
      dispatch({
        type: GET_SYSTEM_SETTINGS_SUCCESS,
        payload: { data }
      })
    })
}

export const checkEmailAvailability = (email) => (dispatch) => {
  dispatch({
    type: CHECK_EMAIL_AVAILABILITY_PENDING,
    payload: { email }
  })
  settingsSerivce.checkEmailValidity(email)
    .then(data => {
      const isEmailAvailable = _.get(data, 'result.content.valid')
      dispatch({
        type: CHECK_EMAIL_AVAILABILITY_SUCCESS,
        payload: {email, isEmailAvailable}
      })
    })
    .catch(err => {
      dispatch({
        type: CHECK_EMAIL_AVAILABILITY_FAILURE,
        payload: {error: err.message}
      })
    })
}

export const changeEmail = (email) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_EMAIL_PENDING
  })
  const state = getState()
  const handle = _.get(state, 'loadUser.user.handle')
  const profile = _.get(state, 'settings.system.settings')
  const newProfile = {...profile,
    email,
  }
  settingsSerivce.updateSystemSettings(handle, newProfile)
    .then(data => {
      const profile = _.get(data, 'result.content')
      dispatch({
        type: CHANGE_EMAIL_SUCCESS,
        payload: { data: profile }
      })
    })
    .catch(err => {
      Alert.error(`Failed to update email: ${err.message}`)
      dispatch({
        type: CHANGE_EMAIL_FAILURE,
      })
    })
}

export const changePassword = (credential) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_PASSWORD_PENDING
  })
  const state = getState()
  const userId = _.get(state, 'settings.system.settings.userId')
  settingsSerivce.updatePassword(credential, userId)
    .then(() => {
      Alert.success('Password changed successfully')
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS
      })
    })
    .catch(err => {
      const msg = _.get(err, 'response.data.result.content') || err.message
      Alert.error(`Failed to update password: ${msg}`)
      dispatch({
        type: CHANGE_PASSWORD_FAILURE
      })
    })
}

export const resetPassword = () => (dispatch, getState) => {
  dispatch({
    type: RESET_PASSWORD_PENDING
  })
  const state = getState()
  const email = _.get(state, 'settings.system.settings.email')
  settingsSerivce.resetPassword(email)
    .then(() => {
      dispatch({
        type: RESET_PASSWORD_SUCCESS
      })
    })
    .catch(err => {
      const message = _.get(err, 'response.data.result.content') || err.message
      Alert.error(`Failed to reset password: ${message}`)
      dispatch({
        type: RESET_PASSWORD_FAILURE
      })
    })
}

export const getNotificationSettings = () => (dispatch) => {
  dispatch({
    type: GET_NOTIFICATION_SETTINGS_PENDING
  })

  settingsSerivce.getNotificationSettings().then(data => {
    dispatch({
      type: GET_NOTIFICATION_SETTINGS_SUCCESS,
      payload: { data }
    })
  }).catch(err => {
    Alert.error(`Failed to get notification settings. ${err.message}`)
    dispatch({
      type: GET_NOTIFICATION_SETTINGS_FAILURE
    })
  })
}

export const saveNotificationSettings = (data) => (dispatch) => {
  dispatch({
    type: SAVE_NOTIFICATION_SETTINGS_PENDING
  })

  settingsSerivce.saveNotificationSettings(data).then(() => {
    Alert.success('Settings successfully saved.')
    dispatch({
      type: SAVE_NOTIFICATION_SETTINGS_SUCCESS,
      payload: { data }
    })
  }).catch(err => {
    Alert.error(`Failed to save settings. ${err.message}`)
    dispatch({
      type: SAVE_NOTIFICATION_SETTINGS_FAILURE,
      payload: { data }
    })
  })
}

export const saveProfileSettings = (settings) => (dispatch, getState) => {
  dispatch({
    type: SAVE_PROFILE_SETTINGS_PENDING
  })
  const state = getState()
  const handle = _.get(state, 'loadUser.user.handle')
  settingsSerivce.saveProfileSettings(handle, settings).then(data => {
    Alert.success('Settings successfully saved.')
    dispatch({
      type: SAVE_PROFILE_SETTINGS_SUCCESS,
      payload: { data }
    })
  }).catch((err) => {
    Alert.error(`Failed to save settings. ${err.message}`)
    dispatch({
      type: SAVE_PROFILE_SETTINGS_FAILURE
    })
  })
}

export const getProfileSettings = () => (dispatch, getState) => {
  dispatch({
    type: GET_PROFILE_SETTINGS_PENDING
  })
  const state = getState()
  const handle = _.get(state, 'loadUser.user.handle')
  settingsSerivce.getProfileSettings(handle).then(data => {
    dispatch({
      type: GET_PROFILE_SETTINGS_SUCCESS,
      payload: { data }
    })
  }).catch((err) => {
    Alert.error(`Failed to get settings. ${err.message}`)
    dispatch({
      type: GET_PROFILE_SETTINGS_FAILURE,
    })
  })
}

export const uploadProfilePhoto = (file) => (dispatch, getState) => {
  dispatch({
    type: SAVE_PROFILE_PHOTO_PENDING
  })
  const state = getState()
  const handle = _.get(state, 'loadUser.user.handle')
  settingsSerivce.uploadProfilePhoto(handle, file)
    .then(photoUrl => {
      const settings = _.get(state, 'settings.profile.settings')
      const newSettings = {...settings,
        photoUrl
      }
      return settingsSerivce.saveProfileSettings(handle, newSettings)
    }).then(data => {
      Alert.success('Profile photo uploaded successfully')
      dispatch({
        type: SAVE_PROFILE_PHOTO_SUCCESS,
        payload: { data }
      })
    }).catch(err => {
      Alert.error(`Failed to upload photo. ${err.message}`)
      dispatch({
        type: SAVE_PROFILE_PHOTO_FAILURE,
      })
    })
}
