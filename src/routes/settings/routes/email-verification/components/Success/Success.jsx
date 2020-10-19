/**
 * Message to show when new email verification was success.
 */
import React from 'react'
import { Link } from 'react-router-dom'

import './Success.scss'

const Success = () => (
  <div styleName="outer-container">
    <div styleName="page">
      <div styleName="container">
        <img src={require('../assets/icons/success.svg')} alt="success-icon" />
        <h1>
          Email Verification Success
        </h1>
        <div styleName="text">
          Congratulations! Your email verification has been completed.
        </div>
        <div styleName="button-back">
          <Link className="tc-btn tc-btn-primary" to="/settings/account">Back to My Account</Link>
        </div>
      </div>
    </div>
  </div>
)

export default Success

