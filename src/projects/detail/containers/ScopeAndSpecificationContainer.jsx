/**
 * This container is used to display both, Scope and Specification tabs
 * as basically they are same for now, just use different set of sections to display.
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sticky from '../../../components/Sticky'
import MediaQuery from 'react-responsive'

import ProjectSpecSidebar from '../components/ProjectSpecSidebar'
import EditProjectForm from '../components/EditProjectForm'
import TwoColsLayout from '../../../components/TwoColsLayout'
import ScopeChangeRequest from '../components/ScopeChangeRequest/ScopeChangeRequest'
import {
  SCREEN_BREAKPOINT_MD,
  PROJECT_ATTACHMENTS_FOLDER,
  EVENT_TYPE,
  PROJECT_ROLE_OWNER,
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_MANAGER,
  PROJECT_ROLE_ACCOUNT_MANAGER
} from '../../../config/constants'
import {
  updateProject,
  fireProjectDirty,
  fireProjectDirtyUndo,
  createScopeChangeRequest,
  approveScopeChange,
  rejectScopeChange,
  cancelScopeChange,
  activateScopeChange
} from '../../actions/project'
import { addProjectAttachment, updateProjectAttachment, removeProjectAttachment } from '../../actions/projectAttachment'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import NotificationsReader from '../../../components/NotificationsReader'
import ProjectEstimation from '../../create/components/ProjectEstimation'
import { getProjectProductTemplates } from '../../../helpers/templates'

// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.processing)
const EnhancedEditProjectForm = enhance(EditProjectForm)

class SpecificationContainer extends Component {
  constructor(props) {
    super(props)
    this.saveProject = this.saveProject.bind(this)
    this.state = { project: {} }

    this.removeProjectAttachment = this.removeProjectAttachment.bind(this)
    this.updateProjectAttachment = this.updateProjectAttachment.bind(this)
    this.addProjectAttachment = this.addProjectAttachment.bind(this)
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ project: nextProps.project })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextProps.error, this.props.error)
    )
  }
  saveProject(model, scopeFreezed) {
    if (scopeFreezed) {
      const scopeChangeRequest = {
        oldScope: this.props.projectNonDirty.details,
        newScope: model.details,
      }
      this.props.createScopeChangeRequest(this.props.project.id, scopeChangeRequest)
    } else {
      this.props.updateProject(this.props.project.id, model)
    }
  }

  removeProjectAttachment(attachmentId) {
    this.props.removeProjectAttachment(this.props.project.id, attachmentId)
  }

  updateProjectAttachment(attachmentId, updatedAttachment) {
    this.props.updateProjectAttachment(this.props.project.id, attachmentId, updatedAttachment)
  }

  addProjectAttachment(attachment) {
    this.props.addProjectAttachment(this.props.project.id, attachment)
  }

  approveScopeChange(pendingScopeChange) {
    this.props.approveScopeChange(this.props.project.id, pendingScopeChange.id)
  }

  rejectScopeChange(pendingScopeChange) {
    this.props.rejectScopeChange(this.props.project.id, pendingScopeChange.id)
  }

  cancelScopeChange(pendingScopeChange) {
    this.props.cancelScopeChange(this.props.project.id, pendingScopeChange.id)
  }

  activateScopeChange(pendingScopeChange) {
    this.props.activateScopeChange(this.props.project.id, pendingScopeChange.id)
  }

  render() {
    const {
      project,
      projectNonDirty,
      currentMemberRole,
      isSuperUser,
      processing,
      template,
      allProductTemplates,
      productCategories,
      estimationQuestion,
      currentUserId,
    } = this.props
    const editPriv = isSuperUser ? isSuperUser : !!currentMemberRole
    const isCustomer = _.indexOf([PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER], currentMemberRole) > -1
    const isManager = currentMemberRole && [PROJECT_ROLE_MANAGER, PROJECT_ROLE_ACCOUNT_MANAGER].indexOf(currentMemberRole) > -1

    const attachmentsStorePath = `${PROJECT_ATTACHMENTS_FOLDER}/${project.id}/`

    const leftArea = (
      <ProjectSpecSidebar project={project} sections={template.sections} currentMemberRole={currentMemberRole} />
    )

    // look for any pending scope change request
    let pendingScopeChange = null
    if (project.scopeChangeRequests) {
      const pendingStatuses = ['pending', 'approved']
      pendingScopeChange = _.find(project.scopeChangeRequests, scr => pendingStatuses.indexOf(scr.status) !== -1)
    }

    return (
      <TwoColsLayout>
        <NotificationsReader
          id="scope"
          criteria={[
            { eventType: EVENT_TYPE.PROJECT.SPECIFICATION_MODIFIED, contents: { projectId: project.id } },
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
          <EnhancedEditProjectForm
            project={project}
            projectNonDirty={projectNonDirty}
            template={template}
            isEdittable={editPriv}
            submitHandler={this.saveProject}
            saving={processing}
            fireProjectDirty={this.props.fireProjectDirty}
            fireProjectDirtyUndo= {this.props.fireProjectDirtyUndo}
            addAttachment={this.addProjectAttachment}
            updateAttachment={this.updateProjectAttachment}
            removeAttachment={this.removeProjectAttachment}
            attachmentsStorePath={attachmentsStorePath}
            canManageAttachments={!!currentMemberRole}
            productTemplates={allProductTemplates}
            productCategories={productCategories}
            showHidden
            pendingScopeChange={pendingScopeChange}
            isCustomer={isCustomer}
          />
          {!!estimationQuestion &&
            <ProjectEstimation
              question={estimationQuestion}
              template={template}
              project={project}
              theme="dashboard"
            />
          }
          {
            pendingScopeChange &&
            <ScopeChangeRequest
              template={template}
              pendingScopeChange={pendingScopeChange}
              onApprove={() => this.approveScopeChange(pendingScopeChange)}
              onReject={() => this.rejectScopeChange(pendingScopeChange)}
              onCancel={() => this.cancelScopeChange(pendingScopeChange)}
              onActivate={() => this.activateScopeChange(pendingScopeChange)}
              isManager={isManager}
              isCustomer={isCustomer}
              isAdmin={isSuperUser}
              isRequestor={pendingScopeChange.createdBy === currentUserId}
            />
          }
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}

SpecificationContainer.propTypes = {
  project: PropTypes.object.isRequired,
  currentMemberRole: PropTypes.string,
  processing: PropTypes.bool,
  productTemplates: PropTypes.array.isRequired,
  allProductTemplates: PropTypes.array.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
}

const mapStateToProps = ({projectState, loadUser, templates}) => {
  const { projectTemplates, productTemplates } = templates

  return {
    processing: projectState.processing,
    error: projectState.error,
    currentUserId: parseInt(loadUser.user.id),
    productTemplates: (productTemplates && projectTemplates) ? (
      getProjectProductTemplates(
        productTemplates,
        projectTemplates,
        projectState.project
      )
    ) : [],
    productCategories: templates.productCategories,
    allProductTemplates: productTemplates,
  }
}

const mapDispatchToProps = {
  updateProject,
  createScopeChangeRequest,
  fireProjectDirty,
  fireProjectDirtyUndo,
  addProjectAttachment,
  updateProjectAttachment,
  removeProjectAttachment,
  approveScopeChange,
  rejectScopeChange,
  activateScopeChange,
  cancelScopeChange
}

export default connect(mapStateToProps, mapDispatchToProps)(SpecificationContainer)
