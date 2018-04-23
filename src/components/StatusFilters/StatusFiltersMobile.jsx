/**
 * Select of filter statuses for mobile devices
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import { PROJECT_STATUS } from '../../config/constants'

import IconCarretDown from '../../assets/icons/arrows-16px-3_small-down.svg'
import style from './StatusFiltersMobile.scss'

/**
 * All project statuses
 */
const projectStatuses = [
  { val: null, label: 'All Projects' },
  ...PROJECT_STATUS.sort((a, b) => a.order - b.order).map((item) => ({val: item.value, label: item.name}))
]

class StatusFiltersMobile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }

    this.toggle = this.toggle.bind(this)
    this.onStatusClick = this.onStatusClick.bind(this)
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  onStatusClick(statusVal) {
    this.toggle()
    this.props.onStatusClick(statusVal)
  }

  render() {
    const { currentStatus, onStatusClick } = this.props
    const { isOpen } = this.state
    const currentSatusLabel = _.find(projectStatuses, { val: currentStatus }).label

    return (
      <div>
        <div styleName={cn('handle', { 'is-open': isOpen })} onClick={this.toggle}>
          <span>{currentSatusLabel}</span>
          <IconCarretDown />
        </div>
        {isOpen && <ul styleName="list">
          {projectStatuses.map((status) => (
            <li
              key={status.val || 'null'}
              className={cn(style.item, { [style.active]: status.val === currentStatus })}
              onClick={() => this.onStatusClick(status.val)}
            >
              {status.label}
            </li>
          ))}
        </ul>}
      </div>
    )
  }
}

StatusFiltersMobile.defaultProps = {
  currentStatus: null
}

StatusFiltersMobile.propTypes = {
  currentStatus: PropTypes.string,
  statuses: PropTypes.arrayOf(PropTypes.shape({
    val: PropTypes.string,
    label: PropTypes.string.isRequired
  })),
  onStatusClick: PropTypes.func.isRequired
}

export default StatusFiltersMobile
