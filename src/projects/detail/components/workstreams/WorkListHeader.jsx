/**
 * WorkListHeader section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import cn from 'classnames'
import {getDaysToDelivery, getActiveWorkFilter, getDeliveredWorkFilter} from '../../../../helpers/workstreams'

import './WorkListHeader.scss'

const WorkListHeader = ({workstream, listType, onChangeListType}) => (
  <div styleName="container">
    <div styleName="left">
      <span styleName="stream-name">{workstream.name}</span>
      <span styleName="delivery-total">{getDaysToDelivery(workstream)}</span>
    </div>
    <div styleName="right">
      <a
        href="javascript:;"
        styleName={cn('switch-item', { 'switch-item-selected': listType === 'active' })}
        onClick={() => onChangeListType('active')}
      >
        <span styleName={cn('switch-item-title', { 'switch-item-title-selected': listType === 'active' })}>Active</span>
        <span styleName={cn('switch-item-count', { 'switch-item-count-selected': listType === 'active' })}>{_.filter(workstream.works, getActiveWorkFilter).length}</span>
      </a>
      <a
        href="javascript:;"
        styleName={cn('switch-item', { 'switch-item-selected': listType === 'delivered' })}
        onClick={() => onChangeListType('delivered')}
      >
        <span styleName={cn('switch-item-title', { 'switch-item-title-selected': listType === 'delivered' })}>Delivered</span>
        <span styleName={cn('switch-item-count', { 'switch-item-count-selected': listType === 'delivered' })}>{_.filter(workstream.works, getDeliveredWorkFilter).length}</span>
      </a>
      <a
        href="javascript:;"
        styleName={cn('switch-item', { 'switch-item-selected': listType === 'all' })}
        onClick={() => onChangeListType('all')}
      >
        <span styleName={cn('switch-item-title', { 'switch-item-title-selected': listType === 'all' })}>All</span>
      </a>
    </div>
  </div>
)

WorkListHeader.defaultProps = {
  onChangeListType: () => {}
}

WorkListHeader.propTypes = {
  workstream: PT.shape({
    name: PT.string.isRequired,
    works: PT.arrayOf(PT.shape({
      id: PT.number.isRequired,
      name: PT.string.isRequired,
      status: PT.string.isRequired,
      description: PT.string,
    })).isRequired,
  }).isRequired,
  listType: PT.string.isRequired,
  onChangeListType: PT.func,
}

export default withRouter(WorkListHeader)
