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
  return value.toString().replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g, ',')
}
