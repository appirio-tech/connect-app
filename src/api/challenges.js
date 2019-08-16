import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, CHALLENGE_LIST_PER_PAGE } from '../config/constants'


/**
 * Get challenge by filter string and offset
 * @param {String} filterString filter string
 * @param {Number} offset offset of challenge list
 *
 * @return {Promise<[]>} list of challenges
 */
export function getChallengesByFilter(filterString, offset) {
  let pageQuery = ''
  if(!_.isNil(offset)) {
    pageQuery = `&limit=${CHALLENGE_LIST_PER_PAGE}&offset=${offset}`
  }

  return axios.get(`${TC_API_URL}/v4/challenges?filter=${filterString}${pageQuery}`)
    .then(resp => ({
      challenges: _.get(resp.data, 'result.content', {}),
      metadata: _.get(resp.data, 'result.metadata', {}),
    }))
}