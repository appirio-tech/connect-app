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
  createMilestoneTemplate,
  updateProjectsMetadata,
} from '../../../actions/templates'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import MetaDataPanel from '../components/MetaDataPanel'
import _ from 'lodash'

import './MetaDataContainer.scss'

class MilestoneTemplateDetails extends React.Component {

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
      createMilestoneTemplate,
      updateProjectsMetadata,
      templates,
      isLoading,
      match,
    } = this.props
    const milestoneTemplates = templates.milestoneTemplates
    const id = match.params.id
    const milestoneTemplate = _.find(milestoneTemplates, t => String(t.id) === id)
    return (
      <div>
        {isLoading && (<LoadingIndicator />)}
        <div className={isLoading ? 'hide' : ''}>
          <MetaDataPanel
            templates={templates}
            metadataType="milestoneTemplate"
            metadata={milestoneTemplate}
            loadProjectsMetadata={loadProjectsMetadata}
            deleteProjectsMetadata={deleteProjectsMetadata}
            createProjectsMetadata={createMilestoneTemplate}
            updateProjectsMetadata={updateProjectsMetadata}
            isNew={!id}
          />
        </div>
      </div>
    )
  }
}



MilestoneTemplateDetails.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createMilestoneTemplate: PropTypes.func.isRequired,
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
  createMilestoneTemplate,
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
      (props.templates && props.templates.milestoneTemplates)) &&
    !props.isRemoving
)
const MilestoneTemplateDetailsWithLoaderEnhanced = enhance(errorHandler(MilestoneTemplateDetails))
const MilestoneTemplateDetailsWithLoaderAndAuth = requiresAuthentication(MilestoneTemplateDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MilestoneTemplateDetailsWithLoaderAndAuth))
