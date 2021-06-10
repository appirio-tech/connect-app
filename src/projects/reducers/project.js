import {
  CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_PENDING, CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_SUCCESS, CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_FAILURE,
  LOAD_PROJECT_PENDING, LOAD_PROJECT_SUCCESS, LOAD_PROJECT_MEMBER_INVITE_PENDING, LOAD_PROJECT_MEMBER_INVITE_SUCCESS, LOAD_PROJECT_FAILURE,
  LOAD_PROJECT_BILLING_ACCOUNT_SUCCESS, LOAD_PROJECT_BILLING_ACCOUNT_FAILURE,
  CREATE_PROJECT_PENDING, CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE, CLEAR_LOADED_PROJECT,
  UPDATE_PROJECT_PENDING, UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAILURE,
  DELETE_PROJECT_PENDING, DELETE_PROJECT_SUCCESS, DELETE_PROJECT_FAILURE,
  ADD_PROJECT_ATTACHMENT_PENDING, ADD_PROJECT_ATTACHMENT_SUCCESS, ADD_PROJECT_ATTACHMENT_FAILURE,
  UPDATE_PROJECT_ATTACHMENT_PENDING, UPDATE_PROJECT_ATTACHMENT_SUCCESS, UPDATE_PROJECT_ATTACHMENT_FAILURE,
  REMOVE_PROJECT_ATTACHMENT_PENDING, REMOVE_PROJECT_ATTACHMENT_SUCCESS, REMOVE_PROJECT_ATTACHMENT_FAILURE,
  REMOVE_PENDING_ATTACHMENT, UPDATE_PENDING_ATTACHMENT,
  ADD_PRODUCT_ATTACHMENT_PENDING, ADD_PRODUCT_ATTACHMENT_SUCCESS, ADD_PRODUCT_ATTACHMENT_FAILURE,
  UPDATE_PRODUCT_ATTACHMENT_PENDING, UPDATE_PRODUCT_ATTACHMENT_SUCCESS, UPDATE_PRODUCT_ATTACHMENT_FAILURE,
  REMOVE_PRODUCT_ATTACHMENT_PENDING, REMOVE_PRODUCT_ATTACHMENT_SUCCESS, REMOVE_PRODUCT_ATTACHMENT_FAILURE,
  ADD_PROJECT_MEMBER_PENDING, ADD_PROJECT_MEMBER_SUCCESS, ADD_PROJECT_MEMBER_FAILURE,
  UPDATE_PROJECT_MEMBER_PENDING, UPDATE_PROJECT_MEMBER_SUCCESS, UPDATE_PROJECT_MEMBER_FAILURE,
  REMOVE_PROJECT_MEMBER_PENDING, REMOVE_PROJECT_MEMBER_SUCCESS, REMOVE_PROJECT_MEMBER_FAILURE,
  GET_PROJECTS_SUCCESS, PROJECT_DIRTY, PROJECT_DIRTY_UNDO, LOAD_PROJECT_PHASES_SUCCESS, LOAD_PROJECT_PHASES_PENDING, PRODUCT_DIRTY, PRODUCT_DIRTY_UNDO,
  UPDATE_PRODUCT_FAILURE, UPDATE_PRODUCT_SUCCESS, UPDATE_PHASE_SUCCESS, UPDATE_PHASE_PENDING, UPDATE_PHASE_FAILURE,
  DELETE_PROJECT_PHASE_PENDING, DELETE_PROJECT_PHASE_SUCCESS, DELETE_PROJECT_PHASE_FAILURE, PHASE_DIRTY_UNDO, PHASE_DIRTY,
  EXPAND_PROJECT_PHASE, COLLAPSE_PROJECT_PHASE, COLLAPSE_ALL_PROJECT_PHASES, INVITE_CUSTOMER_SUCCESS, REMOVE_CUSTOMER_INVITE_SUCCESS,
  INVITE_TOPCODER_MEMBER_SUCCESS, REMOVE_TOPCODER_MEMBER_INVITE_SUCCESS, INVITE_TOPCODER_MEMBER_PENDING, REMOVE_CUSTOMER_INVITE_PENDING,
  REMOVE_TOPCODER_MEMBER_INVITE_PENDING, REMOVE_TOPCODER_MEMBER_INVITE_FAILURE, REMOVE_CUSTOMER_INVITE_FAILURE,
  INVITE_CUSTOMER_FAILURE, INVITE_TOPCODER_MEMBER_FAILURE, INVITE_CUSTOMER_PENDING,
  ACCEPT_OR_REFUSE_INVITE_SUCCESS, ACCEPT_OR_REFUSE_INVITE_FAILURE, ACCEPT_OR_REFUSE_INVITE_PENDING,
  UPLOAD_PROJECT_ATTACHMENT_FILES, DISCARD_PROJECT_ATTACHMENT, CHANGE_ATTACHMENT_PERMISSION,
  CREATE_SCOPE_CHANGE_REQUEST_SUCCESS, APPROVE_SCOPE_CHANGE_SUCCESS, REJECT_SCOPE_CHANGE_SUCCESS, CANCEL_SCOPE_CHANGE_SUCCESS, ACTIVATE_SCOPE_CHANGE_SUCCESS,
  LOAD_PROJECT_MEMBERS_SUCCESS, LOAD_PROJECT_MEMBER_INVITES_SUCCESS, LOAD_PROJECT_MEMBER_SUCCESS, CREATE_PROJECT_PHASE_PENDING, CREATE_PROJECT_PHASE_SUCCESS
} from '../../config/constants'
import _ from 'lodash'
import update from 'react-addons-update'
import { clean } from '../../helpers/utils'

export function getEmptyProjectObject() {
  return { invites: [], members: [] }
}

const initialState = {
  isLoading: true,
  isBillingAccountExpired: false,
  processing: false,
  processingMembers: false,
  updatingMemberIds: [],
  processingInvites: false,
  processingAttachments: false,
  attachmentsAwaitingPermission: null,
  attachmentPermissions: null,
  attachmentTags: null,
  error: false,
  inviteError: false,
  // invites are pushed directly into it hence need to declare first
  // using the getEmptyProjectObject method
  project: getEmptyProjectObject(),
  assetsMembers: {},
  projectNonDirty: getEmptyProjectObject(),
  updateExisting: false,
  phases: null,
  phasesNonDirty: null,
  isLoadingPhases: false,
  showUserInvited: undefined, // keep default as `undefined` so we can track when it changes values to false/true on load
  userInvitationId: null,
  phasesStates: {} // controls opened phases and tabs of the phases
}

// NOTE: We should always update projectNonDirty state whenever we update the project state
// same for phasesNonDirty

const parseErrorObj = (action) => {
  const data = _.get(action.payload, 'response.data.result')
  const httpStatus = _.get(action.payload, 'response.status')
  return {
    type: action.type,
    code: _.get(data, 'status', httpStatus || 500),
    msg: _.get(data, 'content.message', ''),
    details: JSON.parse(_.get(data, 'details', null))
  }
}

/**
 * Updates a product in the phase list without mutations
 *
 * @param {Array}  phases         phases list in store
 * @param {Number} phaseId        phase id
 * @param {Number} productId      product id
 * @param {Object} updateProduct  this object has to be in a special shape for `update` function
 *                                from 'react-addons-update' package, or simple object if `shouldReplace` === true
 * @param {Boolean} shouldReplace if this is true, updateProduct replaces current product directly
 *
 * @return {Array} new array of phases with updated product
 */
function updateProductInPhases(phases, phaseId, productId, updateProduct, shouldReplace) {
  const phaseIdx = _.findIndex(phases, { id: phaseId })
  const productIdx = _.findIndex(phases[phaseIdx].products, { id: productId })

  const updatedProduct = shouldReplace ? updateProduct : update(
    phases[phaseIdx].products[productIdx],
    updateProduct
  )

  const updatedPhase = update(phases[phaseIdx], {
    products: { $splice: [[productIdx, 1, updatedProduct]] }
  })

  return update(phases, { $splice : [[phaseIdx, 1, updatedPhase]] })
}

/**
 * Updates the status of a scope change request identified by the index.
 *
 * @param {Object} scopeChangeRequests - the list of scope change requests for the project
 * @param {number} requestId - the id of targetted scope change request
 * @param {string} status - the new status to update
 */
function updateScopeChangeStatus(scopeChangeRequests, updatedScopeChange) {
  const index = _.findIndex(scopeChangeRequests, s => s.id === updatedScopeChange.id)
  if (index > -1) {
    return update(scopeChangeRequests, {
      [index]: {
        $set: updatedScopeChange
      }
    })
  }
  return scopeChangeRequests
}

function revertDirtyProject(state) {
  return Object.assign({}, state, {
    project: _.cloneDeep(state.projectNonDirty)
  })
}

/**
 * Finds product in the list of phases
 *
 * @param {Array}  phases         phases list in store
 * @param {Number} phaseId        phase id
 * @param {Number} productId      product id
 *
 * @return {Object} product
 */
function getProductInPhases(phases, phaseId, productId) {
  const phase = _.find(phases, { id: phaseId })
  const product = _.find(phase.products, { id: productId })

  return product
}

export const projectState = function (state=initialState, action) {

  switch (action.type) {
  case CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_PENDING:
  case CREATE_PROJECT_PHASE_PENDING:
    return Object.assign({}, state, {
      isCreatingPhase: true
    })
  case LOAD_PROJECT_BILLING_ACCOUNT_SUCCESS:
    return {
      ...state,
      isBillingAccountExpired: !action.payload.data.active,
    }
  case LOAD_PROJECT_BILLING_ACCOUNT_FAILURE:
    return {
      ...state,
      isBillingAccountExpired: false,
    }
  case CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_SUCCESS:
  case CREATE_PROJECT_PHASE_SUCCESS: {
    const { phase, product } = action.payload
    phase.products = [product]
    return update(state, {
      phases: { $push: [phase] },
      phasesNonDirty: { $push: [_.cloneDeep(phase)] },
      isCreatingPhase: { $set: false },
    })
  }

  case EXPAND_PROJECT_PHASE: {
    const { phaseId, tab } = action.payload
    const currentPhaseTab = state.phasesStates[phaseId] || {}
    const updatedPhaseTab = {
      ...currentPhaseTab,
      isExpanded: true
    }
    if (tab) {
      updatedPhaseTab.tab = tab
    }

    return {
      ...state,
      phasesStates: {
        ...state.phasesStates,
        [phaseId]: updatedPhaseTab
      }
    }
  }

  case COLLAPSE_PROJECT_PHASE: {
    const { phaseId } = action.payload
    const currentPhaseTab = state.phasesStates[phaseId] || {}
    const updatedPhaseTab = {
      ...currentPhaseTab,
      isExpanded: false
    }

    return {
      ...state,
      phasesStates: {
        ...state.phasesStates,
        [phaseId]: updatedPhaseTab
      }
    }
  }

  case COLLAPSE_ALL_PROJECT_PHASES:
    return {
      ...state,
      phasesStates: {},
    }

  case LOAD_PROJECT_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      project: getEmptyProjectObject(),
      projectNonDirty: getEmptyProjectObject(),
    })

  case LOAD_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      error: false,
      project: {
        // if these arrays are not returned we should init them with empty arrays
        // as later code counts on this
        attachments: [],
        members: [],
        invites: [],
        ...action.payload
      },
      projectNonDirty: _.cloneDeep(action.payload),
      lastUpdated: new Date()
    })

  case LOAD_PROJECT_MEMBER_INVITE_SUCCESS: {
    const { invites, currentUserId, currentUserEmail } = action.payload
    let invite
    if (invites && invites.length > 0) {
      invite = _.find(invites, inv => (
        (
          // user is invited by `handle`
          inv.userId !== null && inv.userId === currentUserId ||
          // user is invited by `email` (invite doesn't have `userId`)
          (
            inv.userId === null &&
            inv.email &&
            currentUserEmail &&
            inv.email.toLowerCase() === currentUserEmail.toLowerCase()
          )
        ) &&
        !inv.deletedAt &&
        inv.status === 'pending'
      ))
    }
    return Object.assign({}, state, {
      showUserInvited: !!invite,
      userInvitationId: invite ? invite.id : null
    })
  }

  case LOAD_PROJECT_MEMBER_INVITE_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      showUserInvited: undefined
    })

  case ACCEPT_OR_REFUSE_INVITE_PENDING:
    return Object.assign({}, state, {
      inviteError: false,
    })

  case ACCEPT_OR_REFUSE_INVITE_SUCCESS: {
    const { id: inviteId } = action.payload
    const invites = _.filter(state.project.invites, m => m.id !== inviteId)
    return Object.assign({}, state, {
      showUserInvited: false,
      inviteError: false,
      project: {
        ...state.project,
        invites
      },
      projectNonDirty: {
        ...state.projectNonDirty,
        invites
      }
    })
  }

  case LOAD_PROJECT_MEMBERS_SUCCESS: {
    return Object.assign({}, state, {
      project: {
        ...state.project,
        members: action.payload
      },
      projectNonDirty: {
        ...state.projectNonDirty,
        members: action.payload
      }
    })
  }

  case LOAD_PROJECT_MEMBER_INVITES_SUCCESS: {
    return Object.assign({}, state, {
      project: {
        ...state.project,
        invites: action.payload
      },
      projectNonDirty: {
        ...state.projectNonDirty,
        invites: action.payload
      }
    })
  }

  case LOAD_PROJECT_MEMBER_SUCCESS: {
    const member = action.payload
    const index = _.findIndex(state.project.members, (o) =>  o.userId === parseInt(member.userId))
    const updatedMembers = (
      index >=0 ? [...state.project.members.slice(0, index),
        member,
        ...state.project.members.slice(index+1)
      ] : state.project.members.concat([action.payload])
    )
    return Object.assign({}, state, {
      project: {
        ...state.project,
        members: updatedMembers
      },
      projectNonDirty: {
        ...state.projectNonDirty,
        members: updatedMembers
      }
    })
  }

  case UPDATE_PHASE_SUCCESS: {
    // as we additionally loaded products to the phase object we have to keep them
    // note that we keep them as they are without creation a new copy
    const phase = {
      ...action.payload,
      products: state.phases[action.payload.phaseIndex].products
    }
    const phaseNonDirty = {
      // for non-dirty version we make sure that dont' have the same objects with phase
      ..._.cloneDeep(action.payload),
      products: state.phasesNonDirty[action.payload.phaseIndex].products
    }

    return update(state, {
      processing: { $set: false },
      phases: { $splice: [[action.payload.phaseIndex, 1, phase]] },
      phasesNonDirty: { $splice: [[action.payload.phaseIndex, 1, phaseNonDirty]] },
    })
  }

  case CLEAR_LOADED_PROJECT:
  case GET_PROJECTS_SUCCESS:
    return Object.assign({}, state, {
      isLoading: true, // this is excpected to be default value when there is not project loaded
      project: getEmptyProjectObject(),
      projectNonDirty: getEmptyProjectObject(),
      phases: null,
      phasesNonDirty: null,
    })

  case LOAD_PROJECT_PHASES_PENDING:
    return Object.assign({}, state, {
      isLoadingPhases: true
    })

  case LOAD_PROJECT_PHASES_SUCCESS: {
    // loops through the phases to update the attachments field in the products of each phase
    // NOTE it might not be needed after we get a proper implementation for supporting product attachments
    const phases = _.map(action.payload, p => {
      p.products = _.map(p.products, prd => {
        const attachments = []
        if (state.project.attachments && state.project.attachments.length) {
          state.project.attachments.forEach(a => {
            if (a.category === `product#${prd.id}`) {
              attachments.push(a)
            }
          })
        }
        return { ...prd, attachments }
      })
      return p
    })
    // updates projects' attachments which are not coupled with any product/phase
    const projectAttachments = []
    state.project.attachments.forEach(a => {
      if (!a.category || a.category.indexOf('product') !== 0) {
        projectAttachments.push(a)
      }
    })
    return update(state, {
      project: { attachments : { $set : projectAttachments } },
      projectNonDirty: { attachments: { $set: projectAttachments } },
      phases: { $set:phases },
      phasesNonDirty: { $set: action.payload },
      isLoadingPhases: { $set: false}
    })
  }

  case CREATE_SCOPE_CHANGE_REQUEST_SUCCESS: {
    state = revertDirtyProject(state)

    const project = update(state.project, {
      scopeChangeRequests: { $push: [action.payload] }
    })
    return Object.assign({}, state, {
      project,
      projectNonDirty: _.cloneDeep(project)
    })
  }

  case APPROVE_SCOPE_CHANGE_SUCCESS:
  case REJECT_SCOPE_CHANGE_SUCCESS:
  case CANCEL_SCOPE_CHANGE_SUCCESS: {
    state = revertDirtyProject(state)

    const project = update(state.project, {
      scopeChangeRequests: {
        $set: updateScopeChangeStatus(
          state.project.scopeChangeRequests,
          action.payload
        )
      }
    })
    return Object.assign({}, state, {
      project,
      projectNonDirty: _.cloneDeep(project)
    })
  }

  case ACTIVATE_SCOPE_CHANGE_SUCCESS: {
    state = revertDirtyProject(state)

    const updatedScopeChangeRequests = updateScopeChangeStatus(
      state.project.scopeChangeRequests,
      action.payload
    )
    const updatedDetails = _.mergeWith(
      {},
      state.project.details,
      _.cloneDeep(action.payload.newScope),
      (_objValue, srcValue) => {
        if (_.isArray(srcValue)) {
          return srcValue
        }
      }
    )
    const project = update(state.project, {
      scopeChangeRequests: {
        $set: updatedScopeChangeRequests
      },
      details: {
        $set: updatedDetails
      }
    })
    return Object.assign({}, state, {
      project,
      projectNonDirty: _.cloneDeep(project)
    })
  }

  // Create & Edit project
  case CREATE_PROJECT_PENDING:
  case DELETE_PROJECT_PENDING:
  case UPDATE_PROJECT_PENDING:
  case UPDATE_PHASE_PENDING:
  case DELETE_PROJECT_PHASE_PENDING:
    return Object.assign({}, state, {
      isLoading: false,
      processing: true,
      error: false
    })

  case CREATE_PROJECT_SUCCESS:
  case UPDATE_PROJECT_SUCCESS: {
    // after updating project they will be lost, so here we restore them
    // TODO better don't add additional values to `project` object and keep additional values separately
    const restoredProject = {
      ...action.payload,

      // the next properties we also could modify by other reducers, so we restore them,
      // and also, we fallback to the default empty array [] as the code relies on it
      // we should not `cloneDeep` these values as they are not changed
      attachments: _.get(state.project, 'attachments', []),
      members: _.get(state.project, 'members', []),
      invites: _.get(state.project, 'invites', []),
    }

    return Object.assign({}, state, {
      processing: false,
      error: false,
      project: restoredProject,
      projectNonDirty: _.cloneDeep(restoredProject),
      updateExisting: action.payload.updateExisting,
      attachmentsAwaitingPermission: null
    })
  }

  case DELETE_PROJECT_PHASE_SUCCESS: {
    const { phaseId } = action.payload

    const phaseIndex = _.findIndex(state.phases, { id: phaseId })

    return update(state, {
      phases: { $splice: [[phaseIndex, 1]] },
      phasesNonDirty: { $splice: [[phaseIndex, 1]] },
      processing: { $set: false },
    })
  }

  case UPDATE_PRODUCT_SUCCESS:
    return {
      ...state,
      phases: updateProductInPhases(
        state.phases, action.payload.phaseId, action.payload.id, action.payload, true
      ),
      phasesNonDirty: updateProductInPhases(
        state.phasesNonDirty, action.payload.phaseId, action.payload.id, _.cloneDeep(action.payload), true
      ),
    }

  case DELETE_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      processing: false,
      error: false,
      project: getEmptyProjectObject(),
      projectNonDirty: getEmptyProjectObject(),
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
      project: { attachments: { $push: [action.payload] } },
      projectNonDirty: { attachments: { $push: [action.payload] } },
      attachmentsAwaitingPermission: { $set: null }
    })

  case UPLOAD_PROJECT_ATTACHMENT_FILES: {
    let query = {}
    if (state.attachmentsAwaitingPermission && state.attachmentsAwaitingPermission.attachments) {
      query = { attachments: { $push: action.payload.attachments } }
    } else {
      query = { $set : action.payload }
    }
    return update(state, {
      attachmentsAwaitingPermission: query,
      attachmentPermissions: { $set : null },
      attachmentTags: { $set: null }
    })
  }

  case DISCARD_PROJECT_ATTACHMENT:
    return {
      ...state,
      attachmentsAwaitingPermission: null
    }

  case CHANGE_ATTACHMENT_PERMISSION:
    return {
      ...state,
      attachmentPermissions: action.payload.allowedUsers,
      attachmentTags: action.payload.tags
    }

  case UPDATE_PROJECT_ATTACHMENT_SUCCESS: {
    // get index
    const idx = _.findIndex(state.project.attachments, a => a.id === action.payload.id)
    return update(state, {
      processingAttachments: { $set : false },
      project: { attachments: { $splice : [[idx, 1, action.payload]] } },
      projectNonDirty: { attachments: { $splice : [[idx, 1, action.payload]] } }
    })
  }

  // Product attachments
  case ADD_PRODUCT_ATTACHMENT_PENDING:
  case UPDATE_PRODUCT_ATTACHMENT_PENDING:
  case REMOVE_PRODUCT_ATTACHMENT_PENDING:
    return {
      ...state,
      processingAttachments: true
    }

  case ADD_PRODUCT_ATTACHMENT_SUCCESS: {
    const { phaseId, productId, attachment } = action.payload

    return {
      ...state,
      processingAttachments: false,
      phases: updateProductInPhases(state.phases, phaseId, productId, {
        attachments: { $push: [attachment] }
      }),
      phasesNonDirty: updateProductInPhases(state.phasesNonDirty, phaseId, productId, {
        attachments: { $push: [_.cloneDeep(attachment)] }
      }),
      attachmentsAwaitingPermission: null
    }
  }

  case UPDATE_PRODUCT_ATTACHMENT_SUCCESS: {
    const { phaseId, productId, attachment } = action.payload
    const product = getProductInPhases(state.phases, phaseId, productId)
    const idx = _.findIndex(product.attachments, { id: attachment.id })

    return {
      ...state,
      processingAttachments: false,
      phases: updateProductInPhases(state.phases, phaseId, productId, {
        attachments: { $splice : [[idx, 1, attachment]] }
      }),
      phasesNonDirty: updateProductInPhases(state.phasesNonDirty, phaseId, productId, {
        attachments: { $splice : [[idx, 1, _.cloneDeep(attachment)]] }
      }),
    }
  }

  case REMOVE_PRODUCT_ATTACHMENT_SUCCESS: {
    const { phaseId, productId, attachmentId } = action.payload
    const product = getProductInPhases(state.phases, phaseId, productId)
    const idx = _.findIndex(product.attachments, { id: attachmentId })

    return {
      ...state,
      processingAttachments: false,
      phases: updateProductInPhases(state.phases, phaseId, productId, {
        attachments: { $splice : [[idx, 1]] }
      }),
      phasesNonDirty: updateProductInPhases(state.phasesNonDirty, phaseId, productId, {
        attachments: { $splice : [[idx, 1]] }
      }),
    }
  }

  case REMOVE_PROJECT_ATTACHMENT_SUCCESS: {
    // action.payload will contain id of the attachment
    // that was just removed
    const idx = _.findIndex(state.project.attachments, a => a.id === action.payload)
    return update(state, {
      processingAttachments: { $set : false },
      project: { attachments: { $splice: [[idx, 1]] } },
      projectNonDirty: { attachments: { $splice: [[idx, 1]] } }
    })
  }

  case REMOVE_PENDING_ATTACHMENT: {
    // action.payload will contain id of the attachment
    // that was just removed
    const idx = action.payload
    return update(state, {
      processingAttachments: { $set : false },
      attachmentsAwaitingPermission: { attachments : { $splice: [[idx, 1]] } },
    })
  }

  case UPDATE_PENDING_ATTACHMENT: {
    const idx = action.payload.attachmentIdx
    const existingAttachment = _.get(state.attachmentsAwaitingPermission, `attachments[${idx}]`)
    const updatedAttachment = _.assign({}, existingAttachment, action.payload.updatedAttachment)
    return update(state, {
      processingAttachments: { $set : false },
      attachmentsAwaitingPermission: { attachments : { $splice: [[idx, 1, updatedAttachment]] } },
    })
  }

  case REMOVE_CUSTOMER_INVITE_PENDING:
  case REMOVE_TOPCODER_MEMBER_INVITE_PENDING:
  case INVITE_CUSTOMER_PENDING:
  case INVITE_TOPCODER_MEMBER_PENDING:
    return Object.assign({}, state, {
      processingInvites: true
    })

  case ADD_PROJECT_MEMBER_PENDING:
  case REMOVE_PROJECT_MEMBER_PENDING:
    return Object.assign({}, state, {
      processingMembers: true
    })

  case UPDATE_PROJECT_MEMBER_PENDING:
    return Object.assign({}, state, {
      updatingMemberIds: [ ...state.updatingMemberIds, action.meta.memberId ]
    })

  case ADD_PROJECT_MEMBER_SUCCESS:
    return update (state, {
      processingMembers: { $set : false },
      project: { members: { $push: [action.payload] } },
      projectNonDirty: { members: { $push: [action.payload] } }
    })

  case INVITE_CUSTOMER_SUCCESS: {
    const newState = Object.assign({}, state)
    if (!newState.project.invites) {
      newState.project.invites = []
    }
    newState.project.invites.push(...action.payload.success)
    newState.projectNonDirty.invites = newState.project.invites
    newState.processingInvites = false
    newState.error = false
    if (action.payload.failed) {
      newState.error = {
        type: action.type,
        failed: action.payload.failed,
      }
    }
    return newState
  }

  case INVITE_TOPCODER_MEMBER_SUCCESS: {
    const newState = Object.assign({}, state)
    if (!newState.project.invites) {
      newState.project.invites = []
    }
    newState.project.invites.push(...action.payload.success)
    newState.projectNonDirty.invites = newState.project.invites
    newState.processingInvites = false
    newState.error = false
    if (action.payload.failed) {
      newState.error = {
        type: action.type,
        failed: action.payload.failed,
      }
    }
    return newState
  }

  case REMOVE_CUSTOMER_INVITE_SUCCESS:
  case REMOVE_TOPCODER_MEMBER_INVITE_SUCCESS: {
    const idx = _.findIndex(state.project.invites, { id: action.meta.inviteId })
    return update(state, {
      processingInvites: { $set : false },
      project: { invites: { $splice: [[idx, 1]] } },
      projectNonDirty: { invites: { $splice: [[idx, 1]] } }
    })
  }

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
      project: { members: { $set: updatedMembers } },
      projectNonDirty: { members: { $set: updatedMembers } },
      updatingMemberIds: { $set: _.xor(state.updatingMemberIds, [action.payload.id]) }
    })
  }

  case REMOVE_PROJECT_MEMBER_SUCCESS: {
    // NOTE action.payload will contain memberId of the record just removed
    const idx = _.findIndex(state.project.members, a => a.id === action.payload)
    return update(state, {
      processingMembers: { $set : false },
      project: { members: { $splice: [[idx, 1]] } },
      projectNonDirty: { members: { $splice: [[idx, 1]] } }
    })
  }

  case PROJECT_DIRTY: {
    const updatedProject = _.mergeWith({}, _.omit(state.project, 'isDirty'), action.payload,
      // customizer to override arrays with changed values
      (objValue, srcValue, key) => {
        // when we update some array values, we have to replace them completely, rather than merge
        if (_.isArray(objValue) && _.isArray(srcValue)) {
          return srcValue
        }
        // most likely these cases are particular cases of the upper rule for arrays,
        // but just in case keep them here for now, until we are sure we can safely remove
        // this particular cases
        if (key === 'screens' || key === 'features' || key === 'capabilities') {
          return srcValue// srcValue contains the changed values from action payload
        }

        // project's name might contain ampersand
        if (key === 'name') {
          return _.escape(srcValue)
        }
      }
    )
    // dont' compare this properties as they could be not added to `projectNonDirty`
    // or mutated somewhere in the app
    const skipProperties = ['members', 'invites']
    const clearUpdatedProject = clean(_.omit(updatedProject, skipProperties))
    const clearUpdatedNonDirtyProject = clean(_.omit(state.projectNonDirty, skipProperties))
    if (!_.isEqual(clearUpdatedProject, clearUpdatedNonDirtyProject)) {
      updatedProject.isDirty = true
    }

    // keep this code for debugging
    // as there are could be some parts of the application which could add additional properties
    // to the `project` by Redux Store mutation
    // this code could help to find such places during debugging if `isDirty` becomes `true` unexpectedly
    /* if (updatedProject.isDirty) {
      function difference(object, base) {
        function changes(object, base) {
          return _.transform(object, function(result, value, key) {
            if (!_.isEqual(value, base[key])) {
              result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
          });
        }
        return changes(object, base);
      }
      console.log('diff', difference(clearUpdatedProject, clearUpdatedNonDirtyProject))
    } */
    return Object.assign({}, state, {
      project: updatedProject
    })
  }

  case PHASE_DIRTY: {
    const phaseIndex = state.phases.findIndex(phase => phase.id === action.payload.phaseId)
    const phasesUpdated = [
      ...state.phases.slice(0, phaseIndex),
      {
        ...state.phases[phaseIndex],
        ...action.payload.dirtyPhase,
        isDirty : true
      },
      ...state.phases.slice(phaseIndex + 1),
    ]
    return Object.assign({}, state, {
      phases: _.mergeWith([], phasesUpdated)
    })
  }

  case PRODUCT_DIRTY:


    return {
      ...state,
      phases: updateProductInPhases(state.phases, action.payload.phaseId, action.payload.productId, {
        $merge: {
          ...action.payload.values,
          isDirty: true,
        }
      })
    }

  case PROJECT_DIRTY_UNDO: {
    return revertDirtyProject(state)
  }

  case PHASE_DIRTY_UNDO: {
    return Object.assign({}, state, {
      phases: _.cloneDeep(state.phasesNonDirty)
    })
  }

  case PRODUCT_DIRTY_UNDO: {
    return {
      ...state,
      phases: _.cloneDeep(state.phasesNonDirty)
    }
  }

  case LOAD_PROJECT_FAILURE:
  case CREATE_PROJECT_FAILURE:
  case DELETE_PROJECT_FAILURE:
  case UPDATE_PROJECT_FAILURE:
  case UPDATE_PHASE_FAILURE:
  case UPDATE_PRODUCT_FAILURE:
  case ADD_PROJECT_MEMBER_FAILURE:
  case INVITE_CUSTOMER_FAILURE:
  case INVITE_TOPCODER_MEMBER_FAILURE:
  case REMOVE_TOPCODER_MEMBER_INVITE_FAILURE:
  case REMOVE_CUSTOMER_INVITE_FAILURE:
  case REMOVE_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
  case ADD_PROJECT_ATTACHMENT_FAILURE:
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
  case UPDATE_PRODUCT_ATTACHMENT_FAILURE:
  case ADD_PRODUCT_ATTACHMENT_FAILURE:
  case REMOVE_PRODUCT_ATTACHMENT_FAILURE:
  case DELETE_PROJECT_PHASE_FAILURE:
  case CREATE_PROJECT_PHASE_TIMELINE_MILESTONES_FAILURE:
    return Object.assign({}, state, {
      isCreatingPhase: false,
      isLoading: false,
      processing: false,
      processingMembers: false,
      processingAttachments: false,
      processingInvites: false,
      error: parseErrorObj(action)
    })
  case ACCEPT_OR_REFUSE_INVITE_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      processing: false,
      processingMembers: false,
      processingAttachments: false,
      processingInvites: false,
      error: parseErrorObj(action),
      inviteError: parseErrorObj(action)
    })
  case UPDATE_PROJECT_MEMBER_FAILURE:
    return Object.assign({}, state, {
      updatingMemberIds: _.remove(state.updatingMemberIds, [action.payload.id]),
      error: parseErrorObj(action)
    })

  default:
    return state
  }
}
