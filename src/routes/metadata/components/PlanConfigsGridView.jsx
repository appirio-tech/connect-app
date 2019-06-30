import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NavLink, Link } from 'react-router-dom'
import moment from 'moment'
import GridView from '../../../components/Grid/GridView'

import './MetaDataProjectTemplatesGridView.scss'

const PlanConfigsGridView = props => {
  const { totalCount, criteria, pageNum, pageSize, sortHandler,
    error, isLoading, infiniteAutoload, setInfiniteAutoload,
    applyFilters, planConfigs } = props

  const currentSortField = _.get(criteria, 'sort', '')
  // This 'little' array is the heart of the list component.
  // it defines what columns should be displayed and more importantly
  // how they should be displayed.
  const columns = [
    {
      id: 'key',
      headerLabel: 'Key',
      classes: 'item-key',
      sortable: false,
      renderText: item => {
        const url = `/metadata/planConfig/${item.key}`
        const recentlyCreated = moment().diff(item.createdAt, 'seconds') < 3600
        return (
          <Link to={url} className="spacing">
            {recentlyCreated && <span className="blue-border" />}
            {item.key}
          </Link>
        )
      }
    }, {
      id: 'version',
      headerLabel: 'Version',
      classes: 'item-project-templates',
      sortable: false,
      renderText: item => {
        const url = `/metadata/planConfig/${item.key}`
        return (
          <div className="spacing project-template-container">
            <div className="template-title">
              <Link to={url} className="link-title">{_.unescape(item.version)}</Link>
            </div>
          </div>
        )
      }
    }, {
      id: 'updatedAt',
      headerLabel: 'Updated At',
      sortable: true,
      classes: 'item-status-date',
      renderText: item => {
        const time = moment(item.updatedAt)
        return (
          <div className="spacing time-container">
            <div className="txt-normal">{time.year() === moment().year() ? time.format('MMM D, h:mm a') : time.format('MMM D YYYY, h:mm a')}</div>
          </div>
        )
      }
    }, {
      id: 'createdAt',
      headerLabel: 'Created At',
      sortable: true,
      classes: 'item-status-date',
      renderText: item => {
        const time = moment(item.createdAt)
        return (
          <div className="spacing time-container">
            <div className="txt-normal">{time.year() === moment().year() ? time.format('MMM D, h:mm a') : time.format('MMM D YYYY, h:mm a')}</div>
          </div>
        )
      }
    }
  ]

  const gridProps = {
    error,
    isLoading,
    columns,
    onPageChange: () => {}, // dummy, as we are not expecting paging yet in metadata views
    sortHandler,
    currentSortField,
    resultSet: planConfigs.map((planConfig) => ({
      ...planConfig,
      id: planConfig.key,
    })),
    totalCount,
    currentPageNum: pageNum,
    pageSize,
    infiniteAutoload,
    infiniteScroll: true,
    setInfiniteAutoload,
    applyFilters,
    entityName: 'plan config',
    entityNamePlural: 'plan configs'
  }

  return (
    <div className="project-templates-grid-view">
      <div className="project-templates-actions">
        <NavLink to="/metadata/new-plan-config" className="tc-btn tc-btn-primary align-button">
          Create
        </NavLink>
      </div>
      <GridView {...gridProps} />
    </div>
  )
}


PlanConfigsGridView.propTypes = {
  currentUser: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  // onPageChange: PropTypes.func.isRequired,
  sortHandler: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  criteria: PropTypes.object.isRequired,
  planConfigs: PropTypes.array.isRequired,
}

export default PlanConfigsGridView
