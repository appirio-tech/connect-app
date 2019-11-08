/**
 * TwoColsLayout component
 * has sidebar column and content column
 */
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './TwoColsLayout.scss'

const TwoColsLayout = ({
  children,
  noPadding,
}) => (
  <div
    styleName={cn('container', {
      'no-padding': noPadding,
    })}
  >
    {children}
  </div>
)

TwoColsLayout.Sidebar = ({ children, wrapperClass }) => (
  <aside styleName={cn('sidebar', wrapperClass)}>{children}</aside>
)

TwoColsLayout.Content = ({ children }) => (
  <div styleName="content">
    <div styleName="content-inner">
      {children}
    </div>
  </div>
)

TwoColsLayout.defaultProps = {
  children: null,
  noPadding: false,
}

TwoColsLayout.propTypes = {
  children: PropTypes.node,
  noPadding: PropTypes.bool,
}

export default TwoColsLayout
