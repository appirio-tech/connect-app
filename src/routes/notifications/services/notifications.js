/**
 * Mocked service for notifications
 */
import { axiosInstance as axios } from '../../../api/requestInterceptor'
import { TC_NOTIFICATION_URL } from '../../../config/constants'
import { NOTIFICATIONS_LIMIT } from '../../../config/constants'
import { prepareNotifications } from '../helpers/notifications'


// the id can be either: null/undefined (mark all); notification id; or '-' separated ids, e.g. '123-456-789'
const markNotificationsRead = (id) => {
  if (id) {
    return axios.put(`${TC_NOTIFICATION_URL}/${id}/read`)
  } else {
    return axios.put(`${TC_NOTIFICATION_URL}/read`)
  }
}

// the id can be either: notification id; or '-' separated ids, e.g. '123-456-789'
const markNotificationsSeen = (id) => {
  return axios.put(`${TC_NOTIFICATION_URL}/${id}/seen`)
}

const getNotifications = () => {
  return axios.get(`${TC_NOTIFICATION_URL}/list?read=false&limit=${NOTIFICATIONS_LIMIT}`)
    .then(resp => prepareNotifications(resp.data.items))
}

export default {
  getNotifications,
  markNotificationsRead,
  markNotificationsSeen,
}
