import _ from 'lodash'
import { TC_API_URL } from '../config/constants'
import { axiosInstance as axios } from './requestInterceptor'
import qs from 'query-string'


/**
 * Api request for fetching skills
 *
 * @param {String} term search key
 *
 * @returns {Promise<*>}
 */
export const searchSkills = async (term) => {
  const skills = await axios.get(`${TC_API_URL}/v5/emsi-skills/skills/auto-complete?${qs.stringify({
    term
  })}`)
  return _.get(skills, 'data', [])
}
