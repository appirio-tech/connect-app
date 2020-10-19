/**
 * Message to show when the step-1 of email verification was success.
 */
import React from 'react'
import { Link } from 'react-router-dom'

import './AlmostDone.scss'

const AlmostDone = ({ user, verifiedEmail }) => {
  const [firstEmail, secondEmail] = [verifiedEmail, verifiedEmail === user.email ? 'new' : user.email]

  return (
    <div styleName="outer-container">
      <div styleName="page">
        <div styleName="container">
          <img src={require('../assets/icons/email-confirmation-icon.svg')} alt="almost-done-icon" />
          <h1>
            Almost done! One more step!
          </h1>
          <div styleName="text">
            The action was verified from your <strong>{firstEmail}</strong> email account.&nbsp;
            Please<br />
            click the link from your <strong>{secondEmail}</strong> account to complete the change.
          </div>
          <div styleName="button-back">
            <Link className="tc-btn tc-btn-primary" to="/settings/account">Back to My Account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlmostDone
