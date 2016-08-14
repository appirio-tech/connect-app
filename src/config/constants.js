/*
 * ACTIONS
 */

// Auth
export const LOAD_USER_SUCCESS     = 'LOAD_USER_SUCCESS'
export const LOAD_USER_FAILURE     = 'LOAD_USER_FAILURE'

// Search Term
export const SET_SEARCH_TERM   = 'SET_SEARCH_TERM'
export const SET_SEARCH_TAG    = 'SET_SEARCH_TAG'
export const RESET_SEARCH_TERM = 'RESET_SEARCH_TERM'

// Project Search
export const CLEAR_PROJECT_SEARCH       = 'CLEAR_PROJECT_SEARCH'
export const PROJECT_SEARCH             = 'PROJECT_SEARCH'
export const PROJECT_SEARCH_FAILURE     = 'PROJECT_SEARCH_FAILURE'
export const PROJECT_SEARCH_SUCCESS     = 'PROJECT_SEARCH_SUCCESS'
export const PROJECT_SEARCH_PENDING     = 'PROJECT_SEARCH_PENDING'
export const LOAD_MORE_PROJECTS         = 'LOAD_MORE_PROJECTS'
export const GET_PROJECTS               = 'GET_PROJECTS'
export const GET_PROJECTS_PENDING       = 'GET_PROJECTS_PENDING'
export const GET_PROJECTS_SUCCESS       = 'GET_PROJECTS_SUCCESS'
export const GET_PROJECTS_FAILURE       = 'GET_PROJECTS_FAILURE'
export const GET_PROJECTS_SEARCH_CRITERIA = 'GET_PROJECTS_SEARCH_CRITERIA'

// Project Search Suggestions (Typeahead)
export const CLEAR_PROJECT_SUGGESTIONS_SEARCH   = 'CLEAR_PROJECT_SUGGESTIONS_SEARCH'
export const PROJECT_SUGGESTIONS_SEARCH_FAILURE     = 'PROJECT_SUGGESTIONS_SEARCH_FAILURE'
export const PROJECT_SUGGESTIONS_SEARCH_SUCCESS     = 'PROJECT_SUGGESTIONS_SEARCH_SUCCESS'

// Project Dashboard
export const LOAD_PROJECT_DASHBOARD             = 'LOAD_PROJECT_DASHBOARD'
export const LOAD_PROJECT_DASHBOARD_PENDING     = 'LOAD_PROJECT_DASHBOARD_PENDING'
export const LOAD_PROJECT_DASHBOARD_FAILURE     = 'LOAD_PROJECT_DASHBOARD_FAILURE'
export const LOAD_PROJECT_DASHBOARD_SUCCESS     = 'LOAD_PROJECT_DASHBOARD_SUCCESS'


// Project Load
export const LOAD_PROJECT             = 'LOAD_PROJECT'
export const LOAD_PROJECT_PENDING     = 'LOAD_PROJECT_PENDING'
export const CLEAR_LOADED_PROJECT     = 'CLEAR_LOADED_PROJECT'
export const LOAD_PROJECT_FAILURE     = 'LOAD_PROJECT_FAILURE'
export const LOAD_PROJECT_SUCCESS     = 'LOAD_PROJECT_SUCCESS'

export const CREATE_PROJECT           = 'CREATE_PROJECT_REQUEST'
export const CREATE_PROJECT_SUCCESS   = 'CREATE_PROJECT_SUCCESS'
export const CREATE_PROJECT_FAILURE   = 'CREATE_PROJECT_FAILURE'

export const UPDATE_PROJECT_REQUEST   = 'UPDATE_PROJECT_REQUEST'
export const UPDATE_PROJECT_SUCCESS   = 'UPDATE_PROJECT_SUCCESS'
export const UPDATE_PROJECT_FAILURE   = 'UPDATE_PROJECT_FAILURE'

export const LOAD_MEMBERS             = 'LOAD_MEMBERS'
export const LOAD_MEMBERS_PENDING     = 'LOAD_MEMBERS_PENDING'
export const LOAD_MEMBERS_SUCCESS     = 'LOAD_MEMBERS_SUCCESS'
export const LOAD_MEMBERS_FAILURE     = 'LOAD_MEMBERS_FAILURE'

/*
 * User Roles
 */
export const ROLE_TOPCODER_USER = 'Topcoder User'
export const ROLE_TOPCODER_COPILOT = 'Topcoder Copilot'
export const ROLE_MANAGER = 'Manager'
export const ROLE_TOPCODER_MANAGER = 'Topcoder Manager'
export const ROLE_ADMINISTRATOR = 'administrator'


/*
 * URLs
 */
export const DOMAIN = process.env.domain || 'topcoder.com'
export const CONNECT_DOMAIN = `connect.${DOMAIN}`
export const ACCOUNTS_APP_CONNECTOR_URL = process.env.ACCOUNTS_APP_CONNECTOR_URL
export const ACCOUNTS_APP_LOGIN_URL = process.env.ACCOUNTS_APP_LOGIN_URL || 'https://accounts.topcoder-dev.com/connect'

// FIXME: Change to process.env.INTERNAL_API after added to webpack
export const INTERNAL_API = `https://internal-api.${DOMAIN}/v3`
export const TC_API_URL = `https://api.${DOMAIN}`
export const V3_API_URL = `https://api.${DOMAIN}/v3`

export const v3IdentityUrl = `${V3_API_URL}/users`

export const memberSearchTagUrl = `${INTERNAL_API}/tags/`

export const memberSearchUrl = `${INTERNAL_API}/members/_search/`
