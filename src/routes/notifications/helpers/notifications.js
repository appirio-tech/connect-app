/**
 * Helper methods to filter and preprocess notifications
 */
import _ from 'lodash'

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
    [{ title: 'All Notifications', value: '' }],
    [{ title: 'Global', value: 'global', quantity: globalNotificationsQuantity }]
  ]
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
 *
 * @return {Array}                list of sources with related notifications
 */
export const splitNotificationsBySources = (sources, notifications) => {
  const notificationsBySources = []

  sources.filter(source => source.total > 0).forEach(source => {
    source.notifications = _.filter(notifications, { sourceId: source.id })
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
