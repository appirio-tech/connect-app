import get from 'lodash/get'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get a user basd on it's handle/username
 * @param  {integer} handle unique identifier of the user
 * @return {object}           user returned by api
 */
export function getUserProfile(handle) {
  return axios.get(`${TC_API_URL}/v3/members/${handle}/`)
    .then(resp => {
      return get(resp.data, 'result.content', {})
    })
}
