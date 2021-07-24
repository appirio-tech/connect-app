import { axiosInstance as axios } from './requestInterceptor'
import { PROJECTS_API_URL } from '../config/constants'

export function updatePhaseMembers(projectId, phaseId, userIds) {
  const url = `${PROJECTS_API_URL}/v5/projects/${projectId}/phases/${phaseId}/members`
  const data = { userIds }
  return axios.post(url, data)
    .then(res => res.data)
}
