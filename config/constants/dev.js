module.exports = {
  API_URL           : 'https://api.topcoder-dev.com/v3',
  API_URL_V2        : 'https://api.topcoder-dev.com/v2',
  WORK_API_URL      : 'https://api-work.topcoder-dev.com/v3',
  INTERNAL_API_URL  : 'https://internal-api.topcoder-dev.com/v3',
  ASSET_PREFIX      : 'https://s3.amazonaws.com/app.topcoder-dev.com/',
  AUTH_API_URL      : 'https://api.topcoder-dev.com/v3',
  auth0Callback     : 'https://api.topcoder-dev.com/pub/callback.html',
  auth0Domain       : 'topcoder-dev.auth0.com',
  clientId          : process.env.AUTH0_CLIENT_ID_DEV,
  AUTH0_DOMAIN      : 'topcoder-dev.auth0.com',
  AUTH0_CLIENT_ID   : process.env.AUTH0_CLIENT_ID_DEV,
  domain            : 'topcoder-dev.com',
  DOMAIN            : 'topcoder-dev.com',
  ENV               : 'DEV',

  PROJECTS_API_URL  : 'https://api.topcoder-dev.com',

  NEW_RELIC_APPLICATION_ID: process.env.TRAVIS_BRANCH ? '8957921' : '',

  ARENA_URL          : '//arena.topcoder-dev.com',
  BLOG_LOCATION      : 'https://www.topcoder-dev.com/feed/',
  COMMUNITY_URL      : '//community.topcoder-dev.com',
  FORUMS_APP_URL     : '//apps.topcoder-dev.com/forums',
  HELP_APP_URL       : 'help.topcoder-dev.com',
  MAIN_URL           : 'https://www.topcoder-dev.com',
  PHOTO_LINK_LOCATION: 'https://community.topcoder-dev.com',
  SWIFT_PROGRAM_URL  : 'apple.topcoder-dev.com',
  TCO16_URL          : 'https://tco16.topcoder-dev.com',
  TCO17_URL          : 'https://tco17.topcoder-dev.com',
  TCO_HOME_URL       : 'https://www.topcoder-dev.com/tco',

  ACCOUNTS_APP_URL             : 'https://accounts-auth0.topcoder-dev.com',
  ACCOUNTS_APP_CONNECTOR_URL   : 'https://accounts-auth0.topcoder-dev.com',
  TYPEFORM_URL      : 'https://topcoder.typeform.com/to/vgqiBXdk',

  FILE_PICKER_API_KEY: process.env.FILE_PICKER_API_KEY_DEV,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME: 'submission-staging-dev',
  FILE_PICKER_ACCEPT: process.env.FILE_PICKER_ACCEPT_DEV,

  SALESFORCE_PROJECT_LEAD_LINK: 'https://c.cs18.visual.force.com/apex/ConnectLead?connectProjectId=',
  SALESFORCE_BILLING_ACCOUNT_LINK: 'https://c.cs18.visual.force.com/apex/baredirect?id=',

  CONNECT_SEGMENT_KEY: process.env.DEV_SEGMENT_KEY,
  PREDIX_PROGRAM_ID         : 3448,
  IBM_COGNITIVE_PROGRAM_ID  : 3449,
  HEAP_ANALYTICS_APP_ID     : '4153837120',
  PHASE_PRODUCT_TEMPLATE_ID : 176,

  TC_NOTIFICATION_URL: 'https://api.topcoder-dev.com/v5/notifications',
  CONNECT_MESSAGE_API_URL: 'https://api.topcoder-dev.com/v5',
  TC_SYSTEM_USERID: process.env.DEV_TC_SYSTEM_USERID,
  MAINTENANCE_MODE: process.env.DEV_MAINTENANCE_MODE,

  TC_CDN_URL: process.env.TC_CDN_URL,

  DASHBOARD_FAQ_CONTENT_ID : process.env.DASHBOARD_FAQ_CONTENT_ID,
  CONTENTFUL_DELIVERY_KEY : process.env.CONTENTFUL_DELIVERY_KEY,
  CONTENTFUL_SPACE_ID : process.env.CONTENTFUL_SPACE_ID,

  TAAS_APP_URL: 'https://platform.topcoder-dev.com/taas',
  DEFAULT_NDA_UUID: 'e5811a7b-43d1-407a-a064-69e5015b4900'
}
