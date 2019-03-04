import _ from 'lodash'
import Alert from 'react-s-alert'
/* eslint-disable no-unused-vars */
import {
  // Project
  CREATE_PROJECT_STAGE_SUCCESS,
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
  // invite topcoder Team
  INVITE_TOPCODER_MEMBER_FAILURE, INVITE_TOPCODER_MEMBER_SUCCESS,
  REMOVE_TOPCODER_MEMBER_INVITE_FAILURE, REMOVE_TOPCODER_MEMBER_INVITE_SUCCESS,
  // invite customer
  INVITE_CUSTOMER_FAILURE, INVITE_CUSTOMER_SUCCESS,
  REMOVE_CUSTOMER_INVITE_FAILURE, REMOVE_CUSTOMER_INVITE_SUCCESS,
  // accepted or refused invite
  ACCEPT_OR_REFUSE_INVITE_SUCCESS, ACCEPT_OR_REFUSE_INVITE_FAILURE,
  PROJECT_MEMBER_INVITE_STATUS_ACCEPTED, PROJECT_MEMBER_INVITE_STATUS_REFUSED,
  PROJECT_MEMBER_INVITE_STATUS_REQUEST_APPROVED, PROJECT_MEMBER_INVITE_STATUS_REQUEST_REJECTED,
  // project feeds
  CREATE_PROJECT_FEED_FAILURE,
  CREATE_PROJECT_FEED_COMMENT_FAILURE,
  SAVE_PROJECT_FEED_FAILURE,
  SAVE_PROJECT_FEED_COMMENT_FAILURE,
  DELETE_PROJECT_FEED_FAILURE,
  DELETE_PROJECT_FEED_COMMENT_FAILURE,
  GET_PROJECT_FEED_COMMENT_FAILURE,
  // Project status
  PROJECT_STATUS_IN_REVIEW,
  // phase comments
  CREATE_PHASE_FEED_COMMENT_FAILURE,
  SAVE_PHASE_FEED_COMMENT_FAILURE,
  DELETE_PHASE_FEED_COMMENT_FAILURE,
  // products
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PHASE_FAILURE,
  DELETE_PROJECT_PHASE_SUCCESS,
  // timelines
  UPDATE_PRODUCT_TIMELINE_FAILURE,
  LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_FAILURE,
  // milestones
  UPDATE_PRODUCT_MILESTONE_FAILURE,
  COMPLETE_PRODUCT_MILESTONE_FAILURE,
  COMPLETE_PRODUCT_MILESTONE_SUCCESS,
  EXTEND_PRODUCT_MILESTONE_FAILURE,
  EXTEND_PRODUCT_MILESTONE_SUCCESS,
  SUBMIT_FINAL_FIXES_REQUEST_FAILURE,
  SUBMIT_FINAL_FIXES_REQUEST_SUCCESS,
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

  case CREATE_PROJECT_STAGE_SUCCESS: {
    const name = _.truncate(action.payload.name, 20)

    //delay time for reload stage list of project after creating state
    setTimeout(() => { Alert.success(`Added New Stage To Project '${name}'`) }, 2000)

    return state
  }

  case DELETE_PROJECT_PHASE_SUCCESS: {
    Alert.success('Project phase deleted.')

    return state
  }

  case DELETE_PROJECT_SUCCESS:
    Alert.success('Project deleted.')
    return state

  case COMPLETE_PRODUCT_MILESTONE_SUCCESS:
    Alert.success('Milestone is completed.')
    return state

  case EXTEND_PRODUCT_MILESTONE_SUCCESS:
    Alert.success('Milestone is extended.')
    return state

  case SUBMIT_FINAL_FIXES_REQUEST_SUCCESS:
    Alert.success('Final fixes are submitted.')
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

  case UPDATE_PRODUCT_SUCCESS:
    Alert.success('Product updated')
    return state

  case REMOVE_PROJECT_MEMBER_SUCCESS:
    // show notification message if user leaving a project
    if (action.meta.isUserLeaving) {
      Alert.success('You\'ve successfully left the project.')
    }
    return state

  case ADD_PROJECT_ATTACHMENT_SUCCESS:
    Alert.success('Added attachment to the project successfully')
    return state
  
  case UPDATE_PROJECT_ATTACHMENT_SUCCESS:
    Alert.success('Updated attachment succcessfully')
    return state
  case REMOVE_PROJECT_ATTACHMENT_SUCCESS:
    Alert.success('Removed attachment successfully')
    return state

  case INVITE_TOPCODER_MEMBER_SUCCESS:
  case INVITE_CUSTOMER_SUCCESS:
    Alert.success('You\'ve successfully invited member(s).')
    return state

  case REMOVE_TOPCODER_MEMBER_INVITE_SUCCESS:
  case REMOVE_CUSTOMER_INVITE_SUCCESS:
    Alert.success('You have successfully remove member invitation.')
    return state

  case REMOVE_TOPCODER_MEMBER_INVITE_FAILURE:
  case REMOVE_CUSTOMER_INVITE_FAILURE:
    Alert.error('You are unable to remove member invitations.')
    return state

  case INVITE_TOPCODER_MEMBER_FAILURE:
  case INVITE_CUSTOMER_FAILURE:
    Alert.error('You are unable to invite members successfully.')
    return state

  case ACCEPT_OR_REFUSE_INVITE_SUCCESS:
    if (action.payload.status===PROJECT_MEMBER_INVITE_STATUS_ACCEPTED){
      Alert.success('You\'ve successfully joined the project.')
    } else if (action.payload.status===PROJECT_MEMBER_INVITE_STATUS_REFUSED){
      Alert.success('You\'ve refused to join the project.')
    } else if (action.payload.status===PROJECT_MEMBER_INVITE_STATUS_REQUEST_APPROVED){
      Alert.success('You\'ve approved copilot invitation request.')
    } else if (action.payload.status===PROJECT_MEMBER_INVITE_STATUS_REQUEST_REJECTED){
      Alert.success('You\'ve rejected copilot invitation request.')
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
  case CREATE_PHASE_FEED_COMMENT_FAILURE:
  case SAVE_PHASE_FEED_COMMENT_FAILURE:
  case DELETE_PHASE_FEED_COMMENT_FAILURE:
  case UPDATE_PHASE_FAILURE:
  case LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_FAILURE:
  case UPDATE_PRODUCT_TIMELINE_FAILURE:
  case UPDATE_PRODUCT_MILESTONE_FAILURE:
  case COMPLETE_PRODUCT_MILESTONE_FAILURE:
  case EXTEND_PRODUCT_MILESTONE_FAILURE:
  case SUBMIT_FINAL_FIXES_REQUEST_FAILURE:
  case ACCEPT_OR_REFUSE_INVITE_FAILURE:
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
