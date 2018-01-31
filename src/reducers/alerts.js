import _ from 'lodash'
import Alert from 'react-s-alert'
/* eslint-disable no-unused-vars */
import {
  // Project
  CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE,
  UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAILURE,
  DELETE_PROJECT_SUCCESS, DELETE_PROJECT_FAILURE,
  LOAD_PROJECT_SUCCESS,
  // Attachments
  ADD_PROJECT_ATTACHMENT_SUCCESS, ADD_PROJECT_ATTACHMENT_FAILURE,
  UPDATE_PROJECT_ATTACHMENT_SUCCESS, UPDATE_PROJECT_ATTACHMENT_FAILURE,
  REMOVE_PROJECT_ATTACHMENT_SUCCESS, REMOVE_PROJECT_ATTACHMENT_FAILURE,
  // project Members
  ADD_PROJECT_MEMBER_SUCCESS, ADD_PROJECT_MEMBER_FAILURE,
  UPDATE_PROJECT_MEMBER_SUCCESS, UPDATE_PROJECT_MEMBER_FAILURE,
  REMOVE_PROJECT_MEMBER_SUCCESS, REMOVE_PROJECT_MEMBER_FAILURE,
  // project feeds
  CREATE_PROJECT_FEED_FAILURE,
  CREATE_PROJECT_FEED_COMMENT_FAILURE,
  SAVE_PROJECT_FEED_FAILURE,
  SAVE_PROJECT_FEED_COMMENT_FAILURE,
  DELETE_PROJECT_FEED_FAILURE,
  DELETE_PROJECT_FEED_COMMENT_FAILURE,
  GET_PROJECT_FEED_COMMENT_FAILURE,
  // Project status
  PROJECT_STATUS_IN_REVIEW
} from '../config/constants'
/* eslint-enable no-unused-vars */

export default function(state = {}, action) {
  switch(action.type) {
  case CREATE_PROJECT_SUCCESS: {
    const name = _.truncate(action.payload.name, 20)

    //temporary workaround
    setTimeout(() => { Alert.success(`Project '${name}' created`) }, 0)

    return state
  }

  case DELETE_PROJECT_SUCCESS:
    Alert.success('Project deleted.')
    return state

  case LOAD_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      project: action.payload
    })

  case UPDATE_PROJECT_SUCCESS: {
    const prevStatus = _.get(state, 'project.status', '')
    if (action.payload.status === PROJECT_STATUS_IN_REVIEW
      && prevStatus && prevStatus !== PROJECT_STATUS_IN_REVIEW) {
      Alert.success('Project submitted.')
    } else {
      Alert.success('Project updated.')
    }
    return Object.assign({}, state, {
      project: action.payload
    })
  }

  case REMOVE_PROJECT_MEMBER_SUCCESS:
    // show notification message if user leaving a project
    if (action.meta.isUserLeaving) {
      Alert.success('You\'ve successfully left the project.')
    }
    return state

  case UPDATE_PROJECT_FAILURE:
    Alert.error('Please add a name for your project and then try saving again.')
    return state

  case CREATE_PROJECT_FAILURE:
  case DELETE_PROJECT_FAILURE:
  case ADD_PROJECT_ATTACHMENT_FAILURE:
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
  case ADD_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_MEMBER_FAILURE:
  case REMOVE_PROJECT_MEMBER_FAILURE:
  case CREATE_PROJECT_FEED_COMMENT_FAILURE:
  case SAVE_PROJECT_FEED_COMMENT_FAILURE:
  case DELETE_PROJECT_FEED_COMMENT_FAILURE:
  case GET_PROJECT_FEED_COMMENT_FAILURE:
  case CREATE_PROJECT_FEED_FAILURE:
  case SAVE_PROJECT_FEED_FAILURE:
  case DELETE_PROJECT_FEED_FAILURE:
    if (action.payload && action.payload.response) {
      const rdata = action.payload.response.data
      if (rdata && rdata.result && rdata.result.content && rdata.result.content.message) {
        Alert.error(rdata.result.content.message)
        return state
      }
      if (action.payload.response.statusText) {
        Alert.error(action.payload.response.statusText)
        return state
      }
    }
    Alert.error('Whoops! we ran into a problem.<br/> Please try again later.')
    return state
  default:
    return state
  }
}
