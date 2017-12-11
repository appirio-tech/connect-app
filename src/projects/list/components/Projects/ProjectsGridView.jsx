import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'
import ProjectListProjectColHeader from './ProjectListProjectColHeader'
import GridView from '../../../../components/Grid/GridView'

import StatusFilters from '../../../../components/StatusFilters/StatusFilters'
import UserWithName from '../../../../components/User/UserWithName'
import { findCategory } from '../../../../config/projectWizard'
import { PROJECT_STATUS, PROJECTS_LIST_PER_PAGE } from '../../../../config/constants'

require('./ProjectsGridView.scss')

/*eslint-disable quote-props */
const projectTypeClassMap = {
  'generic'             : 'purple-block',
  'visual_design'       : 'blue-block',
  'visual_prototype'    : 'blue-block',
  'app_dev'             : 'green-block',
  'app'                 : 'green-block',
  'website'             : 'green-block',
  'chatbot'             : 'green-block',
  'quality_assurance'   : 'green-block'
}
/*eslint-enable */


const ProjectsGridView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, totalCount, criteria, pageNum, sortHandler, onPageChange,
    error, isLoading, infiniteAutoload, setInfiniteAutoload, projectsStatus, applyFilters } = props
  const currentSortField = _.get(criteria, 'sort', '')
  // This 'little' array is the heart of the list component.
  // it defines what columns should be displayed and more importantly
  // how they should be displayed.
  const columns = [
    {
      id: 'id',
      headerLabel: 'ID',
      classes: 'width70 item-id',
      sortable: true,
      renderText: item => {
        const recentlyCreated = moment().diff(item.createdAt, 'seconds') < 3600
        return (
          <div className="spacing">
            { recentlyCreated  && <span className="blue-border" /> }
            { item.id }
          </div>
        )
      }
    }, {
      id: 'projects',
      headerLabel: <ProjectListProjectColHeader currentSortField={currentSortField} sortHandler={sortHandler}/>,
      classes: 'width45 item-projects',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        const code = _.get(item, 'details.utm.code', '')
        const projectTypeClass = projectTypeClassMap[item.type]
        const projectType = _.get(findCategory(item.type), 'name', '')
        return (
          <div className="spacing">
            <Link to={url} className="link-title">{item.name}</Link>
            <div className="project-metadata">
              <span className={ projectTypeClass }>{ projectType }</span>
              { code && <span className="item-ref-code txt-gray-md">Ref: {code}</span> }
              <span className="txt-time">{moment(item.createdAt).format('DD MMM YYYY')}</span>
            </div>
          </div>
        )
      }
    }, {
      id: 'status',
      headerLabel: 'Status',
      sortable: true,
      classes: 'item-status width9',
      renderText: item => {
        const s = PROJECT_STATUS.filter((opt) => opt.value === item.status)[0]
        const classes = `txt-status ${s.color}`
        return (
          <div className="spacing">
            <span className={classes}>{s.name}</span>
          </div>
        )
      }
    }, {
      id: 'updatedAt',
      headerLabel: 'Last Updated',
      sortable: true,
      classes: 'item-status-date width9',
      renderText: item => {
        const classes = classNames('txt-normal', {
          'txt-italic': false // TODO when should we use this
        })
        return (
          <div className="spacing">
            <span className={classes}>{moment(item.updatedAt).format('MMM D')}</span>
          </div>
        )
      }
    }, {
      id: 'customer',
      headerLabel: 'Customer',
      sortable: false,
      classes: 'item-customer width12',
      renderText: item => {
        const m = _.find(item.members, m => m.isPrimary && m.role === 'customer')
        if (!m)
          return <div className="user-block txt-italic">Unknown</div>
        return (
          <div className="spacing">
            <UserWithName {...m} showLevel={false} />
          </div>
        )
      }
    }, {
      id: 'copilot',
      headerLabel: 'Copilot',
      sortable: false,
      classes: 'item-copilot width11',
      renderText: item => {
        const m = _.find(item.members, m => m.isPrimary && m.role === 'copilot')
        const rating = _.get(m, 'maxRating.rating', 0)
        if (!m)
          return <div className="user-block txt-italic">Unclaimed</div>
        return (
          <div className="spacing">
            <UserWithName {...m} rating={rating} showLevel={false} />
          </div>
        )
      }
    }, {
      id: 'price',
      headerLabel: 'Price',
      sortable: false,
      classes: 'item-price width7',
      renderText: item => {
        let desc = ''
        let price = null
        switch (item.status) {
        case 'active':
          desc = 'Pending'
          break
        case 'in_review':
          price = item.estimatedPrice || null
          desc = 'Estimated'
          break
        case 'reviewed':
          price = item.estimatedPrice || null
          desc = 'Quoted'
          break
        case 'completed':
          desc = 'Paid'
          price = item.actualPrice || null
          break
        }
        // if (price)
        //   price = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        return (
          <div className="spacing">
            { price ? <span className="txt-price yellow-light">$ {price}</span> : <noscript /> }
            <span className="txt-gray-sm">{desc}</span>
          </div>
        )
      }
    }
  ]

  // annotate projects with member data
  _.forEach(projects, prj => {
    prj.members = _.map(prj.members, m => {
      // there is some bad data in the system
      if (!m.userId) return m
      return _.assign({}, m, {
        photoURL: ''
      },
      members[m.userId.toString()])
    })
  })

  const gridProps = {
    error,
    isLoading,
    columns,
    onPageChange,
    sortHandler,
    currentSortField,
    resultSet: projects,
    totalCount,
    currentPageNum: pageNum,
    pageSize: PROJECTS_LIST_PER_PAGE,
    infiniteAutoload,
    infiniteScroll: true,
    setInfiniteAutoload,
    projectsStatus
  }

  return (
    <div>
      <StatusFilters criteria={criteria} applyFilters={applyFilters} />
      <GridView {...gridProps} />
    </div>
  )
}


ProjectsGridView.propTypes = {
  currentUser: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  members: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  sortHandler: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  criteria: PropTypes.object.isRequired
}

export default ProjectsGridView
