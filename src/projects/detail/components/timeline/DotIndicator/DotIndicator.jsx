import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './DotIndicator.scss'

const DotIndicator = ({
  hideDot,
  hideLine,
  children,
}) => (
  <div
    styleName={cn('container', {
      'hide-dot': hideDot,
      'hide-line': hideLine,
    })}
  >
    {children}
    <div styleName="line" />
    <i styleName="dot" />
  </div>
)

DotIndicator.propTypes = {
  children: PT.node,
}

export default DotIndicator
