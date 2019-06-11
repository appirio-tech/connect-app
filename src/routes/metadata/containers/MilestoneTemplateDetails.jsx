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
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import MetaDataPanel from '../components/MetaDataPanel'
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
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
      // isLoading,
      isAdmin,
      match,
    } = this.props
    const milestoneTemplates = templates.milestoneTemplates
    const id = match.params.id
    const milestoneTemplate = _.find(milestoneTemplates, t => String(t.id) === id)
    return (
      <div>
        <MetaDataPanel
          templates={templates}
          isAdmin={isAdmin}
          metadataType="milestoneTemplate"
          metadata={milestoneTemplate}
          loadProjectsMetadata={loadProjectsMetadata}
          deleteProjectsMetadata={deleteProjectsMetadata}
          createProjectsMetadata={createMilestoneTemplate}
          updateProjectsMetadata={updateProjectsMetadata}
          isNew={!id}
        />
      </div>
    )
  }
}



MilestoneTemplateDetails.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createMilestoneTemplate: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    templates,
    isLoading: templates.isLoading,
    isRemoving: templates.isRemoving,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

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
const enhance = spinnerWhileLoading(props => !props.isLoading && !props.isRemoving)
const MilestoneTemplateDetailsWithLoaderEnhanced = enhance(errorHandler(MilestoneTemplateDetails))
const MilestoneTemplateDetailsWithLoaderAndAuth = requiresAuthentication(MilestoneTemplateDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MilestoneTemplateDetailsWithLoaderAndAuth))
