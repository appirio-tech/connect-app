/**
 * TopCoder specific helpers
 */
import {
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID,
  TC_CDN_URL
} from '../config/constants'
import systemSettings from '../routes/settings/services/settings'

let userTraitsCache = {}

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

export function clearUserTraits() {
  userTraitsCache = {}
}

export function getUserTrait(handle) {
  return new Promise((resolve, reject) => {
    if (!handle) {
      reject()
    }
    if (userTraitsCache[handle]) {
      return resolve(userTraitsCache[handle])
    }
    systemSettings.getProfileSettings(handle).then((resp) => {
      userTraitsCache[handle] = resp
      resolve(resp)
    }).catch(() => {
      reject()
    })
  })
}