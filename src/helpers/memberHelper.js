import moment from 'moment'

/**
 * Set default value of photoURL as empty string
 */
export function normalizeMemberData(member) {
  if (!member.photoURL) member.photoURL = ''
  return member
}

/**
 * Convert timestampt from Epoch time to datetime ISO format string
 * homeCountryCode of `null` is validation error in member-api v5
 */
export function normalizeMemberProfileData(profile) {
  if (profile.createdAt) profile.createdAt = moment(profile.createdAt).toISOString()
  if (profile.updatedAt) profile.updatedAt = moment(profile.updatedAt).toISOString()
  if (!profile.homeCountryCode) delete profile.homeCountryCode
  return profile
}

/**
 * Convert timestampt from Epoch time to datetime ISO format string
 */
export function normalizeTraitData(trait) {
  if (trait.createdAt) trait.createdAt = moment(trait.createdAt).toISOString()
  if (trait.updatedAt) trait.updatedAt = moment(trait.updatedAt).toISOString()
  return trait
}
