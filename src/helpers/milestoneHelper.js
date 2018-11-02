import _ from 'lodash'

import { MILESTONE_STATUS } from '../config/constants'
import { MILESTONE_STATUS_TEXT } from '../config/constants'

export const getMilestoneStatusText = (milestone) => {
  const status = milestone && milestone.status ? milestone.status : MILESTONE_STATUS.PLANNED
  const statusTextMap = _.find(MILESTONE_STATUS_TEXT, s => s.status === status)
  const statusText = statusTextMap ? statusTextMap.textValue : MILESTONE_STATUS.PLANNED
  return milestone[statusText]
}