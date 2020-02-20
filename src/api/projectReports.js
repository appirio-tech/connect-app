import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

/**
 * Get a project summary
 *
 * @param  {integer} projectId unique identifier of the project
 */
export function getProjectSummary(projectId) {

  const summaryPromise = axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/reports?reportName=summary`)
  const budgetPromise = axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/reports?reportName=projectBudget`)

  return Promise.all([summaryPromise, budgetPromise]).then(responses => {
    const res = responses[0].data
    const designMetrics = _.find(res, c => c['challenge.track'] === 'Design') || {}
    const totalRegistrants = _.sumBy(res, c => c['challenge.num_registrations'])

    const res1 = responses[1].data
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

/**
 * Gets signed URL for embeding the requested report.
 * @param {*} projectId id of the project for which report is to be fecthed
 * @param {*} reportName unique name of the report
 */
export function getProjectReportUrl(projectId, reportName) {
  return axios.get(`${PROJECTS_API_URL}/v5/projects/${projectId}/reports/embed?reportName=${reportName}`)
    .then(resp => resp.data)
}