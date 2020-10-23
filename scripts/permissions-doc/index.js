/**
 * Generate a permissions.html document using the permission config from the Topcoder Connect App.
 *
 * Run by: `npm generate:doc:permissions`
 *
 * For development purpose, run by `npm generate:doc:permissions:dev`
 */
import '../../src/helpers/testHelper.js' // so we can run Connect App code on the NodeJs

import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import { PERMISSIONS } from '../../src/config/permissions'
import {
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_ROLE_ACCOUNT_MANAGER,
  PROJECT_ROLE_ACCOUNT_EXECUTIVE,
  PROJECT_ROLE_PROJECT_MANAGER,
  PROJECT_ROLE_PROGRAM_MANAGER,
  PROJECT_ROLE_SOLUTION_ARCHITECT,

  // "virtual role"
  PROJECT_ROLE_OWNER,

  ROLE_TOPCODER_USER,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_ACCOUNT_MANAGER,
  ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
  ROLE_PRESALES,
  ROLE_ACCOUNT_EXECUTIVE,
  ROLE_PROGRAM_MANAGER,
  ROLE_SOLUTION_ARCHITECT,
  ROLE_PROJECT_MANAGER,
  ROLE_CONNECT_COPILOT,
} from '../../src/config/constants'

const docTemplatePath = path.resolve(__dirname, './template.hbs')
const outputDocPath = path.resolve(__dirname, '../../docs/permissions.html')

handlebars.registerHelper('istrue', value => value === true)

/**
 * All Project Roles
 */
const PROJECT_ROLES = [
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_ROLE_ACCOUNT_MANAGER,
  PROJECT_ROLE_ACCOUNT_EXECUTIVE,
  PROJECT_ROLE_PROJECT_MANAGER,
  PROJECT_ROLE_PROGRAM_MANAGER,
  PROJECT_ROLE_SOLUTION_ARCHITECT
]

/**
 * All Topcoder Roles
 */
const TOPCODER_ROLES = [
  ROLE_TOPCODER_USER,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_ACCOUNT_MANAGER,
  ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
  ROLE_PRESALES,
  ROLE_ACCOUNT_EXECUTIVE,
  ROLE_PROGRAM_MANAGER,
  ROLE_SOLUTION_ARCHITECT,
  ROLE_PROJECT_MANAGER,
  ROLE_CONNECT_COPILOT,
]

/**
 * Normalize all the project and topcoder role lists to the list of strings.
 *
 * - `projectRoles` can be `true` -> full list of Project Roles
 * - `projectRoles` may contain an object for `owner` role -> `owner` (string)
 * - `topcoderRoles` can be `true` -> full list of Topcoder Roles
 *
 * @param {Object} rule permission rule
 *
 * @returns {Object} permission rule with all the roles as strings
 */
function normalizePermissionRule(rule) {
  const normalizedRule = _.cloneDeep(rule)

  if (normalizedRule.projectRoles === true) {
    normalizedRule.projectRoles = PROJECT_ROLES
  }

  if (_.isArray(normalizedRule.projectRoles)) {
    normalizedRule.projectRoles = normalizedRule.projectRoles.map((role) => {
      if (_.isEqual(role, { role: PROJECT_ROLE_CUSTOMER, isPrimary: true })) {
        return PROJECT_ROLE_OWNER
      }

      return role
    })
  }

  if (normalizedRule.topcoderRoles === true) {
    normalizedRule.topcoderRoles = TOPCODER_ROLES
  }

  return normalizedRule
}

/**
 * Normalize permission object which has "simple" and "full" shape into a "full" shape for consistency
 *
 * @param {Object} permission permission object
 *
 * @returns {Objects} permission object in the "full" shape with "allowRule" and "denyRule"
 */
function normalizePermission(permission) {
  let normalizedPermission = permission

  if (!normalizedPermission.allowRule) {
    normalizedPermission = {
      meta: permission.meta,
      allowRule: _.omit(permission, 'meta')
    }
  }

  if (normalizedPermission.allowRule) {
    normalizedPermission.allowRule = normalizePermissionRule(normalizedPermission.allowRule)
  }

  if (normalizedPermission.denyRule) {
    normalizedPermission.denyRule = normalizePermissionRule(normalizedPermission.denyRule)
  }

  return normalizedPermission
}

const templateStr = fs.readFileSync(docTemplatePath).toString()
const renderDocument = handlebars.compile(templateStr)

const permissionKeys = _.keys(PERMISSIONS)
const permissions = permissionKeys.map((key) => ({
  ...PERMISSIONS[key],
  meta: {
    ...PERMISSIONS[key].meta,
    key,
  }
}))
const groupsObj = _.groupBy(permissions, 'meta.group')
const groups = _.toPairs(groupsObj).map(([title, permissions]) => ({
  title,
  permissions,
  anchor: `section-${title.toLowerCase().replace(/\s+/g, '-')}`,
}))

groups.forEach((group) => {
  group.permissions = group.permissions.map(normalizePermission)
})

const data = {
  groups,
}

fs.writeFileSync(outputDocPath, renderDocument(data))
