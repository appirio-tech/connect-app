/**
 * User permission policies.
 * Can be used with `hasPermission` method.
 *
 * PERMISSION GUIDELINES
 *
 * All the permission name and meaning should define **WHAT** can be done having such permission
 * but not **WHO** can do it.
 *
 * Examples of CORRECT permission naming and meaning:
 *    - `VIEW_PROJECT`
 *    - `EDIT_MILESTONE`
 *    - `DELETE_WORK`
 *
 * Examples of INCORRECT permissions naming and meaning:
 *    - `COPILOT_AND_MANAGER`
 *    - `PROJECT_MEMBERS`
 *    - `ADMINS`
 *
 * The same time **internally only** in this file, constants like `COPILOT_AND_ABOVE`,
 * `PROJECT_MEMBERS`, `ADMINS` could be used to define permissions.
 *
 * NAMING GUIDELINES
 *
 * We should use unified prefixes to indicate what kind of permissions it is.
 *
 * VIEW_ - means read or view something
 * CREATE_ - create somethings
 * UPDATE_ - edit something
 * DELETE_ - delete something
 *
 * MANAGE_ - means combination of 3 operations CREATE/UPDATE/DELETE.
 *           usually should be used, when VIEW operation is allowed to everyone
 *           while 3 manage operations require additional permissions
 * ACCESS_ - means combination of all 4 operations VIEW/CREATE/UPDATE/DELETE.
 *           usually should be used, when by default users cannot even VIEW something
 *           and if someone can VIEW, then also can do other kind of operations.
 */
/* eslint-disable no-unused-vars */
import {
  // Project Roles
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_ROLE_ACCOUNT_MANAGER,
  PROJECT_ROLE_ACCOUNT_EXECUTIVE,
  PROJECT_ROLE_PROJECT_MANAGER,
  PROJECT_ROLE_PROGRAM_MANAGER,
  PROJECT_ROLE_SOLUTION_ARCHITECT,

  // Topcoder Roles
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
} from './constants'
/* eslint-enable no-unused-vars  */

/*
 * The next sets of roles should be used only in this file internally.
 */

/**
 * Topcoder Admin level roles.
 */
const TOPCODER_ADMINS = [
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
]

/**
 * Topcoder Manager level roles.
 */
const TOPCODER_MANAGERS = [
  ROLE_CONNECT_MANAGER,
  ROLE_PROGRAM_MANAGER,
  ROLE_SOLUTION_ARCHITECT,
  ROLE_PROJECT_MANAGER,
]

/**
 * Topcoder Admin & Manager level roles.
 */
const TOPCODER_MANAGERS_AND_ADMINS = [
  ...TOPCODER_ADMINS,
  ...TOPCODER_MANAGERS,
]

/**
 * Project non-customer members
 */
const PROJECT_NON_CUSTOMER_MEMBERS = [
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_ROLE_ACCOUNT_MANAGER,
  PROJECT_ROLE_ACCOUNT_EXECUTIVE,
  PROJECT_ROLE_PROJECT_MANAGER,
  PROJECT_ROLE_PROGRAM_MANAGER,
  PROJECT_ROLE_SOLUTION_ARCHITECT,
]

/*
 * The next sets of roles are exported for outside usage with `hasPermission` method.
 */

export default {
  MANAGE_PROJECT_PLAN: {
    _title: 'Manage project plan',
    _description: 'Manage phases and milestones.',
    projectRoles: [
      PROJECT_ROLE_MANAGER,
      PROJECT_ROLE_PROJECT_MANAGER,
      PROJECT_ROLE_PROGRAM_MANAGER,
      PROJECT_ROLE_SOLUTION_ARCHITECT,
      PROJECT_ROLE_COPILOT,
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  },
  MANAGE_COMPLETED_PHASE: {
    _title: 'Manage completed phases',
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  },
  MANAGE_TOPCODER_TEAM: {
    _title: 'Manage topcoder team',
    _description: 'Invite new members or delete them. There are some additional restrictions for some roles.',
    projectRoles: [
      ...PROJECT_NON_CUSTOMER_MEMBERS
    ],
  },
  ACCESS_PRIVATE_POST: {
    _title: 'Access private posts',
    projectRoles: [
      PROJECT_ROLE_COPILOT,
    ],
    topcoderRoles: [
      ...TOPCODER_MANAGERS_AND_ADMINS,
    ]
  },
  ACCESS_BUDGET_REPORT: {
    _title: 'Access budget report',
    projectRoles: [
      PROJECT_ROLE_CUSTOMER,
      PROJECT_ROLE_MANAGER,
      PROJECT_ROLE_ACCOUNT_MANAGER,
      PROJECT_ROLE_ACCOUNT_EXECUTIVE,
      PROJECT_ROLE_PROJECT_MANAGER,
      PROJECT_ROLE_PROGRAM_MANAGER,
      PROJECT_ROLE_SOLUTION_ARCHITECT,
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  },
  ACCESS_BUDGET_SPENT_REPORT: {
    _title: 'Access budget spent report',
    projectRoles: [
      PROJECT_ROLE_MANAGER,
      PROJECT_ROLE_ACCOUNT_MANAGER,
      PROJECT_ROLE_ACCOUNT_EXECUTIVE,
      PROJECT_ROLE_PROJECT_MANAGER,
      PROJECT_ROLE_PROGRAM_MANAGER,
      PROJECT_ROLE_SOLUTION_ARCHITECT,
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  },
  ACCESS_INVOICE_REPORT: {
    _title: 'Access invoice report',
    projectRoles: [
      PROJECT_ROLE_CUSTOMER,
      PROJECT_ROLE_MANAGER,
      PROJECT_ROLE_ACCOUNT_MANAGER,
      PROJECT_ROLE_ACCOUNT_EXECUTIVE,
      PROJECT_ROLE_PROJECT_MANAGER,
      PROJECT_ROLE_PROGRAM_MANAGER,
      PROJECT_ROLE_SOLUTION_ARCHITECT,
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  }
}
