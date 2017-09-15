import React, { PropTypes as PT } from 'react'
import config from '../../../config/projectWizard'
import ProjectTypeCard from './ProjectTypeCard'
import SVGIconImage from '../../../components/SVGIconImage'
import './SelectProjectType.scss'

function SelectProjectType(props) {
  const { userRoles } = props
  const cards = []
  for (const key in config) {
    const item = config[key]
    const icon = <SVGIconImage filePath={item.icon} />
    cards.push(
      <ProjectTypeCard
        icon={icon}
        info={item.info}
        key={key}
        onClick={() => props.onProjectTypeChange(item.id)}
        type={key}
      />
    )
  }
  return (
    <div>
      <div className="header headerSelectProjectType">
        { (!userRoles || !userRoles.length) && <SVGIconImage filePath="connect-logo-mono" />}
      </div>
      <div className="SelectProjectType">
        <h1>Select your project category</h1>
        <div className="cards">{cards}</div>
        <div className="footer">
          Looking for something else? <a href="http://crowdsourcing.topcoder.com/piqued_by_crowdsourcing">Get in touch with us.</a>
        </div>
      </div>
    </div>
  )
}

SelectProjectType.propTypes = {
  onProjectTypeChange: PT.func.isRequired,
  userRoles: PT.arrayOf(PT.string)
}

export default SelectProjectType
