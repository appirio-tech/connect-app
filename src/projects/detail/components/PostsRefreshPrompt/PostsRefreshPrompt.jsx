/**
 * Prompt to refresh posts
 *
 * It's shown when ALL the next conditions are met:
 * - user scrolled down the screen
 * - user is not currently editing/creating a post
 * - there are some new posts on the server
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import Sticky from '../../../../components/Sticky'

import {
  filterReadNotifications,
  filterNotificationsByProjectId,
  filterTopicAndPostChangedNotifications,
} from '../../../../routes/notifications/helpers/notifications'
import { SCROLL_TO_MARGIN } from '../../../../config/constants'

import Refresh from '../../../../assets/icons/icon-refresh.svg'

import styles from './PostsRefreshPrompt.scss'

/**
 * Check if there are any new unread notifications related to topics or posts
 * 
 * @param {Array}  notifications     current notifications
 * @param {Array}  nextNotifications updated notifications
 * @param {Number} projectId         project id
 * 
 * @returns {Boolean} true if there are new unread notifications related to topics or posts
 */
const getIsNewTopicAndPostNotificationsArrived = (notifications, nextNotifications, projectId) => {
  const newNotifications = _.differenceBy(nextNotifications, notifications, 'id')

  const notReadNotifications = filterReadNotifications(newNotifications)
  const unreadTopicAndPostChangedNotifications = filterTopicAndPostChangedNotifications(filterNotificationsByProjectId(notReadNotifications, projectId))

  return unreadTopicAndPostChangedNotifications.length > 0
}

class PostsRefreshPrompt extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasToRefresh: false,
      scrolled: false,
    }

    this.onScroll = this.onScroll.bind(this)
    this.refreshFeeds = this.refreshFeeds.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  componentDidMount() {
    this.setState({
      hasToRefresh: false,
      scrolled: window.scrollY > 0,
    })
    window.addEventListener('scroll', this.onScroll)
  }

  onScroll() {
    const { scrolled: currentlyScrolled } = this.state
    const scrolled = window.scrollY > 0

    // update state only if the values is changes to avoid unnecessary redraws
    if (currentlyScrolled !== scrolled) {
      this.setState({ scrolled })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { notifications: { notifications } } = this.props
    const { notifications: { notifications: nextNotifications }, projectId, preventShowing } = nextProps
    const { scrolled, hasToRefresh } = this.state

    const isNewTopicAndPostNotificationsArrived = getIsNewTopicAndPostNotificationsArrived(notifications, nextNotifications, projectId)
    
    // if there are new notification regarding topics or post, we have to refresh the feed
    // we run this only once, so if we already have to refresh the feed, than do nothing
    if (!hasToRefresh && isNewTopicAndPostNotificationsArrived) {
      this.setState({ hasToRefresh: true }, () => {
        // if not scrolled we refresh feed automatically without showing a button for manual refresh
        if (!preventShowing && !scrolled) {
          this.refreshFeeds()
        }
      })      
    }
  }

  refreshFeeds() {
    const { refreshFeeds } = this.props

    refreshFeeds && refreshFeeds()
    this.setState({ hasToRefresh: false })
  }

  render() {
    const { preventShowing } = this.props
    const { hasToRefresh } = this.state

    const isShown = hasToRefresh && !preventShowing

    return (
      isShown ? (
        <Sticky top={SCROLL_TO_MARGIN} innerZ={10}>
          <div styleName="prompt">
            <button
              className={`tc-btn tc-btn-primary tc-btn-md ${styles.button}`}
              onClick={this.refreshFeeds}
            >
              <Refresh styleName="icon" />
              Reload page to view updates
            </button>
          </div>
        </Sticky>
      ) : (
        null
      )
    )
  }
}

PostsRefreshPrompt.propTypes = {
  preventShowing: PT.bool,
  toggleNotificationRead: PT.func.isRequired,
  refreshFeeds: PT.func.isRequired,
  notifications: PT.object.isRequired,
  projectId: PT.number.isRequired,
}

export default PostsRefreshPrompt
