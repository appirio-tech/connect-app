import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Get a project summary
 *
 * @param  {integer} projectId unique identifier of the project
 */
export function getProjectSummary(projectId) {
  return axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/reports?reportName=summary`)
    .then(resp => {
      const res = _.get(resp.data, 'result.content', {})
      const challengeMetrics = _.find(res, c => c['challenge.track'] === null)

      return Promise.resolve({
        projectId,
        budget: {
          work: 40250,
          fees: 10430,
          revenue: 40250,
          remaining: 19750
        },
        topcoderDifference: {
          countries: 12,
          registrants: challengeMetrics['challenge.num_registrations'],
          designs: challengeMetrics['challenge.num_submissions'],
          linesOfCode: 1500000,
          hoursSaved: 450,
          costSavings: 45000,
          valueCreated: 670000
        }
      })
    })

}
