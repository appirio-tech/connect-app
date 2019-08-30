import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Get a project summary
 *
 * @param  {integer} projectId unique identifier of the project
 */
export function getProjectSummary(projectId) {

  const summaryPromise = axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/reports?reportName=summary`)
  const budgetPromise = axios.get(`${PROJECTS_API_URL}/v4/projects/${projectId}/reports?reportName=projectBudget`)

  return Promise.all([summaryPromise, budgetPromise]).then(responses => {
    const res = _.get(responses[0].data, 'result.content', {})
    const designMetrics = _.find(res, c => c['challenge.track'] === 'Design') || {}
    const totalRegistrants = _.sumBy(res, c => c['challenge.num_registrations'])

    const res1 = _.get(responses[1].data, 'result.content', {})
    const filterReport = c => `${c['project_stream.tc_connect_project_id']}` === projectId.toString()
    const projectBudget = _.find(res1, filterReport) || {}

    return {
      projectId,
      budget: {
        work: parseFloat(projectBudget['project_stream.total_actual_member_payment'] || 0),
        fees: parseFloat(projectBudget['project_stream.total_actual_challenge_fee'] || 0),
        revenue: parseFloat(projectBudget['project_stream.total_invoiced_amount'] || 0),
        remaining: parseFloat(projectBudget['project_stream.remaining_invoiced_budget'] || 0)
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
    }
  })
}
