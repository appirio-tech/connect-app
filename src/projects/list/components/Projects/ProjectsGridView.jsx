import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  filterReadNotifications,
  filterNotificationsByProjectId,
} from '../../../../routes/notifications/helpers/notifications'
import ProjectListTimeSortColHeader from './ProjectListTimeSortColHeader'
import ProjectListFilterColHeader from './ProjectListFilterColHeader'
import GridView from '../../../../components/Grid/GridView'
import UserTooltip from '../../../../components/User/UserTooltip'
import {
  PROJECTS_LIST_PER_PAGE, SORT_OPTIONS, PROJECT_STATUS_COMPLETED, DATE_TO_USER_FIELD_MAP, PHASE_STATUS_REVIEWED,
  PHASE_STATUS_ACTIVE
} from '../../../../config/constants'
import { getProjectTemplateByKey } from '../../../../helpers/templates'
import TextTruncate from 'react-text-truncate'
import ProjectStatus from '../../../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../../../components/ProjectStatus/editableProjectStatus'
import ProjectManagerAvatars from './ProjectManagerAvatars'
import ProjectTypeIcon from '../../../../components/ProjectTypeIcon'
import IconProjectStatusTitle from '../../../../assets/icons/status-ico.svg'

import './ProjectsGridView.scss'

const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

const ProjectsGridView = props => {
  const { projects, members, totalCount, criteria, pageNum, sortHandler, currentUser, onPageChange,
    error, isLoading, infiniteAutoload, setInfiniteAutoload, projectsStatus, onChangeStatus,
    applyFilters, projectTemplates, notifications, newProjectLink, setFilter } = props

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
        return (
          <Link to={url} className="spacing">
            {item.id}
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
        const projectTemplateId = item.templateId
        const projectTemplateKey = _.get(item, 'details.products[0]')
        const projectTemplate = projectTemplateId
          ? _.find(projectTemplates, pt => pt.id === projectTemplateId)
          : getProjectTemplateByKey(projectTemplates, projectTemplateKey)
        // icon for the product, use default generic work project icon for categories which no longer exist now
        const productIcon = _.get(projectTemplate, 'icon', 'tech-32px-outline-work-project')
        return (
          <Link to={url} className="spacing">
            <div className="project-type-icon" title={item.type !== undefined ? item.type[0].toUpperCase() + item.type.substr(1).replace(/_/g, ' ') : null}>
              <ProjectTypeIcon type={productIcon} />
            </div>
          </Link>
        )
      }
    }, {
      id: 'projects',
      headerLabel: <ProjectListFilterColHeader setFilter={setFilter} title="Project" filterName="name" value={_.get(criteria, 'name', '')} />,
      classes: 'item-projects',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        // project notifications
        const notReadNotifications = filterReadNotifications(notifications)
        const unreadProjectUpdate = filterNotificationsByProjectId(notReadNotifications, item.id)
        const recentlyCreated = moment().diff(item.createdAt, 'seconds') < 3600
        return (
          <div className="spacing project-container">
            {(recentlyCreated || unreadProjectUpdate.length > 0) && <span className="blue-border" />}
            <div className="project-title">
              <Link to={url} className="link-title">{_.unescape(item.name)}</Link>
            </div>
            <Link to={url}>
              <TextTruncate
                containerClassName="project-description"
                line={2}
                truncateText="..."
                text={_.unescape(item.description)}
              />
            </Link>
          </div>
        )
      }
    }, {
      id: 'reference',
      headerLabel: <ProjectListFilterColHeader setFilter={setFilter} title="REF" filterName="code" value={_.get(criteria, 'code', '')} />,
      sortable: false,
      classes: 'item-ref-code',
      renderText: item => {
        const code = _.get(item, 'details.utm.code', '')
        return (
          <div className="spacing time-container">
            <span className="txt-gray-md">{code}</span>
          </div>
        )
      }
    }, {
      id: 'updatedAt',
      headerLabel: <ProjectListTimeSortColHeader currentSortField={currentSortField} sortHandler={sortHandler} />,
      sortable: false,
      classes: 'item-status-date',
      renderText: item => {
        const sortMetric = _.find(SORT_OPTIONS, o => currentSortField === o.val) || SORT_OPTIONS[0]
        const lastAction = DATE_TO_USER_FIELD_MAP[sortMetric.field]
        const lastEditor = members[item[lastAction]]
        const time = moment(item[sortMetric.field])
        return (
          <div className="spacing time-container">
            <div className="txt-normal">{time.year() === moment().year() ? time.format('MMM D, h:mm a') : time.format('MMM D YYYY, h:mm a')}</div>
            <div className="project-last-editor">
              {
                lastEditor ? `${lastEditor.firstName} ${lastEditor.lastName}` : 'Unknown'
              }
            </div>
          </div>
        )
      }
    }, {
      id: 'customer',
      headerLabel: <ProjectListFilterColHeader setFilter={setFilter} title="Customer" filterName="customer" value={_.get(criteria, 'customer', '')} />,
      sortable: false,
      classes: 'item-customer',
      renderText: item => {
        const m = _.find(item.members, m => m.isPrimary && m.role === 'customer')
        if (!m)
          return <div className="user-block txt-italic">Unknown</div>
        return (
          <div className="spacing">
            <div className="user-block">
              <UserTooltip usr={m} id={item.id} size={35} />

            </div>
          </div>
        )
        // TODO: Restore user segment when we support it
        // <div className="project-segment">
        //  <ProjectSegmentSelect currentSegment={item.segment || 'self-service'}/>
        // </div>
        // Hiding the user segment for the momemnt
      }
    },
    {
      id: 'joinBtn',
      headerLabel: '',
      classes: 'item-join',
      sortable: false,
      renderText: item => {
        const url = `/projects/${item.id}`
        // check whether is the project's member
        const isMember = _.some(item.members, m => (m.userId === currentUser.userId && m.deletedAt === null))
        if(isMember) return
        // check whether has pending invition
        const isInvited = _.some(item.invites, m => ((m.userId === currentUser.userId || m.email === currentUser.email ) && !m.deletedAt && m.status === 'pending'))
        if(!isInvited) return
        return (
          <Link to={url} className="spacing">
            <div className="join-btn" style={{margin: '5px'}}>
              Join project
            </div>
          </Link>
        )
      }
    }, {
      id: 'managers',
      headerLabel: <ProjectListFilterColHeader setFilter={setFilter} title="Managers" filterName="manager" value={_.get(criteria, 'manager', '')} />,
      sortable: false,
      classes: 'item-manager',
      renderText: item => {
        const m = _.filter(item.members, m => m.role === 'manager')
        return (
          <div className="spacing">
            <ProjectManagerAvatars managers={m} />
          </div>
        )
      }
    }, {
      id: 'status',
      headerLabel: <IconProjectStatusTitle className="project-status-title" />,
      sortable: false,
      classes: 'item-status',
      renderText: item => {
        const canEdit = item.status !== PROJECT_STATUS_COMPLETED
        const hasReviewedOrActivePhases = !!_.find(item.phases, (phase) => _.includes([PHASE_STATUS_REVIEWED, PHASE_STATUS_ACTIVE], phase.status))
        const isProjectActive = item.status === PROJECT_STATUS_ACTIVE
        const isV3Project = item.version === 'v3'
        const projectCanBeActive =  (isV3Project && !isProjectActive && hasReviewedOrActivePhases) || isProjectActive
        return (
          <div className="spacing">
            <EnhancedProjectStatus
              status={item.status}
              showText={false}
              withoutLabel
              canEdit={canEdit}
              unifiedHeader={false}
              onChangeStatus={onChangeStatus}
              projectId={item.id}
              projectCanBeActive={projectCanBeActive}
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
    applyFilters,
    entityName: 'project',
    entityNamePlural: 'projects',
    noMoreResultsMessage: `No more ${projectsStatus} projects`,
    newProjectLink
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
  newProjectLink: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired,
  members: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  sortHandler: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  criteria: PropTypes.object.isRequired,
  projectTemplates: PropTypes.array.isRequired,
  setFilter: PropTypes.func,
}

export default ProjectsGridView
