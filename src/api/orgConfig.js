import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Get organization configurations based on it's group ids
 *
 * @param {Array} groupIds list of group ids
 *
 * @returns {Promise<Object>} organization config data
 */
export function getOrgConfig(groupIds) {
  return axios.get(`${PROJECTS_API_URL}/v4/projects/metadata/orgConfig?filter=orgId=in(${groupIds})`)
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}
