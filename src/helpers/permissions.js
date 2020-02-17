import store from '../config/store'
import _ from 'lodash'

/**
 * Check if user has permission.
 * (The main permission method which should be used).
 *
 * This method uses permission defined in `permission`
 * and checks that the logged-in user from Redux Store matches it.
 *
 * To check if user has `project` permissions it uses `project` currently loaded into Redux Store,
 * but this value can be overridden by providing `project` via argument.
 *
 * `permission` may be defined in two ways:
 *  - **Full** way with defined `allowRule` and optional `denyRule`, example:
 *    ```js
 *    {
 *       allowRule: {
 *          projectRoles: [],
 *          topcoderRoles: []
 *       },
 *       denyRule: {
 *          projectRoles: [],
 *          topcoderRoles: []
 *       }
 *    }
 *    ```
 *    If user matches `denyRule` then the access would be dined even if matches `allowRule`.
 *  - **Simplified** way may be used if we only want to define `allowRule`.
 *    We can skip the `allowRule` property and define `allowRule` directly inside `permission` object, example:
 *    ```js
 *    {
 *       projectRoles: [],
 *       topcoderRoles: []
 *    }
 *    ```
 *    This **simplified** permission is equal to a **full** permission:
 *    ```js
 *    {
 *       allowRule: {
 *         projectRoles: [],
 *         topcoderRoles: []
 *       }
 *    }
 *    ```
 *
 * If we define any rule with `projectRoles` list, we also should provide `project`
 * with the list of project members in `project.members`.
 *
 * @param {Object}        permissionRule               permission rule
 * @param {Array<String>} permissionRule.projectRoles  the list of project roles of the user
 * @param {Array<String>} permissionRule.topcoderRoles the list of Topcoder roles of the user
 * @param {Object}        [project]                    project object - required to check `topcoderRoles`
 * @param {Array}         project.members              list of project members - required to check `topcoderRoles`
 *
 * @returns {Boolean}     true, if has permission
 */
export const hasPermission = (permission, project) => {
  const user =  _.get(store.getState(), 'loadUser.user', {})
  const projectData = project || _.get(store.getState(), 'projectState.project')

  const allowRule = permission.allowRule ? permission.allowRule : permission
  const denyRule = permission.denyRule ? permission.denyRule : null

  const allow = matchPermissionRule(allowRule, user, projectData)
  const deny = matchPermissionRule(denyRule, user, projectData)

  return allow && !deny
}

/**
 * Check if user match the permission rule.
 * (Helper method, most likely wouldn't be used directly).
 *
 * This method uses permission rule defined in `permissionRule`
 * and checks that the `user` matches it.
 *
 * If we define a rule with `projectRoles` list, we also should provide `projectMembers`
 * - the list of project members.
 *
 * `permissionRule.projectRoles` may be equal to `true` which means user is a project member with any role
 *
 * @param {Object}        permissionRule               permission rule
 * @param {Array<String>|Boolean} permissionRule.projectRoles  the list of project roles of the user
 * @param {Array<String>} permissionRule.topcoderRoles the list of Topcoder roles of the user
 * @param {Object}        user                         user for whom we check permissions
 * @param {Object}        user.roles                   list of user roles
 * @param {Object}        [project]                    project object - required to check `topcoderRoles`
 * @param {Array}         project.members              list of project members - required to check `topcoderRoles`
 *
 * @returns {Boolean}     true, if has permission
 */
const matchPermissionRule = (permissionRule, user, project) => {
  let hasProjectRole = false
  let hasTopcoderRole = false

  // if no rule defined, no access by default
  if (!permissionRule) {
    return false
  }

  // check Project Roles
  if (permissionRule.projectRoles
    && project
    && project.members
  ) {
    const userId = !_.isNumber(user.userId) ? parseInt(user.userId, 10) : user.userId
    const member = _.find(project.members, { userId })

    if (permissionRule.projectRoles.length > 0) {
      hasProjectRole = member && _.includes(permissionRule.projectRoles, member.role)
    } else if (permissionRule.projectRoles === true) {
      // `projectRoles === true` means that we check if user is a member of the project
      // with any role
      hasProjectRole = !!member
    }
  }

  // check Topcoder Roles
  if (permissionRule.topcoderRoles && permissionRule.topcoderRoles.length > 0) {
    hasTopcoderRole = _.intersection(
      _.get(user, 'roles', []).map(role => role.toLowerCase()),
      permissionRule.topcoderRoles.map(role => role.toLowerCase())
    ).length > 0
  }

  return hasProjectRole || hasTopcoderRole
}