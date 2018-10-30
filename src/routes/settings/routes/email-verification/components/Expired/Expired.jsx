/**
 * Message to show when new email verification link is expired.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import CoderBot from '../../../../../../components/CoderBot/CoderBot'

import './Expired.scss'

const Expired = () => (
  <CoderBot
    code={401}
    heading="Email Verification Failed" 
    message="Sorry, this verification link is no longer valid due to one of the following reasons:" 
  >
    <ul styleName="list">
      <li>It has already been verified.</li>
      <li>It has expired or has been cancelled, any pending email change that is cancelled is no longer subject to verification.</li>
    </ul>
    <div styleName="controls">
      <Link className="tc-btn tc-btn-primary" to="/settings/account">Back to My Account</Link>
    </div>
  </CoderBot>
)

export default Expired