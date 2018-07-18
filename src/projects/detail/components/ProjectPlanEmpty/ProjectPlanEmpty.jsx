/**
 * A plug to show when project plan doesn't have any phases
 */
import React from 'react'

import './ProjectPlanEmpty.scss'

const ProjectPlanEmpty = () => (
  <div styleName="container">
    <h2>Welcome to your project plan</h2>
    <p>Thank you for submitting your project requirements. In the next 24h someone from our team will reach out to you to discuss the project details with you so we can build the detailed project plan. Until then stand back and relax, we're working hard on your information.</p>
    <p>If you feel like you have more things to send over, or want to reach out to us, please drop us a line at connect@topcoder.com. Thanks!</p>
  </div>
)

export default ProjectPlanEmpty
