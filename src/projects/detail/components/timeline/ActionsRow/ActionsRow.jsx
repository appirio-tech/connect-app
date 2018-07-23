/**
 * Shows section with action buttons
 *
 * Has special case when `fakeName` is defined it shows a fake name left to button.
 * It's intended to be used together with `type=secondary`.
 *
 * `type` can be one of:
 *  - 'default'    - no special style
 *  - 'primary'    - blue background for primary button actions
 *  - 'secondary'  - gray background
 *
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './ActionsRow.scss'

const ActionsRow = ({
  buttons,
  fakeName,
  type,
}) => (
  <div styleName={cn('container', type)}>
    {!!fakeName && <div styleName="fake-name">{fakeName}</div>}

    <div>
      {buttons.map((button) => (
        <button
          key={button.title}
          onClick={button.onClick}
          className={`tc-btn tc-btn-${button.type || 'default'}`}
        >
          {button.title}
        </button>
      ))}
    </div>
  </div>
)

ActionsRow.defaultProps = {
  fakeName: null,
  type: 'default',
}

ActionsRow.propTypes = {
  buttons: PT.arrayOf(PT.shape({
    title: PT.string.isRequired,
    onClick: PT.func.isRequired,
    type: PT.type,
  })).isRequired,
  fakeName: PT.string,
  type: PT.oneOf([
    'default',
    'primary',
    'secondary',
  ])
}

export default ActionsRow
