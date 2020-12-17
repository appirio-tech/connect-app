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
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import FormFieldDropdow from '../components/timeline/FormFieldDropdown'
import moment from 'moment'
const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import GenericMenu from '../../../components/GenericMenu'
import TrashIcon from  '../../../assets/icons/icon-trash.svg'

import styles from './DashboardContainer.scss'

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
  createPhaseAndMilestones
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
import { updateProject, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'
import ProjectEstimation from '../../create/components/ProjectEstimation'

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
} from '../../../config/constants'

const SYSTEM_USER = {
  handle: CODER_BOT_USERID,
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.svg')
}

const TYPE_OPTIONS = [
  {
    title: 'Reporting',
    value: 'generic-work',
  },
  {
    title: 'Deliverable Review',
    value: 'add-links',
  },
  {
    title: 'Final Deliverable Review',
    value: 'delivery-dev',
  },
]

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      publishClicked: false,
      isAddButtonClicked: false,
      addMilestonesButtonClicked: false,
      canSubmit: false,
      open: false,
      milestones: [{
        type: 'generic-work',
        title: 'Reporting',
        startDate: moment.utc().format('YYYY-MM-DD'),
        endDate: moment.utc().add(3, 'days').format('YYYY-MM-DD')
      }]
    }
    this.onNotificationRead = this.onNotificationRead.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.onAddClick = this.onAddClick.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)

    this.onPublishClick = this.onPublishClick.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.onDeleteMilestoneClick = this.onDeleteMilestoneClick.bind(this)
    this.onAddMilestoneClick = this.onAddMilestoneClick.bind(this)
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

  onPublishClick() {
    this.setState({
      publishClicked: true,
    })
  }

  onCancelClick() {
    this.setState( {
      isAddButtonClicked: false
    })
    this.setState({
      milestones: [{
        type: 'generic-work',
        title: 'Reporting',
        startDate: moment.utc().format('YYYY-MM-DD'),
        endDate: moment.utc().add(3, 'days').format('YYYY-MM-DD')
      }]
    })
  }
  onAddClick() {
    this.setState( {
      isAddButtonClicked: true
    })
  }

  enableButton() {
    this.setState( { canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  onFormSubmit(model) {

    const { project, createPhaseAndMilestones } = this.props
    const { publishClicked, addMilestonesButtonClicked } = this.state

    const phaseData = {
      title: model.title,
      startDate: moment(model.startDate),
      endDate: moment(model.endDate),
    }

    const milestones = []
    _.forEach(_.keys(_.omit(model, ['title', 'startDate', 'endDate'])), (k) => {
      const arrs =  k.match(/(\w+)_(\d+)/)
      const arrIndex = arrs[2]
      const objKey = arrs[1] === 'title'? 'name': arrs[1]
      if (!milestones[arrIndex]) {
        milestones[arrIndex] = {}
      }
      milestones[arrIndex][objKey] = model[k]
    })

    _.forEach(milestones, (m) => {
      m.status = 'reviewed'
      // TODO  add mock data
      m.duration = 1
      m.order = 1
      m.hidden =false
      m.completedText = 'completed text'
      m.activeText = 'active text'
      m.description = 'description'
      m.plannedText ='planned text'
      m.details = {}
      m.blockedText = 'blocked text'
    })

    const projectTemplate = {
      name: phaseData.title,
      id:166,
    }
    if (publishClicked) {
      createPhaseAndMilestones(project, projectTemplate, 'active', phaseData.startDate, phaseData.endDate, milestones)
    } else {
      createPhaseAndMilestones(project, projectTemplate, 'draft', phaseData.startDate, phaseData.endDate, milestones)
    }
    this.setState({
      publishClicked: false,
      isAddButtonClicked: false
    })
  }

  isChanged() {
    // We check if this.refs.form exists because this may be called before the
    // first render, in which case it will be undefined.
    return (this.refs.form && this.refs.form.isChanged())
  }
  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   * @param isChanged flag that indicates if form actually changed from initial model values
   */
  handleChange(change) {
    const {
      milestones
    } = this.state


    // omit phase fields
    _.forEach(_.keys(_.omit(change, ['title', 'startDate', 'endDate'])), (k) => {
      const arrs =  k.match(/(\w+)_(\d+)/)
      const arrIndex = arrs[2]
      const objKey = arrs[1]
      if(change[k] && change[k] !== milestones[arrIndex][objKey]) {
        milestones[arrIndex][objKey] = change[k]
        // set default title with option type
        if (objKey === 'type' && !milestones[arrIndex]['title']) {
          milestones[arrIndex]['title'] = this.getOptionType(change[k])
        }
      }
    })


    this.setState({milestones})
  }

  getOptionType(val) {
    return _.find(TYPE_OPTIONS, (v) => v.value === val).title
  }

  onDeleteMilestoneClick(index) {
    const {
      milestones
    } = this.state
    milestones.splice(index, 1)
    this.setState({
      milestones
    })
  }

  onAddMilestoneClick() {
    const {
      milestones
    } = this.state

    const defaultData = {
      startDate: moment(_.last(milestones).endDate).format('YYYY-MM-DD'),
      endDate: moment(_.last(milestones).endDate).add(3, 'days').format('YYYY-MM-DD')
    }
    milestones.push(defaultData)

    this.setState({
      addMilestonesButtonClicked: true,
      milestones
    })
  }

  renderMilestones() {

    const {
      isCreatingPhase
    } = this.props
    const {
      milestones
    } = this.state

    const ms = _.map(milestones, (m, index) => {
      return (
        <div styleName="milestone-item">
          <div styleName="title-label-layer">
            <FormFieldDropdow
              // theme={`${styles['input-row']}`}
              validations={{isRequired: true}}
              validationError={'Please, select type'}
              required
              options={TYPE_OPTIONS}
              label="TYPE"
              type="select"
              name={`type_${index}`}
              value={milestones[index].type}
            />
          </div>
          <div styleName="label-layer">
            <TCFormFields.TextInput
              wrapperClass={`${styles['input-row']}`}
              validationError={'Please, enter title'}
              label="title"
              type="text"
              name={`title_${index}`}
              value={milestones[index].title}
            />
          </div>
          <div styleName="label-layer">
            <TCFormFields.TextInput
              wrapperClass={`${styles['input-row']}`}

              validations={{isRequired: true}}
              validationError={'Please, enter start date'}
              required
              label="Start Date"
              type="date"
              name={`startDate_${index}`}
              value={milestones[index].startDate}
            />
          </div>
          <div styleName="label-layer">
            <TCFormFields.TextInput
              wrapperClass={`${styles['input-row']}`}
              validations={{isRequired: true}}
              validationError={'Please, enter end date'}
              required
              label="End Date"
              type="date"
              name={`endDate_${index}`}
              value={milestones[index].endDate}
            />
          </div>
          <i className="icon-trash" onClick={() => this.onDeleteMilestoneClick(index)} title="trash"><TrashIcon /></i>
        </div>
      )
    })
    return (
      <div styleName="add-milestone-form">
        {ms}
        <div styleName="add-milestone-wrapper">
          <button
            type="button"
            onClick={this.onAddMilestoneClick}
            className="tc-btn tc-btn-primary tc-btn-sm"
            disabled={(!this.isChanged() || isCreatingPhase) || !this.state.canSubmit}
          >Add Milestone</button>
        </div>
      </div>
    )

  }
  renderTab() {
    const tabs = [
      {
        onClick: () => {},
        label: 'Timeline',
        isActive: true,
        hasNotifications: false,
      }]
    return (
      <div styleName="tab-container">
        <GenericMenu navLinks={tabs} />
      </div>
    )
  }
  renderAddingForm() {
    const {
      isCreatingPhase
    } = this.props
    return (
      <div styleName="add-phase-form">
        <Formsy.Form
          ref="form"
          onInvalid={this.disableButton}
          onValid={this.enableButton}
          onValidSubmit={this.onFormSubmit}
          onChange={ this.handleChange }
        >
          <div styleName="form">
            <div styleName="title-label-layer">
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter title'}
                required
                label="Title"
                type="text"
                name="title"
                value={''}
                maxLength={48}
              />
            </div>
            <div styleName="label-layer">
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter start date'}
                required
                label="Start Date"
                type="date"
                name="startDate"
                value={moment.utc().format('YYYY-MM-DD')}
              />
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter end date'}
                required
                label="End Date"
                type="date"
                name="endDate"
                value={moment.utc().add(3, 'days').format('YYYY-MM-DD')}
              />
            </div>
            {this.renderTab()}
            {this.renderMilestones()}
            <div styleName="group-bottom">
              <button onClick={this.onCancelClick} type="button" className="tc-btn tc-btn-default"><strong>{'Cancel'}</strong></button>
              <button className="tc-btn tc-btn-primary tc-btn-sm"
                type="submit" disabled={(!this.isChanged() || isCreatingPhase) || !this.state.canSubmit}
              >Save Draft</button>
              <button
                onClick={this.onPublishClick}
                className="tc-btn tc-btn-primary tc-btn-sm"
                type="submit" disabled={(!this.isChanged() || isCreatingPhase) || !this.state.canSubmit}
              >Publish</button>
            </div>
          </div>
        </Formsy.Form>
      </div>
    )

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
    const {
      isAddButtonClicked
    } = this.state
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

              {!isAddButtonClicked && isProjectLive && !isCreatingPhase && hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN)  && !isLoadingPhases && (<div styleName="add-button-container">
                <button
                  onClick={this.onAddClick}
                  className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                // type="submit"
                >Add New Phase</button>
              </div>)}
              {!isCreatingPhase && isAddButtonClicked? this.renderAddingForm(): null}
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
