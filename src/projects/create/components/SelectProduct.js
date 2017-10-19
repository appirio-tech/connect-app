import React, { PropTypes as PT } from 'react'
import { Link } from 'react-router-dom'
import config from '../../../config/projectWizard'
import ProductCard from './ProductCard'
import SVGIconImage from '../../../components/SVGIconImage'
import { findCategory } from '../../../config/projectWizard'
import './SelectProduct.scss'

function SelectProduct(props) {
  const { userRoles, projectType, onChangeProjectType } = props
  const isLoggedIn = userRoles && userRoles.length
  const logoTargetUrl = isLoggedIn ? '/projects' : '/'
  const cards = []
  for (const key in config) {
    const type = config[key]
    if (projectType && type.id !== projectType) continue
    const subTypes = type.subtypes
    for(const subType in subTypes) {
      const item = subTypes[subType]
      // don't render disabled items for selection
      // don't render hidden items as well, hidden items can be reached via direct link though
      if (item.disabled || item.hidden) continue
      const icon = <SVGIconImage filePath={item.icon} />
      cards.push(
        <ProductCard
          icon={icon}
          info={item.details}
          key={item.id}
          onClick={() => props.onProductChange(type.id, item.id)}
          type={ subType }
        />
      )
    }
  }
  const projectCategory = findCategory(props.projectType)
  return (
    <div>
      <div className="header headerSelectProduct">
        { !isLoggedIn && <Link className="logo" to={logoTargetUrl} target="_self"><SVGIconImage filePath="connect-logo-mono" className="connectLogo"/></Link>}
        { !isLoggedIn && <button className="tc-btn tc-btn-default tc-btn-sm" onClick={ onChangeProjectType }><SVGIconImage filePath="arrows-undo" />Change project type</button> }
      </div>
      <div className="SelectProduct">
        <h1> { projectCategory.name } projects </h1>
        <h2>{ projectCategory.question }</h2>
        <div className="cards">{cards}</div>
        <div className="footer">
          Looking for something else? <a href="http://crowdsourcing.topcoder.com/piqued_by_crowdsourcing">Get in touch with us.</a>
        </div>
      </div>
    </div>
  )
}

SelectProduct.propTypes = {
  onProductChange: PT.func.isRequired,
  userRoles: PT.arrayOf(PT.string)
}

export default SelectProduct
