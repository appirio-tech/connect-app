import React from 'react'
import { TAAS_APP_URL } from '../../../../config/constants'
import './TaasProjectWelcome.scss'

const TaasProjectWelcome = ({ projectId }) => {
  const url = `${TAAS_APP_URL}/myteams/${projectId}`
  return (
    <div styleName="container">
      <a href={url} className="tc-btn tc-btn-lg tc-btn-primary">Go to your Talent Team</a>
    </div>
  )
}

export default TaasProjectWelcome
