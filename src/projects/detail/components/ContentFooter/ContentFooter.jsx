/**
 * ContentFooter component
 * used to be displayed in the right area of TwoColsLayout
 */
import React from 'react'
import PT from 'prop-types'

import './ContentFooter.scss'

const ContentFooter = ({
  children
}) => (
  <footer styleName="container">{children}</footer>
)

ContentFooter.defaultProps = {
  children: null,
}

ContentFooter.propTypes = {
  children: PT.node,
}

export default ContentFooter
