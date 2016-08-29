
import {
  LOAD_PROJECT_PENDING, LOAD_PROJECT_SUCCESS, LOAD_PROJECT_FAILURE,
  CREATE_PROJECT, CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE, CLEAR_LOADED_PROJECT,
  UPDATE_PROJECT_PENDING, UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAILURE,
  ADD_PROJECT_ATTACHMENT_PENDING, ADD_PROJECT_ATTACHMENT_SUCCESS, ADD_PROJECT_ATTACHMENT_FAILURE,
  UPDATE_PROJECT_ATTACHMENT_PENDING, UPDATE_PROJECT_ATTACHMENT_SUCCESS, UPDATE_PROJECT_ATTACHMENT_FAILURE,
  REMOVE_PROJECT_ATTACHMENT_PENDING, REMOVE_PROJECT_ATTACHMENT_SUCCESS, REMOVE_PROJECT_ATTACHMENT_FAILURE,
  ADD_PROJECT_MEMBER_PENDING, ADD_PROJECT_MEMBER_SUCCESS, ADD_PROJECT_MEMBER_FAILURE,
  UPDATE_PROJECT_MEMBER_PENDING, UPDATE_PROJECT_MEMBER_SUCCESS, UPDATE_PROJECT_MEMBER_FAILURE,
  REMOVE_PROJECT_MEMBER_PENDING, REMOVE_PROJECT_MEMBER_SUCCESS, REMOVE_PROJECT_MEMBER_FAILURE
} from '../../config/constants'
import _ from 'lodash'
import update from 'react-addons-update'

const initialState = {
  isLoading: true,
  processing: false,
  processingMembers: false,
  error: false,
  project: {}
}

export const projectState = function (state=initialState, action) {

  switch (action.type) {
  case LOAD_PROJECT_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      project: {}
    })
  case LOAD_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      project: action.payload,
      lastUpdated: new Date()
    })

  case LOAD_PROJECT_FAILURE:
    return Object.assign({}, state, {
      pageLoaded: true,
      error: true
    })

  case CLEAR_LOADED_PROJECT:
    return Object.assign({}, state, {
      project: {}
    })

  case CREATE_PROJECT:
    return Object.assign({}, state, {
      isLoading: true
    })
  case CREATE_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      project: action.newProject,
      lastUpdated: new Date()
    })
  case CREATE_PROJECT_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      error: action.error
    })

  // Edit project
  case UPDATE_PROJECT_PENDING:
    return Object.assign({}, state, {
      processing: true
    })

  case UPDATE_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      processing: false,
      error: false,
      project: action.payload
    })
  case UPDATE_PROJECT_FAILURE:
    return Object.assign({}, state, {
      processing: false,
      error: action.error
    })

  // Project attachments
  case ADD_PROJECT_ATTACHMENT_PENDING:
    return Object.assign({}, state, {
      processing: true
    })

  case ADD_PROJECT_ATTACHMENT_SUCCESS:
    return Object.assign({}, state, {
      processing: false,
      project: update(state.project, {
        attachments: { $push: [action.payload] }
      })
    })
  case ADD_PROJECT_ATTACHMENT_FAILURE:
    return Object.assign({}, state, {
      processing: false,
      error: action.error
    })
  case UPDATE_PROJECT_ATTACHMENT_PENDING:
    return Object.assign({}, state, {
      processing: true
    })

  case UPDATE_PROJECT_ATTACHMENT_SUCCESS: {
    // get index
    const idx = _.findIndex(state.project.attachments, a => a.id === action.payload.id)
    return Object.assign({}, state, {
      processing: false,
      project: update(state.project, {attachments: {$splice : [[idx, 1, action.payload]]}})
    })
  }
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
    return Object.assign({}, state, {
      processing: false,
      error: action.error
    })
  case REMOVE_PROJECT_ATTACHMENT_PENDING:
    return Object.assign({}, state, {
      processing: true
    })

  case REMOVE_PROJECT_ATTACHMENT_SUCCESS: {
    // NOTE action.payload will contain id of the attachment
    // that was just removed
    const idx = _.findIndex(state.project.attachments, a => a.id === action.payload)
    return Object.assign({}, state, {
      processing: false,
      project: update(state.project, { attachments: { $splice: [[idx, 1]] } } )
    })
  }
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
    return Object.assign({}, state, {
      processing: false,
      error: action.error
    })

  case ADD_PROJECT_MEMBER_PENDING:
  case REMOVE_PROJECT_MEMBER_PENDING:
  case UPDATE_PROJECT_MEMBER_PENDING:
    return Object.assign({}, state, {
      processingMembers: true
    })

  case ADD_PROJECT_MEMBER_FAILURE:
  case REMOVE_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_MEMBER_FAILURE:
    return Object.assign({}, state, {
      processingMembers: false,
      error: { type: action.type, errObj: action.error }
    })

  case ADD_PROJECT_MEMBER_SUCCESS:
    return Object.assign({}, state, {
      processingMembers: false,
      project: update(state.project, {
        members: { $push: [action.payload] }
      })
    })

  case UPDATE_PROJECT_MEMBER_SUCCESS: {
    // get index
    const idx = _.findIndex(state.project.members, a => a.id === action.payload.id)
    // in case this member was marked as owner unset any other member that was owner
    const updatedMembers = _.cloneDeep(state.project.members)
    _.forEach(updatedMembers, m => {
      if (m.role === action.payload.role) m.isPrimary = false
    })
    updatedMembers.splice(idx, 1, action.payload)

    return Object.assign({}, state, {
      processing: false,
      project: update(state.project, { members: { $set: updatedMembers }})
    })
  }
  case REMOVE_PROJECT_MEMBER_SUCCESS: {
    // NOTE action.payload will contain memberId of the record just removed
    const idx = _.findIndex(state.project.members, a => a.id === action.payload)
    return Object.assign({}, state, {
      processing: false,
      project: update(state.project, { members: { $splice: [[idx, 1]] } } )
    })
  }
  default:
    return state
  }
}
