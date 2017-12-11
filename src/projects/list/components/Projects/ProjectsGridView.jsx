import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classNames from 'classnames'
import ProjectListTimeSortColHeader from './ProjectListTimeSortColHeader'
import ProjectSegmentSelect from './ProjectSegmentSelect'
import GridView from '../../../../components/Grid/GridView'

import { PROJECTS_LIST_PER_PAGE } from '../../../../config/constants'

import UserAvatar from '../../../../components/User/UserAvatar'
import { DOMAIN } from '../../../../config/constants'
import TextTruncate from 'react-text-truncate'
import { Tooltip } from 'appirio-tech-react-components'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../../components/ProjectStatus/editableProjectStatus'
require('./ProjectsGridView.scss')

/*eslint-disable quote-props */
const projectIconClassMap = {
  'app': 'product-cat-app',
  'application_development': 'product-app-app',
  'website': 'product-cat-website',
  'website_development': 'product-website-website',
  'chatbot': 'product-cat-chatbot',
  'watson_chatbot': 'product-chatbot-watson',
  'generic_chatbot': 'product-chatbot-chatbot',
  'visual_design': 'product-cat-design',
  'wireframes': 'product-design-wireframes',
  'visual_design_concepts': 'product-design-app-visual',
  'visual_design_prod': 'product-design-app-visual',
  'infographic': 'product-design-infographic',
  'generic_design': 'product-design-other',
  'app_dev': 'product-cat-development',
  'visual_prototype': 'product-dev-prototype',
  'frontend_dev': 'product-dev-front-end-dev',
  'api_dev': 'product-dev-integration',
  'generic_dev': 'product-dev-other',
  'quality_assurance': 'product-cat-qa',
  'real_world_testing': 'product-qa-crowd-testing',
  'mobility_testing': 'product-qa-mobility-testing',
  'performance_testing': 'product-qa-website-performance',
  'digital_accessability': 'product-qa-digital-accessability',
  'open_source_automation': 'product-qa-os-automation',
  'consulting_adivisory': 'product-qa-consulting'
}
const sortOptions = [
  { val: 'updatedAt desc', field: 'updatedAt' },
  { val: 'createdAt', field: 'createdAt' },
  { val: 'createdAt desc', field: 'createdAt' }
]
/*eslint-enable */
const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)


const ProjectsGridView = props => {
  //const { projects, members, totalCount, criteria, pageNum, applyFilters, sortHandler, onPageChange, error, isLoading, onNewProjectIntent } = props
  // TODO: use applyFilters and onNewProjectIntent. Temporary delete to avoid lint errors.
  const { projects, members, totalCount, criteria, pageNum, sortHandler, onPageChange,
    error, isLoading, infiniteAutoload, setInfiniteAutoload, projectsStatus, onChangeStatus } = props

  const currentSortField = _.get(criteria, 'sort', '')
  // This 'little' array is the heart of the list component.
  // it defines what columns should be displayed and more importantly
  // how they should be displayed.
  const columns = [
    {
      id: 'id',
      headerLabel: 'ID',
      classes: 'width60 item-id',
      sortable: true,
      renderText: item => {
        const recentlyCreated = moment().diff(item.createdAt, 'seconds') < 3600
        return (
          <div className="spacing">
            { recentlyCreated  && <span className="blue-border" /> }
            { item.id.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) }
          </div>
        )
      }
    }, {
      id: 'icon',
      headerLabel: '',
      classes: 'item-icon',
      sortable: false,
      renderText: item => {
        const projectIconClass = projectIconClassMap[item.type]
        return (
          <div className="spacing">
            <div className={ projectIconClass }>
            </div>
          </div>
        )
      }
    }, {
      id: 'projects',
      headerLabel: 'Project',
      classes: 'width49 item-projects',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        const code = _.get(item, 'details.utm.code', '')
        return (
          <div className="spacing project-container">
            <div className="project-title">
              <Link to={url} className="link-title">{item.name}</Link>
              { code && <span className="item-ref-code txt-gray-md">{code}</span> }
            </div>
            <TextTruncate
              containerClassName="project-description"
              line={2}
              truncateText="..."
              text={ item.description }
            />
          </div>
        )
      }
    }, {
      id: 'updatedAt',
      headerLabel: <ProjectListTimeSortColHeader currentSortField={currentSortField} sortHandler={sortHandler}/>,
      sortable: false,
      classes: 'item-status-date width9',
      renderText: item => {
        const classes = classNames('txt-normal', {
          'txt-italic': false // TODO when should we use this
        })
        const sortMetric = _.find(sortOptions, o => currentSortField === o.val)
        || sortOptions[0]
        const lastAction = item[sortMetric.field] === 'createdAt' ? 'createdBy' : 'updatedBy'
        const lastEditor = members[item[lastAction]] || null
        return (
          <div className="spacing time-container">
            <div className={classes}>{moment(item[sortMetric.field]).format('MMM D, h:mm a')}</div>
            <div className="project-last-editor">{lastEditor.firstName} {lastEditor.lastName}</div>
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
        const rating = _.get(m, 'maxRating.rating', 0)
        if (!m)
          return <div className="user-block txt-italic">Unknown</div>
        return (
          <div className="spacing">
            <div className="user-block">
              <Tooltip theme="customer-data" pointerWidth={20}>
                <div className="tooltip-target" id={`tt-${item.id}`}>
                  <span className="project-customer">{m.firstName} {m.lastName}</span>
                </div>
                <div className="tooltip-body">
                  <div className="top-container">
                    <div className="tt-col-avatar">
                      <a href={`//www.${DOMAIN}/members/${m.handle}/`} target="_blank" rel="noopener noreferrer" className="tt-user-avatar">
                        <UserAvatar rating={rating} showLevel={false} photoURL={m.photoURL} />
                      </a>
                    </div>
                    <div className="tt-col-user-data">
                      <div className="user-name-container">
                        <span>{m.firstName} {m.lastName}</span>
                      </div>
                      <div className="user-handle-container">
                        <span>{m.handle}</span>
                      </div>
                      <div className="user-email-container">
                        <a href={`mailto:${m.email}`}>{m.email}</a>
                      </div>
                    </div>
                  </div>
                  <div className="sf-data-bottom-container">
                    <div className="segment-data">
                      <span>Wipro Digital Jaipur / Topgear</span>
                    </div>
                    <div className="segment-data">
                      <span>0141-2211258</span>
                    </div>
                    <div className="segment-data">
                      <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="ext-link">SDFC Lead Page</a>
                    </div>
                  </div>
                </div>
              </Tooltip>
              <div className="project-segment">
                <ProjectSegmentSelect currentSegment={item.segment || 'self-service'}/>
              </div>
            </div>
          </div>
        )
      }
    }, {
      id: 'managers',
      headerLabel: 'Managers',
      sortable: false,
      classes: 'item-manager width11',
      renderText: item => {
        const m = _.filter(item.members, m => m.role === 'manager')
        let extM = false
        if (!m || !m.length)
          return <div className="user-block txt-italic">Unclaimed</div>
        if (m.length > 3) {
          extM = m.length - 3
          m.length = 3
        }
        return (
          <div className="spacing">
            <div className="user-block">
            {m.map((user, i) => {
              return (
                <a href={`//www.${DOMAIN}/members/${user.handle}/`} target="_blank" rel="noopener noreferrer" className={`stack-avatar-${i}`} key={i}>
                  <UserAvatar rating={0} showLevel={false} photoURL={user.photoURL} />
                </a>
              )
            })}
            {extM && <span className="plus-user">+{extM}</span>}
            </div>
          </div>
        )
      }
    }, {
      id: 'status',
      headerLabel: <div className="project-status-title"></div>,
      sortable: false,
      classes: 'item-status width9',
      renderText: item => {
        return (
          <div className="spacing">
            <EnhancedProjectStatus
              status={item.status}
              showText={false}
              withoutLabel
              canEdit
              unifiedHeader={false}
              onChangeStatus={onChangeStatus}
              projectId={item.id}
            />
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
  pageNum: PropTypes.number.isRequired,
  criteria: PropTypes.object.isRequired
}

export default ProjectsGridView
