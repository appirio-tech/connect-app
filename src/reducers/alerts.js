import _ from 'lodash'
import Alert from 'react-s-alert'
/* eslint-disable no-unused-vars */
import {
  // billing account
  LOAD_PROJECT_BILLING_ACCOUNT_SUCCESS,
  // bulk phase and milestones
  CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_SUCCESS,
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
  CREATE_TOPIC_POST_FAILURE,
  UPDATE_TOPIC_POST_FAILURE,
  DELETE_TOPIC_POST_FAILURE,
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
  CREATE_TIMELINE_MILESTONE_SUCCESS,
  CREATE_TIMELINE_MILESTONE_FAILURE,
  // Scope changes
  CREATE_SCOPE_CHANGE_REQUEST_SUCCESS,
  CREATE_SCOPE_CHANGE_REQUEST_FAILURE,
  APPROVE_SCOPE_CHANGE_SUCCESS,
  REJECT_SCOPE_CHANGE_SUCCESS,
  CANCEL_SCOPE_CHANGE_SUCCESS,
  ACTIVATE_SCOPE_CHANGE_SUCCESS,
  APPROVE_SCOPE_CHANGE_FAILURE,
  REJECT_SCOPE_CHANGE_FAILURE,
  CANCEL_SCOPE_CHANGE_FAILURE,
  ACTIVATE_SCOPE_CHANGE_FAILURE,
  CREATE_PROJECT_PHASE_SUCCESS,
  CUSTOMER_APPROVE_MILESTONE_SUCCESS,
  CUSTOMER_APPROVE_MILESTONE_FAILURE,
  CUSTOMER_APPROVE_MILESTONE_APPROVE_SUCCESS,
  CUSTOMER_APPROVE_MILESTONE_REJECT_SUCCESS,
  CUSTOMER_APPROVE_MILESTONE_APPROVE_FAILURE,
  CUSTOMER_APPROVE_MILESTONE_REJECT_FAILURE,
  DELETE_BULK_PROJECT_PHASE_SUCCESS
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

  case CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_SUCCESS:
  case CREATE_PROJECT_PHASE_SUCCESS: {
    if (state.project.version === 'v4') {
      Alert.success('Project milestone created.')
    } else {
      Alert.success('Project phase created.')
    }
    return state
  }

  case DELETE_PROJECT_PHASE_SUCCESS: {
    if (state.project.version === 'v4') {
      Alert.success('Project milestone deleted.')
    } else {
      Alert.success('Project phase deleted.')
    }

    return state
  }

  case DELETE_BULK_PROJECT_PHASE_SUCCESS: {
    if (state.project.version === 'v4') {
      Alert.success('Project milestones deleted.')
    } else {
      Alert.success('Project phases deleted.')
    }

    return state
  }

  case DELETE_PROJECT_SUCCESS:
    Alert.success('Project deleted.')
    return state

  case CREATE_TIMELINE_MILESTONE_SUCCESS:
    Alert.success('Milestone created.')
    return state

  case CREATE_TIMELINE_MILESTONE_FAILURE:
    Alert.error('Unable to create milestone')
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

  case CREATE_SCOPE_CHANGE_REQUEST_SUCCESS:
    Alert.success('Submitted the Change Request successfully')
    return state

  case CREATE_SCOPE_CHANGE_REQUEST_FAILURE:
    Alert.error('Unable to submit the Change Request')
    return state

  case APPROVE_SCOPE_CHANGE_SUCCESS:
    Alert.success('Approved the Scope Change successfully')
    return state

  case APPROVE_SCOPE_CHANGE_FAILURE:
    Alert.error('Unable to Approve the Scope Change')
    return state

  case REJECT_SCOPE_CHANGE_SUCCESS:
    Alert.success('Rejected the Scope Change successfully')
    return state

  case REJECT_SCOPE_CHANGE_FAILURE:
    Alert.error('Unable to Reject the Scope Change')
    return state

  case CANCEL_SCOPE_CHANGE_SUCCESS:
    Alert.success('Canceled the Scope Change successfully')
    return state

  case CANCEL_SCOPE_CHANGE_FAILURE:
    Alert.error('Unable to Cancel the Scope Change')
    return state
  case LOAD_PROJECT_BILLING_ACCOUNT_SUCCESS:
    if (!action.payload.data.active) {
      Alert.error('The billing account of this project is expired, please update it.')
    }
    return state

  case ACTIVATE_SCOPE_CHANGE_SUCCESS:
    Alert.success('Activated the Scope Change successfully')
    return state

  case ACTIVATE_SCOPE_CHANGE_FAILURE:
    Alert.error('Unable to Activate the Scope Change')
    return state

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
    Alert.success('Updated attachment successfully')
    return state
  case REMOVE_PROJECT_ATTACHMENT_SUCCESS:
    Alert.success('Removed attachment successfully')
    return state

  case INVITE_TOPCODER_MEMBER_SUCCESS:
  case INVITE_CUSTOMER_SUCCESS:
    if(action.payload.success.length && !action.payload.failed) {
      Alert.success('You\'ve successfully invited member(s).')
    } else if (action.payload.success.length && action.payload.failed) {
      Alert.warning('Some members couldn\'t be invited.')
    } else if (!action.payload.success.length && action.payload.failed) {
      Alert.error('You are unable to invite members successfully.')
    }
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

  case UPDATE_PROJECT_MEMBER_SUCCESS:
    Alert.success('Member updated successfully.')
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

  case UPDATE_PROJECT_FAILURE: {
    const data = _.get(action.payload, 'response.data.result')
    let message = _.get(data, 'content.message', 'Unable to update project')
    message = _.get(data, 'details', message)
    Alert.error(message)
    return state
  }
  case CUSTOMER_APPROVE_MILESTONE_SUCCESS:
    Alert.success('Approved or Rejected Milestones successfully.')
    return state

  case CUSTOMER_APPROVE_MILESTONE_APPROVE_SUCCESS:
    Alert.success('Approved Milestones successfully.')
    return state
  
  case CUSTOMER_APPROVE_MILESTONE_REJECT_SUCCESS:
    Alert.success('Rejected Milestones successfully.')
    return state

  case CUSTOMER_APPROVE_MILESTONE_APPROVE_FAILURE:
    Alert.success('Unable to Approve Milestone.')
    return state
  
  case CUSTOMER_APPROVE_MILESTONE_REJECT_FAILURE:
    Alert.success('Unable to Reject Milestone.')
    return state

  case CUSTOMER_APPROVE_MILESTONE_FAILURE:
    Alert.error('Unable to Approve Milestone.')
    return state

  case CREATE_PROJECT_FAILURE:
  case DELETE_PROJECT_FAILURE:
  case ADD_PROJECT_ATTACHMENT_FAILURE:
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
  case ADD_PROJECT_MEMBER_FAILURE:
  case REMOVE_PROJECT_MEMBER_FAILURE:
  case CREATE_PROJECT_FEED_COMMENT_FAILURE:
  case SAVE_PROJECT_FEED_COMMENT_FAILURE:
  case DELETE_PROJECT_FEED_COMMENT_FAILURE:
  case GET_PROJECT_FEED_COMMENT_FAILURE:
  case CREATE_PROJECT_FEED_FAILURE:
  case SAVE_PROJECT_FEED_FAILURE:
  case DELETE_PROJECT_FEED_FAILURE:
  case CREATE_TOPIC_POST_FAILURE:
  case UPDATE_TOPIC_POST_FAILURE:
  case DELETE_TOPIC_POST_FAILURE:
  case UPDATE_PHASE_FAILURE:
  case LOAD_PRODUCT_TIMELINE_WITH_MILESTONES_FAILURE:
  case UPDATE_PRODUCT_TIMELINE_FAILURE:
  case UPDATE_PRODUCT_MILESTONE_FAILURE:
  case COMPLETE_PRODUCT_MILESTONE_FAILURE:
  case EXTEND_PRODUCT_MILESTONE_FAILURE:
  case SUBMIT_FINAL_FIXES_REQUEST_FAILURE:
  case ACCEPT_OR_REFUSE_INVITE_FAILURE:
  case UPDATE_PROJECT_MEMBER_FAILURE:
    if (action.payload && action.payload.response) {
      const rdata = action.payload.response.data
      if (rdata && rdata.result && rdata.result.content && rdata.result.content.message) {
        Alert.error(rdata.result.content.message)
        return state
      }
      if (rdata && rdata.message) {
        Alert.error(rdata.message)
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
