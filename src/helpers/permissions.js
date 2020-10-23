import store from '../config/store'
import _ from 'lodash'
import { DEFAULT_PROJECT_ROLE } from '../config/permissions'

/**
 * Check if user has permission.
 * - By default this method if logged-in user has `permission` for the project
 *   currently loaded in the Redux Store.
 * - Optionally, we can check permission for another `project` or `user` by passing them in `entities` argument.
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
 * @param {Object}        permissionRule               permission rule
 * @param {Array<String>} permissionRule.projectRoles  the list of project roles of the user
 * @param {Array<String>} permissionRule.topcoderRoles the list of Topcoder roles of the user
 * @param {Object}        [entities]                   `project` and `user` which has to be used to check permission
 * @param {Object}        [entities.project]           project
 * @param {Array}         entities.project.members     list of project members
 * @param {Object}        [entities.user]              user
 * @param {String}        entities.user.role                    user Project Role
 *
 * @returns {Boolean}     true, if has permission
 */
export const hasPermission = (permission, entities = {}) => {
  const user =  entities.user || _.get(store.getState(), 'loadUser.user', {})
  const project = entities.project || _.get(store.getState(), 'projectState.project')

  const allowRule = permission.allowRule ? permission.allowRule : permission
  const denyRule = permission.denyRule ? permission.denyRule : null

  const allow = matchPermissionRule(allowRule, user, project)
  const deny = matchPermissionRule(denyRule, user, project)

  // uncomment for debugging
  // console.warn('hasPermission', permission, project, allow && !deny)

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
 * `permissionRule.topcoderRoles` may be equal to `true` which means user is a logged-in user
 *
 * @param {Object}        permissionRule               permission rule
 * @param {Array<String>|Array<Object>|Boolean} permissionRule.projectRoles  the list of project roles of the user
 * @param {Array<String>|Boolean} permissionRule.topcoderRoles the list of Topcoder roles of the user
 * @param {Object}        user                         user for whom we check permissions
 * @param {String}        user.role                    user Project Role
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
      // as we support `projectRoles` as strings and as objects like:
      // { role: "...", isPrimary: true } we have normalize them to a common shape
      const normalizedProjectRoles = permissionRule.projectRoles.map((rule) => (
        _.isString(rule) ? { role: rule } : rule
      ))
      hasProjectRole = member && _.some(normalizedProjectRoles, (rule) => (
        // checks that common properties are equal
        _.isMatch(member, rule)
      ))
    } else if (permissionRule.projectRoles === true) {
      // `projectRoles === true` means that we check if user is a member of the project
      // with any role
      hasProjectRole = !!member
    }
  }

  // check Topcoder Roles
  if (permissionRule.topcoderRoles) {
    if (permissionRule.topcoderRoles.length > 0) {
      hasTopcoderRole = _.intersection(
        _.get(user, 'roles', []).map(role => role.toLowerCase()),
        permissionRule.topcoderRoles.map(role => role.toLowerCase())
      ).length > 0
    } else if (permissionRule.topcoderRoles === true) {
      // `topcoderRoles === true` means that we check if user is has any Topcoder role
      // basically this equals to logged-in user, as all the Topcoder users
      // have at least one role `Topcoder User`
      hasTopcoderRole = _.get(user, 'roles').length > 0
    }
  }

  return hasProjectRole || hasTopcoderRole
}

/**
 * Get default Topcoder Roles.
 *
 * @param {Object} user       user
 * @param {Array}  user.roles user Topcoder roles
 *
 * @returns {String} project role
 */
export const getDefaultTopcoderRole = (user) => {
  for (let i = 0; i < DEFAULT_PROJECT_ROLE.length; i += 1) {
    const rule = DEFAULT_PROJECT_ROLE[i]

    if (matchPermissionRule({ topcoderRoles: [rule.topcoderRole] }, user)) {
      return rule.topcoderRole
    }
  }

  return undefined
}
