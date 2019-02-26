/**
 * Message to show when new email verification failed.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import CoderBot from '../../../../../../components/CoderBot/CoderBot'

import './Failure.scss'

const Failure = () => (
  <CoderBot
    code={400}
    heading="Email Verification Failed" 
    message="We could not verify your email. If you have any issues with your Topcoder account, please contact <a href='mailto:support@topcoder.com'>support@topcoder.com</a>." 
  >
    <div styleName="controls">
      <Link className="tc-btn tc-btn-primary" to="/settings/account">Back to My Account</Link>
    </div>
  </CoderBot>
)

export default Failure