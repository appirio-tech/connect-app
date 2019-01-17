import {
  LOAD_PROJECT_PENDING, LOAD_PROJECT_SUCCESS, LOAD_PROJECT_MEMBER_INVITES_PENDING, LOAD_PROJECT_MEMBER_INVITES_FAILURE, LOAD_PROJECT_MEMBER_INVITES_SUCCESS, LOAD_PROJECT_FAILURE, LOAD_DIRECT_PROJECT_SUCCESS,
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
  GET_PROJECTS_SUCCESS, PROJECT_DIRTY, PROJECT_DIRTY_UNDO, LOAD_PROJECT_PHASES_SUCCESS, LOAD_PROJECT_PHASES_PENDING, PRODUCT_DIRTY, PRODUCT_DIRTY_UNDO,
  UPDATE_PRODUCT_FAILURE, UPDATE_PRODUCT_SUCCESS, UPDATE_PHASE_SUCCESS, UPDATE_PHASE_PENDING, UPDATE_PHASE_FAILURE,
  DELETE_PROJECT_PHASE_PENDING, DELETE_PROJECT_PHASE_SUCCESS, DELETE_PROJECT_PHASE_FAILURE, PHASE_DIRTY_UNDO, PHASE_DIRTY,
  EXPAND_PROJECT_PHASE, COLLAPSE_PROJECT_PHASE, COLLAPSE_ALL_PROJECT_PHASES, INVITE_CUSTOMER_SUCCESS, REMOVE_CUSTOMER_INVITE_SUCCESS,
  INVITE_TOPCODER_MEMBER_SUCCESS, REMOVE_TOPCODER_MEMBER_INVITE_SUCCESS, INVITE_TOPCODER_MEMBER_PENDING, REMOVE_CUSTOMER_INVITE_PENDING,
  REMOVE_TOPCODER_MEMBER_INVITE_PENDING, REMOVE_TOPCODER_MEMBER_INVITE_FAILURE, REMOVE_CUSTOMER_INVITE_FAILURE,
  INVITE_CUSTOMER_FAILURE, INVITE_TOPCODER_MEMBER_FAILURE, INVITE_CUSTOMER_PENDING,
  ACCEPT_OR_REFUSE_INVITE_SUCCESS, ACCEPT_OR_REFUSE_INVITE_FAILURE, ACCEPT_OR_REFUSE_INVITE_PENDING,
} from '../../config/constants'
import _ from 'lodash'
import update from 'react-addons-update'

const initialState = {
  isLoading: true,
  processing: false,
  processingMembers: false,
  processingInvites: false,
  processingAttachments: false,
  error: false,
  project: {},
  projectNonDirty: {},
  updateExisting: false,
  phases: null,
  phasesNonDirty: null,
  isLoadingPhases: false,
  showUserInvited: false,
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

  case LOAD_PROJECT_MEMBER_INVITES_SUCCESS: {
    return Object.assign({}, state, {
      showUserInvited: true
    })
  }

  case LOAD_PROJECT_MEMBER_INVITES_PENDING:
    return Object.assign({}, state, {
      isLoading: true,
      showUserInvited: false
    })

  case ACCEPT_OR_REFUSE_INVITE_PENDING:
    return Object.assign({}, state, {
      showUserInvited: true
    })

  case ACCEPT_OR_REFUSE_INVITE_SUCCESS: {
    return Object.assign({}, state, {
      showUserInvited: false
    })
  }

  case CREATE_PROJECT_STAGE_SUCCESS: {
    // as we additionally loaded products to the phase object we have to keep them
    // note that we keep them as they are without creation a new copy
    const phase = {
      ...action.payload.phase,
      products: [action.payload.product]
    }
    const phaseNonDirty = {
      // for non-dirty version we make sure that dont' have the same objects with phase
      ..._.cloneDeep(action.payload.phase),
      products: [_.cloneDeep(action.payload.product)]
    }
    return update(state, {
      processing: { $set: false },
      phases: { $push: [phase] },
      phasesNonDirty: { $push: [phaseNonDirty] }
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

  // Create & Edit project
  case CREATE_PROJECT_STAGE_PENDING:
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

  case REMOVE_CUSTOMER_INVITE_PENDING:
  case REMOVE_TOPCODER_MEMBER_INVITE_PENDING:
  case INVITE_CUSTOMER_PENDING:
  case INVITE_TOPCODER_MEMBER_PENDING:
    return Object.assign({}, state, {
      processingInvites: true
    })

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

  case INVITE_CUSTOMER_SUCCESS: {
    const newState = Object.assign({}, state)
    newState.project.invites.push(...action.payload)
    newState.processingInvites = false
    return newState
  }

  case INVITE_TOPCODER_MEMBER_SUCCESS: {
    const newState = Object.assign({}, state)
    newState.project.invites.push(...action.payload)
    newState.processingInvites = false
    return newState
  }

  case REMOVE_CUSTOMER_INVITE_SUCCESS: {
    const newState = Object.assign({}, state)
    _.remove(newState.project.invites, i => action.payload.id === i.id)
    newState.processingInvites = false
    return newState
  }

  case REMOVE_TOPCODER_MEMBER_INVITE_SUCCESS: {
    const newState = Object.assign({}, state)
    _.remove(newState.project.invites, i => action.payload.id === i.id)
    newState.processingInvites = false
    return newState
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
      }
    )
    // dont' compare this properties as they could be not added to `projectNonDirty`
    // or mutated somewhere in the app
    const skipProperties = ['members']
    const clearUpdatedProject = _.omit(updatedProject, skipProperties)
    const clearUpdatedNonDirtyProject = _.omit(state.projectNonDirty, skipProperties)
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
    return Object.assign({}, state, {
      project: _.cloneDeep(state.projectNonDirty)
    })
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
  case CREATE_PROJECT_STAGE_FAILURE:
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
  case UPDATE_PROJECT_MEMBER_FAILURE:
  case UPDATE_PROJECT_ATTACHMENT_FAILURE:
  case ADD_PROJECT_ATTACHMENT_FAILURE:
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
  case UPDATE_PRODUCT_ATTACHMENT_FAILURE:
  case ADD_PRODUCT_ATTACHMENT_FAILURE:
  case REMOVE_PRODUCT_ATTACHMENT_FAILURE:
  case DELETE_PROJECT_PHASE_FAILURE:
  case LOAD_PROJECT_MEMBER_INVITES_FAILURE:
  case ACCEPT_OR_REFUSE_INVITE_FAILURE:
    return Object.assign({}, state, {
      isLoading: false,
      processing: false,
      processingMembers: false,
      processingAttachments: false,
      processingInvites: false,
      error: parseErrorObj(action)
    })

  default:
    return state
  }
}
