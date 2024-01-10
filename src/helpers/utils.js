/*
  Helper util functions
 */
import _ from 'lodash'
import moment from 'moment'
import { logger } from '../../logger/logger';

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

/**
 * Helper method to check the uniqueness of two user handles
 *
 * @param {String} handle1    first user handle to compare
 * @param {String} handle2    second user handle to compare
 *
 * @returns {Boolean} true if two user handles are same
 */
export const compareHandles = (handle1, handle2) => {
  if (handle1 === undefined || handle2 === undefined || handle1 === null || handle2 === null ) {
    logger.info(`Comparing: ${handle1} to ${handle2}`)
    return false
  }
  let h1 = handle1
  let h2 = handle2
  if (handle2.indexOf('@') === 0) {
    h2 = (handle2 || '').substring(1)
  }
  if (handle1.indexOf('@') === 0) {
    h1 = (handle1 || '').substring(1)
  }
  return h1.toLowerCase() === h2.toLowerCase()
}

// remove empty object, null/undefined value and empty string recursively from passed obj
const deepClean = obj => _.transform(obj, (result, value, key) => {
  const isCollection = _.isObject(value)
  const cleaned = isCollection ? deepClean(value) : value
  // exclude if empty object, null, undefined or empty string
  if ((isCollection && _.isEmpty(cleaned)) || _.isNil(value) || value === '') {
    return
  }
  _.isArray(result) ? result.push(cleaned) : (result[key] = cleaned)
})

/**
 * Helper method to clean given object from null, undefined or empty property.
 *
 * @param {Object} obj    the object to clean
 */
export const clean = obj => _.isObject(obj) ? deepClean(obj) : obj


/**
 * Creates a DOM event in browser independent way to be complaint
 *
 * @param {String} eventName name of the event to be created
 */
export const createEvent = (eventName) => {
  let event
  if(typeof(Event) === 'function') {
    event = new Event(eventName)
  } else {
    event = document.createEvent('Event')
    event.initEvent(eventName, true, true)
  }
  return event
}

/**
 * Creates artificial delay
 *
 * @param {Integer} milliseconds delay in milliseconds
 *
 * @returns {Promise}
 */
export const delay = (milliseconds) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds)
})

/**
 * Case-insensitive search
 *
 * @param {String} key search key
 * @param {String} searchString search string
 *
 * @returns {Bool}
 */
export const caseInsensitiveSearch = (key, searchString) => {
  if (!key || !searchString) {
    return false
  }

  return searchString.toLowerCase().indexOf(key.toLowerCase()) >= 0
}

/**
 * format phone bofore send to server
 * if phone is not head with '+', add '+'
 *
 * @param {String}        phone
 * @returns {String}
 */
export const formatPhone = (phone) => {
  if (!phone) {
    return phone
  }

  if(phone[0] === '+') {
    return phone
  }else{
    return '+' + phone
  }
}

/**
 * Validates if object has valid start and end dates
 *
 * @param {object} values
 * @param {string} values.startDate start date
 * @param {string} values.endDate end date
 *
 * @returns {boolean} is valid
 */
export const isValidStartEndDates = (values) => {
  const { startDate, endDate } = values
  // if no dates, don't validate
  if (!startDate || !endDate) {
    return false
  }

  const momentStartDate = moment(startDate)
  const momentEndDate = moment(endDate)

  const isValid =  momentStartDate.isSameOrBefore(momentEndDate, 'days')

  return isValid
}
