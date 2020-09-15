/**
 * TopCoder specific helpers
 */
import {
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID,
  TC_CDN_URL,
  NON_CUSTOMER_ROLES,
  PROFILE_FIELDS_CONFIG,
} from '../config/constants'

/**
 * Check if a user is a special system user
 *
 * @param {String} userId user id
 *
 * @return {Boolean}
 */
export const isSystemUser = (userId) => [DISCOURSE_BOT_USERID, CODER_BOT_USERID, TC_SYSTEM_USERID].indexOf(userId) > -1

/**
 * Get Avatar resized to specified size
 *
 * @param {String} avatarUrl Avatar URL
 * @param {Number} size Avatar Resize value
 *
 * @return {String}
 */
export const getAvatarResized = (avatarUrl, size) => {
  // we only load URL using CDN if they are absolute
  // we don't load relative URLs which lead to the images inside connect-app like Coder Bot avatar
  if (avatarUrl && /^https?:\/\//.test(avatarUrl)) {
    return `${TC_CDN_URL}/avatar/${encodeURIComponent(avatarUrl)}?size=${size}`
  }

  return avatarUrl
}

export const getFullNameWithFallback = (user) => {
  if (!user) return ''
  let userFullName = user.firstName
  if (userFullName && user.lastName) {
    userFullName += ' ' + user.lastName
  }
  userFullName = userFullName && userFullName.trim().length > 0 ? userFullName : user.handle
  userFullName = userFullName && userFullName.trim().length > 0 ? userFullName : 'Connect user'
  return userFullName
}

/**
 * Check if user profile is complete or no.
 *
 * @param {Object} user            `loadUser.user` from Redux Store
 * @param {Object} profileSettings profile settings with traits
 *
 * @returns {Boolean} complete or no
 */
export const isUserProfileComplete = (user, profileSettings) => {
  const isTopcoderUser = _.intersection(user.roles, NON_CUSTOMER_ROLES).length > 0
  const fieldsConfig = isTopcoderUser ? PROFILE_FIELDS_CONFIG.TOPCODER : PROFILE_FIELDS_CONFIG.CUSTOMER

  // check if any required field doesn't have a value
  let isMissingUserInfo = false
  _.forEach(_.keys(fieldsConfig), (fieldKey) => {
    const isFieldRequired = fieldsConfig[fieldKey]

    if (isFieldRequired && !profileSettings.fieldKey) {
      isMissingUserInfo = true
      return false
    }
  })

  return !isMissingUserInfo
}
