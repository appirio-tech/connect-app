import _ from 'lodash'
import { 
  PROJECT_ROLE_CUSTOMER, PROJECT_ROLE_OWNER
} from '../config/constants'

export const getProjectRoleForCurrentUser = ({currentUserId, project}) => {
  let role = null
  if (project) {
    const member = _.find(project.members, m => m.userId === currentUserId)
    if (member) {
      role = member.role
      if (role === PROJECT_ROLE_CUSTOMER && member.isPrimary)
        role = PROJECT_ROLE_OWNER
    }
  }
  return role
}

export const setDuration = ({duration, status}) => {
  let percent =''
  let title = ''
  let text = ''
  let type = 'completed' // default
  if (duration  && duration.plannedDuration) {
    const {actualDuration, plannedDuration} = duration
    if (status === 'draft') {
      title = 'Duration'
      percent = 0
      text = 'Complete specification to get estimate'
    } else if (status === 'in_review') {
      title = 'Duration'
      percent = 0
      text = 'Pending review'
    } else if (status === 'reviewed') {
      title = `${plannedDuration} days (projected)`
      percent = 0
      text = `${plannedDuration} days remaining`
    } else if (status === 'completed') {
      title = 'Completed'
      percent = 100
      text = ''
      type = 'completed'
    } else {
      text = `Day ${actualDuration} of ${plannedDuration}`
      percent = actualDuration / plannedDuration * 100
      if (0 <= percent && percent < 100) {
        const diff = plannedDuration - actualDuration
        title = `${diff} ${diff > 1 ? 'days' : 'day'} remaining`
        type = 'working'
      } else {
        percent = 100
        type = 'error'
        const diff = actualDuration - plannedDuration
        title = `${diff} ${diff > 1 ? 'days' : 'day'} over`
      }
    }
  } else {
    title = 'Duration'
    percent = 0
    text = status === 'draft' ? 'Complete specification to get estimate' : 'Estimate not entered'
  }
  return { title, text, percent, type }
}
