
import {
  LOAD_PROJECT_PENDING, LOAD_PROJECT_SUCCESS, LOAD_PROJECT_FAILURE,
  CREATE_PROJECT, CREATE_PROJECT_SUCCESS,
  CREATE_PROJECT_FAILURE, CLEAR_LOADED_PROJECT
} from '../../config/constants'

import { modelReducer, formReducer } from 'react-redux-form'


const initialState = {
  isLoading: false,
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
  default:
    return state
  }
}


export const newProject = modelReducer('newProject', {
  name: '',
  description: '',
  utm: {
    code: ''
  },
  type: 'visual_design',
  details: {
    version: 'v2',
    devices: ['phone'],
    appType: 'ios'
  }
})

export const newProjectForm = formReducer('newProject')
