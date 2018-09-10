/**
 * Project and product templates API service
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get projects metadata (projectTemplates, productTemplates and projectTypes)
 *
 * @return {Promise} projects metadata (projectTemplates, productTemplates and projectTypes)
 */
export function getProjectsMetadata() {
  return axios.get(`${TC_API_URL}/v4/projects/metadata`)
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
  return axios.get(`${TC_API_URL}/v4/projects/metadata/projectTemplates/${projectTemplateId}`)
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
  return axios.get(`${TC_API_URL}/v4/projects/metadata/productTemplates/${productTemplateId}`)
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
  const params = {}
  if (productKey) {
    params['filter'] = `productKey=${productKey}`
  }

  return axios.get(`${TC_API_URL}/v4/projects/metadata/productTemplates/`, { params })
  // we only get first product of result in case provide productKey otherwise we get all the products
    .then(resp => _.get(resp.data, (productKey ? 'result.content[0]' : 'result.content'), {}))
}
