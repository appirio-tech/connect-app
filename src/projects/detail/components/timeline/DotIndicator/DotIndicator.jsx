/**
 * Shows empty blue circle on the line be default
 *
 * - hideDot - don't show the dot on the line
 * - hideLine - hides line together with dot
 * - isDone - dot become filled with blue
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './DotIndicator.scss'

const DotIndicator = ({
  hideDot,
  hideLine,
  isDone,
  children,
}) => (
  <div
    styleName={cn('container', {
      'hide-dot': hideDot,
      'hide-line': hideLine,
      'is-done': isDone,
    })}
  >
    {children}
    <div styleName="line" />
    <i styleName="dot" />
  </div>
)

DotIndicator.defaultTypes = {
  hideDot: false,
  hideLine: false,
  isDone: false,
}

DotIndicator.propTypes = {
  children: PT.node.isRequired,
  hideDot: PT.bool,
  hideLine: PT.bool,
  isDone: PT.bool,
}

export default DotIndicator
