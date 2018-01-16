import React from 'react'
import IconNotificationMememberAdded from '../../../assets/images/notification-member-added.svg'
import IconNotificationNewPosts from '../../../assets/images/notification-new-posts.svg'
import IconNotificationNewProject from '../../../assets/images/notification-new-project.svg'
import IconNotificationReviewPending from '../../../assets/images/notification-review-pending.svg'
import IconNotificationUpdates from '../../../assets/images/notification-updates.svg'
import IconNotificationWarning from '../../../assets/images/notification-warning.svg'

class NotificationIcons extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { type, className } = this.props
    switch(type){
    case 'member-added':
      return <object><IconNotificationMememberAdded className={className}/></object>
    case 'new-posts':
      return <object><IconNotificationNewPosts className={className}/></object>
    case 'new-project':
      return <object><IconNotificationNewProject className={className}/></object>
    case 'review-pending':
      return <object><IconNotificationReviewPending className={className}/></object>
    case 'updates':
      return <object><IconNotificationUpdates className={className}/></object>
    case 'warning':
      return <object><IconNotificationWarning className={className}/></object>
    default:
      return 'undefined icon'
    }
  }
}

export default NotificationIcons
