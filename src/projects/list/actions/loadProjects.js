import _ from 'lodash'
// import { fetchJSON } from '../helpers'
import {
  CLEAR_PROJECT_SEARCH, PROJECT_SEARCH_SUCCESS, PROJECT_SEARCH_FAILURE,
  RESET_SEARCH_TERM, SET_SEARCH_TERM,
  CLEAR_PROJECT_SUGGESTIONS_SEARCH, PROJECT_SUGGESTIONS_SEARCH_SUCCESS
  } from '../../../config/constants'

export function loadProjects(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    // const numCurrentUsernameMatches = state.memberSearch.usernameMatches.length
    const previousSearchTerm = state.searchTerm.previousSearchTerm
    const isPreviousSearchTerm = _.isString(previousSearchTerm)
    const isNewSearchTerm = isPreviousSearchTerm && searchTerm.toLowerCase() !== previousSearchTerm.toLowerCase()

    if (isNewSearchTerm) {
      dispatch({ type: CLEAR_PROJECT_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, searchTerm })
    if (searchTerm.toLowerCase() === 'lux') {
      dispatch({ type: PROJECT_SEARCH_SUCCESS,
        projects: [
          {
            id: 30043671,
            name: 'LUX challenge for HP',
            startsOn: 'July 20, 2016',
            endsOn: 'July 30, 2016',
            currentPhase: 'Registration'
          },
          {
            id: 30043672,
            name: 'LUX challenge for Delloite',
            startsOn: 'July 20, 2016',
            endsOn: 'July 30, 2016',
            currentPhase: 'Submission'
          }
        ]
      })
    } else {
      dispatch({ type: PROJECT_SEARCH_SUCCESS,
        projects: [
          {
            id: 30043671,
            name: 'LUX challenge for HP',
            startsOn: 'July 20, 2016',
            endsOn: 'July 30, 2016',
            currentPhase: 'Registration'
          },
          {
            id: 30043672,
            name: 'LUX challenge for Delloite',
            startsOn: 'July 20, 2016',
            endsOn: 'July 30, 2016',
            currentPhase: 'Submission'
          },
          {
            id: 30043673,
            name: 'RUX challenge for Accentrue',
            startsOn: 'July 20, 2016',
            endsOn: 'July 30, 2016',
            currentPhase: 'Review'
          },
          {
            id: 30043674,
            name: 'UI Refresh - Dashboard -Topcoder platform',
            startsOn: 'July 20, 2016',
            endsOn: 'July 30, 2016',
            currentPhase: 'Registration'
          },
          {
            id: 30043675,
            name: 'Health App Integration',
            startsOn: 'July 20, 2016',
            endsOn: 'July 30, 2016',
            currentPhase: 'Final Fix'
          }
        ]
      })
    }

  })
}

export function projectSearchSuccess(dispatch) {
  dispatch({ type: PROJECT_SEARCH_FAILURE })
  dispatch({ type: RESET_SEARCH_TERM})
}

export function projectSearchFailure(dispatch) {
  dispatch({ type: PROJECT_SEARCH_FAILURE })
  dispatch({ type: RESET_SEARCH_TERM})
}

export function projectSuggestions(searchTerm) {
  return ((dispatch, getState) => {
    const state = getState()
    // const numCurrentUsernameMatches = state.memberSearch.usernameMatches.length
    const previousSearchTerm = state.searchTerm.previousSearchTerm
    const isPreviousSearchTerm = _.isString(previousSearchTerm)
    const isNewSearchTerm = isPreviousSearchTerm && searchTerm.toLowerCase() !== previousSearchTerm.toLowerCase()

    if (isNewSearchTerm) {
      dispatch({ type: CLEAR_PROJECT_SUGGESTIONS_SEARCH })
    }

    dispatch({ type: SET_SEARCH_TERM, searchTerm })

    dispatch({ type: PROJECT_SUGGESTIONS_SEARCH_SUCCESS,
      projects: [
        'LUX challenge for HP',
        'LUX challenge for Delloite'
      ]
    })

  })
}