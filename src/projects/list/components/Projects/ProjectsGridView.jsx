import React, { PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import ProjectListTimeSortColHeader from './ProjectListTimeSortColHeader'
import ProjectSegmentSelect from './ProjectSegmentSelect'
import GridView from '../../../../components/Grid/GridView'
import UserTooltip from '../../../../components/User/UserTooltip'
import { PROJECTS_LIST_PER_PAGE, PROJECT_ICON_MAP, SORT_OPTIONS } from '../../../../config/constants'
import TextTruncate from 'react-text-truncate'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../../components/ProjectStatus/editableProjectStatus'
import ProjectManagerAvatars from './ProjectManagerAvatars'
require('./ProjectsGridView.scss')

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

const ProjectsGridView = props => {
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
      classes: 'item-id',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        const recentlyCreated = moment().diff(item.createdAt, 'seconds') < 3600
        return (
          <Link to={url} className="spacing">
            { recentlyCreated  && <span className="blue-border" /> }
            { item.id.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) }
          </Link>
        )
      }
    }, {
      id: 'icon',
      headerLabel: '',
      classes: 'item-icon',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        const projectIconClass = PROJECT_ICON_MAP[item.type]
        return (
          <Link to={url} className="spacing">
            <div className={ projectIconClass }>
            </div>
          </Link>
        )
      }
    }, {
      id: 'projects',
      headerLabel: 'Project',
      classes: 'item-projects',
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
            <Link to={url}>
              <TextTruncate
                containerClassName="project-description"
                line={2}
                truncateText="..."
                text={ item.description }
              />
            </Link>
          </div>
        )
      }
    }, {
      id: 'updatedAt',
      headerLabel: <ProjectListTimeSortColHeader currentSortField={currentSortField} sortHandler={sortHandler}/>,
      sortable: false,
      classes: 'item-status-date',
      renderText: item => {
        const sortMetric = _.find(SORT_OPTIONS, o => currentSortField === o.val) || SORT_OPTIONS[0]
        const lastAction = item[sortMetric.field] === 'createdAt' ? 'createdBy' : 'updatedBy'
        const lastEditor = members[item[lastAction]] || {}
        return (
          <div className="spacing time-container">
            <div className="txt-normal">{moment(item[sortMetric.field]).format('MMM D, h:mm a')}</div>
            <div className="project-last-editor">{lastEditor.firstName} {lastEditor.lastName}</div>
          </div>
        )
      }
    }, {
      id: 'customer',
      headerLabel: 'Customer',
      sortable: false,
      classes: 'item-customer',
      renderText: item => {
        const m = _.find(item.members, m => m.isPrimary && m.role === 'customer')
        if (!m)
          return <div className="user-block txt-italic">Unknown</div>
        return (
          <div className="spacing">
            <div className="user-block">
              <UserTooltip usr={m} id={item.id}/>
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
      classes: 'item-manager',
      renderText: item => {
        const m = _.filter(item.members, m => m.role === 'manager')
        return (
          <div className="spacing">
            <ProjectManagerAvatars managers={m}/>
          </div>
        )
      }
    }, {
      id: 'status',
      headerLabel: <div className="project-status-title"></div>,
      sortable: false,
      classes: 'item-status',
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
