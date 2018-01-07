/**
 * Helper methods to filter and preprocess notifications
 */
import _ from 'lodash'
import { OLD_NOTIFICATION_TIME } from '../../../config/constants'
import { NOTIFICATION_RULES } from '../constants/notifications'

// how many milliseconds in one minute
const MILLISECONDS_IN_MINUTE = 60000

/**
 * Get notification filters by sources
 *
 * @param  {Array} sources       list of sources
 *
 * @return {Array}               list of filters by sources
 */
export const getNotificationsFilters = (sources) => {
  const globalNotificationsQuantity = _.find(sources, { id: 'global' }).total
  const filterSections = [
    [{ title: 'All Notifications', value: '' }]
  ]
  if (globalNotificationsQuantity > 0) {
    filterSections.push([{ title: 'Global', value: 'global', quantity: globalNotificationsQuantity }])
  }
  const filtersBySource = []

  sources.forEach(source => {
    if (source.id !== 'global') {
      filtersBySource.push({
        title: source.title,
        value: source.id,
        quantity: source.total
      })
    }
  })

  if (filtersBySource.length > 0) {
    filterSections.push(filtersBySource)
  }

  return filterSections
}

/**
 * Split notifications by sources
 *
 * @param  {Array}  sources       list of sources
 * @param  {Array}  notifications list of notifications
 * @param  {Array}  oldSourceIds  list of ids of sources that will also show old notifications
 *
 * @return {Array}                list of sources with related notifications
 */
export const splitNotificationsBySources = (sources, notifications, oldSourceIds = []) => {
  const notificationsBySources = []

  sources.filter(source => source.total > 0).forEach(source => {
    source.notifications = _.filter(notifications, n => {
      if (n.sourceId !== source.id) return false
      if (_.indexOf(oldSourceIds, source.id) < 0 && n.isOld) return false
      return true
    })
    notificationsBySources.push(source)
  })

  return notificationsBySources
}

/**
 * Filter notifications to only not read yet
 *
 * @param  {Array}  notifications list of notifications
 *
 * @return {Array}                notifications list filtered of notifications
 */
export const filterReadNotifications = (notifications) => _.filter(notifications, { isRead: false })

/**
 * Limits notifications quantity per source
 * and total quantity of notifications
 *
 * @param  {Array}  notificationsBySources list of sources with notifications
 * @param  {Number} maxPerSource           maximum number of notifications to include per source
 * @param  {Number} maxTotal               maximum number of notifications in total
 *
 * @return {Array}                         list of sources with related notifications
 */
export const limitQuantityInSources = (notificationsBySources, maxPerSource, maxTotal) => {
  const notificationsBySourceLimited = []
  let total = 0
  let sourceIndex = 0

  while (total < maxTotal && sourceIndex < notificationsBySources.length) {
    const source = notificationsBySources[sourceIndex]
    const maxPerThisSource = Math.min(maxTotal - total, maxPerSource)
    source.notifications = source.notifications.slice(0, maxPerThisSource)
    notificationsBySourceLimited.push(source)

    total += source.notifications.length
    sourceIndex += 1
  }

  return notificationsBySourceLimited
}

/**
 * Render template with [variable] placeholders
 *
 * @param  {String} templateStr template
 * @param  {Object} values      values for template placeholders
 *
 * @return {String}             rendered template
 */
const renderTemplate = (templateStr, values) => {
  const regexp = /\[([^\]]+)\]/g
  let output = templateStr
  let match

  while (match = regexp.exec(templateStr)) { // eslint-disable-line no-cond-assign
    if (values[match[1]]) {
      output = output.replace(match[0], values[match[1]])
    }
  }

  return output
}

/**
 * Get a rule for notification
 *
 * @param  {Object} notification notification
 *
 * @return {Object}              notification rule
 */
const getNotificationRule = (notification) => {
  const notificationRule = _.find(NOTIFICATION_RULES, (_notificationRule) => {
    let match = _notificationRule.eventType === notification.eventType

    if (notification.version) {
      match = match && _notificationRule.version === notification.version
    }

    if (notification.contents.toTopicStarter) {
      match = match && _notificationRule.toTopicStarter
    }

    if (notification.contents.toUserHandle) {
      match = match && _notificationRule.toUserHandle
    }

    if (notification.contents.projectRole) {
      match = match && _notificationRule.projectRoles && _.includes(_notificationRule.projectRoles, notification.contents.projectRole)
    }

    if (notification.contents.topcoderRole) {
      match = match && _notificationRule.topcoderRoles && _.includes(_notificationRule.topcoderRoles, notification.contents.topcoderRole)
    }

    return match
  })

  if (!notificationRule) {
    throw new Error(`Cannot find notification rule for eventType '${notification.eventType}' version '${notification.version}'.`)
  }

  return notificationRule
}

/**
 * Prepare notifications
 *
 * @param  {Array} notifications notifications list
 *
 * @return {Array}               notification list
 */
export const prepareNotifications = (rowNotifications) => {
  const notifications = rowNotifications.map((rowNotification) => ({
    id: `${rowNotification.id}`,
    sourceId: rowNotification.contents.projectId ? `${rowNotification.contents.projectId}` : 'global',
    sourceName: rowNotification.contents.projectId ? (rowNotification.contents.projectName || 'project') : 'Global',
    eventType: rowNotification.type,
    date: rowNotification.createdAt,
    isRead: rowNotification.read,
    isOld: new Date().getTime() - OLD_NOTIFICATION_TIME * MILLISECONDS_IN_MINUTE > new Date(rowNotification.createdAt).getTime(),
    contents: rowNotification.contents,
    version: rowNotification.version
  })).map((notification) => {
    const notificationRule = getNotificationRule(notification)

    // populate notification data
    notification.type = notificationRule.type
    notification.text = renderTemplate(notificationRule.text, notification.contents)
    notification.goto = renderTemplate(notificationRule.goTo, notification.contents)

    return notification
  })

  return notifications
}
