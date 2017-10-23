import React, { PropTypes as PT } from 'react'
import { Link } from 'react-router-dom'
import config from '../../../config/projectWizard'
import ProjectTypeCard from './ProjectTypeCard'
import SVGIconImage from '../../../components/SVGIconImage'
import { findProductsOfCategory } from '../../../config/projectWizard'
import './SelectProjectType.scss'

function SelectProjectType(props) {
  const { userRoles } = props
  const isLoggedIn = userRoles && userRoles.length
  const logoTargetUrl = isLoggedIn ? '/projects' : '/'
  const cards = []
  for (const key in config) {
    const item = config[key]
    const icon = <SVGIconImage filePath={item.icon} />
    const products = findProductsOfCategory(item.id) || []
    cards.push(
      <ProjectTypeCard
        icon={icon}
        info={item.info}
        key={key}
        onClick={() => props.onProjectTypeChange(item.id)}
        type={key}
        buttonText={ products.length > 1 ? 'View All' : 'Select Project'}
      />
    )
  }
  return (
    <div>
      <div className="header headerSelectProjectType">
        { !isLoggedIn && <Link className="logo" to={logoTargetUrl} target="_self"><SVGIconImage filePath="connect-logo-mono" className="connectLogo"/></Link>}
      </div>
      <div className="SelectProjectType">
        <h1>Create a new project</h1>
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
