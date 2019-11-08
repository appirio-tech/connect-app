/**
 * Message to show when new email verification was success.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import CoderBot from '../../../../../../components/CoderBot/CoderBot'

import './Success.scss'

const Success = () => (
  <CoderBot
    code={200}
    heading="Email Verification Success" 
    message="Congratulations! Your email verification has been completed." 
  >
    <div styleName="controls">
      <Link className="tc-btn tc-btn-primary" to="/settings/account">Back to My Account</Link>
    </div>
  </CoderBot>
)

export default Success