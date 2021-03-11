import React from 'react'
import { TAAS_APP_URL } from '../../../../config/constants'
import './TaasProjectWelcome.scss'

const TaasProjectWelcome = ({ projectId }) => {
  const url = `${TAAS_APP_URL}/myteams/${projectId}`
  return (
    <div>
      <div styleName="text-container">
        <p>This is a Talent as a Service project. Click this button to navigate to a TaaS focused experience where you can get information specific to your TaaS team.</p>
      </div>
      <div styleName="container">
        <a href={url} className="tc-btn tc-btn-lg tc-btn-primary">Go to your Talent Team</a>
      </div>
    </div>
  )
}

export default TaasProjectWelcome
