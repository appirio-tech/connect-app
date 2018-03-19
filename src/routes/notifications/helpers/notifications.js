/**
 * Helper methods to filter and preprocess notifications
 */
import _ from 'lodash'
import { OLD_NOTIFICATION_TIME } from '../../../config/constants'
import { NOTIFICATION_RULES } from '../constants/notifications'
import Handlebars from 'handlebars'

// how many milliseconds in one minute
const MILLISECONDS_IN_MINUTE = 60000

/**
 * Handlebars helper to display limited quantity of item and text +N more
 *
 * Example:
 *   ```
 *   {{#showMore __history__ 3}}<strong>{{userHandle}}</strong>{{/showMore}}
 *   ```
 *   Gets 3 items from `__history__` array and render them comma-separated.
 *   If there are more than 3 items, adds '+N more'. Output can be:
 *   ```
 *   <strong>userHandle1</strong>, <strong>userHandle1</strong>, <strong>userHandle3</strong> +7 more
 *   ```
 *
 * @param {Array}  items   list of items
 * @param {Number} max     max items to display
 * @param {Object} options handlebars options
 */
const handlebarsShowMoreHelper = (items, max, options) => {
  const renderedItems = items.map(options.fn)
  const uniqRenderedItems = _.uniq(renderedItems)
  const maxRenderedItems = uniqRenderedItems.slice(0, max)
  const restItemsCount = uniqRenderedItems.length - maxRenderedItems.length

  let out = maxRenderedItems.join(', ')

  if (restItemsCount > 0) {
    out += ` +${restItemsCount} more`
  }

  return out
}

/**
 * Handlebars helper which displays fallback value if the value is not provided (falsy)
 *
 * Example:
 *  ```
 *  {{fallback userFullName userHandle}}
 *  ```
 *  Will output `userHandle` if `userFullName` is not provided
 *
 * @param {String} value         value
 * @param {String} fallbackValue fallback value
 */
const handlebarsFallbackHelper = (value, fallbackValue) => {
  const out = value || fallbackValue

  return new Handlebars.SafeString(out)
}

// register handlebars helpers
Handlebars.registerHelper('showMore', handlebarsShowMoreHelper)
Handlebars.registerHelper('fallback', handlebarsFallbackHelper)

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
 * Filter notifications that belongs to project:projectId
 *
 * @param  {Array}  notifications list of notifications
 *
 * @param  {Number}  projectId
 *
 * @return {Array}                notifications list filtered of notifications
 */
export const filterNotificationsByProjectId = (notifications, projectId) => _.filter(notifications, (notification) => {
  return notification.sourceId === `${projectId}`
})

/**
 * Filter notifications about Topic and Post changed
 *
 * @param  {Array}  notifications list of notifications
 *
 * @return {Array}                notifications list filtered of notifications
 */
export const filterTopicAndPostChangedNotifications = (notifications) => _.filter(notifications, (notification) => {
  return notification.eventType === 'notifications.connect.project.topic.created' ||
         notification.eventType === 'notifications.connect.project.post.created' ||
         notification.eventType === 'notifications.connect.project.post.mention'
})

/**
 * Filter notifications about the project
 *
 * @param  {Array}  notifications list of notifications
 *
 * @return {Array}                notifications list filtered of notifications
 */
export const filterProjectNotifications = (notifications) => _.filter(notifications, (notification) => {
  return notification.eventType === 'notifications.connect.project.created' ||
         notification.eventType === 'notifications.connect.project.approved' ||
         notification.eventType === 'notifications.connect.project.paused' ||
         notification.eventType === 'notifications.connect.project.completed' ||
         notification.eventType === 'notifications.connect.project.specificationModified' ||
         notification.eventType === 'notifications.connect.project.submittedForReview' ||
         notification.eventType === 'notifications.connect.project.fileUploaded' ||
         notification.eventType === 'notifications.connect.project.canceled' ||
         notification.eventType === 'notifications.connect.project.linkCreated'
})

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
 * Compare notification rules ignoring version
 *
 * @param {Object} rule1 notification rule 1
 * @param {Object} rule2 notification rule 2
 *
 * @returns {Boolean} true if rules are equal
 */
const isNotificationRuleEqual = (rule1, rule2) => {
  /**
   * Properties which distinguish one rule from another
   *
   * @type {Array<String>}
   */
  const ESSENTIAL_RULE_PROPERTIES = ['eventType', 'toTopicStarter', 'toUserHandle', 'projectRole', 'topcoderRole']
  const essentialRule1 = _.pick(rule1, ESSENTIAL_RULE_PROPERTIES)
  const essentialRule2 = _.pick(rule2, ESSENTIAL_RULE_PROPERTIES)

  return _.isEqual(essentialRule1, essentialRule2)
}

/**
 * Bundle same type notifications for the same project
 *
 * @param {Array<{notification, notificationRule}>} notificationsWithRules list of notification with rules
 *
 * @returns {Array<{notification, notificationRule}>} bundled notifications with rules
 */
const bundleNotifications = (notificationsWithRules) => {
  /**
   * List of `contents` properties for which we want to keep the whole history
   *
   * @type {Array<String>}
   */
  const PROPERTIES_KEEP_IN_HISTORY = ['userHandle', 'userFullName']
  const bundledNotificationsWithRules = []

  // starting from the latest notifications
  // find older notifications with the same notification rule and the same project
  _.reverse(notificationsWithRules).forEach((notificationWithRule) => {
    // if notifications doesn't have to be bundled, add it to notifications list as it is
    if (!notificationWithRule.notificationRule.shouldBundle) {
      bundledNotificationsWithRules.push(notificationWithRule)
    }

    // try to find existent notification in the list to which we can bundle current one
    const existentNotificationWithRule = _.find(bundledNotificationsWithRules, (bundledNotificationWithRule) => (
      // same source id means same project
      bundledNotificationWithRule.notification.sourceId === notificationWithRule.notification.sourceId
      // same notification rule means same type
      && isNotificationRuleEqual(bundledNotificationWithRule.notificationRule, notificationWithRule.notificationRule)
    ))

    // if already have notification of the same type, update it instead of adding new notification to the list
    if (existentNotificationWithRule) {
      // if haven't bundled any notifications yet, then init properties which only bundled notifications has
      if (!existentNotificationWithRule.notification.bundledIds) {
        existentNotificationWithRule.notification.bundledIds = [
          existentNotificationWithRule.notification.id
        ]
        existentNotificationWithRule.notification.contents.bundledCount = 1
        existentNotificationWithRule.notification.contents.__history__ = [
          _.pick(existentNotificationWithRule.notification.contents, PROPERTIES_KEEP_IN_HISTORY)
        ]
      }

      // at this point bundled notification is initialized,
      // so we just update values of bundled notifications
      existentNotificationWithRule.notification.bundledIds.push(
        notificationWithRule.notification.id
      )
      existentNotificationWithRule.notification.contents.bundledCount += 1
      existentNotificationWithRule.notification.contents.__history__.push(
        _.pick(notificationWithRule.notification.contents, PROPERTIES_KEEP_IN_HISTORY)
      )
      if (notificationWithRule.notification.date > existentNotificationWithRule.notification.date) {
        _.merge(existentNotificationWithRule.notification, notificationWithRule.notification)
      }
    } else {
      bundledNotificationsWithRules.push(notificationWithRule)
    }
  })

  return bundledNotificationsWithRules
}

/**
 * Prepare notifications
 *
 * @param  {Array} rawNotifications notifications list
 *
 * @return {Array}               notification list
 */
export const prepareNotifications = (rawNotifications) => {
  const notificationsWithRules = rawNotifications.map((rawNotification) => ({
    id: `${rawNotification.id}`,
    sourceId: rawNotification.contents.projectId ? `${rawNotification.contents.projectId}` : 'global',
    sourceName: rawNotification.contents.projectId ? (rawNotification.contents.projectName || 'project') : 'Global',
    eventType: rawNotification.type,
    date: rawNotification.createdAt,
    isRead: rawNotification.read,
    seen: rawNotification.seen,
    isOld: new Date().getTime() - OLD_NOTIFICATION_TIME * MILLISECONDS_IN_MINUTE > new Date(rawNotification.createdAt).getTime(),
    contents: rawNotification.contents,
    version: rawNotification.version
  })).map((notification) => {
    const notificationRule = getNotificationRule(notification)

    // populate notification data
    notification.type = notificationRule.type
    if (notificationRule.goTo){
      const renderGoTo = Handlebars.compile(notificationRule.goTo)
      notification.goto = renderGoTo(notification.contents)
    }

    return {
      notification,
      notificationRule
    }
  })

  const bundledNotificationsWithRules = bundleNotifications(notificationsWithRules)

  // render notifications texts
  bundledNotificationsWithRules.forEach((bundledNotificationWithRule) => {
    const { notification, notificationRule } = bundledNotificationWithRule
    const textTpl = notification.contents.bundledCount
      // if text for bundled notification is not defined, just use regular text
      ? (notificationRule.bundledText || notificationRule.text)
      : notificationRule.text

    const renderText = Handlebars.compile(textTpl)
    notification.text = renderText(notification.contents)
  })

  const notifications = _.map(bundledNotificationsWithRules, 'notification')

  return notifications
}
