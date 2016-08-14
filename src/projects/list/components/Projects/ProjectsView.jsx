import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import { branch, renderComponent } from 'recompose'
import moment from 'moment'
import classNames from 'classnames'
import ProjectListProjectColHeader from './ProjectListProjectColHeader'
import GridView from '../../../../components/Grid/GridView'
import UserWithName from '../../../../components/User/UserWithName'
import ProjectsToolBar from '../ProjectsToolBar/ProjectsToolBar'

// This handles showing a spinner while the state is being loaded async
import spinnerWhileLoading from '../../../../components/LoadingSpinner'

const errorMessage = () => <div><h4>Opps we ran into a problem. <br/>Our minions are have been notified and will resolve the problem shortly.</h4></div>
const showErrorMessageIfError = hasError =>
  branch(hasError, t => t, renderComponent(errorMessage))
const errorHandler = showErrorMessageIfError(props => !props.error)
const spinner = spinnerWhileLoading(props => !props.isLoading)
const EnhancedGrid = spinner(errorHandler(GridView))



require('./ProjectsView.scss')

/*eslint-disable quote-props */
const projectTypeMap = {
  'generic': 'Wr',
  'visual_design': 'Dn',
  'visual_prototype': 'Pr',
  'app_dev': 'Ap'
}
const projectStatuseMap = {
  draft: { classes: 'status-draft', label: 'Draft'},
  'in_review': { classes: 'status-active', label: 'In Review'},
  reviewed: { classes: 'status-draft', label: 'Will launch'},
  active: { classes: 'status-active', label: 'Working'},
  completed: { classes: 'status-done', label: 'Done'},
  paused: { classes: 'status-error', label: 'Stalled'},
  cancelled: { classes: 'status-error', label: 'Cancelled'}
}
/*eslint-enable */

const ProjectsView = props => {
  const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading } = props
  const currentSortField = _.get(criteria, 'sort', '')
  // This 'little' array is the heart of the list component.
  // it defines what columns should be displayed and more importantly
  // how they should be displayed.
  const columns = [
    {
      id: 'type',
      headerLabel: 'Type',
      classes: 'width70 item-type',
      sortable: true,
      renderText: item => {
        return (
          <div className="spacing">
            <span className="blue-border hide"></span>
            <span className="blue-block">{projectTypeMap[item.type]}</span>
          </div>
        )
      }
    }, {
      id: 'projects',
      headerLabel: <ProjectListProjectColHeader currentSortField={currentSortField} sortHandler={sortHandler}/>,
      classes: 'width38 item-projects',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        return (
          <div className="spacing">
            <Link to={url} className="link-title">{item.name}</Link>
            <span className="txt-time">{moment(item.createdAt).format('DD MMM YYYY')}</span>
          </div>
        )
      }
    }, {
      id: 'status',
      headerLabel: 'Status',
      sortable: true,
      classes: 'item-status width9',
      renderText: item => {
        const s = projectStatuseMap[item.status]
        const classes = `txt-status ${s.classes}`
        return (
          <div className="spacing">
            <span className={classes}>{s.label}</span>
          </div>
        )
      }
    }, {
      id: 'status-date',
      headerLabel: 'Status Date',
      sortable: false,
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
      sortable: true,
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
    }, {
      id: 'ref-code',
      sortable: false,
      headerLabel: 'Ref code',
      classes: 'item-ref-code width8',
      renderText: item => {
        const code = _.get(item, 'details.utm.code', '')
        return (
          <div className="spacing">
            <span className="txt-gray-md">{code}</span>
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
    pageSize: 20
  }
  const toolBarProps = { criteria, applyFilters }
  
  return (
    <section class="content">
      <div className="">
        <ProjectsToolBar {...toolBarProps} />
      </div>
      <div class="container">
        <EnhancedGrid {...gridProps} />
      </div>
    </section>
  )
}


ProjectsView.propTypes = {
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

export default ProjectsView
