import store from '../config/store'
import _ from 'lodash'

export const checkPermission = (permission, project, entity) => {
  const {projectRoles, topcoderRoles, handler} = permission
  const currentUser =  _.get(store.getState(), 'loadUser.user', {})
  const roles = currentUser.roles || []

  if(project && projectRoles){
    const currentProjectMember = _.find(project.members, m => m.userId===currentUser.userId)
    if (currentProjectMember){
      const currentUserRole = currentProjectMember.role
      if (projectRoles.includes(currentUserRole)){
        return true
      }
    }
  }

  if(topcoderRoles && roles.some(role => topcoderRoles.indexOf(role) !== -1)) {
    return true
  }

  if(handler && handler(currentUser, entity, project)) {
    return true
  }

  return false
}
