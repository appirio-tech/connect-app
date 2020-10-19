/**
 * Message to show when new email verification failed.
 */
import React from 'react'
import { Link } from 'react-router-dom'

import './Failure.scss'

const Failure = () => (
  <div styleName="outer-container">
    <div styleName="page">
      <div styleName="container">
        <img src={require('../assets/icons/failed.svg')} alt="failed-icon" />
        <h1>
          Email Verification Failed
        </h1>
        <div styleName="text">
          Sorry, this verification link is no longer valid due to one of the following reasons:
        </div>
        <ul>
          <li>
            <span>
              It has already been verified.
            </span>
          </li>
          <li>
            <span>
              It has expired or has been cancelled, any pending email
              change that is cancelled is no longer subject to verification.
            </span>
          </li>
        </ul>
        <div styleName="tip">
          Make sure you&#39;re logged in with the right account
          or try updating your email again
        </div>
        <div styleName="button-back">
          <Link className="tc-btn tc-btn-primary" to="/settings/account">Back to My Account</Link>
        </div>
      </div>
    </div>
  </div>
)

export default Failure
