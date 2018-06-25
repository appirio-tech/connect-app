/**
 * TwoColsLayout component
 * has sidebar column and content column
 */
import React from 'react'

import './TwoColsLayout.scss'

const TwoColsLayout = ({ children }) => (
  <div styleName="container">{children}</div>
)

TwoColsLayout.Sidebar = ({ children }) => (
  <aside styleName="sidebar">{children}</aside>
)

TwoColsLayout.Content = ({ children }) => (
  <div styleName="content">
    <div styleName="content-inner">
      {children}
    </div>
  </div>
)

export default TwoColsLayout
