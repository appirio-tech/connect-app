import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL, PROJECTS_LIST_PER_PAGE } from '../config/constants'

export function getProjects(criteria, pageNum) {
  // add default params
  const includeFields = ['id', 'name', 'description', 'members', 'invites', 'status', 'type', 'actualPrice', 'estimatedPrice', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'details', 'lastActivityAt', 'lastActivityUserId', 'version', 'templateId']
  const params = {
    fields: includeFields.join(','),
    sort: 'updatedAt+desc', // default sort value
    perPage: PROJECTS_LIST_PER_PAGE,
    page: pageNum,
    ...criteria,
  }
  // filters
  const filter = _.omit(criteria, ['sort'])
  if (!_.isEmpty(filter)) {
    // support for multiple comma separated types
    if (filter.type && filter.type.indexOf(',') > -1) {
      params.type = `in(${filter.type})`
    }
  }

  return axios.get(`${PROJECTS_API_URL}/v5/projects/`, { params })
    .then( resp => {
      return {
        totalCount: parseInt(_.get(resp.headers, 'x-total', 0)),
        projects: resp.data,
      }
    })
}

export function getProjectSuggestions() {
  // TODO
}

/**
 * Get a challenge detail based on it's id
 * @param  {integer} challenId challenge id
 * @return {object}           challenge detail returned by api
 */
export function getChallengeById(challengeId) {
  return axios.get(`${PROJECTS_API_URL}/v5/challenges/${challengeId}/`)
    .then(resp => {
      const res = resp.data
      return res
    })
}


/**
 * Get a project based on it's id
 * @param  {integer} projectId unique identifier of the project
 * @return {object}           project returned by api
 */
export function getProjectById(projectId) {
  projectId = parseInt(projectId)
  return axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/`)
    .then(resp => {
      const res = resp.data
      _.forEach(res.attachments, a => {
        a.downloadUrl = `/projects/${projectId}/attachments/${a.id}`
      })
      if (!res.invites) res.invites = []
      return res
    })
}

/**
 * Get project phases
 *
 * @param {String}             projectId project id
 * @param {{ fields: String }} query     request query params
 *
 * @return {Promise} resolves to project phases
 */
export function getProjectPhases(projectId, query = {}) {
  const params = _.mapValues(query, (param) => encodeURIComponent(param))

  // const mockaData = [{
  //   "products":[{"updatedBy":40152856,"actualPrice":0,"phaseId":8730,"billingAccountId":null,"templateId":176,"type":"generic-product","createdAt":"2021-08-05T20:38:08.587Z","createdBy":40152856,"estimatedPrice":0,"name":"Generic Product","details":{},"id":8794,"directProjectId":null,"projectId":18162,"updatedAt":"2021-08-05T20:38:08.588Z"}],
  //   "budget":0,
  //   "createdAt":"2021-08-05T20:38:08.575Z",
  //   "createdBy":40152856,
  //   "details":{},
  //   "duration":null,
  //   "endDate":"2021-08-12T00:00:00.000Z",
  //   "id":8730,
  //   "name":"a1",
  //   "description":null,
  //   "progress":0,
  //   "projectId":18162,
  //   "spentBudget":0,
  //   "startDate":"2021-08-09T00:00:00.000Z",
  //   // "status":"in_review",
  //   "status":"reviewed",
  //   "updatedAt":"2021-08-06T03:06:39.277Z",
  //   "updatedBy":40152856,
  //   // "approvals": [{id: 0, decision: "approve", comment: ""}],
  //   "approvals": [{id: 0, decision: "reject", comment: "rej"}],
  //   "members":[]},

  //   {"products":[{"updatedBy":40152856,"actualPrice":0,"phaseId":8730,"billingAccountId":null,"templateId":176,"type":"generic-product","createdAt":"2021-08-05T20:38:08.587Z","createdBy":40152856,"estimatedPrice":0,"name":"Generic Product","details":{},"id":8794,"directProjectId":null,"projectId":18162,"updatedAt":"2021-08-05T20:38:08.588Z"}],
  //   "budget":0,
  //   "createdAt":"2021-08-05T20:38:08.575Z",
  //   "createdBy":40152856,
  //   "details":{},
  //   "duration":null,
  //   "endDate":"2021-08-12T00:00:00.000Z",
  //   "id":8730,
  //   "name":"a2",
  //   "description":null,
  //   "progress":0,
  //   "projectId":18162,
  //   "spentBudget":0,
  //   "startDate":"2021-08-09T00:00:00.000Z",
  //   // "status":"in_review",
  //   "status":"reviewed",
  //   "updatedAt":"2021-08-06T03:06:39.277Z",
  //   "updatedBy":40152856,
  //   // "approvals": [{id: 0, decision: "approve", comment: ""}],
  //   "approvals": [{id: 0, decision: "reject", comment: "rej1"}],
  //   "members":[]},
  // ]
  // return Promise.resolve(mockaData)

  return axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases`, { params })
    .then(resp => {console.log('resp.data', query, resp.data); return resp.data})
}

/**
 * Get project phase products
 *
 * @param {String} projectId project id
 * @param {String} phaseId   phase id
 *
 * @return {Promise} resolves to project phase products
 */
export function getPhaseProducts(projectId, phaseId) {
  return axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/products`)
    .then(resp => resp.data)
}

/**
 * Update project using patch
 * @param  {integer} projectId    project Id
 * @param  {object} updatedProps updated project properties
 * @param  {boolean} updateExisting update existing or new project
 * @return {promise}              updated project
 */
export function updateProject(projectId, updatedProps, updateExisting) {
  return axios.patch(`${PROJECTS_API_URL}/v5/projects/${projectId}/`, updatedProps)
    .then(resp => {
      return _.extend(resp.data, { updateExisting })
    })
}

/**
 * Create scope change request for the given project with the given details
 * @param  {integer} projectId    project Id
 * @param  {object} request scope change request object
 * @return {promise}              created scope change request
 */
export function createScopeChangeRequest(projectId, request) {
  return axios.post(`${PROJECTS_API_URL}/v5/projects/${projectId}/scopeChangeRequests`, request)
    .then(resp => resp.data)
}/**
 * Create scope change request for the given project with the given details
 * @param  {integer} projectId    project Id
 * @param  {integer} requestId    scope change request Id
 * @param  {object} updatedProps updated request properties
 * @return {promise}              updated request
 */
export function updateScopeChangeRequest(projectId, requestId, updatedProps) {
  return axios.patch(`${PROJECTS_API_URL}/v5/projects/${projectId}/scopeChangeRequests/${requestId}`, updatedProps)
    .then(resp => resp.data)
}

/**
 * Update phase using patch
 * @param  {integer} projectId    project Id
 * @param  {integer} phaseId    phase Id
 * @param  {object} updatedProps updated phase properties
 * @param  {integer} phaseIndex index of phase in phase list redux store
 * @return {promise}              updated phase
 */
export function updatePhase(projectId, phaseId, updatedProps, phaseIndex) {
  return axios.patch(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}`, updatedProps)
    .then(resp => {
      return _.extend(resp.data, {phaseIndex})
    })
}

/**
 * Create phase apprvoal
 * @param  {integer} projectId    project Id
 * @param  {integer} phaseId    phase Id
 * @param  {object} updatedProps updated phase properties
 * @param  {integer} phaseIndex index of phase in phase list redux store
 * @return {promise}              created phase approval
 */
export function createPhaseApproval(projectId, phaseId, updatedProps, phaseIndex) {
  return axios.post(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/approvals`, updatedProps)
    .then(resp => {
      return _.extend(resp.data, {phaseIndex})
    })
}

/**
 * Update product using patch
 *
 * @param  {Number} projectId    project Id
 * @param  {Number} phaseId      phase Id
 * @param  {Number} productId    product Id
 * @param  {Object} updatedProps updated project properties
 *
 * @return {Promise}             updated product
 */
export function updateProduct(projectId, phaseId, productId, updatedProps) {
  return axios.patch(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/products/${productId}`, updatedProps)
    .then(resp => resp.data)
}


export function createProject(projectProps) {
  // Phase out discussions
  // TODO: Remove this once none of the active projects
  // have the discussions tab enabled
  projectProps.details.hideDiscussions = true

  return axios.post(`${PROJECTS_API_URL}/v5/projects/`, projectProps)
    .then( resp => resp.data)
}

/**
 * Create new phase for project
 *
 * @param {String} projectId project id
 * @param {Object} phase     new phase
 *
 * @return {Promise} resolves to new phase
 */
export function createProjectPhase(projectId, phase) {
  return axios.post(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases`, phase)
    .then( resp => resp.data)
}

/**
 * Create new product for project's phase
 *
 * @param {String} projectId project id
 * @param {String} phaseId   phase id
 * @param {Object} product   new product
 *
 * @return {Promise} resolves to new product
 */
export function createPhaseProduct(projectId, phaseId, product) {
  return axios.post(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/products`, product)
    .then( resp => resp.data)
}

export function deleteProject(projectId) {
  return axios.delete(`${PROJECTS_API_URL}/v5/projects/${projectId}/`)
    .then(() => {
      return projectId
    })
}

export function deleteProjectPhase(projectId, phaseId) {
  return axios.delete(`${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}`)
    .then(() => ({ projectId, phaseId }))
}
