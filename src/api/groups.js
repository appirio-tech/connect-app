import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get a user groups based on it's member id and membership type
 *
 * @param {String} memberId user member id
 *
 * @param {String} membershipType user membership type
 *
 * @returns {Promise<Object>} user groups data
 */
export function getUserGroups(memberId, membershipType) {
  return axios.get(`${TC_API_URL}/v3/groups?memberId=${memberId}&membershipType=${membershipType}`)
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}
