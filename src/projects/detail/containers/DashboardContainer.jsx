/**
 * DashboardContainer container
 * displays content of the Dashboard tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Redirect, withRouter, Link } from 'react-router-dom'
import Alert from 'react-s-alert'
import './DashboardContainer.scss'

import {
  filterReadNotifications,
  filterNotificationsByProjectId,
  filterProjectNotifications,
  preRenderNotifications,
} from '../../../routes/notifications/helpers/notifications'
import { toggleNotificationRead, toggleBundledNotificationRead } from '../../../routes/notifications/actions'
import {
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  deleteProjectPhase,
  expandProjectPhase,
  collapseProjectPhase,
  collapseAllProjectPhases,
} from '../../actions/project'
import { addProductAttachment, updateProductAttachment, removeProductAttachment } from '../../actions/projectAttachment'

import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import Sticky from '../../../components/Sticky'
import TwoColsLayout from '../../../components/TwoColsLayout'
import SystemFeed from '../../../components/Feed/SystemFeed'
import ProjectScopeDrawer from '../components/ProjectScopeDrawer'
import ProjectStages from '../components/ProjectStages'
import NotificationsReader from '../../../components/NotificationsReader'
import { checkPermission } from '../../../helpers/permissions'
import { getProjectTemplateById } from '../../../helpers/templates'
import PERMISSIONS from '../../../config/permissions'
import { updateProject, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'

import {
  PHASE_STATUS_ACTIVE,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
  EVENT_TYPE,
  PHASE_STATUS_DRAFT,
  SCREEN_BREAKPOINT_MD,
} from '../../../config/constants'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.svg')
}

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      matchesTopicUrl: null,
      matchesPostUrl: null,
      topicIdForPost: null
    }
    this.onNotificationRead = this.onNotificationRead.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)

    this.alertedFailedTopicRedirect = false
  }

  onNotificationRead(notification) {
    if (notification.bundledIds) {
      this.props.toggleBundledNotificationRead(notification.id, notification.bundledIds)
    } else {
      this.props.toggleNotificationRead(notification.id)
    }
  }

  componentDidMount() {
    // if the user is a customer and its not a direct link to a particular phase
    // then by default expand all phases which are active
    const { isCustomerUser, expandProjectPhase, location } = this.props

    if (isCustomerUser) {
      _.forEach(this.props.phases, phase => {
        if (phase.status === PHASE_STATUS_ACTIVE) {
          expandProjectPhase(phase.id)
        }
      })
    }

    /*
    For redirecting old urls to new urls for topics and posts
    Old TOPIC: '/projects/{{projectId}}/#feed-{{topicId}}',
    Old POST: '/projects/{{projectId}}/#comment-{{postId}}',
    */
    const matchesTopicUrl = location.hash.match(/#feed-(\d+)/)
    const matchesPostUrl = location.hash.match(/#comment-(\d+)/)
    this.setState({
      matchesPostUrl,
      matchesTopicUrl
    })

    // if the user is a customer and its not a direct link to a particular phase
    // then by default expand all phases which are active
    if (_.isEmpty(location.hash) && this.props.isCustomerUser) {
      _.forEach(this.props.phases, phase => {
        if (phase.status === PHASE_STATUS_ACTIVE) {
          expandProjectPhase(phase.id)
        }
      })
    }
  }

  componentWillUnmount() {
    const { collapseAllProjectPhases } = this.props

    collapseAllProjectPhases()
  }

  componentWillReceiveProps(nextProps) {
    const { isFeedsLoading } = nextProps
    const { matchesPostUrl } = this.state

    // we need topicId for redirecting old post url (/projects/{{projectId}}/#comment-{{postId}})
    if (!isFeedsLoading && matchesPostUrl && !this.alertedFailedTopicRedirect) {
      const topicIdForPost = this.getTopicIdForPost(matchesPostUrl[1])
      this.setState({ topicIdForPost })
      this.alertFailedTopicRedirection(matchesPostUrl, topicIdForPost, isFeedsLoading)
    }
  }

  toggleDrawer() {
    this.setState((prevState) => ({
      open: !prevState.open
    }))
  }

  // Get topic id corresponding to the post that we're trying to redirect to
  getTopicIdForPost(postId) {
    const {feeds} = this.props
    const topic = feeds && feeds
      .find(feed => feed.posts.find(p => p.id === Number(postId)))
    return topic && topic.id
  }

  // Alert user in case the post is not available / not accessible to him.
  alertFailedTopicRedirection(matchesPostUrl, topicIdForPost, isFeedsLoading) {
    if (matchesPostUrl && !topicIdForPost && !isFeedsLoading) {
      this.alertedFailedTopicRedirect = true
      Alert.error('Couldn\'t find the post')
    }
  }

  render() {
    const {
      project,
      phases,
      phasesNonDirty,
      isLoadingPhases,
      currentMemberRole,
      isSuperUser,
      isManageUser,
      notifications,
      productTemplates,
      projectTemplates,
      productCategories,
      isProcessing,
      feeds,
      isFeedsLoading,
      productsTimelines,
      phasesTopics,
      fireProjectDirty,
      fireProjectDirtyUndo,
      updateProject,
      addProjectAttachment,
      updateProjectAttachment,
      removeProjectAttachment,
      location,
    } = this.props
    const { matchesPostUrl, matchesTopicUrl, topicIdForPost } = this.state


    const projectTemplate = project && project.templateId && projectTemplates ? (getProjectTemplateById(projectTemplates, project.templateId)) : null

    let template
    if (project.version === 'v3') {
      template = _.get(projectTemplate, 'scope')
    } else {
      template = _.get(productTemplates[0], 'template')
    }

    // system notifications
    const notReadNotifications = filterReadNotifications(notifications)
    const unreadProjectUpdate = filterProjectNotifications(filterNotificationsByProjectId(notReadNotifications, project.id))
    const sortedUnreadProjectUpdates = _.orderBy(unreadProjectUpdate, ['date'], ['desc'])

    // manager user sees all phases
    // customer user doesn't see unplanned (draft) phases
    const visiblePhases = phases && phases.filter((phase) => (
      isSuperUser || isManageUser || phase.status !== PHASE_STATUS_DRAFT
    ))
    const visiblePhasesIds = _.map(visiblePhases, 'id')
    const visiblePhasesNonDirty = phasesNonDirty && phasesNonDirty.filter((phaseNonDirty) => (
      _.includes(visiblePhasesIds, phaseNonDirty.id)
    ))

    const isProjectLive = project.status !== PROJECT_STATUS_COMPLETED && project.status !== PROJECT_STATUS_CANCELLED

    const leftArea = (
      <ProjectInfoContainer
        location={location}
        currentMemberRole={currentMemberRole}
        project={project}
        phases={phases}
        isSuperUser={isSuperUser}
        isManageUser={isManageUser}
        feeds={feeds}
        isFeedsLoading={isFeedsLoading}
        productsTimelines={productsTimelines}
        phasesTopics={phasesTopics}
        isProjectProcessing={isProcessing}
      />
    )

    return (
      <TwoColsLayout>
        <NotificationsReader
          id="dashboard"
          criteria={[
            { eventType: EVENT_TYPE.PROJECT.ACTIVE, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.MEMBER.JOINED, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.MEMBER.LEFT, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.MEMBER.REMOVED, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.MEMBER.ASSIGNED_AS_OWNER, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.MEMBER.COPILOT_JOINED, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.MEMBER.MANAGER_JOINED, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.READY, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.MODIFIED, contents: { projectId: project.id } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.PROGRESS_UPDATED, contents: { projectId: project.id } },
          ]}
        />

        {matchesTopicUrl && <Redirect to={`/projects/${project.id}/messages/${matchesTopicUrl[1]}`} />}
        {matchesPostUrl && topicIdForPost && <Redirect to={`/projects/${project.id}/messages/${topicIdForPost}#comment-${matchesPostUrl[1]}`}  />}

        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return <Sticky top={60}>{leftArea}</Sticky>
              } else {
                return leftArea
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>

        <TwoColsLayout.Content>
          {unreadProjectUpdate.length > 0 &&
            <SystemFeed
              messages={sortedUnreadProjectUpdates}
              user={SYSTEM_USER}
              onNotificationRead={this.onNotificationRead}
            />
          }
          <button type="button" onClick={this.toggleDrawer}>Toggle drawer</button>
          {/* The following containerStyle and overlayStyle are needed for shrink drawer and overlay size for not
              covering sidebar and topbar
           */}
          <ProjectScopeDrawer
            open={this.state.open}
            containerStyle={{top: '110px', height: 'calc(100% - 110px)', display: 'flex', flexDirection: 'column' }}
            overlayStyle={{top: '110px', left: '360px'}}
            onRequestChange={(open) => this.setState({open})}
            isSuperUser={isSuperUser}
            project={project}
            template={template}
            updateProject={updateProject}
            processing={isProcessing}
            fireProjectDirty={fireProjectDirty}
            fireProjectDirtyUndo= {fireProjectDirtyUndo}
            addProjectAttachment={addProjectAttachment}
            updateProjectAttachment={updateProjectAttachment}
            removeProjectAttachment={removeProjectAttachment}
            currentMemberRole={currentMemberRole}
            productTemplates={productTemplates}
            productCategories={productCategories}
          />

          {visiblePhases && visiblePhases.length > 0 ? (
            <ProjectStages
              {...{
                ...this.props,
                phases: visiblePhases,
                phasesNonDirty: visiblePhasesNonDirty,
              }}
            />
          ) : (
            <ProjectPlanEmpty />
          )}
          {isProjectLive && checkPermission(PERMISSIONS.EDIT_PROJECT_PLAN, project, phases)  && !isLoadingPhases && (<div styleName="add-button-container">
            <Link to={`/projects/${project.id}/add-phase`} className="tc-btn tc-btn-primary tc-btn-sm action-btn">Add New Phase</Link>
          </div>)}
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

const mapStateToProps = ({ notifications, projectState, projectTopics, templates, phasesTopics }) => {
  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  if (checkPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
    allFeed = [...allFeed, ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics]
  }

  return {
    notifications: preRenderNotifications(notifications.notifications),
    productTemplates: templates.productTemplates,
    projectTemplates: templates.projectTemplates,
    productCategories: templates.productCategories,
    isProcessing: projectState.processing,
    phases: projectState.phases,
    phasesNonDirty: projectState.phasesNonDirty,
    isLoadingPhases: projectState.isLoadingPhases,
    feeds: allFeed,
    isFeedsLoading: projectTopics.isLoading,
    phasesStates: projectState.phasesStates,
    phasesTopics,
  }
}

const mapDispatchToProps = {
  toggleNotificationRead,
  toggleBundledNotificationRead,
  updateProduct,
  fireProductDirty,
  fireProductDirtyUndo,
  addProductAttachment,
  updateProductAttachment,
  removeProductAttachment,
  deleteProjectPhase,
  expandProjectPhase,
  collapseProjectPhase,
  collapseAllProjectPhases,
  fireProjectDirty,
  fireProjectDirtyUndo,
  updateProject,
  addProjectAttachment,
  updateProjectAttachment,
  removeProjectAttachment
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardContainer))
