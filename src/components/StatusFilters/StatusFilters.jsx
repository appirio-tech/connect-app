/**
 * Filters for project by status
 * 
 * Regularly filter items are displayed in a line. 
 * If there is not enough space some items are hided and new option "More" is displayed.
 * Clicking option "More" shows dropdown menu with hidden items.
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import StatusFiltersDropdown from './StatusFiltersDropdown'
import StatusFiltersList from './StatusFiltersList'
import { PROJECT_STATUS } from '../../config/constants'

import './StatusFilters.scss'

/**
 * All project statuses
 */
const projectStatuses = [
  { val: null, label: 'All Projects' },
  ...PROJECT_STATUS.sort((a, b) => a.order - b.order).map((item) => ({val: item.value, label: item.name}))
]

/**
 * Placeholder for the "More" option for calculating space
 */
const moreStatus = {val: '__more__', label: 'More'}

class StatusFilters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hiddenStatusValues: [],
      measureStatuses: this.getMeasureStatuses(props.currentStatus)
    }

    this.updateHiddenStatuses = this.updateHiddenStatuses.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateHiddenStatuses)
    this.updateHiddenStatuses()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHiddenStatuses)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStatus !== nextProps.currentStatus) {
      this.updateMeasureStatuses(nextProps.currentStatus)
    }
  }

  updateMeasureStatuses(currentStatus) {
    this.setState({ 
      measureStatuses: this.getMeasureStatuses(currentStatus)
    }, this.updateHiddenStatuses)
  }

  getMeasureStatuses(currentStatus) {
    // the list of statuses which used to measure space
    // looks like: [ <active status>, ...<other statuses>... , <more button> ]
    return [
      // put active item first, as it will be always visible
      ..._.filter(projectStatuses, { val: currentStatus }),
      ..._.reject(projectStatuses, { val: currentStatus }),
      // measure with "More" button 
      moreStatus
    ]
  }

  updateHiddenStatuses() {
    const { measureStatuses } = this.state
    const hiddenStatusValues = []

    const listEl = this.refs.measurer.firstElementChild
    const itemEls = listEl.children
    const itemWidths = _.map(itemEls, el => el.clientWidth)

    // width of button "More"
    const moreWidth = itemWidths[itemWidths.length - 1]
    
    // how much space items overflow including "More" button
    let overflowWidth = this.refs.measurer.scrollWidth - this.refs.measurer.clientWidth

    // if without "More" button we still fit the space don't do anything
    if (overflowWidth - moreWidth > 0) {
      // try removing (hiding) items from the list to fit the space
      // but don't remove active item and "More" button
      while (itemWidths.length > 2) {
        if ( overflowWidth > 0) {
          const nextToLastIndex = itemWidths.length - 2
          overflowWidth -= itemWidths[nextToLastIndex]
          itemWidths.splice(nextToLastIndex, 1)
          hiddenStatusValues.push(measureStatuses[nextToLastIndex].val)
        } else {
          break
        }
      }
    }

    // update hidden statuses in the state only if they are changed to avoid unnecessary redrawing
    if (!_.isEqual(this.state.hiddenStatusValues, hiddenStatusValues)) {
      this.setState({ hiddenStatusValues })
    }
  }

  render() {
    const { measureStatuses, hiddenStatusValues } = this.state

    const visibleStatuses = projectStatuses.filter((status) => !_.includes(hiddenStatusValues, status.val))
    const hiddenStatuses = projectStatuses.filter((status) => _.includes(hiddenStatusValues, status.val))

    return (
      <div>
        <div styleName="measurer" ref="measurer">
          <StatusFiltersList {...this.props} statuses={measureStatuses} />
        </div>
        <div styleName="filters">
          <StatusFiltersList {...this.props} statuses={visibleStatuses} />
          {hiddenStatuses.length > 0 && (
            <StatusFiltersDropdown {...this.props} statuses={hiddenStatuses} />
          )}
        </div>
      </div>
    )
  }
}

StatusFilters.defaultProps = {
  currentStatus: null
}

StatusFilters.propTypes = {
  currentStatus: PropTypes.string,
  onStatusClick: PropTypes.func.isRequired
}

export default StatusFilters
