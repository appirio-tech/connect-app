import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, PROJECTS_API_URL, PROJECTS_LIST_PER_PAGE } from '../config/constants'

export function getProjects(criteria, pageNum) {
  // add default params
  const includeFields = ['id', 'name', 'description', 'members', 'status', 'type', 'actualPrice', 'estimatedPrice', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'details', 'lastActivityAt', 'lastActivityUserId', 'version']
  const params = {
    limit: PROJECTS_LIST_PER_PAGE,
    offset: (pageNum - 1) * PROJECTS_LIST_PER_PAGE,
    fields: includeFields.join(',')
  }
  // filters
  const filter = _.omit(criteria, ['sort'])
  if (!_.isEmpty(filter)) {
    // support for multiple comma separated types
    if (filter.type && filter.type.indexOf(',') > -1) {
      filter.type = `in(${filter.type})`
    }
    // support for multiple comma separated segments
    if (filter.segment && filter.segment.indexOf(',') > -1) {
      filter.segment = `in(${filter.segment})`
    }
    // convert filter object to string
    const filterStr = _.map(filter, (v, k) => `${k}=${encodeURIComponent(v)}`)
    params.filter = filterStr.join('&')
  }
  // sort fields
  const sort = _.get(criteria, 'sort', null)
  if (sort) params.sort = sort

  return axios.get(`${PROJECTS_API_URL}/v4/projects/`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        projects: _.get(resp.data, 'result.content', [])
      }
    })
}

export function getProjectSuggestions() {
  // TODO
}


/**
 * Get a project based on it's id
 * @param  {integer} projectId unique identifier of the project
 * @return {object}           project returned by api
 */
export function getProjectById(projectId) {
  projectId = parseInt(projectId)
  return axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/`)
    .then(resp => {
      const res = _.get(resp.data, 'result.content', {})
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

  return axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases`, { params })
    .then(resp => _.get(resp.data, 'result.content', {}))
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
  return axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}/products`)
    .then(resp => {
      const res = _.get(resp.data, 'result.content', {})
      return res
    })
}

/**
 * Update project using patch
 * @param  {integer} projectId    project Id
 * @param  {object} updatedProps updated project properties
 * @param  {boolean} updateExisting update existing or new project
 * @return {promise}              updated project
 */
export function updateProject(projectId, updatedProps, updateExisting) {
  return axios.patch(`${PROJECTS_API_URL}/v4/projects/${projectId}/`, { param: updatedProps })
    .then(resp => {
      return _.extend(_.get(resp.data, 'result.content'), { updateExisting })
    })
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
  return axios.patch(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}`, { param: updatedProps })
    .then(resp => {
      return _.extend(_.get(resp.data, 'result.content'), {phaseIndex})
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
  return axios.patch(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}/products/${productId}`, {
    param: updatedProps,
  })
    .then(resp => {
      return _.get(resp.data, 'result.content')
    })
}


export function createProject(projectProps) {
  // Phase out discussions
  // TODO: Remove this once none of the active projects
  // have the discussions tab enabled
  projectProps.details.hideDiscussions = true

  return axios.post(`${PROJECTS_API_URL}/v4/projects/`, { param: projectProps })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
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
  return axios.post(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases`, { param: phase })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
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
  return axios.post(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}/products`, { param: product })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function createProjectWithStatus(projectProps, status) {
  // Phase out discussions
  // TODO: Remove this once none of the active projects
  // have the discussions tab enabled
  projectProps.details.hideDiscussions = true

  return axios.post(`${PROJECTS_API_URL}/v4/projects/`, { param: projectProps })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
    .then(project => {
      const updatedProps = { status }
      const projectId = project.id
      return axios.patch(`${PROJECTS_API_URL}/v4/projects/${projectId}/`, { param: updatedProps })
        .then(resp => {
          return _.get(resp.data, 'result.content')
        })
        .catch(error => { // eslint-disable-line no-unused-vars
          // return created project even if status update fails to prevent error page
          return project
        })
    })
}

export function deleteProject(projectId) {
  return axios.delete(`${PROJECTS_API_URL}/v4/projects/${projectId}/`)
    .then(() => {
      return projectId
    })
}

export function getDirectProjectData(directProjectId) {
  return axios.get(`${TC_API_URL}/v3/direct/projects/${directProjectId}`)
    .then(resp => {
      return resp.data.result.content
    })
}

export function deleteProjectPhase(projectId, phaseId) {
  return axios.delete(`${PROJECTS_API_URL}/v4/projects/${projectId}/phases/${phaseId}`)
    .then(() => ({ projectId, phaseId }))
}
