import store from '../config/store'
import _ from 'lodash'
import {
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_ROLE_ACCOUNT_MANAGER,
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_ACCOUNT_EXECUTIVE,
  PROJECT_ROLE_PROGRAM_MANAGER,
  PROJECT_ROLE_SOLUTION_ARCHITECT,
  PROJECT_ROLE_PROJECT_MANAGER,

  ROLE_TOPCODER_USER,
  ROLE_CONNECT_COPILOT,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_ACCOUNT_MANAGER,
  ROLE_CONNECT_ADMIN,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_COPILOT_MANAGER,
  ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
  ROLE_PRESALES,
  ROLE_ACCOUNT_EXECUTIVE,
  ROLE_PROGRAM_MANAGER,
  ROLE_SOLUTION_ARCHITECT,
  ROLE_PROJECT_MANAGER,
} from '../config/constants'

/**
 * This list determines default Project Role by Topcoder Role.
 *
 * - The order of items in this list is IMPORTANT.
 * - To determine default Project Role we have to go from TOP to END
 *   and find the first record which has the Topcoder Role of the user.
 * - Always define default Project Role which is allowed for such Topcoder Role
 *   as per `PROJECT_TO_TOPCODER_ROLES_MATRIX`
 */
export const DEFAULT_PROJECT_ROLE = [
  {
    topcoderRole: ROLE_ADMINISTRATOR,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_CONNECT_ADMIN,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_CONNECT_MANAGER,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_CONNECT_ACCOUNT_MANAGER,
    projectRole: PROJECT_ROLE_ACCOUNT_MANAGER,
  }, {
    topcoderRole: ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
    projectRole: PROJECT_ROLE_ACCOUNT_MANAGER,
  }, {
    topcoderRole: ROLE_PRESALES,
    projectRole: PROJECT_ROLE_ACCOUNT_MANAGER,
  }, {
    topcoderRole: ROLE_ACCOUNT_EXECUTIVE,
    projectRole: PROJECT_ROLE_ACCOUNT_EXECUTIVE,
  }, {
    topcoderRole: ROLE_PROGRAM_MANAGER,
    projectRole: PROJECT_ROLE_PROGRAM_MANAGER,
  }, {
    topcoderRole: ROLE_SOLUTION_ARCHITECT,
    projectRole: PROJECT_ROLE_SOLUTION_ARCHITECT,
  }, {
    topcoderRole: ROLE_PROJECT_MANAGER,
    projectRole: PROJECT_ROLE_PROJECT_MANAGER,
  }, {
    topcoderRole: ROLE_CONNECT_COPILOT_MANAGER,
    projectRole: PROJECT_ROLE_CUSTOMER,
  }, {
    topcoderRole: ROLE_CONNECT_COPILOT,
    projectRole: PROJECT_ROLE_COPILOT,
  }, {
    topcoderRole: ROLE_TOPCODER_USER,
    projectRole: PROJECT_ROLE_CUSTOMER,
  },
]

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

  // uncomment for debugging
  // console.warn('hasPermission', permission, projectData, allow && !deny)

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
    // as we support `projectRoles` as strings and as objects like:
    // { role: "...", isPrimary: true } we have normalize them to a common shape
    const normalizedProjectRoles = permissionRule.projectRoles.map((rule) => (
      _.isString(rule) ? { role: rule } : rule
    ))

    if (permissionRule.projectRoles.length > 0) {
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
    } else if (permissionRule.topcoderRoles === 'true') {
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
