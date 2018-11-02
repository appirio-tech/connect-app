/**
 * This component marks `unreadNotifications` as read when this component is mounted.
 *
 * It is usefull if we have to mark some notifications as read when we show some component.
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import { toggleNotificationRead, toggleBundledNotificationRead } from '../../routes/notifications/actions'

class NotificationsReader extends React.Component {
  componentWillMount() {
    const { unreadNotifications } = this.props

    this.markNotificationsRead(unreadNotifications)
  }

  componentWillReceiveProps(nextProps) {
    // if list of unread notifications changed we have to mark new unread notification as read too
    // as this component is still mounted i. e. visible
    if (!_.isEqual(nextProps.unreadNotifications, this.props.unreadNotifications)) {
      const newUnreadNotification = _.differenceBy(nextProps.unreadNotifications, this.props.unreadNotifications)

      this.markNotificationsRead(newUnreadNotification)
    }
  }

  markNotificationsRead(notifications) {
    const {
      toggleNotificationRead,
      toggleBundledNotificationRead,
    } = this.props

    if (!notifications) {
      return
    }

    notifications.forEach((notification) => {
      if (notification.bundledIds) {
        toggleBundledNotificationRead(notification.id, notification.bundledIds)
      } else {
        toggleNotificationRead(notification.id)
      }
    })
  }

  render() {
    const { children } = this.props

    return children
  }
}

NotificationsReader.defaultProps = {
  children: null,
  unreadNotifications: [],
}

NotificationsReader.propTypes = {
  children: PT.node,
  unreadNotifications: PT.array,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  toggleNotificationRead,
  toggleBundledNotificationRead,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsReader)