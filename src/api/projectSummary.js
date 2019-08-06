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
      const designMetrics = _.find(res, c => c['challenge.track'] === 'Design') || {}
      const totalRegistrants = _.sumBy(res, c => c['challenge.num_registrations'])

      return Promise.resolve({
        projectId,
        budget: {
          work: 40250,
          fees: 10430,
          revenue: 40250,
          remaining: 19750
        },
        // null values will be filled in as back-end implementation/integration is done. 
        topcoderDifference: {
          countries: null,
          registrants: totalRegistrants,
          designs: designMetrics['challenge.num_submissions'],
          linesOfCode: null,
          hoursSaved: null,
          costSavings: null,
          valueCreated: null,
        }
      })
    })

}
