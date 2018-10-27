/**
 * Mocked service for settings
 */
import { axiosInstance as axios } from '../../../api/requestInterceptor'
import { TC_NOTIFICATION_URL } from '../../../config/constants'

const getNotificationSettings = () => {
  return axios.get(`${TC_NOTIFICATION_URL}/settings`)
    .then(resp => resp.data)
}

const saveNotificationSettings = (data) => {
  return axios.put(`${TC_NOTIFICATION_URL}/settings`, data)
}

export default {
  getNotificationSettings,
  saveNotificationSettings,
}
