import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

/**
 * Get a user based on it's handle/username
 * 
 * @param  {integer} handle unique identifier of the user
 * @return {object}           user returned by api
 */
export function getUserProfile(handle) {
  return axios.get(`${TC_API_URL}/v3/members/${handle}/`)
    .then(resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

/**
 * Get member traits
 * 
 * @param {String} handle member handle
 * 
 * @returns {Object}      member traits
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
 * @returns {Promise<Array>}     member traits
 */
export const updateMemberTraits = (handle, updatedTraits) => {
  return axios.put(`${TC_API_URL}/v3/members/${handle}/traits`, {
    param: updatedTraits
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