import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL, RESET_PASSWORD_URL } from '../config/constants'
import querystring from 'querystring'

/**
 * Get a user based on it's handle/username
 *
 * @param {String} handle user handle
 *
 * @returns {Promise<Object>} user profile data
 */
export function getUserProfile(handle) {
  return axios.get(`${TC_API_URL}/v3/members/${handle}/`)
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}


/**
 * Gets credential for the specified user id.
 *
 * NOTE: Only admins are authorized to use the underlying endpoint.
 *
 * @param {Number} userId The user id
 * @return {Promise} Resolves to the linked accounts array.
 */
export  function getCredential(userId) {
  return axios.get(`${TC_API_URL}/v3/users/${userId}?fields=credential`)
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}


/**
 * Update user profile
 *
 * @param {String} handle         user handle
 * @param {Object} updatedProfile updated user data
 * @param {Object} [queryParams]  optional query params
 *
 * @returns {Promise<Object>} user profile data
 */
export function updateUserProfile(handle, updatedProfile, queryParams = {}) {
  let query = querystring.stringify(queryParams)
  query = query ? `?${query}` : ''

  return axios.put(`${TC_API_URL}/v3/members/${handle}/${query}`, {
    param: updatedProfile
  })
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

/**
 * Get member traits
 *
 * @param {String} handle member handle
 *
 * @returns {Promise<Array>} member traits
 */
export const getMemberTraits = (handle) => {
  return axios.get(`${TC_API_URL}/v5/members/${handle}/traits`)
    .then(resp => resp.data)
}

/**
 * Update member traits
 *
 * @param {String} handle        member handle
 * @param {Array}  updatedTraits list of updated traits
 *
 * @returns {Promise<Array>} member traits
 */
export const updateMemberTraits = (handle, updatedTraits) => {
  return axios.put(`${TC_API_URL}/v5/members/${handle}/traits`, (updatedTraits || []).map(traitInfo => {
    return _.pick(traitInfo, ['categoryName', 'traitId', 'traits', ])
  }))
    .then(resp => resp.data)
}

/**
 * Create member traits
 *
 * @param {String} handle member handle
 * @param {Array}  traits list of traits to create
 *
 * @returns {Promise<Array>} member traits
 */
export const createMemberTraits = (handle, traits) => {
  return axios.post(`${TC_API_URL}/v5/members/${handle}/traits`, (traits || []).map(traitInfo => {
    return _.pick(traitInfo, ['categoryName', 'traitId', 'traits', ])
  }))
    .then(resp => resp.data)
}

/**
 * Update member photo
 *
 * @param {String} handle           member handle
 * @param {Object} data             params to update photo
 * @param {String} data.contentType photo file content type
 * @param {String} data.token       token provided by pre signed URL
 *
 * @returns {Promise<String>}       photo URL
 */
export const updateMemberPhoto = (handle, data) => {
  return axios.put(`${TC_API_URL}/v3/members/${handle}/photo`, {
    param: data
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Get pre-signed URL for member photo
 *
 * @param {String} handle member handle
 * @param {File}   file   file to upload
 *
 * @returns {Promise<Object>} data of pre-signed URL
 */
export const getPreSignedUrl = (handle, file) => {
  return axios.post(`${TC_API_URL}/v3/members/${handle}/photoUploadUrl`, {
    param: {
      contentType: file.type
    }
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Check if email is available to be used for a user
 *
 * @param {String} email email to validate
 *
 * @returns {Promise<Object>} response body
 */
export const checkEmailValidity = (email) => {
  return axios.get(`${TC_API_URL}/v3/users/validateEmail?email=${encodeURIComponent(email)}`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Update user password
 *
 * @param {Number} userId     user id
 * @param {Object} credential user credentials old and new one
 *
 * @returns {Promise<Object>} response body
 */
export const updatePassword = (userId, credential) => {
  return axios.patch(`${TC_API_URL}/v3/users/${userId}`, {
    param: { credential }
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
}

/**
 * Send reset password email to the user
 *
 * @param {String} email user email
 *
 * @returns {Promise<Object>} response body
 */
export const resetPassword = (email) => {
  return axios.get(`${TC_API_URL}/v3/users/resetToken?email=${encodeURIComponent(email)}&resetPasswordUrlPrefix=${encodeURIComponent(RESET_PASSWORD_URL)}`)
    .then(resp => _.get(resp.data, 'result.content', {}))
}
