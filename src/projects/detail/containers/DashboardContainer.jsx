/**
 * DashboardContainer container
 * displays content of the Dashboard tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

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
import PhasesContainer from './PhasesContainer'
import WorkstreamsContainer from './WorkstreamsContainer'
import WorkViewContainer from './WorkViewContainer'
import WorkNewContainer from './WorkNewContainer'
import WorkTimelineNewMilestoneContainer from './WorkTimelineNewMilestoneContainer'
import WorkTimelineEditMilestoneContainer from './WorkTimelineEditMilestoneContainer'
import Sticky from '../../../components/Sticky'
import TwoColsLayout from '../../../components/TwoColsLayout'
import SystemFeed from '../../../components/Feed/SystemFeed'
import ProjectScopeDrawer from '../components/ProjectScopeDrawer'
import NotificationsReader from '../../../components/NotificationsReader'
import { checkPermission } from '../../../helpers/permissions'
import { getProjectTemplateById } from '../../../helpers/templates'
import PERMISSIONS from '../../../config/permissions'
import { updateProject, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import { loadProjectPlan } from '../../actions/projectPlan'
import { loadProjectWorkstreams } from '../../actions/workstreams'
import {
  loadWorkInfo,
  updateWork,
  createWork,
  deleteWork,
} from '../../actions/works'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'
import ProjectEstimation from '../../create/components/ProjectEstimation'

import {
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
  EVENT_TYPE,
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
      showAddWorkForWorkstream: -1,
      showAddMilestoneForTimeline: -1,
      showEditMilestoneForTimeline: {
        timelineId: -1,
        milestoneId: -1,
      }
    }
    this.onNotificationRead = this.onNotificationRead.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.getContentView = this.getContentView.bind(this)
  }

  onNotificationRead(notification) {
    if (notification.bundledIds) {
      this.props.toggleBundledNotificationRead(notification.id, notification.bundledIds)
    } else {
      this.props.toggleNotificationRead(notification.id)
    }
  }

  toggleDrawer() {
    this.setState((prevState) => ({
      open: !prevState.open
    }))
  }

  /**
   * Get content view
   */
  getContentView() {
    const {
      project,
      match: { params }
    } = this.props
    const isWorkstreams = _.get(project, 'details.settings.workstreams', false)
    if (isWorkstreams) {
      const {
        showAddWorkForWorkstream,
        showAddMilestoneForTimeline,
        showEditMilestoneForTimeline
      } = this.state
      if (showAddMilestoneForTimeline >= 0) {
        // show add new milestone for timeline
        return (
          <WorkTimelineNewMilestoneContainer
            onBack={() => this.setState({ showAddMilestoneForTimeline: -1 })}
            timelineId={showAddMilestoneForTimeline}
          />
        )
      }
      if (showEditMilestoneForTimeline.milestoneId >= 0) {
        // show edit new milestone for timeline
        return (
          <WorkTimelineEditMilestoneContainer
            onBack={() => this.setState({ showEditMilestoneForTimeline: {timelineId: -1, milestoneId: -1} })}
            timelineId={showEditMilestoneForTimeline.timelineId}
            milestoneId={showEditMilestoneForTimeline.milestoneId}
          />
        )
      }
      if (params.workId) {
        return (
          <WorkViewContainer
            {...this.props}
            addNewMilestone={(timelineId) => this.setState({ showAddMilestoneForTimeline: timelineId }) }
            editMilestone={(timelineId, milestoneId) => this.setState({ showEditMilestoneForTimeline: {timelineId, milestoneId} }) }
          />
        )
      }

      if (showAddWorkForWorkstream >= 0) {
        return (
          <WorkNewContainer
            {...this.props}
            workstreamId={showAddWorkForWorkstream}
            onClose={() => this.setState({ showAddWorkForWorkstream: -1 })}
          />
        )
      }
      return (<WorkstreamsContainer {...this.props} addWorkForWorkstream={(workstreamId) => { this.setState({ showAddWorkForWorkstream: workstreamId }) }} />)
    }
    return (<PhasesContainer {...this.props} />)
  }

  render() {
    const {
      project,
      phases,
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
      estimationQuestion,
      match: { params },
    } = this.props
    const {
      showAddWorkForWorkstream,
      showAddMilestoneForTimeline,
      showEditMilestoneForTimeline,
    } = this.state
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
    // if this is true, we will hide other component like estimate section
    const onlyShowMainContent =
      params.workId ||
      (showAddWorkForWorkstream >= 0) ||
      (showAddMilestoneForTimeline >= 0) ||
      (showEditMilestoneForTimeline.milestoneId >= 0)

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
          {/* <button type="button" onClick={this.toggleDrawer}>Toggle drawer</button> */}
          {!!estimationQuestion && !onlyShowMainContent &&
            <ProjectEstimation
              onClick={this.toggleDrawer}
              question={estimationQuestion}
              template={template}
              project={project}
              theme="dashboard"
            />
          }
          {/* The following containerStyle and overlayStyle are needed for shrink drawer and overlay size for not
              covering sidebar and topbar
           */}
          <ProjectScopeDrawer
            open={this.state.open}
            containerStyle={{top: '60px', height: 'calc(100% - 60px)', display: 'flex', flexDirection: 'column' }}
            overlayStyle={{top: '60px', left: '280px'}}
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
          {this.getContentView()}
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

const mapStateToProps = ({ notifications, projectState, projectTopics, templates, phasesTopics, projectPlan, workstreams, works }) => {
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
    isLoadingPhases: projectState.isLoadingPhases || projectPlan.isLoading,
    feeds: allFeed,
    isFeedsLoading: projectTopics.isLoading,
    isLoadingWorkstreams: workstreams.isLoading,
    isLoadingWorkInfo: works.isLoading,
    isUpdatingWorkInfo: works.isUpdating,
    isCreatingWorkInfo: works.isCreating,
    isDeletingWorkInfo: works.isDeleting,
    isRequestWorkError: !!works.error,
    phasesStates: projectState.phasesStates,
    phasesTopics,
    workstreams: workstreams.workstreams,
    workstreamsError: workstreams.error,
    work: works.work,
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
  removeProjectAttachment,
  loadProjectPlan,
  loadProjectWorkstreams,
  loadWorkInfo,
  updateWork,
  createWork,
  deleteWork
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardContainer))
