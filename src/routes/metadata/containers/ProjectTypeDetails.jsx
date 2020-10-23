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
  deleteProjectsMetadata,
  createProjectType,
  updateProjectsMetadata,
} from '../../../actions/templates'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import MetaDataPanel from '../components/MetaDataPanel'
import _ from 'lodash'

import './MetaDataContainer.scss'

class ProjectTypeDetails extends React.Component {

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
      deleteProjectsMetadata,
      createProjectType,
      updateProjectsMetadata,
      templates,
      isLoading,
      match,
    } = this.props
    const projectTypes = templates.projectTypes
    const key = match.params.key
    const projectType = _.find(projectTypes, t => t.key === key)
    return (
      <div>
        {isLoading && (<LoadingIndicator />)}
        <div className={isLoading ? 'hide' : ''}>
          <MetaDataPanel
            templates={templates}
            metadataType="projectType"
            metadata={projectType}
            loadProjectsMetadata={loadProjectsMetadata}
            deleteProjectsMetadata={deleteProjectsMetadata}
            createProjectsMetadata={createProjectType}
            updateProjectsMetadata={updateProjectsMetadata}
            isNew={!key}
          />
        </div>
      </div>
    )
  }
}



ProjectTypeDetails.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectType: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => ({
  templates,
  isLoading: templates.isLoading,
  isRemoving: templates.isRemoving,
  currentUser: loadUser.user,
})

const mapDispatchToProps = {
  loadProjectsMetadata,
  deleteProjectsMetadata,
  createProjectType,
  updateProjectsMetadata,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const enhance = spinnerWhileLoading(
  props =>
    (!props.isLoading ||
      // avoid resetting state of child when saving
      (props.templates && props.templates.projectTypes)) &&
    !props.isRemoving
)
const ProjectTypeDetailsWithLoaderEnhanced = enhance(errorHandler(ProjectTypeDetails))
const ProjectTypeDetailsWithLoaderAndAuth = requiresAuthentication(ProjectTypeDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTypeDetailsWithLoaderAndAuth))
