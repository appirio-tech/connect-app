/**
 * Email verification container.
 *
 * This container sends request to the backend to verify a new email and shows
 * success/failure/almostDone message according to the backend response.
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { verifyEmail } from '../../../actions'
import { requiresAuthentication } from '../../../../../components/AuthenticatedComponent'
import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import Success from '../components/Success'
import Failure from '../components/Failure'
import AlmostDone from '../components/AlmostDone'

class EmailVerification extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { location, verifyEmail, user } = this.props
    const query = new URLSearchParams(location.search)
    const token = query.get('token')

    verifyEmail(user.handle, token)
  }

  render() {
    const { isVerifyingEmail, verifyingEmailResult, verifyingEmailError, user } = this.props

    if (isVerifyingEmail) {
      return <LoadingIndicator />
    }

    if (verifyingEmailResult) {
      return verifyingEmailResult.emailChangeCompleted
        ? <Success />
        : <AlmostDone verifiedEmail={verifyingEmailResult.verifiedEmail} user={user} />
    }

    if (verifyingEmailError) {
      return <Failure />
    }

    return null
  }
}

EmailVerification.propTypes = {
  user: PT.object,
  location: PT.shape({ search: PT.string }),
  isVerifyingEmail: PT.bool,
  verifyingEmailResult: PT.shape({ emailChangeCompleted: PT.bool, verifiedEmail: PT.string }),
  verifyingEmailError: PT.any
}

const mapStateToProps = ({ loadUser, settings }) => ({
  user: loadUser.user,
  isVerifyingEmail: settings.system.isVerifyingEmail,
  verifyingEmailResult: settings.system.verifyingEmailResult,
  verifyingEmailError: settings.system.verifyingEmailError
})

const mapDispatchToProps = {
  verifyEmail
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(requiresAuthentication(EmailVerification))
)
