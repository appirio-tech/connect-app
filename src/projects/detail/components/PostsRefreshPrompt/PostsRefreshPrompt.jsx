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

import Sticky from '../../../../components/Sticky'

import {
  filterReadNotifications,
  filterNotificationsByProjectId,
  filterTopicAndPostChangedNotifications,
} from '../../../../routes/notifications/helpers/notifications'
import { REFRESH_UNREAD_UPDATE_INTERVAL, SCROLL_TO_MARGIN } from '../../../../config/constants'

import Refresh from '../../../../assets/icons/icon-refresh.svg'

import styles from './PostsRefreshPrompt.scss'

class PostsRefreshPrompt extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      unreadUpdate: [],
      scrolled: false,
    }

    this.onScroll = this.onScroll.bind(this)
    this.checkForUnreadPosts = this.checkForUnreadPosts.bind(this)

    this.refreshUnreadUpdate = null
  }

  componentWillMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    // clearInterval(this.refreshUnreadUpdate)
  }

  componentDidMount() {
    this.setState({
      unreadUpdate: [],
      scrolled: window.scrollY > 0,
    })

    // this.refreshUnreadUpdate = setInterval(this.checkForUnreadPosts, REFRESH_UNREAD_UPDATE_INTERVAL)
  }

  getUnreadTopicAndPostChangedNotifications() {
    const { notifications, projectId } = this.props

    const notReadNotifications = filterReadNotifications(notifications.notifications)
    const unreadTopicAndPostChangedNotifications = filterTopicAndPostChangedNotifications(filterNotificationsByProjectId(notReadNotifications, projectId))

    return unreadTopicAndPostChangedNotifications
  }

  onScroll() {
    const { scrolled: currentlyScrolled } = this.state
    const scrolled = window.scrollY > 0

    // update state only if the values is changes to avoid unnecessary redraws
    if (currentlyScrolled !== scrolled) {
      this.setState({ scrolled })
    }
  }

  checkForUnreadPosts() {
    const unreadUpdate = this.getUnreadTopicAndPostChangedNotifications()
    const { refreshFeeds, preventShowing } = this.props
    const { scrolled } = this.state

    this.setState({ unreadUpdate: this.getUnreadTopicAndPostChangedNotifications() })

    if (!preventShowing && !scrolled && unreadUpdate.length > 0) {
      refreshFeeds()
    }
  }

  render() {
    const { preventShowing, refreshFeeds } = this.props
    const { unreadUpdate, scrolled } = this.state

    const isShown = unreadUpdate.length > 0 && !preventShowing && scrolled

    return (
      isShown ? (
        <Sticky top={SCROLL_TO_MARGIN} innerZ={999}>
          <div styleName="prompt">
            <button
              className={`tc-btn tc-btn-primary tc-btn-md ${styles.button}`}
              onClick={refreshFeeds}
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
