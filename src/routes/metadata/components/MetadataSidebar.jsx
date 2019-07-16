import React from 'react'
import MenuList from '../../../components/MenuList/MenuList'

import './MetadataSidebar.scss'

const navLinks = [{
  label: 'Project Templates',
  to: '/metadata/projectTemplates',
}, {
  label: 'Product Templates',
  to: '/metadata/productTemplates',
}, {
  label: 'Project Types',
  to: '/metadata/projectTypes',
}, {
  label: 'Product Categories',
  to: '/metadata/productCategories',
}, {
  label: 'Milestone Templates',
  to: '/metadata/milestoneTemplates',
}, {
  label: 'Forms',
  to: '/metadata/forms',
}, {
  label: 'Plan Configs',
  to: '/metadata/planConfigs',
}, {
  label: 'Price Configs',
  to: '/metadata/priceConfigs',
}]

const MetadataSidebar = () => {
  return (
    <div styleName="container">
      <div className="sideAreaWrapper">
        <hr styleName="separator"/>
        <div styleName="section-title">
            METADATA
        </div>
        <MenuList navLinks={navLinks}/>
      </div>
    </div>
  )
}

export default MetadataSidebar