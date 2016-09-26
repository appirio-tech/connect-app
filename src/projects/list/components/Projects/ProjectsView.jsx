import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import { branch, renderComponent, compose } from 'recompose'
import moment from 'moment'
import classNames from 'classnames'
import ProjectListProjectColHeader from './ProjectListProjectColHeader'
import GridView from '../../../../components/Grid/GridView'
import Walkthrough from '../Walkthrough/Walkthrough'

import UserWithName from '../../../../components/User/UserWithName'
import PageError from '../../../../components/PageError/PageError'
import { ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT, PROJECT_STATUS } from '../../../../config/constants'

// This handles showing a spinner while the state is being loaded async
import spinnerWhileLoading from '../../../../components/LoadingSpinner'

/*
  Definiing default project criteria. This is used to later to determine if
  walkthrough component should be rendered instead of no results
 */
const defaultCriteria = {sort: 'createdAt desc'}

const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, t => t, renderComponent(<PageError code={500} />))
const errorHandler = showErrorMessageIfError(props => !props.error)
const spinner = spinnerWhileLoading(props => !props.isLoading)
const enhance = compose(errorHandler, spinner)
const EnhancedGrid = enhance(GridView)


require('./ProjectsView.scss')

/*eslint-disable quote-props */
const projectTypeMap = {
  'generic': 'Work project',
  'visual_design': 'Design',
  'visual_prototype': 'Design & Prototype',
  'app_dev': 'Full App'
}
/*eslint-enable */


const ProjectsView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, totalCount, criteria, pageNum, sortHandler, onPageChange, error, isLoading, currentUser} = props
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
        return (
          <div className="spacing">
            <span className="blue-border hide" />
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
        return (
          <div className="spacing">
            <Link to={url} className="link-title">{item.name}</Link>
            <div className="project-metadata">
              <span className="blue-block">{projectTypeMap[item.type]}</span>
              { code && <span className="item-ref-code txt-gray-md">{code}</span> }
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

  // show walk through if user is customer and no projects were returned
  // for default filters
  const showWalkThrough = !isLoading && totalCount === 0 &&
    _.isEqual(criteria, defaultCriteria) &&
    _.isEmpty(_.intersection(currentUser.roles,
      [ROLE_CONNECT_MANAGER, ROLE_CONNECT_COPILOT]
    ))

  return (
    <section className="">
      <div className="container">
        { showWalkThrough  ? <Walkthrough currentUser={currentUser} /> : <EnhancedGrid {...gridProps} />}
      </div>
    </section>
  )
}


ProjectsView.propTypes = {
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

export default ProjectsView
