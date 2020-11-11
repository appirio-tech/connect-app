/**
 * A plug to show when project plan doesn't have any phases
 */
import React from 'react'
import { PERMISSIONS } from '../../../../config/permissions'
import { hasPermission } from '../../../../helpers/permissions'

import './ProjectPlanEmpty.scss'

const ProjectPlanEmpty = () => {
  return hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN) ? (
    <div styleName="container">
      <h2>Build Your Project Plan</h2>
      <p>Build your project plan in Connect to reflect delivery progress to the customer. Begin by clicking the "Add Phase" button, select the template that best matches your need, and modify the phase title and milestone dates prior to publishing to the customer.</p>
      <p><b>Important Note:</b> To move the project into <i>'Active'</i> status, you must set at least one phase in Connect's Project Plan to be in 'Planned' status, which signifies to customers that delivery planning and execution has begun.</p>
      <p>If you feel like you have more things to send over, or want to reach out to us, please drop us a line at support@topcoder.com. Thanks!</p>
    </div>
  ) : (
    <div styleName="container">
      <h2>Welcome to your project plan</h2>
      <p>We are reviewing your request. Within the next 24 hours, Topcoder will contact you to discuss next steps, including finalizing your sale and preparing our crowd to meet your needs. Once delivery is mobilized, your project plan will be updated to reflect your detailed delivery plan and will serve as your resource for engaging in key milestones and monitoring progress.</p>
    </div>
  )
}

export default ProjectPlanEmpty
