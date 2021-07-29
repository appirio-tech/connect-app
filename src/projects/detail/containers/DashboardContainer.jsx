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
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import  CreatePhaseForm from '../components/CreatePhaseForm'
import moment from 'moment'

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
  createPhaseAndMilestones,
  createPhaseWithoutTimeline,
} from '../../actions/project'
import { addProductAttachment, updateProductAttachment, removeProductAttachment } from '../../actions/projectAttachment'

import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './ProjectInfoContainer'
import Sticky from '../../../components/Sticky'
import TwoColsLayout from '../../../components/TwoColsLayout'
import SystemFeed from '../../../components/Feed/SystemFeed'
import ProjectScopeDrawer from '../components/ProjectScopeDrawer'
import ProjectStages from '../components/ProjectStages'
import ProjectPlanEmpty from '../components/ProjectPlanEmpty'
import TaasProjectWelcome from '../components/TaasProjectWelcome'
import NotificationsReader from '../../../components/NotificationsReader'
import { hasPermission } from '../../../helpers/permissions'
import { getProjectTemplateById } from '../../../helpers/templates'
import { PERMISSIONS } from '../../../config/permissions'
import { updateProject, fireProjectDirty, fireProjectDirtyUndo, updatePhase } from '../../actions/project'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'
import ProjectEstimation from '../../create/components/ProjectEstimation'
import CreateSimplePlan from '../components/SimplePlan/CreateSimplePlan'
import { updatePhaseMembers } from '../../actions/phaseMember'

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
  CODER_BOT_USERID,
  PROJECT_TYPE_TALENT_AS_A_SERVICE,
  PHASE_PRODUCT_TEMPLATE_ID
} from '../../../config/constants'

const SYSTEM_USER = {
  handle: CODER_BOT_USERID,
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.svg')
}

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      createGameplanPhases: null,
    }
    this.onNotificationRead = this.onNotificationRead.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  onNotificationRead(notification) {
    if (notification.bundledIds) {
      this.props.toggleBundledNotificationRead(notification.id, notification.bundledIds)
    } else {
      this.props.toggleNotificationRead(notification.id)
    }
  }

  componentDidMount() {
    const { expandProjectPhase } = this.props
    // if the user is a customer and its not a direct link to a particular phase
    // then by default expand all phases which are active
    if (_.isEmpty(location.hash) && hasPermission(PERMISSIONS.EXPAND_ACTIVE_PHASES_BY_DEFAULT)) {
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

  toggleDrawer() {
    this.setState((prevState) => ({
      open: !prevState.open
    }))
  }

  onFormSubmit(type, phase, milestones) {
    const { project, createPhaseAndMilestones, createPhaseWithoutTimeline } = this.props

    const productTemplate = {
      name: phase.title,
      description: phase.description,
      id: PHASE_PRODUCT_TEMPLATE_ID,
    }
    if (project.version === 'v4') {
      createPhaseWithoutTimeline(project, productTemplate, type, phase.startDate, phase.endDate)
    } else {
      createPhaseAndMilestones(project, productTemplate, type, phase.startDate, phase.endDate, milestones)
    }
  }


  render() {
    const {
      project,
      phases,
      phasesNonDirty,
      isCreatingPhase,
      isLoadingPhases,
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
    } = this.props
    const projectTemplate = project && project.templateId && projectTemplates ? (getProjectTemplateById(projectTemplates, project.templateId)) : null

    let template
    if (project.version === 'v3') {
      template = _.get(projectTemplate, 'scope')
    } else {
      template = _.get(productTemplates[0], 'template')
    }

    // system notifications
    const preRenderedNotifications = preRenderNotifications(notifications)
    const notReadNotifications = filterReadNotifications(preRenderedNotifications)
    const unreadProjectUpdate = filterProjectNotifications(filterNotificationsByProjectId(notReadNotifications, project.id))
    const sortedUnreadProjectUpdates = _.orderBy(unreadProjectUpdate, ['date'], ['desc'])

    // manager user sees all phases
    // customer user doesn't see unplanned (draft) phases
    const visiblePhases = phases && phases.filter((phase) => (
      hasPermission(PERMISSIONS.VIEW_DRAFT_PHASES) || phase.status !== PHASE_STATUS_DRAFT
    ))
    const visiblePhasesIds = _.map(visiblePhases, 'id')
    const visiblePhasesNonDirty = phasesNonDirty && phasesNonDirty.filter((phaseNonDirty) => (
      _.includes(visiblePhasesIds, phaseNonDirty.id)
    ))

    const isProjectLive = project.status !== PROJECT_STATUS_COMPLETED && project.status !== PROJECT_STATUS_CANCELLED

    const isTaasProject = project.type === PROJECT_TYPE_TALENT_AS_A_SERVICE

    const leftArea = (
      <ProjectInfoContainer
        location={location}
        project={project}
        phases={phases}
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
                return <Sticky top={60} bottomBoundary="#wrapper-main">{leftArea}</Sticky>
              } else {
                return leftArea
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>

        <TwoColsLayout.Content>
          {isTaasProject ? (
            <TaasProjectWelcome projectId={project.id} />
          ) : (
            <div>
              {unreadProjectUpdate.length > 0 &&
                <SystemFeed
                  messages={sortedUnreadProjectUpdates}
                  user={SYSTEM_USER}
                  onNotificationRead={this.onNotificationRead}
                />
              }
              {/* <button type="button" onClick={this.toggleDrawer}>Toggle drawer</button> */}
              {!!estimationQuestion &&
                <ProjectEstimation
                  onClick={this.toggleDrawer}
                  question={estimationQuestion}
                  template={template}
                  project={project}
                  showPrice={!_.get(template, 'hidePrice')}
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
                project={project}
                template={template}
                updateProject={updateProject}
                processing={isProcessing}
                fireProjectDirty={fireProjectDirty}
                fireProjectDirtyUndo= {fireProjectDirtyUndo}
                addProjectAttachment={addProjectAttachment}
                updateProjectAttachment={updateProjectAttachment}
                removeProjectAttachment={removeProjectAttachment}
                productTemplates={productTemplates}
                productCategories={productCategories}
              />

              {project.version !== 'v4' ? (
                <div>
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
                  {isCreatingPhase? <LoadingIndicator/>: null}
                  {isProjectLive && !isCreatingPhase && hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN)  && !isLoadingPhases && (
                    <CreatePhaseForm
                      projectVersion={parseInt((project.version || 'v2').substring(1))}
                      onSubmit={this.onFormSubmit}
                    />
                  )}
                </div>
              ) : (
                <div styleName="simple-plan">
                  {/* check if visiblePhases/phases is non-null and empty */}
                  {((!hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN) && (visiblePhases && visiblePhases.length === 0))
                    || (hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN) &&
                      (phases && phases.length === 0) &&
                      (!this.state.createGameplanPhases || this.state.createGameplanPhases.length === 0))
                  ) && (
                    <div styleName="welcome-message">
                      <ProjectPlanEmpty version="v4" />
                    </div>
                  )}
                  {(() => {
                    // is loading
                    if (isCreatingPhase || isLoadingPhases) {
                      return null
                    }

                    // hide milestones form if customer and no visible milestones
                    if (!hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN) && visiblePhases && visiblePhases.length === 0) {
                      return null
                    }

                    return (
                      <CreateSimplePlan
                        isProjectLive={isProjectLive}
                        isCustomer={!hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN)}
                        project={project}
                        phases={phases}
                        milestones={this.state.createGameplanPhases || visiblePhases || []}
                        onChangeMilestones={(milestones) => {
                          this.setState({createGameplanPhases: milestones})
                        }}
                        onSaveMilestone={(id) => {
                          const { createGameplanPhases } = this.state
                          const index = createGameplanPhases.findIndex(phase => phase.id === id)
                          const phase = createGameplanPhases[index]

                          const updatePhaseMembers = (projectId, phaseId) => {
                            const phaseMembers = _.get(phase, 'members', [])
                            const oldPhaseMembers = _.get(phase, 'origin.members', [])
                            if (phaseMembers.length !== oldPhaseMembers.length ||
                              _.differenceBy(phaseMembers, oldPhaseMembers, member => member.userId).length !== 0) {
                              this.props.updatePhaseMembers(
                                projectId,
                                phaseId,
                                phaseMembers.map(member => member.userId)
                              )
                            }
                          }

                          if (`${phase.id}`.startsWith('new-milestone')) {
                            const productTemplate = {
                              name: phase.name,
                              id: PHASE_PRODUCT_TEMPLATE_ID,
                            }

                            if (phase.description && phase.description.trim()) {
                              productTemplate.description = phase.description.trim()
                            }

                            const projectId = project.id
                            let phaseId
                            this.props.createPhaseWithoutTimeline(
                              project,
                              productTemplate,
                              phase.status,
                              moment.utc(phase.startDate),
                              moment.utc(phase.endDate),
                              phase.budget
                            ).then(({ action }) => {
                              phaseId = action.payload.phase.id
                              // reload phase
                              const updatedCreateGameplanPhases = [...createGameplanPhases]
                              updatedCreateGameplanPhases.splice(index, 1, {
                                ...action.payload.phase,
                                selected: phase.selected
                              })
                              this.setState({ createGameplanPhases: updatedCreateGameplanPhases })
                            }).then(() => updatePhaseMembers(projectId, phaseId))
                          } else {
                            const updateParam =  {
                              name: phase.name,
                              startDate: moment.utc(phase.startDate),
                              endDate: moment.utc(phase.endDate),
                              status: phase.status,
                              budget: phase.budget,
                            }

                            if (phase.description && phase.description.trim()) {
                              updateParam.description = phase.description.trim()
                            }

                            this.props.updatePhase(
                              phase.projectId,
                              phase.id,
                              updateParam
                            ).then(({ action }) => {
                              const updatedCreateGameplanPhases = [...this.state.createGameplanPhases]
                              const idx = updatedCreateGameplanPhases.findIndex(phase => phase.id === action.payload.id)

                              // reload phase
                              updatedCreateGameplanPhases.splice(idx, 1, {
                                ...action.payload,
                                edit: this.state.createGameplanPhases[idx].edit,
                                selected: this.state.createGameplanPhases[idx].selected,
                              })
                              this.setState({ createGameplanPhases: updatedCreateGameplanPhases })
                            }).then(() => updatePhaseMembers(phase.projectId, phase.id))

                            // toggle edit
                            const updatedCreateGameplanPhases = [...this.state.createGameplanPhases]
                            updatedCreateGameplanPhases.splice(index, 1, {
                              ...phase,
                              edit: false,
                              selected: phase.selected
                            })
                            this.setState({ createGameplanPhases: updatedCreateGameplanPhases })
                          }
                        }}
                        onRemoveMilestone={(id) => {
                          const { createGameplanPhases } = this.state
                          let index
                          let projectId

                          if (createGameplanPhases) {
                            index = createGameplanPhases.findIndex(phase => phase.id === id)
                            projectId = createGameplanPhases[index].projectId
                          } else {
                            index = phases.findIndex(phase => phase.id === id)
                            projectId = phases[index].projectId
                          }

                          this.props.deleteProjectPhase(
                            projectId,
                            id
                          ).then(() => {
                            if (!this.state.createGameplanPhases) {
                              return
                            }

                            // remove phase
                            const index = this.state.createGameplanPhases.findIndex(phase => phase.id === id)
                            const newGameplanPhases = [...this.state.createGameplanPhases]
                            newGameplanPhases.splice(index, 1)
                            this.setState({createGameplanPhases: newGameplanPhases})
                          })
                        }}
                      />
                    )
                  })()}
                </div>
              )}
            </div>
          )}
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

const mapStateToProps = ({ notifications, projectState, projectTopics, templates, topics }) => {
  // all feeds includes primary as well as private topics if user has access to private topics
  let allFeed = projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics
  if (hasPermission(PERMISSIONS.ACCESS_PRIVATE_POST)) {
    allFeed = [...allFeed, ...projectTopics.feeds[PROJECT_FEED_TYPE_MESSAGES].topics]
  }

  return {
    isCreatingPhase: projectState.isCreatingPhase,
    notifications: notifications.notifications,
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
    phasesTopics: topics,
  }
}

const mapDispatchToProps = {
  toggleNotificationRead,
  toggleBundledNotificationRead,
  updateProduct,
  createPhaseAndMilestones,
  createPhaseWithoutTimeline,
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
  updatePhase,
  updatePhaseMembers,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardContainer))
