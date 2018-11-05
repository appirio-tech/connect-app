/**
 * Mocked service for settings
 */
import { axiosInstance as axios } from '../../../api/requestInterceptor'
import { TC_NOTIFICATION_URL } from '../../../config/constants'

/**
 * Get notifications settings
 * 
 * @returns {Promise<Object>} notifications settings
 */
const getNotificationSettings = () => {
  return axios.get(`${TC_NOTIFICATION_URL}/settings`)
    .then(resp => resp.data)
}

/**
 * Save notifications settings
 * 
 * @param {Object} notifications settings
 * 
 * @returns {Promise<Object>} notifications settings
 */
const saveNotificationSettings = (data) => {
  return axios.put(`${TC_NOTIFICATION_URL}/settings`, data)
}

export default {
  getNotificationSettings,
  saveNotificationSettings,
}
