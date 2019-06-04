/*
  Helper util functions
 */
import _ from 'lodash'

/**
 * Finds the difference between two objects.
 * This function is helpful for debugging.
 *
 * @param {Object} object object to compare with
 * @param {Object} base   some basic object
 */
export function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, (result, value, key) => {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value
      }
    })
  }
  return changes(object, base)
}

/**
 * Helper method to check the uniqueness of two emails
 *
 * @param {String} email1    first email to compare
 * @param {String} email2    second email to compare
 * @param {Object} options  the options
 *
 * @returns {Boolean} true if two emails are same
 */
export const compareEmail = (email1, email2, options = { UNIQUE_GMAIL_VALIDATION: false }) => {
  if (options.UNIQUE_GMAIL_VALIDATION) {
    // email is gmail
    const emailSplit = /(^[\w.+-]+)(@gmail\.com|@googlemail\.com)$/g.exec(_.toLower(email1))
    if (emailSplit) {
      const address = emailSplit[1].replace('.', '')
      const emailDomain = emailSplit[2].replace('.', '\\.')
      const regexAddress = address.split('').join('\\.?')
      const regex = new RegExp(`${regexAddress}${emailDomain}`)
      return regex.test(_.toLower(email2))
    }
  }
  return _.toLower(email1) === _.toLower(email2)
}