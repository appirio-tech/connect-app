/**
 * SidebarWithFooter component
 * displays footer at the bottom sticked to the bottom of the sidebar
 */
import React from 'react'
import PT from 'prop-types'

import FooterV2 from '../../../../components/FooterV2/FooterV2'

import './SidebarWithFooter.scss'

const SidebarWithFooter = ({
  children
}) => (
  <div styleName="container">
    {children}
    <FooterV2 />
  </div>
)

SidebarWithFooter.propTypes = {
  children: PT.node.isRequired,
}

export default SidebarWithFooter
