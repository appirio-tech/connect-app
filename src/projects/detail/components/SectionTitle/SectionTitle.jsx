/**
 * SectionTitle component
 * which is supposed to show a title in Section component
 * also can display some aside components on the right
 */
import React from 'react'
import PT from 'prop-types'

import './SectionTitle.scss'

const SectionTitle = ({ title, children }) => (
  <header styleName="container">
    <h3 styleName="title">{title}</h3>
    {children && <aside>{children}</aside>}
  </header>
)

SectionTitle.defaultProps = {
  children: null,
}

SectionTitle.propTypes = {
  children: PT.node,
  title: PT.string.isRequired,
}

export default SectionTitle
