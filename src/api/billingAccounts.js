import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get a user groups based on it's member id and membership type
 *
 * @param {String} projectId Id of the project
 *
 * @returns {Promise<Object>} Billing accounts data
 */
export function fetchBillingAccounts(projectId) {
  return axios.get(`${TC_API_URL}/v5/projects/${projectId}/billingAccounts`)
}

