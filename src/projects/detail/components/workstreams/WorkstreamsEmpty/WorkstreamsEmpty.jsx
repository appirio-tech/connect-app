/**
 * A plug to show when project plan doesn't have any workstreams
 */
import React from 'react'

import './WorkstreamsEmpty.scss'

const WorkstreamsEmpty = ({ isManageUser }) => {

  return isManageUser ? (
    <div styleName="container">
      <h2>Build Your Project Plan</h2>
      <p>Build your project plan in Connect to reflect delivery progress to the customer. Begin by clicking the "Add Phase" button, select the template that best matches your need, and modify the phase title and milestone dates prior to publishing to the customer.</p>
      <p><b>Important Note:</b> To move the project into <i>'Active'</i> status, you must set at least one phase in Connect's Project Plan to be in 'Planned' status, which signifies to customers that delivery planning and execution has begun.</p>
      <p>If you feel like you have more things to send over, or want to reach out to us, please drop us a line at support@topcoder.com. Thanks!</p>
    </div>
  ) : (
    <div styleName="container">
      <h2>Welcome to your project plan</h2>
      <p>Thank you for submitting your project requirements. In the next 24h someone from our team will reach out to you to discuss the project details with you so we can build the detailed project plan. Until then stand back and relax, we're working hard on your information.</p>
      <p>If you feel like you have more things to send over, or want to reach out to us, please drop us a line at support@topcoder.com. Thanks!</p>
    </div>
  )
}

export default WorkstreamsEmpty
