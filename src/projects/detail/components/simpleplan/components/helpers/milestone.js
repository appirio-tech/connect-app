import moment from 'moment'
import * as constants from '../../../../../../config/constants'

let nextId = 0
export function createEmptyMilestone(startDate, endDate) {
  startDate = startDate ? moment(startDate) : moment()
  endDate = endDate ? moment(endDate) : moment(startDate).add(3, 'days')

  return {
    id: `new-milestone-${nextId++}`,
    name: '',
    description: '',
    startDate: moment(startDate).format('YYYY-MM-DD'),
    endDate: moment(endDate).format('YYYY-MM-DD'),
    status: constants.PHASE_STATUS_DRAFT,
    budget: 0,
  }
}
