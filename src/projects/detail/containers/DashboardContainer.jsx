/**
 * DashboardContainer container
 * displays content of the Dashboard tab
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

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
import FeedContainer from './FeedContainer'
import Sticky from '../../../components/Sticky'
import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import SystemFeed from '../../../components/Feed/SystemFeed'
import WorkInProgress from '../components/WorkInProgress'
import NotificationsReader from '../../../components/NotificationsReader'
import { checkPermission } from '../../../helpers/permissions'
import PERMISSIONS from '../../../config/permissions'
import ProjectEstimation from '../../create/components/ProjectEstimation'
import { getProductEstimate } from '../../../config/projectWizard'

import {
  PHASE_STATUS_ACTIVE,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME,
  PROJECT_FEED_TYPE_PRIMARY,
  PROJECT_FEED_TYPE_MESSAGES,
  EVENT_TYPE,
} from '../../../config/constants'

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.svg')
}

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.onNotificationRead = this.onNotificationRead.bind(this)
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
    const { isCustomerUser, expandProjectPhase } = this.props

    if (isCustomerUser) {
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

  render() {
    const {
      project,
      phases,
      currentMemberRole,
      isSuperUser,
      isManageUser,
      notifications,
      productTemplates,
      isProcessing,
      updateProduct,
      fireProductDirty,
      fireProductDirtyUndo,
      addProductAttachment,
      updateProductAttachment,
      removeProductAttachment,
      deleteProjectPhase,
      feeds,
      isFeedsLoading,
      productsTimelines,
      phasesStates,
      phasesTopics,
      expandProjectPhase,
      collapseProjectPhase,
      location,
      projectTemplate,
    } = this.props

    // system notifications
    const notReadNotifications = filterReadNotifications(notifications)
    const unreadProjectUpdate = filterProjectNotifications(filterNotificationsByProjectId(notReadNotifications, project.id))
    const sortedUnreadProjectUpdates = _.orderBy(unreadProjectUpdate, ['date'], ['desc'])

    // work in progress phases
    // find active phases
    const activePhases = _.orderBy(_.filter(phases, phase => phase.status === PHASE_STATUS_ACTIVE), ['endDate'])

    let showProjectEstimation = false
    const template = _.get(projectTemplate, 'scope', {})
    let estimationQuestion = []
    const showDescription = false
    const { estimateBlocks } = getProductEstimate({scope: template}, project)

    if (estimateBlocks.length > 0){
      _.forEach(template.sections, (section) => {
        _.forEach(section.subSections, (subSection) => {
          if (subSection.type === 'questions') {
            _.forEach(subSection.questions, (question) => {
              if(question.type === 'estimation') {
                estimationQuestion = question
                estimationQuestion.title = 'Project Scope'
                showProjectEstimation = true
                return false
              }
            })
          }
        })
      })
    }

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
          ]}
        />

        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return <Sticky top={110}>{leftArea}</Sticky>
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

          {showProjectEstimation &&
            <ProjectEstimation
              question={estimationQuestion}
              template={template}
              project={project}
              showDescription={showDescription}
              theme="dashboard"
            />
          }

          {activePhases.length > 0 &&
            <WorkInProgress
              productTemplates={productTemplates}
              currentMemberRole={currentMemberRole}
              isProcessing={isProcessing}
              isSuperUser={isSuperUser}
              isManageUser={isManageUser}
              project={project}
              activePhases={activePhases}
              updateProduct={updateProduct}
              fireProductDirty={fireProductDirty}
              fireProductDirtyUndo={fireProductDirtyUndo}
              addProductAttachment={addProductAttachment}
              updateProductAttachment={updateProductAttachment}
              removeProductAttachment={removeProductAttachment}
              deleteProjectPhase={deleteProjectPhase}
              phasesStates={phasesStates}
              expandProjectPhase={expandProjectPhase}
              collapseProjectPhase={collapseProjectPhase}
            />
          }

          <FeedContainer
            currentMemberRole={currentMemberRole}
            project={project}
            isSuperUser={isSuperUser}
          />
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
    isProcessing: projectState.processing,
    phases: projectState.phases,
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
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer)
