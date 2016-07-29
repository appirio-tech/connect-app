// import _ from 'lodash'
// import { fetchJSON } from '../helpers'
import { ACCOUNTS_APP_CONNECTOR_URL, LOAD_USER_SUCCESS, LOAD_USER_FAILURE } from '../config/constants'
import { getFreshToken, configureConnector, decodeToken } from 'tc-accounts'

configureConnector({
  connectorUrl: ACCOUNTS_APP_CONNECTOR_URL,
  frameId: 'tc-accounts-iframe'
})

export function loadUser() {
  return ((dispatch, getState) => {
    const state = getState()
    const user = state.user

    if (user) {
      dispatch({ type: LOAD_USER_SUCCESS, user })
    }

    return getFreshToken()
      .then((token) => {
        return loadUserSuccess(dispatch, token)
      })
      .catch(() => {
        return loadUserFailure(dispatch)
      })

  })
}
export function loadUserSuccess(dispatch, token) {
  const decodedToken = decodeToken( token )
  let currentUser = null
  if (decodedToken.userId) {
    currentUser = decodedToken
    currentUser.id = currentUser.userId
    currentUser.token = token
  }

  dispatch({ type: LOAD_USER_SUCCESS, user : currentUser })
}

export function loadUserFailure(dispatch) {
  dispatch({ type: LOAD_USER_FAILURE })
}
