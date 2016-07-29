
import {
  LOAD_PROJECT, PROJECT_LOAD_SUCCESS, PROJECT_LOAD_FAILURE,
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
  case LOAD_PROJECT:
    return Object.assign({}, state, {
      isLoading: true,
      project: {}
    })
  case PROJECT_LOAD_SUCCESS:
    return Object.assign({}, state, {
      isLoading: false,
      project: action.project,
      lastUpdated: new Date()
    })

  case PROJECT_LOAD_FAILURE:
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
  type: '',
  details: {
    version: 'v2',
    devices: ['phone'],
    appType: ''
  }
})

export const newProjectForm = formReducer('newProject')
