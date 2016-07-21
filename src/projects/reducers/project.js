
import { LOAD_PROJECT, PROJECT_LOAD_SUCCESS,
  PROJECT_LOAD_FAILURE} from '../../config/constants'

const initialState = {
  isLoading: false,
  project: {}
}

export default function project(state=initialState, action) {

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

    default:
      return state
  }
}
