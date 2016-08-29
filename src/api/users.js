import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { V3_API_URL } from '../config/constants'

/**
 * Get a user basd on it's handle/username
 * @param  {integer} handle unique identifier of the user
 * @return {object}           user returned by api
 */
export function getUserProfile(handle) {
  return axios.get(`${V3_API_URL}/members/${handle}/`)
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}
