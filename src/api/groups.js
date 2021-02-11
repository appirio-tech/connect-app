import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get a user groups based on it's member id and membership type
 *
 * @param {Object} query fetch group query
 *
 * @param {String} params fetch group url params
 *
 * @returns {Promise<Object>} user groups data
 */
export function fetchGroups(query, params = '') {
  const queryString = new URLSearchParams(query)
  return axios.get(`${TC_API_URL}/v5/groups${params}?${queryString}`)
}
