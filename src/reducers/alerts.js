import _ from 'lodash'
import Alert from 'react-s-alert'
/* eslint-disable no-unused-vars */
import {
  // Project
  CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE,
  UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAILURE,
  DELETE_PROJECT_SUCCESS, DELETE_PROJECT_FAILURE,
  // Attachments
  ADD_PROJECT_ATTACHMENT_SUCCESS, ADD_PROJECT_ATTACHMENT_FAILURE,
  UPDATE_PROJECT_ATTACHMENT_SUCCESS, UPDATE_PROJECT_ATTACHMENT_FAILURE,
  REMOVE_PROJECT_ATTACHMENT_SUCCESS, REMOVE_PROJECT_ATTACHMENT_FAILURE,
  // project Members
  ADD_PROJECT_MEMBER_SUCCESS, ADD_PROJECT_MEMBER_FAILURE,
  UPDATE_PROJECT_MEMBER_SUCCESS, UPDATE_PROJECT_MEMBER_FAILURE,
  REMOVE_PROJECT_MEMBER_SUCCESS, REMOVE_PROJECT_MEMBER_FAILURE
} from '../config/constants'
/* eslint-enable no-unused-vars */

export default function(state = {}, action) {
  switch(action.type) {
  case CREATE_PROJECT_SUCCESS: {
    const name = _.truncate(action.payload.name, 20)
    Alert.success(`Project '${name}' created`)
    return state
  }

  case DELETE_PROJECT_SUCCESS:
    Alert.success('Project deleted.')
    return state

  case UPDATE_PROJECT_SUCCESS:
    Alert.success('Project updated.')
    return state
  case REMOVE_PROJECT_MEMBER_SUCCESS:
    // show notification message if user leaving a project
    if (action.meta.isUserLeaving) {
      Alert.success('You\'ve successfully left the project.')
    }
    return state

  case CREATE_PROJECT_FAILURE:
  case UPDATE_PROJECT_FAILURE:
  case DELETE_PROJECT_FAILURE:
  case ADD_PROJECT_ATTACHMENT_FAILURE:
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
  case ADD_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_MEMBER_FAILURE:
  case REMOVE_PROJECT_MEMBER_FAILURE:
    Alert.error('Whoops! we ran into a problem.<br/> Please try again later.')
    return state
  default:
    return state
  }
}
