/**
 * When this component is mounted is triggers action to start reading notifications which met
 * the provided criteria.
 * 
 * When this component is unmounted it triggers action to stop reading notifications with that criteria.
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { markNotificationsReadByCriteria } from '../../routes/notifications/actions'

class NotificationsReader extends React.Component {
  componentWillMount() {
    const { criteria, markNotificationsReadByCriteria } = this.props

    markNotificationsReadByCriteria(criteria)
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
  markNotificationsReadByCriteria,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsReader)