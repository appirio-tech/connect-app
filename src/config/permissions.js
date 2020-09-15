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
 * There are unified prefixes to indicate what kind of permissions.
 * If no prefix is suitable, please, feel free to use a new prefix.
 *
 * CREATE_ - create somethings
 * READ_   - read something
 * UPDATE_ - update something
 * DELETE_ - delete something
 *
 * MANAGE_ - means combination of 3 operations CREATE/UPDATE/DELETE.
 *           usually should be used, when READ operation is allowed to everyone
 *           while 3 manage operations require additional permissions
 * ACCESS_ - means combination of all 4 operations READ/CREATE/UPDATE/DELETE.
 *           usually should be used, when by default users cannot even READ something
 *           and if someone can READ, then also can do other kind of operations.
 *
 * ANTI-PERMISSIONS
 *
 * If it's technically impossible to create permission rules for some situation in "allowed" manner,
 * in such case we can create permission rules, which would disallow somethings.
 * - Create such rules ONLY IF CREATING ALLOW RULE IS IMPOSSIBLE.
 * - Add a comment to such rules explaining why allow-rule cannot be created.
 */
/* eslint-disable no-unused-vars */
import _ from 'lodash'
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
  // PROJECT_ROLE_MEMBER - don't use, it's equal to `projectRoles: true`
  // PROJECT_ROLE_OWNER  - don't use, it's equal to `projectRoles: { role: PROJECT_ROLE_CUSTOMER, isPrimary: true }`

  // Topcoder Roles
  ROLE_TOPCODER_USER, // users, who only have this role and doesn't have any other specific role we treat as "customer" accounts
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
  ROLE_CONNECT_COPILOT_MANAGER,
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
 * All Topcoder Roles
 */
const TOPCODER_ALL = [
  ROLE_TOPCODER_USER,
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
  ROLE_CONNECT_MANAGER,
  ROLE_CONNECT_COPILOT_MANAGER,
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
 * All Project Roles
 */
const PROJECT_ALL = [
  PROJECT_ROLE_CUSTOMER,
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
    _meta: {
      group: 'Project Plan',
      title: 'Manage project plan',
      description: 'Create, edit and delete phases and milestones.',
    },
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

  MANAGE_NOT_OWN_ATTACHEMENT: {
    _meta: {
      group: 'Project Plan',
      title: 'Manage asset libraries files and links',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  MANAGE_COMPLETED_PHASE: {
    _meta: {
      group: 'Project Plan',
      title: 'Manage completed phases',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  },

  MANAGE_TOPCODER_TEAM: {
    _meta: {
      group: 'Project Members',
      title: 'Manage topcoder team',
      description: 'Invite new members or delete them. There are some additional restrictions for some roles.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_COPILOT, PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS
    ]
  },

  MANAGE_COPILOTS: {
    _meta: {
      group: 'Project Members',
      title: 'Manage copilots',
      description: 'Directly invite copilots to the project.',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
      ROLE_CONNECT_COPILOT_MANAGER
    ]
  },

  REQUEST_COPILOTS: {
    _meta: {
      group: 'Project Members',
      title: 'Request copilots',
      description: 'Request copilots to the project.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_COPILOT, PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
      ROLE_CONNECT_COPILOT_MANAGER
    ]
  },

  ACCESS_PRIVATE_POST: {
    _meta: {
      group: 'Topics & Posts',
      title: 'Access private posts',
    },
    projectRoles: [
      PROJECT_ROLE_COPILOT,
    ],
    topcoderRoles: [
      ...TOPCODER_MANAGERS_AND_ADMINS,
    ]
  },

  ACCESS_BUDGET_REPORT: {
    _meta: {
      group: 'Budget & Invoice Reports',
      title: 'Access budget report',
    },
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
    _meta: {
      group: 'Budget & Invoice Reports',
      title: 'Access budget spent report',
    },
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
    _meta: {
      group: 'Budget & Invoice Reports',
      title: 'Access invoice report',
    },
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

  UPDATE_USER_PROFILE_PHONE: {
    _meta: {
      group: 'User Profile',
      title: 'Update phone number in user profile',
    },
    allowRule: {
      topcoderRoles: [
        ..._.difference(TOPCODER_ALL, [ROLE_CONNECT_COPILOT])
      ]
    },
    denyRule: {
      topcoderRoles: [
        ROLE_CONNECT_COPILOT
      ],
    }
  },

  UPDATE_USER_PROFILE_COMPANY: {
    _meta: {
      group: 'User Profile',
      title: 'Update company name in user profile',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER, ROLE_CONNECT_COPILOT])
    ],
  },

  SEE_MEMBER_SUGGESTIONS: {
    _meta: {
      group: 'View Member Suggestions',
      title: 'Member Suggestions'
    },
    topcoderRoles: [
      ROLE_ADMINISTRATOR,
      ROLE_CONNECT_ADMIN,
      ROLE_CONNECT_MANAGER,
      ROLE_CONNECT_ACCOUNT_MANAGER,
      ROLE_CONNECT_COPILOT_MANAGER
    ],
  },

  SEE_MY_PROJECTS_FILTER: {
    _meta: {
      group: 'My Projects Filter',
      title: 'My Projects Filter',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_CONNECT_COPILOT, ROLE_TOPCODER_USER])
    ]
  },

  /*
    DEMO RULES

    Rules below just to demonstrate possible rules format
  */
  TEST_1: {
    _meta: {
      group: 'DEMO/TEST example permissions',
      title: 'Topcoder role deny',
      description: 'This permission is just to demonstrate possible format',
    },
    allowRule: {
      topcoderRoles: [
        ROLE_CONNECT_COPILOT,
        ROLE_TOPCODER_USER,
      ],
    },
    denyRule: {
      topcoderRoles: [
        ROLE_ACCOUNT_EXECUTIVE,
      ],
    }
  },

  TEST_2: {
    _meta: {
      group: 'DEMO/TEST example permissions',
      title: 'Topcoder role and Project role deny',
      description: 'This permission is just to demonstrate possible format',
    },
    allowRule: {
      topcoderRoles: [
        ROLE_CONNECT_COPILOT,
        ROLE_TOPCODER_USER,
      ],
      projectRoles: [
        PROJECT_ROLE_COPILOT,
        PROJECT_ROLE_CUSTOMER,
      ],
    },
    denyRule: {
      topcoderRoles: [
        ROLE_ACCOUNT_EXECUTIVE,
      ],
      projectRoles: [
        PROJECT_ROLE_MANAGER,
      ],
    }
  },

  TEST_3: {
    _meta: {
      group: 'DEMO/TEST example permissions',
      title: 'Any Project Member',
      description: 'This permission is just to demonstrate possible format',
    },
    projectRoles: true,
  },

  TEST_5: {
    _meta: {
      group: 'DEMO/TEST example permissions',
      title: 'Any Logged-in User',
      description: 'This permission is just to demonstrate possible format',
    },
    topcoderRoles: true,
  },

  TEST_4: {
    _meta: {
      group: 'DEMO/TEST example permissions',
      title: 'Owner Project role',
      description: 'This permission is just to demonstrate possible format',
    },
    projectRoles: [
      { role: PROJECT_ROLE_CUSTOMER, isPrimary: true }
    ],
  },
}
