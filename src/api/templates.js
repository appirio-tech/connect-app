/**
 * Project and product templates API service
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

// import projectTemplates from './templates-json/project-templates.json'
import projectCategories from './templates-json/project-categories.json'
// import productTemplates from './templates-json/product-templates.json'

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
 * Get all product template
 *
 * @return {Promise} all product template
 */
export function getAllProductTemplate() {
  return axios.get(`${TC_API_URL}/v4/productTemplates/`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get product template by key
 *
 * This is only need for old project which doesn't have `templateId`
 *
 * @param {String} productKey product template key
 *
 * @return {Promise} product template
 */
export function getProductTemplateByKey(productKey) {
  const params = {
    filter: `productKey=${productKey}`
  }

  return axios.get(`${TC_API_URL}/v4/productTemplates/`, { params })
    .then(resp => _.get(resp.data, 'result.content[0]', {}))
}

/**
 * Get the list of project categories
 *
 * TODO $PROJECT_PLAN$ so far this method is mocked and has to be updated with real one
 *
 * @return {Promise} list of project categories
 */
export function getProjectCategories() {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(projectCategories)
    }, 3000)
  })
}
