import { updatePhaseMembers as updatePhaseMembersAPI } from '../../api/phaseMembers'

export function updatePhaseMembers(projectId, phaseId, userIds) {
  return (dispatch) => {
    return dispatch({
      type: 'UPDATE_PROJECT_PHASE_MEMBERS',
      payload: updatePhaseMembersAPI(projectId, phaseId, userIds)
    })
  }
}
