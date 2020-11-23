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

/**
 * Project Manager Roles
 */
const PROJECT_MANAGERS = [
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

export const PERMISSIONS = {
  /*
    Project Plan
  */
  MANAGE_PROJECT_PLAN: {
    meta: {
      group: 'Project Plan',
      title: 'Manage project plan',
      description: 'Create, edit and delete phases and milestones.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  },

  MANAGE_NOT_OWN_ATTACHEMENT: {
    meta: {
      group: 'Project Plan',
      title: 'Manage asset libraries files and links (not own)',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  MANAGE_COMPLETED_PHASE: {
    meta: {
      group: 'Project Plan',
      title: 'Manage completed phases',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ],
  },

  EXPAND_ACTIVE_PHASES_BY_DEFAULT: {
    meta: {
      group: 'Project Plan',
      title: 'Expand active phases by default',
    },
    projectRoles: [
      PROJECT_ROLE_CUSTOMER,
    ]
  },

  VIEW_DRAFT_PHASES: {
    meta: {
      group: 'Project Plan',
      title: 'View draft phases',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ROLE_CONNECT_MANAGER,
      ...TOPCODER_ADMINS,
    ],
  },

  /*
    Project Members
  */
  MANAGE_CUSTOMER_TEAM: {
    meta: {
      group: 'Project Members',
      title: 'Manage Customer Team',
      description: 'Invite or cancel invitations and remove members in the Customer Team.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_COPILOT])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS
    ]
  },

  MANAGE_COPILOTS: {
    meta: {
      group: 'Project Members',
      title: 'Manage Copilots',
      description: 'Directly invite copilots to the project.',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
      ROLE_CONNECT_COPILOT_MANAGER
    ]
  },

  REMOVE_COPILOTS: {
    meta: {
      group: 'Project Members',
      title: 'Remove Copilots',
      description: 'Remove copilots form the project.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_COPILOT, PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
      ROLE_CONNECT_COPILOT_MANAGER
    ]
  },

  MANAGE_TOPCODER_TEAM: {
    meta: {
      group: 'Project Members',
      title: 'Manage Topcoder Team',
      description: 'Invite or cancel invitations and remove members in the Topcoder Team.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_COPILOT, PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS
    ]
  },

  JOIN_TOPCODER_TEAM: {
    meta: {
      group: 'Project Members',
      title: 'Join Topcoder Team',
      description: 'Join Topcoder Team without invitation',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
      ROLE_CONNECT_MANAGER,
    ]
  },

  BE_LISTED_IN_CUSTOMER_TEAM: {
    meta: {
      group: 'Project Members',
      title: 'Be listed in Customer Team',
      description: 'Who should be listed in Customer Team.',
    },
    projectRoles: [PROJECT_ROLE_CUSTOMER],
  },

  BE_LISTED_IN_COPILOT_TEAM: {
    meta: {
      group: 'Project Members',
      title: 'Be listed in Copilot Team',
      description: 'Who should be listed in Copilot Team.',
    },
    projectRoles: [PROJECT_ROLE_COPILOT],
  },

  BE_LISTED_IN_TOPCODER_TEAM: {
    meta: {
      group: 'Project Members',
      title: 'Be listed in Topcoder Team',
      description: 'Who should be listed in Topcoder Team.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_COPILOT, PROJECT_ROLE_CUSTOMER])
    ],
  },

  REQUEST_COPILOTS: {
    meta: {
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

  SEE_MEMBER_SUGGESTIONS: {
    meta: {
      group: 'Project Members',
      title: 'See Member Suggestions',
      description: 'When entering user handle in the invite field.'
    },
    topcoderRoles: [
      ROLE_ADMINISTRATOR,
      ROLE_CONNECT_ADMIN,
      ROLE_CONNECT_MANAGER,
      ROLE_CONNECT_ACCOUNT_MANAGER,
      ROLE_CONNECT_COPILOT_MANAGER
    ],
  },

  /*
    Topics & Posts
   */
  ACCESS_PRIVATE_POST: {
    meta: {
      group: 'Topics & Posts',
      title: 'Access private posts',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  CREATE_TOPICS: {
    meta: {
      group: 'Topics & Posts',
      title: 'Create topics',
      description: 'Create threads (supported only for old messages tab at the moment)'
    },
    topcoderRoles: true,
  },

  CREATE_POSTS: {
    meta: {
      group: 'Topics & Posts',
      title: 'Create posts',
      description: 'Comment/post in already created threads/topics'
    },
    topcoderRoles: true,
  },

  /*
    Budget & Invoice Reports
   */
  ACCESS_BUDGET_REPORT: {
    meta: {
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
    meta: {
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
    meta: {
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

  /*
    User Settings (profile, notification etc)
   */
  UPDATE_USER_PROFILE_PHONE: {
    meta: {
      group: 'User Settings',
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
    meta: {
      group: 'User Settings',
      title: 'Update company name in user profile',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER, ROLE_CONNECT_COPILOT])
    ],
  },

  VIEW_USER_PROFILE_AS_COPILOT: {
    meta: {
      group: 'User Settings',
      title: 'View User Profile as Copilot',
    },
    topcoderRoles: [
      ROLE_CONNECT_COPILOT
    ],
  },

  VIEW_USER_PROFILE_AS_TOPCODER_EMPLOYEE: {
    meta: {
      group: 'User Settings',
      title: 'View User Profile as Topcoder Employee',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER, ROLE_CONNECT_COPILOT])
    ],
  },

  VIEW_USER_PROFILE_AS_CUSTOMER: {
    meta: {
      group: 'User Settings',
      title: 'View User Profile as Customer',
    },
    allowRule: {
      topcoderRoles: [
        ROLE_TOPCODER_USER
      ]
    },
    denyRule: {
      topcoderRoles: [
        ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER])
      ],
    }
  },

  UPDATE_USER_EMAIL: {
    meta: {
      group: 'User Settings',
      title: 'Update User Email',
    },
    allowRule: {
      topcoderRoles: [
        ROLE_TOPCODER_USER
      ]
    },
    denyRule: {
      topcoderRoles: [
        ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER])
      ],
    }
  },

  TOGGLE_WEBSITE_NOTIFICATIONS: {
    meta: {
      group: 'User Settings',
      title: 'Enable/disable website notifications.',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER])
    ]
  },

  /*
    Project List
  */
  SEE_MY_PROJECTS_FILTER: {
    meta: {
      group: 'Project List',
      title: 'See My Projects Filter',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_CONNECT_COPILOT, ROLE_TOPCODER_USER])
    ]
  },

  SEARCH_PROJECTS: {
    meta: {
      group: 'Project List',
      title: 'Search Project',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER])
    ]
  },

  SEE_WALK_THROUGH: {
    meta: {
      group: 'Project List',
      title: 'See Walk Through',
    },
    allowRule: {
      topcoderRoles: [
        ROLE_TOPCODER_USER
      ]
    },
    denyRule: {
      topcoderRoles: [
        ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER])
      ],
    },
  },

  SEE_GRID_VIEW_BY_DEFAULT: {
    meta: {
      group: 'Project List',
      title: 'Have Grid View by default',
    },
    topcoderRoles: [
      ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER])
    ],
  },

  RETRY_PROJECTS_LOADING: {
    meta: {
      group: 'Project List',
      title: 'Retry project loading',
    },
    allowRule: {
      topcoderRoles: [
        ROLE_TOPCODER_USER
      ]
    },
    denyRule: {
      topcoderRoles: [
        ..._.difference(TOPCODER_ALL, [ROLE_TOPCODER_USER])
      ],
    },
  },

  /*
    Project Details
  */
  EDIT_PROJECT_SPECIFICATION: {
    meta: {
      group: 'Project Details',
      title: 'Edit project specification',
    },
    projectRoles: true,
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  MANAGE_PROJECT_ASSETS: {
    meta: {
      group: 'Project Details',
      title: 'Manage project assets',
    },
    projectRoles: true,
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  EDIT_PROJECT_STATUS: {
    meta: {
      group: 'Project Details',
      title: 'Edit project status',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  VIEW_PROJECT_SPECIAL_LINKS: {
    meta: {
      group: 'Project Details',
      title: 'View project special links',
      description: 'Direct / Salesforce links'
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ROLE_CONNECT_MANAGER,
      ...TOPCODER_ADMINS,
    ]
  },

  SUBMIT_PROJECT_FOR_REVIEW: {
    meta: {
      group: 'Project Details',
      title: 'Submit project for review',
    },
    projectRoles: [
      PROJECT_ROLE_CUSTOMER
    ],
  },

  DELETE_DRAFT_PROJECT: {
    meta: {
      group: 'Project Details',
      title: 'Delete draft project',
    },
    projectRoles: [
      { role: PROJECT_ROLE_CUSTOMER, isPrimary: true }
    ],
  },

  /*
    Scope Change Requests
   */
  APPROVE_REJECT_SCOPE_REQUESTS: {
    meta: {
      group: 'Scope Change Requests',
      title: 'Approve & Reject Scope Change Requests',
    },
    projectRoles: [
      PROJECT_ROLE_CUSTOMER,
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  ACTIVATE_SCOPE_REQUESTS: {
    meta: {
      group: 'Scope Change Requests',
      title: 'Activate Scope Change Requests',
    },
    projectRoles: [
      ...PROJECT_MANAGERS
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  CANCEL_SCOPE_REQUESTS_NOT_OWN: {
    meta: {
      group: 'Scope Change Requests',
      title: 'Cancel Scope Change Requests (not own)',
      description: 'Everyone can cancel their own scope change requests.'
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  /*
    Milestones
   */
  MANAGE_MILESTONE: {
    meta: {
      group: 'Milestones',
      title: 'Manage Milestones',
      description: 'Who can manage milestone and complete them.',
    },
    projectRoles: [
      ..._.difference(PROJECT_ALL, [PROJECT_ROLE_CUSTOMER])
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  ACCEPT_MILESTONE_FINAL_DELIVERY: {
    meta: {
      group: 'Milestones',
      title: 'Accept final delivery',
    },
    projectRoles: [
      PROJECT_ROLE_CUSTOMER,
    ],
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  EDIT_MILESTONE_ACTUAL_START_COMPLETION_DATES: {
    meta: {
      group: 'Milestones',
      title: 'Edit "Actual Start" and "Completion" dates.',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },

  /*
    Metadata
   */
  ACCESS_METADATA: {
    meta: {
      group: 'Metadata',
      title: 'Access Metadata',
    },
    topcoderRoles: [
      ...TOPCODER_ADMINS,
    ]
  },
}

/**
 * This list determines default Project Role by Topcoder Role.
 *
 * - The order of items in this list is IMPORTANT.
 * - To determine default Project Role we have to go from TOP to END
 *   and find the first record which has the Topcoder Role of the user.
 */
export const DEFAULT_PROJECT_ROLE = [
  {
    topcoderRole: ROLE_CONNECT_MANAGER,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_CONNECT_ADMIN,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_ADMINISTRATOR,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_CONNECT_ACCOUNT_MANAGER,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_BUSINESS_DEVELOPMENT_REPRESENTATIVE,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_PRESALES,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_CONNECT_COPILOT,
    projectRole: PROJECT_ROLE_COPILOT,
  }, {
    topcoderRole: ROLE_ACCOUNT_EXECUTIVE,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_PROGRAM_MANAGER,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_SOLUTION_ARCHITECT,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_PROJECT_MANAGER,
    projectRole: PROJECT_ROLE_MANAGER,
  }, {
    topcoderRole: ROLE_TOPCODER_USER,
    projectRole: PROJECT_ROLE_CUSTOMER,
  },
]
