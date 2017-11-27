/**
 * Settings related actions
 */
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
  GET_NOTIFICATION_SETTINGS,
  SAVE_NOTIFICATION_SETTINGS_PENDING,
  SAVE_NOTIFICATION_SETTINGS_SUCCESS,
  SAVE_NOTIFICATION_SETTINGS_FAILURE
} from '../../../config/constants'
import settingsSerivce from '../services/settings'
import Alert from 'react-s-alert'

export const checkEmailAvailability = (email) => (dispatch) => {
  dispatch({
    type: CHECK_EMAIL_AVAILABILITY_PENDING,
    payload: { email }
  })

  settingsSerivce.checkEmailAvailability(email).then(isEmailAvailable => {
    dispatch({
      type: CHECK_EMAIL_AVAILABILITY_SUCCESS,
      payload: { email, isEmailAvailable }
    })
  }).catch(err => {
    dispatch({
      type: CHECK_EMAIL_AVAILABILITY_FAILURE,
      payload: { email, error: err.message }
    })
  })
}

export const changeEmail = (newEmail) => (dispatch) => {
  dispatch({
    type: CHANGE_EMAIL_PENDING
  })

  settingsSerivce.changeEmail(newEmail).then((changedEmail) => {
    Alert.success('Email successfully changed.')
    dispatch({
      type: CHANGE_EMAIL_SUCCESS,
      payload: { email: changedEmail }
    })
  }).catch(err => {
    Alert.error(`Failed to change email. ${err.message}`)
    dispatch({
      type: CHANGE_EMAIL_FAILURE
    })
  })
}

export const changePassword = (newPassword) => (dispatch) => {
  dispatch({
    type: CHANGE_PASSWORD_PENDING
  })

  settingsSerivce.changePassword(newPassword).then(() => {
    Alert.success('Password successfully changed.')
    dispatch({
      type: CHANGE_PASSWORD_SUCCESS
    })
  }).catch(err => {
    Alert.error(`Failed to change password. ${err.message}`)
    dispatch({
      type: CHANGE_PASSWORD_FAILURE
    })
  })
}

export const getNotificationSettings = () => (dispatch) => {
  settingsSerivce.getNotificationSettings().then(data => {
    dispatch({
      type: GET_NOTIFICATION_SETTINGS,
      payload: { data }
    })
  }).catch(err => {
    Alert.error(`Failed to get notification settings. ${err.message}`)
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
