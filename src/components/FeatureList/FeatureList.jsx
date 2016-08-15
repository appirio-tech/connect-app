import React, {PropTypes} from 'react'
import cn from 'classnames'
require('./FeatureList.scss')

const FeatureList = ({children}) => (
  <div className="feature-list">
    {children}
  </div>
)
FeatureList.propTypes = {
  children: PropTypes.any.isRequired
}

const FeatureListItem = ({icon, title, description, children}) => (
  <div className="feature-list-item">
    {icon && <div className="icon-col">{icon}</div>}
    <div className="content-col">
      <h4>{title}</h4>
      <p className={cn({bigger: !icon})}>{description}</p>
      {children && <div className="child-component">{children}</div>}
    </div>
  </div>
)

FeatureListItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.any.isRequired,
  description: PropTypes.any.isRequired,
  children: PropTypes.any
}

FeatureList.Item = FeatureListItem

export default FeatureList
