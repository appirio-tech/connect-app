/**
 * Project and product templates API service
 */
import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

import moment from 'moment'

function mockResponse(data, timeout = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, timeout)
  })
}

function mockMilestone(timelineId, milestoneId) {
  return {
    id: typeof milestoneId !== 'undefined' ? milestoneId : ++mockMilestone.id,
    description: 'Please review and answer all the questions on the specification document before we can proceed',
    startDate: moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    endDate: moment().add('5', 'days').format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    duration: 15,
    status: 'active',
    type: 'phase-specification',
    details: {},
    timelineId,
    order: 1,
    plannedText: 'dummy plannedText',
    activeText: 'dummy activeText',
    blockedText: 'dummy blockedText',
    completedText: 'dummy completedText',
  }
}

mockMilestone.id = 0

/**
 * Get timeline by reference
 *
 * @return {Promise} list of project templates
 */
export function getTimelinesByReference(reference, referenceId) {
  const filterQuery = encodeURIComponent(`reference=${reference}&referenceId=${referenceId}`)

  return mockResponse([{
    id: (getTimelinesByReference.id = (getTimelinesByReference.id || 0) + 1),
    name: 'Welcome to the design phase',
    description: 'This is the first stage in our project. We’re going to show you the detailed plan in your timeline, with all the milestones. During the execution the milestones will change to reflect the progress, collect your feedback, and deliver the final product. Check the <a href="https://www.youtube.com/channel/UCFv29ANLT2FQmtvS9DRixNA" target="_blank" rel="noopener noreferrer">YouTube video</a> and our <a href="https://help.topcoder.com/hc/en-us/articles/225540188-Topcoder-Connect-FAQs" target="_blank" rel="noopener noreferrer">help article</a> for more information. If you still have questions, please ask them in the stage message channel and we’ll be happy to assist you.',
    startDate: moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    endDate: moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
    reference,
    referenceId,
  }])

  return axios.get(`${TC_API_URL}/v4/timelines?filter=${filterQuery}`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}


export function getTimelineMilestones(timelineId) {
  return mockResponse([
    mockMilestone(timelineId)
  ])

  return axios.get(`${TC_API_URL}/v4/timelines/${timelineId}/milestones`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

export function updateMilestone(timelineId, milestoneId, updatedProps) {
  return mockResponse({
    ...mockMilestone(timelineId, milestoneId),
    ...updatedProps
  })

  return axios.patch(`${TC_API_URL}/v4/timelines/${timelineId}/milestones/${milestoneId}`, {
    param: updatedProps,
  })
    .then(resp => _.get(resp.data, 'result.content'))
}
