/**
 * Project and product templates API service
 *
 * TODO $PROJECT_PLAN$
 *   This is mock for API service, which tough returns **real data** already.
 *   It has to bbe replaced with real API calling when API is ready.
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

// import projectTemplates from './templates-json/project-templates.json'
import projectTypes from './templates-json/project-types.json'
import productTemplates from './templates-json/product-templates.json'

/**
 * Get the list of project templates
 *
 * @return {Promise} list of project templates
 */
export function getProjectTemplates() {
  return axios.get(`${TC_API_URL}/v4/projectTemplates`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get project template by id
 *
 * @param {String} projectTemplateId project template id
 *
 * @return {Promise} project template
 */
export function getProjectTemplate(projectTemplateId) {
  return axios.get(`${TC_API_URL}/v4/projectTemplates/${projectTemplateId}`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get product template by id
 *
 * @param {String} productTemplateId product template id
 *
 * @return {Promise} product template
 */
export function getProductTemplate(productTemplateId) {
  return axios.get(`${TC_API_URL}/v4/productTemplates/${productTemplateId}`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get product template by key
 *
 * TODO $PROJECT_PLAN$ so far this method is mocked and has to be updated with real one
 *
 * This is only need for old project which doesn't have `templateId`
 *
 * @param {String} productKey product template key
 *
 * @return {Promise} product template
 */
export function getProductTemplateByKey(productKey) {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(_.find(productTemplates, { productKey }))
    }, 1000)
  })
}

/**
 * Get the list of project categories
 *
 * TODO $PROJECT_PLAN$ so far this method is mocked and has to be updated with real one
 * TODO $PROJECT_PLAN$ this mock has to be updated to be project categories instead of project types
 *
 * @return {Promise} list of project categories
 */
export function getProjectTypes() {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(projectTypes)
    }, 3000)
  })
}
