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
