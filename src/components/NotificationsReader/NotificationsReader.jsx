/**
 * When this component is mounted is triggers action to start reading notifications which met
 * the provided criteria.
 * 
 * When this component is unmounted it triggers action to stop reading notifications with that criteria.
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { startReadingNotifications, stopReadingNotifications } from '../../routes/notifications/actions'

class NotificationsReader extends React.Component {
  constructor(props) {
    super(props)

    this.notificationsReaderUid = null
  }

  componentWillMount() {
    const { id, criteria, startReadingNotifications } = this.props

    this.notificationsReaderUid = startReadingNotifications(criteria, id)
  }

  componentWillUnmount() {
    const { stopReadingNotifications } = this.props

    stopReadingNotifications(this.notificationsReaderUid)
  }

  render() {
    return null
  }
}

NotificationsReader.propTypes = {
  criteria: PT.oneOfType([
    PT.object, 
    PT.arrayOf(PT.object)
  ]).isRequired,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  startReadingNotifications,
  stopReadingNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsReader)