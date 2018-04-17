module.exports = {
  API_URL           : 'https://api.topcoder.com/v3',
  API_URL_V2        : 'https://api.topcoder.com/v2',
  WORK_API_URL      : 'https://api-work.topcoder.com/v3',
  INTERNAL_API_URL  : 'https://internal-api.topcoder.com/v3',
  ASSET_PREFIX      : 'https://s3.amazonaws.com/app.topcoder.com/',
  AUTH_API_URL      : 'https://api.topcoder.com/v3',
  auth0Callback     : 'https://api.topcoder.com/pub/callback.html',
  auth0Domain       : 'topcoder.auth0.com',
  clientId          : process.env.AUTH0_CLIENT_ID_PROD,
  AUTH0_DOMAIN      : 'topcoder.auth0.com',
  AUTH0_CLIENT_ID   : process.env.AUTH0_CLIENT_ID_PROD,
  domain            : 'topcoder.com',
  DOMAIN            : 'topcoder.com',
  ENV               : 'PROD',
  NODE_ENV          : 'production',

  PROJECTS_API_URL  : 'https://api.topcoder.com',

  NEW_RELIC_APPLICATION_ID: process.env.TRAVIS_BRANCH ? '11352758' : '',

  ARENA_URL          : '//arena.topcoder.com',
  BLOG_LOCATION      : 'https://www.topcoder.com/feed/',
  COMMUNITY_URL      : '//community.topcoder.com',
  FORUMS_APP_URL     : '//apps.topcoder.com/forums',
  HELP_APP_URL       : 'help.topcoder.com',
  MAIN_URL           : 'https://www.topcoder.com',
  PHOTO_LINK_LOCATION: 'https://community.topcoder.com',
  SWIFT_PROGRAM_URL  : 'apple.topcoder.com',
  TCO16_URL          : 'https://tco16.topcoder.com',
  TCO17_URL          : 'https://tco17.topcoder.com',
  TCO_HOME_URL       : 'https://www.topcoder.com/tco',

  ACCOUNTS_APP_URL             : 'https://accounts.topcoder.com/#!/member',
  ACCOUNTS_APP_CONNECTOR_URL   : 'https://accounts.topcoder.com/connector.html',

  FILE_PICKER_API_KEY: process.env.FILE_PICKER_API_KEY_PROD,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME: 'submission-staging-prod',

  SALESFORCE_PROJECT_LEAD_LINK: 'https://topcoder.my.salesforce.com/apex/ConnectLead?connectProjectId=',
  CONNECT_SEGMENT_KEY: 'ajP6cQ5SN2EMUWoWTOLROVnAHsOlsDCn',
  PREDIX_PROGRAM_ID         : 3448,
  IBM_COGNITIVE_PROGRAM_ID  : 3449,
  HEAP_ANALYTICS_APP_ID     : '638908330',

  TC_NOTIFICATION_URL: 'https://api.topcoder.com/v5/notifications',
  CONNECT_MESSAGE_API_URL: 'https://api.topcoder.com/v5'
}
