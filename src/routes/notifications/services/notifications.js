/**
 * Mocked service for notifications
 *
 * TODO has to be replaced with the real service
 */
import { axiosInstance as axios } from '../../../api/requestInterceptor'
import { TC_NOTIFICATION_URL } from '../../../../config/constants'
import { NOTIFICATIONS_LIMIT, OLD_NOTIFICATION_TIME } from '../../../config/constants'
import _ from 'lodash'


// the id can be either: null/undefined (mark all); notification id; or '-' separated ids, e.g. '123-456-789'
const markNotificationsRead = (id) => {
  if (id) {
    return axios.put(`${TC_NOTIFICATION_URL}/notifications/${id}/read`)
  } else {
    return axios.put(`${TC_NOTIFICATION_URL}/notifications/read`)
  }
}

const getNotifications = () => {
  return axios.get(`${TC_NOTIFICATION_URL}/notifications?read=false&limit=${NOTIFICATIONS_LIMIT}`)
    .then(resp => resp.data.items)
    .then(items => _.map(items, item => {
      // convert notification item
      const notification = {
        id: `${item.id}`,
        sourceId: item.contents.projectId ? `${item.contents.projectId}` : 'global',
        sourceName: item.contents.projectId ? (item.contents.projectName || 'project') : 'Global',
        type: 'warning',
        date: item.createdAt,
        isRead: item.read,
        isOld: new Date().getTime() - OLD_NOTIFICATION_TIME * 60000 > new Date(item.createdAt).getTime(),
        content: ''
      }

      if (item.type === 'notifications.connect.project.created') {
        notification.type = 'new-project'
        notification.content = `project created: <strong>${item.contents.projectName}</strong>`
      } else if (item.type === 'notifications.connect.project.updated') {
        notification.type = 'updates'
        notification.content = `project updated: <strong>${item.contents.projectName}</strong>`
      } else if (item.type === 'notifications.connect.message.posted') {
        notification.type = 'new-posts'
        notification.content = `<strong>${item.contents.userName}</strong> posted message: <strong>${item.contents.message}</strong>`
      } else if (item.type === 'notifications.connect.message.edited') {
        notification.type = 'updates'
        notification.content = `<strong>${item.contents.userName}</strong> edited message: <strong>${
          item.contents.oldMessage}</strong>, new message: <strong>${item.contents.newMessage}</strong>`
      } else if (item.type === 'notifications.connect.message.deleted') {
        notification.type = 'updates'
        notification.content = `<strong>${item.contents.userName}</strong> deleted message: <strong>${item.contents.message}</strong>`
      } else if (item.type === 'notifications.connect.project.submittedForReview') {
        notification.type = 'review-pending'
        notification.content = `project submitted for review: <strong>${item.contents.projectName}</strong>`
      }
      return notification
    }))
}

export default {
  getNotifications,
  markNotificationsRead
}
