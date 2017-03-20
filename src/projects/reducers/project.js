import { unflatten } from 'flat'
import {
  LOAD_PROJECT_PENDING, LOAD_PROJECT_SUCCESS, LOAD_PROJECT_FAILURE, LOAD_DIRECT_PROJECT_SUCCESS,
  CREATE_PROJECT_PENDING, CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE, CLEAR_LOADED_PROJECT,
  UPDATE_PROJECT_PENDING, UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAILURE,
  DELETE_PROJECT_PENDING, DELETE_PROJECT_SUCCESS, DELETE_PROJECT_FAILURE,
  ADD_PROJECT_ATTACHMENT_PENDING, ADD_PROJECT_ATTACHMENT_SUCCESS, ADD_PROJECT_ATTACHMENT_FAILURE,
  UPDATE_PROJECT_ATTACHMENT_PENDING, UPDATE_PROJECT_ATTACHMENT_SUCCESS, UPDATE_PROJECT_ATTACHMENT_FAILURE,
  REMOVE_PROJECT_ATTACHMENT_PENDING, REMOVE_PROJECT_ATTACHMENT_SUCCESS, REMOVE_PROJECT_ATTACHMENT_FAILURE,
  ADD_PROJECT_MEMBER_PENDING, ADD_PROJECT_MEMBER_SUCCESS, ADD_PROJECT_MEMBER_FAILURE,
  UPDATE_PROJECT_MEMBER_PENDING, UPDATE_PROJECT_MEMBER_SUCCESS, UPDATE_PROJECT_MEMBER_FAILURE,
  REMOVE_PROJECT_MEMBER_PENDING, REMOVE_PROJECT_MEMBER_SUCCESS, REMOVE_PROJECT_MEMBER_FAILURE,
  GET_PROJECTS_SUCCESS, PROJECT_DIRTY, PROJECT_DIRTY_UNDO
} from '../../config/constants'
import _ from 'lodash'
import update from 'react-addons-update'

const initialState = {
  isLoading: true,
  processing: false,
  processingMembers: false,
  processingAttachments: false,
  error: false,
  project: {}
}

const parseErrorObj = (action) => {
  const data = action.payload.response.data.result
  return {
    type: action.type,
    code: data.status,
    msg: _.get(data, 'content.message', ''),
    details: JSON.parse(_.get(data, 'details', null))
  }
}

export const projectState = function (state=initialState, action) {

  switch (action.type) {
  case LOAD_PROJECT_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      project: null
    })

  case LOAD_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      project: action.payload,
      projectNonDirty: _.cloneDeep(action.payload),
      lastUpdated: new Date()
    })

  case CLEAR_LOADED_PROJECT:
  case GET_PROJECTS_SUCCESS:
    return Object.assign({}, state, {
      project: {}
    })

  case LOAD_DIRECT_PROJECT_SUCCESS:
    return update(state, {
      project: {
        budget: { $set: {
          actualCost: action.payload.actualCost,
          projectedCost: action.payload.projectedCost,
          totalBudget: action.payload.totalBudget
        }},
        duration: { $set: {
          actualDuration: action.payload.actualDuration,
          plannedDuration: action.payload.plannedDuration,
          projectedDuration: action.payload.projectedDuration
        }}
      }
    })

  // Create & Edit project
  case CREATE_PROJECT_PENDING:
  case DELETE_PROJECT_PENDING:
  case UPDATE_PROJECT_PENDING:
    return Object.assign({}, state, {
      isLoading: false,
      processing: true,
      error: false
    })

  case CREATE_PROJECT_SUCCESS:
  case UPDATE_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      processing: false,
      error: false,
      project: action.payload,
      projectNonDirty: _.cloneDeep(action.payload)
    })

  case DELETE_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      processing: false,
      error: false,
      project: {}
    })

  // Project attachments
  case ADD_PROJECT_ATTACHMENT_PENDING:
  case UPDATE_PROJECT_ATTACHMENT_PENDING:
  case REMOVE_PROJECT_ATTACHMENT_PENDING:
    return Object.assign({}, state, {
      processingAttachments: true
    })

  case ADD_PROJECT_ATTACHMENT_SUCCESS:
    return update(state, {
      processingAttachments: { $set : false },
      project: { attachments: { $push: [action.payload] } }
    })

  case UPDATE_PROJECT_ATTACHMENT_SUCCESS: {
    // get index
    const idx = _.findIndex(state.project.attachments, a => a.id === action.payload.id)
    return update(state, {
      processingAttachments: { $set : false },
      project: { attachments: { $splice : [[idx, 1, action.payload]] } }
    })
  }

  case REMOVE_PROJECT_ATTACHMENT_SUCCESS: {
    // action.payload will contain id of the attachment
    // that was just removed
    const idx = _.findIndex(state.project.attachments, a => a.id === action.payload)
    return update(state, {
      processing: { $set : false },
      project: { attachments: { $splice: [[idx, 1]] } }
    })
  }

  case ADD_PROJECT_MEMBER_PENDING:
  case REMOVE_PROJECT_MEMBER_PENDING:
  case UPDATE_PROJECT_MEMBER_PENDING:
    return Object.assign({}, state, {
      processingMembers: true
    })

  case ADD_PROJECT_MEMBER_SUCCESS:
    return update (state, {
      processingMembers: { $set : false },
      project: { members: { $push: [action.payload] } }
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
    return update(state, {
      processingMembers: { $set : false },
      project: { members: { $set: updatedMembers } }
    })
  }

  case REMOVE_PROJECT_MEMBER_SUCCESS: {
    // NOTE action.payload will contain memberId of the record just removed
    const idx = _.findIndex(state.project.members, a => a.id === action.payload)
    return update(state, {
      processingMembers: { $set : false },
      project: { members: { $splice: [[idx, 1]] } }
    })
  }

  case PROJECT_DIRTY: {
    return Object.assign({}, state, {
      project: _.merge({}, state.project, unflatten(action.payload), { isDirty : true})
    })
  }

  case PROJECT_DIRTY_UNDO: {
    return Object.assign({}, state, {
      project: _.cloneDeep(state.projectNonDirty)
    })
  }

  case LOAD_PROJECT_FAILURE:
  case CREATE_PROJECT_FAILURE:
  case DELETE_PROJECT_FAILURE:
  case UPDATE_PROJECT_FAILURE:
  case ADD_PROJECT_MEMBER_FAILURE:
  case REMOVE_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
  case ADD_PROJECT_ATTACHMENT_FAILURE:
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      processing: false,
      processingMembers: false,
      processingAttachments: false,
      error: parseErrorObj(action)
    })

  default:
    return state
  }
}
