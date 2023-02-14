/**
 * String format related helpers
 */

/**
  * Format the number separating every 3 digits with a comma
  *
  * @param {Number} value number to format
  * @return {String} formated number
  */
export function formatNumberWithCommas(value) {
  return (value || 0 ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Get initials from user profile
 * @param {String} firstName first name
 * @param {String} lastName last name
 * @returns {String}
 */
export function getInitials(firstName = '', lastName = '') {
  return `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`
}
