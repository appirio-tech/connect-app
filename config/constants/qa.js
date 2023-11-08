const DOMAIN = 'topcoder-dev.com'

module.exports = {
  API_URL           : 'https://api.topcoder-qa.com/v3',
  API_URL_V2        : 'https://api.topcoder-qa.com/v2',
  WORK_API_URL      : 'https://api-work.topcoder-qa.com/v3',
  INTERNAL_API_URL  : 'https://internal-api.topcoder-qa.com/v3',
  ASSET_PREFIX      : 'https://s3.amazonaws.com/app.topcoder-qa.com/',
  AUTH_API_URL      : 'https://api.topcoder-qa.com/v3',
  auth0Callback     : 'https://api.topcoder-qa.com/pub/callback.html',
  auth0Domain       : 'topcoder-qa.auth0.com',
  clientId          : process.env.AUTH0_CLIENT_ID_QA,
  AUTH0_DOMAIN      : 'topcoder-qa.auth0.com',
  AUTH0_CLIENT_ID   : process.env.AUTH0_CLIENT_ID_QA,
  domain            : 'topcoder-qa.com',
  DOMAIN            : 'topcoder-qa.com',
  ENV               : 'QA',

  PROJECTS_API_URL  : 'http://api.topcoder-dev.com',

  NEW_RELIC_APPLICATION_ID: process.env.TRAVIS_BRANCH ? '11199233' : '',

  ARENA_URL          : '//arena.topcoder-qa.com',
  BLOG_LOCATION      : 'https://www.topcoder-qa.com/feed/',
  COMMUNITY_URL      : '//community.topcoder-qa.com',
  FORUMS_APP_URL     : '//apps.topcoder-qa.com/forums',
  HELP_APP_URL       : 'help.topcoder-qa.com',
  MAIN_URL           : 'https://www.topcoder-qa.com',
  PHOTO_LINK_LOCATION: 'https://community.topcoder-qa.com',
  SWIFT_PROGRAM_URL  : 'apple.topcoder-qa.com',
  TCO16_URL          : 'http://tco16.topcoder-qa.com',
  TCO17_URL          : 'http://tco17.topcoder-qa.com',
  TCO_HOME_URL       : 'https://www.topcoder-dev.com/tco',

  ACCOUNTS_APP_URL             : 'https://accounts.topcoder-qa.com/#!/member',
  ACCOUNTS_APP_CONNECTOR_URL   : 'https://accounts.topcoder-qa.com/connector.html',
  TYPEFORM_URL      : 'https://topcoder.typeform.com/to/vgqiBXdk',

  FILE_PICKER_API_KEY: process.env.FILE_PICKER_API_KEY_QA,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME: 'submission-staging-qa',
  FILE_PICKER_ACCEPT: process.env.FILE_PICKER_ACCEPT_QA,

  SALESFORCE_PROJECT_LEAD_LINK: 'https://c.cs18.visual.force.com/apex/ConnectLead?connectProjectId=',
  SALESFORCE_BILLING_ACCOUNT_LINK: 'https://c.cs18.visual.force.com/apex/baredirect?id=',
  CONNECT_SEGMENT_KEY: process.env.QA_SEGMENT_KEY,
  PREDIX_PROGRAM_ID         : 3448,
  IBM_COGNITIVE_PROGRAM_ID  : 3449,
  HEAP_ANALYTICS_APP_ID     : '4153837120',
  PHASE_PRODUCT_TEMPLATE_ID : 176,

  TC_NOTIFICATION_URL: 'https://api.topcoder-dev.com/v5/notifications',
  CONNECT_MESSAGE_API_URL: 'https://api.topcoder-qa.com/v5',
  TC_SYSTEM_USERID: process.env.QA_TC_SYSTEM_USERID,
  MAINTENANCE_MODE: process.env.QA_MAINTENANCE_MODE,

  TC_CDN_URL: process.env.TC_CDN_URL,

  DEFAULT_NDA_UUID: 'e5811a7b-43d1-407a-a064-69e5015b4900',
  UNIVERSAL_NAV_URL: '//uni-nav.topcoder-dev.com/v1/tc-universal-nav.js',
  HEADER_AUTH_URLS_HREF: `https://accounts-auth0.${DOMAIN}?utm_source=community-app-main`,
  HEADER_AUTH_URLS_LOCATION: `https://accounts-auth0.${DOMAIN}?retUrl=%S&utm_source=community-app-main`
}
