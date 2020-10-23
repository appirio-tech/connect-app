/**
 * Container component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { branch, renderComponent, compose, withProps } from 'recompose'
import {
  loadProjectsMetadata,
  deleteProjectTemplate,
  updateProjectsMetadata,
  createProjectTemplate,
} from '../../../actions/templates'
import { fireProjectDirty } from '../../../projects/actions/project'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import MetaDataPanel from '../components/MetaDataPanel'
import _ from 'lodash'

import './MetaDataContainer.scss'

class ProjectTemplateDetails extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    if (!this.props.templates && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  render() {
    const {
      loadProjectsMetadata,
      deleteProjectTemplate,
      createProjectTemplate,
      updateProjectsMetadata,
      templates,
      isLoading,
      match,
      previewProject,
      firePreviewProjectDirty,
    } = this.props
    const projectTemplates = templates.projectTemplates
    let templateId = match.params.templateId
    templateId = templateId ? parseInt(templateId) : null
    const projectTemplate = _.find(projectTemplates, t => t.id === templateId)
    return (
      <div>
        {isLoading && (<LoadingIndicator />)}
        <div className={isLoading ? 'hide' : ''}>
          <MetaDataPanel
            templates={templates}
            metadataType="projectTemplate"
            metadata={projectTemplate}
            loadProjectsMetadata={loadProjectsMetadata}
            deleteProjectsMetadata={deleteProjectTemplate}
            createProjectsMetadata={createProjectTemplate}
            updateProjectsMetadata={updateProjectsMetadata}
            isNew={!templateId}
            previewProject={previewProject}
            firePreviewProjectDirty={firePreviewProjectDirty}
          />
        </div>
      </div>
    )
  }
}



ProjectTemplateDetails.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectTemplate: PropTypes.func.isRequired,
  createProjectTemplate: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
  previewProject: PropTypes.object,
  firePreviewProjectDirty: PropTypes.func,
}


const mapStateToProps = ({ projectState, templates, loadUser }) => ({
  templates,
  isLoading: templates.isLoading,
  isRemoving: templates.isRemoving,
  error: templates.error,
  currentUser: loadUser.user,
  previewProject: projectState.project,
})

const mapDispatchToProps = {
  loadProjectsMetadata,
  deleteProjectTemplate,
  createProjectTemplate,
  updateProjectsMetadata,
  firePreviewProjectDirty: fireProjectDirty
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.errorTemp)
const enhance = spinnerWhileLoading(
  props =>
    (!props.isLoading ||
      // avoid resetting state of child when saving
      (props.templates && props.templates.projectTemplates)) &&
    !props.isRemoving
)
const ProjectTemplateDetailsWithLoaderEnhanced = enhance(errorHandler(ProjectTemplateDetails))
const ProjectTemplateDetailsWithLoaderAndAuth = requiresAuthentication(ProjectTemplateDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTemplateDetailsWithLoaderAndAuth))
