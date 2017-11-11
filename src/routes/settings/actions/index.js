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
  CHANGE_PASSWORD_FAILURE
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
