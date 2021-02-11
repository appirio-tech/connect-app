import _ from 'lodash'
import {
  ACCOUNTS_APP_CONNECTOR_URL,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_ORG_CONFIG_SUCCESS,
  LOAD_ORG_CONFIG_FAILURE,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_COPILOT,
  ROLE_TOPCODER_USER,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_ADMIN,
  ROLE_ACCOUNT_EXECUTIVE,
  ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
  ROLE_PROGRAM_MANAGER,
  ROLE_PRESALES, ROLE_PROJECT_MANAGER, ROLE_SOLUTION_ARCHITECT
} from '../config/constants'
import { getFreshToken, configureConnector, decodeToken } from 'tc-auth-lib'
import { getUserProfile } from '../api/users'
import { fetchGroups } from '../api/groups'
import { getOrgConfig } from '../api/orgConfig'
import { EventTypes } from 'redux-segment'

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
      .catch((err) => {
        console.log(err)
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
  // uncomment to add admin role to the user for testing admin functionality locally
  // currentUser.roles.push('administrator')
  if (currentUser) {
    getUserProfile(currentUser.handle).then((profile) => {
      currentUser = _.assign(currentUser, profile)
      // determine user role
      let userRole
      if (_.indexOf(currentUser.roles, ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE) > -1) {
        userRole = ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE
      } else if (_.indexOf(currentUser.roles, ROLE_PRESALES) > -1) {
        userRole = ROLE_PRESALES
      } else if (_.indexOf(currentUser.roles, ROLE_ACCOUNT_EXECUTIVE) > -1) {
        userRole = ROLE_ACCOUNT_EXECUTIVE
      } else if (_.indexOf(currentUser.roles, ROLE_PROGRAM_MANAGER) > -1) {
        userRole = ROLE_PROGRAM_MANAGER
      } else if (_.indexOf(currentUser.roles, ROLE_PROJECT_MANAGER) > -1) {
        userRole = ROLE_PROJECT_MANAGER
      } else if (_.indexOf(currentUser.roles, ROLE_SOLUTION_ARCHITECT) > -1) {
        userRole = ROLE_SOLUTION_ARCHITECT
      } else if (_.indexOf(currentUser.roles, ROLE_ADMINISTRATOR) > -1) {
        userRole = ROLE_ADMINISTRATOR
      } else if (_.indexOf(currentUser.roles, ROLE_CONNECT_ADMIN) > -1) {
        userRole = ROLE_CONNECT_ADMIN
      } else if (_.indexOf(currentUser.roles, ROLE_CONNECT_MANAGER) > -1) {
        userRole = ROLE_CONNECT_MANAGER
      } else if (_.indexOf(currentUser.roles, ROLE_CONNECT_COPILOT) > -1) {
        userRole = ROLE_CONNECT_COPILOT
      } else {
        userRole = ROLE_TOPCODER_USER
      }


      const analyticsEvents = [{
        eventType: EventTypes.identify,
        eventPayload: {
          userId: currentUser.id,
          traits: {
            id: currentUser.id,
            role: userRole,
            username: currentUser.handle,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            createdAt: currentUser.createdAt,
            avatar: currentUser.photoURL
          }
        }
      }]
      if (window.analytics && window.analytics.user && window.analytics.user()) {
        const anonymousId = window.analytics.user().anonymousId()
        if (anonymousId) {
          analyticsEvents.push({
            eventType: EventTypes.alias,
            eventPayload: {
              userId: currentUser.id,
              previousId: anonymousId
            }
          })
        }
      }
      dispatch({
        type: LOAD_USER_SUCCESS,
        user : currentUser,
        meta: {
          analytics: analyticsEvents
        }
      })

      loadGroups(dispatch, currentUser.userId)
    })
      .catch((err) => {
      // if we fail to load user's profile, still dispatch user load success
      // ideally it shouldn't happen, but if it is, we can render the page
      // without profile information
        console.log(err)
        dispatch({ type: LOAD_USER_SUCCESS, user : currentUser })
      })
  }
}

export function loadUserFailure(dispatch) {
  dispatch({ type: LOAD_USER_FAILURE })
}


/**
 * Load groups for the user.
 *
 * @param {Object} dispatch        dispatch
 * @param {Number} userId          user id
 */
function loadGroups(dispatch, userId) {
  if (userId) {
    fetchGroups({
      memberId: userId,
      membershipType: 'user'
    }).then((groups) => {
      const groupIds = _.compact(_.uniq([
        // get old and new ids as organizations may refer to any of them
        ..._.map(groups, 'oldId'),
        ..._.map(groups, 'id')
      ]))
      if (groupIds.length > 0) {
        loadOrganizationConfigSuccess(dispatch, _.join(groupIds, ','))
      }
    })
      .catch((err) => {
      // if we fail to load groups
        console.log(err)
      })
  }
}

/**
 * Load organization configurations for the groups.
 *
 * @param {Object} dispatch        dispatch
 * @param {String} groupIds        group ids
 */
function loadOrganizationConfigSuccess(dispatch, groupIds) {
  getOrgConfig(groupIds)
    .then((orgConfigs) => {
      dispatch({
        type: LOAD_ORG_CONFIG_SUCCESS,
        orgConfig : orgConfigs
      })
    })
    .catch((err) => {
      // if we fail to load organization configs
      console.log(err)
      dispatch({ type: LOAD_ORG_CONFIG_FAILURE })
    })
}
