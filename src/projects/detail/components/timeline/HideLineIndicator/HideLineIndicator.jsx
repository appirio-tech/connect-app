import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './HideLineIndicator.scss'

const HideLineIndicator = ({
  hidden,
  children,
}) => (
  <div
    styleName={cn('container', {
      hidden,
    })}
  >
    {children}
    <div styleName="line" />
  </div>
)

HideLineIndicator.propTypes = {
  children: PT.node,
}

export default HideLineIndicator
