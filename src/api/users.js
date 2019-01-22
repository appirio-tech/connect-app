import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'
import { RESET_PASSWORD_URL } from '../config/constants'

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
 * Update user profile
 * 
 * @param {String} handle         user handle
 * @param {Object} updatedProfile updated user data
 * 
 * @returns {Promise<Object>} user profile data
 */
export function updateUserProfile(handle, updatedProfile) {
  return axios.put(`${TC_API_URL}/v3/members/${handle}/`, { 
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
  return axios.get(`${TC_API_URL}/v3/members/${handle}/traits`)
    .then(resp => _.get(resp.data, 'result.content', {}))
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
  return axios.put(`${TC_API_URL}/v3/members/${handle}/traits`, {
    param: updatedTraits
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
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
  return axios.post(`${TC_API_URL}/v3/members/${handle}/traits`, {
    param: traits
  })
    .then(resp => _.get(resp.data, 'result.content', {}))
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
  return axios.get(`${TC_API_URL}/v3/users/validateEmail?email=${email}`)
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
