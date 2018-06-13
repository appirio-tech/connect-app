/**
 * TopCoder specific helpers
 */
import {
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID,
} from '../config/constants'

/**
 * Check if a user is a special system user
 *
 * @param {String} userId user id
 *
 * @return {Boolean}
 */
export const isSystemUser = (userId) => [DISCOURSE_BOT_USERID, CODER_BOT_USERID, TC_SYSTEM_USERID].indexOf(userId) > -1
