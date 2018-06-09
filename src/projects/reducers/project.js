import {
  LOAD_PROJECT_PENDING, LOAD_PROJECT_SUCCESS, LOAD_PROJECT_FAILURE, LOAD_DIRECT_PROJECT_SUCCESS,
  CREATE_PROJECT_PENDING, CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILURE, CREATE_PROJECT_STAGE_PENDING, CREATE_PROJECT_STAGE_SUCCESS, CREATE_PROJECT_STAGE_FAILURE, CLEAR_LOADED_PROJECT,
  UPDATE_PROJECT_PENDING, UPDATE_PROJECT_SUCCESS, UPDATE_PROJECT_FAILURE,
  DELETE_PROJECT_PENDING, DELETE_PROJECT_SUCCESS, DELETE_PROJECT_FAILURE,
  ADD_PROJECT_ATTACHMENT_PENDING, ADD_PROJECT_ATTACHMENT_SUCCESS, ADD_PROJECT_ATTACHMENT_FAILURE,
  UPDATE_PROJECT_ATTACHMENT_PENDING, UPDATE_PROJECT_ATTACHMENT_SUCCESS, UPDATE_PROJECT_ATTACHMENT_FAILURE,
  REMOVE_PROJECT_ATTACHMENT_PENDING, REMOVE_PROJECT_ATTACHMENT_SUCCESS, REMOVE_PROJECT_ATTACHMENT_FAILURE,
  ADD_PRODUCT_ATTACHMENT_PENDING, ADD_PRODUCT_ATTACHMENT_SUCCESS, ADD_PRODUCT_ATTACHMENT_FAILURE,
  UPDATE_PRODUCT_ATTACHMENT_PENDING, UPDATE_PRODUCT_ATTACHMENT_SUCCESS, UPDATE_PRODUCT_ATTACHMENT_FAILURE,
  REMOVE_PRODUCT_ATTACHMENT_PENDING, REMOVE_PRODUCT_ATTACHMENT_SUCCESS, REMOVE_PRODUCT_ATTACHMENT_FAILURE,
  ADD_PROJECT_MEMBER_PENDING, ADD_PROJECT_MEMBER_SUCCESS, ADD_PROJECT_MEMBER_FAILURE,
  UPDATE_PROJECT_MEMBER_PENDING, UPDATE_PROJECT_MEMBER_SUCCESS, UPDATE_PROJECT_MEMBER_FAILURE,
  REMOVE_PROJECT_MEMBER_PENDING, REMOVE_PROJECT_MEMBER_SUCCESS, REMOVE_PROJECT_MEMBER_FAILURE,
  GET_PROJECTS_SUCCESS, PROJECT_DIRTY, PROJECT_DIRTY_UNDO, LOAD_PROJECT_PHASES_SUCCESS, LOAD_PROJECT_PHASES_PENDING,
  LOAD_PROJECT_TEMPLATE_SUCCESS, LOAD_PROJECT_PRODUCT_TEMPLATES_SUCCESS, LOAD_ALL_PRODUCT_TEMPLATES_SUCCESS, PRODUCT_DIRTY, PRODUCT_DIRTY_UNDO,
  UPDATE_PRODUCT_FAILURE, UPDATE_PRODUCT_SUCCESS,
} from '../../config/constants'
import _ from 'lodash'
import update from 'react-addons-update'

const initialState = {
  isLoading: true,
  processing: false,
  processingMembers: false,
  processingAttachments: false,
  error: false,
  project: {},
  projectNonDirty: {},
  updateExisting: false,
  projectTemplate: null,
  productTemplates: [],
  allProductTemplates: [],
  phases: null,
  phasesNonDirty: null,
  isLoadingPhases: false
}

// NOTE: We should always update projectNonDirty state whenever we update the project state
// same for phasesNonDirty

const parseErrorObj = (action) => {
  const data = _.get(action.payload, 'response.data.result')
  return {
    type: action.type,
    code: _.get(data, 'status', 500),
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
  case LOAD_PROJECT_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      project: null,
      projectNonDirty: null
    })

  case LOAD_PROJECT_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      project: action.payload,
      projectNonDirty: _.cloneDeep(action.payload),
      lastUpdated: new Date()
    })

  case LOAD_PROJECT_TEMPLATE_SUCCESS:
    return {...state,
      projectTemplate: action.payload,
    }

  case LOAD_PROJECT_PRODUCT_TEMPLATES_SUCCESS:
    return {...state,
      // replace all loaded product templates so we keep only the one for current project
      productTemplates: action.payload,
    }

  case LOAD_ALL_PRODUCT_TEMPLATES_SUCCESS:
    return {...state,
      allProductTemplates: action.payload,
    }

  case CLEAR_LOADED_PROJECT:
  case GET_PROJECTS_SUCCESS:
    return Object.assign({}, state, {
      project: {},
      projectNonDirty: {},
      phases: null,
      phasesNonDirty: null,
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
      },
      projectNonDirty: {
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
  
  case LOAD_PROJECT_PHASES_PENDING:
    return Object.assign({}, state, {
      isLoadingPhases: true
    })

  case LOAD_PROJECT_PHASES_SUCCESS:
    return update(state, {
      phases: { $set: action.payload },
      phasesNonDirty: { $set: action.payload },
      isLoadingPhases: { $set: false}
    })

  // Create & Edit project
  case CREATE_PROJECT_STAGE_PENDING:
  case CREATE_PROJECT_PENDING:
  case DELETE_PROJECT_PENDING:
  case UPDATE_PROJECT_PENDING:
    return Object.assign({}, state, {
      isLoading: false,
      processing: true,
      error: false
    })

  case CREATE_PROJECT_STAGE_SUCCESS:
  case CREATE_PROJECT_SUCCESS:
  case UPDATE_PROJECT_SUCCESS: {
    // after loading project initially, we also load direct project
    // and add additional properties to the `project` object in LOAD_DIRECT_PROJECT_SUCCESS action
    // after updating project they will be lost, so here we restore them
    // TODO better don't add additional values to `project` object and keep additional values separately
    const restoredProject = {
      ...action.payload,
      budget: _.cloneDeep(state.project.budget),
      duration: _.cloneDeep(state.project.duration),
    }

    return Object.assign({}, state, {
      processing: false,
      error: false,
      project: restoredProject,
      projectNonDirty: _.cloneDeep(restoredProject),
      updateExisting: action.payload.updateExisting
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
      project: {},
      projectNonDirty: {}
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
      projectNonDirty: { attachments: { $push: [action.payload] } }
    })

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
      processing: { $set : false },
      project: { attachments: { $splice: [[idx, 1]] } },
      projectNonDirty: { attachments: { $splice: [[idx, 1]] } }
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
      project: { members: { $push: [action.payload] } },
      projectNonDirty: { members: { $push: [action.payload] } }
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
      project: { members: { $set: updatedMembers } },
      projectNonDirty: { members: { $set: updatedMembers } }
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

  case PROJECT_DIRTY: {// payload contains only changed values from the project form
    return Object.assign({}, state, {
      project: _.mergeWith({}, state.project, action.payload, { isDirty : true },
        // customizer to override screens array with changed values
        (objValue, srcValue, key) => {
          if (key === 'screens' || key === 'features' || key === 'capabilities') {
            return srcValue// srcValue contains the changed values from action payload
          }
        }
      )
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
    return Object.assign({}, state, {
      project: _.cloneDeep(state.projectNonDirty)
    })
  }

  case PRODUCT_DIRTY_UNDO: {
    return {
      ...state,
      phases: _.cloneDeep(state.phasesNonDirty)
    }
  }

  case LOAD_PROJECT_FAILURE:
  case CREATE_PROJECT_STAGE_FAILURE:
  case CREATE_PROJECT_FAILURE:
  case DELETE_PROJECT_FAILURE:
  case UPDATE_PROJECT_FAILURE:
  case UPDATE_PRODUCT_FAILURE:
  case ADD_PROJECT_MEMBER_FAILURE:
  case REMOVE_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
  case ADD_PROJECT_ATTACHMENT_FAILURE:
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
  case UPDATE_PRODUCT_ATTACHMENT_FAILURE:
  case ADD_PRODUCT_ATTACHMENT_FAILURE:
  case REMOVE_PRODUCT_ATTACHMENT_FAILURE:
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
