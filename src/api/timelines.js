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

function mockMilestone(timelineId, milestoneId, type, status) {
  const startDate = mockMilestone.startDate
  const endDate = mockMilestone.startDate.clone().add('5', 'days')

  mockMilestone.startDate = endDate.clone().add('1', 'days')

  if (!milestoneId) {
    milestoneId = ++mockMilestone.id
    let timeline = mockMilestone.timelines[timelineId]

    if (!timeline) {
      timeline = {}
      mockMilestone.timelines[timelineId] = timeline
    }

    const milestone = {
      id: milestoneId,
      name: type.split('-').join(' '),
      description: 'Please review and answer all the questions on the specification document before we can proceed',
      startDate: startDate.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      endDate: endDate.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
      duration: 15,
      status,
      type,
      details: status === 'completed' ? {
        content: {
          specificationUrl: 'http://drive.google.com',
          links: [
            { title: 'link 1', url: 'http://google.com/1', type: 'marvelapp', selectedPlace: 1 },
            { title: 'link 2', url: 'http://twitter.com/2', type: 'marvelapp', selectedPlace: 2 },
            { title: 'link 3', url: 'http://google.com/3', type: 'marvelapp', selectedPlace: 3 },
            { title: 'link 4', url: 'http://twitter.com/4', type: 'marvelapp', isSelected: true },
            { title: 'link 5', url: 'http://google.com/5', type: 'marvelapp', isSelected: true },
            { title: 'link 6', url: 'http://twitter.com/6', type: 'marvelapp' }
          ],
          finalFixRequests: [
            { value: 'request 1' },
            { value: 'request 2' },
          ],
          isInReview: true,
        },
      } : {},
      timelineId,
      order: 1,
      plannedText: 'Before we can launch the actual work, we have to complete the phase technical details. Your copilot will reach out shortly to discuss the phase specification with you. Please monitor your phase communication thread for updates.',
      activeText: 'Please review and answer all the questions on the specification document before we can proceed.',
      blockedText: 'dummy blockedText',
      completedText: 'Great job! We\'re ready to roll. Work on this project phase would begin shortly.',
      hidden: type === 'final-fixes' && status !== 'completed',
    }

    timeline[milestoneId] = milestone
  }

  return mockMilestone.timelines[timelineId][milestoneId]
}

mockMilestone.timelines = {}
mockMilestone.id = 0
mockMilestone.startDate = moment().subtract(3, 'days')

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
    mockMilestone(timelineId, null, 'phase-specification', 'completed'),
    mockMilestone(timelineId, null, 'community-work', 'completed'),
    mockMilestone(timelineId, null, 'community-review', 'completed'),
    mockMilestone(timelineId, null, 'checkpoint-review', 'completed'),
    mockMilestone(timelineId, null, 'final-designs', 'active'),
    mockMilestone(timelineId, null, 'final-fixes', 'planned'),
    mockMilestone(timelineId, null, 'delivery', 'planned'),
  ])

  return axios.get(`${TC_API_URL}/v4/timelines/${timelineId}/milestones`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

export function updateMilestone(timelineId, milestoneId, updatedProps) {
  return mockResponse({
    ...mockMilestone(timelineId, milestoneId, updatedProps.type, updatedProps.status),
    ...updatedProps
  })

  return axios.patch(`${TC_API_URL}/v4/timelines/${timelineId}/milestones/${milestoneId}`, {
    param: updatedProps,
  })
    .then(resp => _.get(resp.data, 'result.content'))
}
