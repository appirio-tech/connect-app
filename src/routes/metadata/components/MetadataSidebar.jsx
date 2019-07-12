import React from 'react'
import MenuList from '../../../components/MenuList/MenuList'
import FileIcon from '../../../assets/icons/file.svg'

import './MetadataSidebar.scss'

const navLinks = [{
  label: 'Project Templates',
  to: '/metadata/projectTemplates',
  Icon: FileIcon
}, {
  label: 'Product Templates',
  to: '/metadata/productTemplates',
  Icon: FileIcon
}, {
  label: 'Project Types',
  to: '/metadata/projectTypes',
  Icon: FileIcon
}, {
  label: 'Product Categories',
  to: '/metadata/productCategories',
  Icon: FileIcon
}, {
  label: 'Milestone Templates',
  to: '/metadata/milestoneTemplates',
  Icon: FileIcon
}, {
  label: 'Forms',
  to: '/metadata/forms',
  Icon: FileIcon
}, {
  label: 'Plan Configs',
  to: '/metadata/planConfigs',
  Icon: FileIcon
}, {
  label: 'Price Configs',
  to: '/metadata/priceConfigs',
  Icon: FileIcon
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