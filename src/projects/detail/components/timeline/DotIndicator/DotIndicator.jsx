/**
 * Shows empty blue circle on the line be default
 *
 * - hideDot - don't show the dot on the line
 * - hideLine - hides line together with dot
 * - hideFirstLine - same like before, but should only be used
 *                   to hide the beginning of the milestone line
 * - isDone - dot become filled with blue
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './DotIndicator.scss'

const DotIndicator = ({
  hideDot,
  hideFirstLine,
  hideLine,
  isDone,
  children,
}) => (
  <div
    styleName={cn('container', {
      'hide-dot': hideDot,
      'hide-line': hideLine,
      'hide-first-line': hideFirstLine,
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
  hideFirstLine: false,
  hideLine: false,
  isDone: false,
}

DotIndicator.propTypes = {
  children: PT.node.isRequired,
  hideDot: PT.bool,
  hideFirstLine: PT.bool,
  hideLine: PT.bool,
  isDone: PT.bool,
}

export default DotIndicator
