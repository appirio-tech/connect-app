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
  deleteProjectsMetadataSpecial,
  createPlanConfig,
  updateProjectsMetadata,
  getVersionOptionList,
  getProjectMetadataWithVersion,
  getRevisionList,
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

class PlanConfigDetails extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { match } = this.props
    let ifNewKey = false
    let ifNewVersion = false
    let ifMetadataTypeChanged = false
    if (this.props.templates.versionMetadataType && this.props.templates.versionMetadataType !== 'planConfig') {
      ifMetadataTypeChanged = true
    }
    if (this.props.templates.versionMetadata) {
      if (this.props.templates.versionMetadata.key !== match.params.key) {
        ifNewKey = true
      }
      if (_.toString(this.props.templates.versionMetadata.version) !== match.params.version) {
        ifNewVersion = true
      }
    }
    if (match.params.version && match.params.key && (!this.props.templates.versionMetadata || ifMetadataTypeChanged || ifNewKey || ifNewVersion) && !this.props.isLoading) {
      this.props.getProjectMetadataWithVersion('planConfig', match.params.key, match.params.version)
    }
    if (match.params.key && (!this.props.templates.versionOptions || ifMetadataTypeChanged || ifNewKey) && !this.props.versionOptionsLoading) {
      this.props.getVersionOptionList('planConfig', match.params.key)
    }
  }

  render() {
    const {
      loadProjectsMetadata,
      getProjectMetadataWithVersion,
      deleteProjectsMetadataSpecial,
      createPlanConfig,
      updateProjectsMetadata,
      getRevisionList,
      templates,
      isAdmin,
      match,
    } = this.props
    const key = match.params.key
    let planConfig
    if (key) {
      planConfig = templates.versionMetadata
    }
    return (
      <div>
        <MetaDataPanel
          templates={templates}
          isAdmin={isAdmin}
          metadataType="planConfig"
          metadata={planConfig}
          getRevisionList={getRevisionList}
          loadProjectsMetadata={loadProjectsMetadata}
          getProjectMetadataWithVersion={getProjectMetadataWithVersion}
          deleteProjectsMetadata={deleteProjectsMetadataSpecial}
          createProjectsMetadata={createPlanConfig}
          updateProjectsMetadata={updateProjectsMetadata}
          routerParams={match.params}
          isNew={!key}
        />
      </div>
    )
  }
}



PlanConfigDetails.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadataSpecial: PropTypes.func.isRequired,
  createPlanConfig: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
  getVersionOptionList: PropTypes.func.isRequired,
  getRevisionList: PropTypes.func.isRequired,
  getProjectMetadataWithVersion: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    templates,
    isLoading: templates.isLoading,
    versionOptionsLoading: templates.versionOptionsLoading,
    isRemoving: templates.isRemoving,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

const mapDispatchToProps = {
  loadProjectsMetadata,
  deleteProjectsMetadataSpecial,
  createPlanConfig,
  updateProjectsMetadata,
  getVersionOptionList,
  getRevisionList,
  getProjectMetadataWithVersion,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const enhance = spinnerWhileLoading(props => !props.isLoading && !props.isRemoving && !props.versionOptionsLoading)
const PlanConfigDetailsWithLoaderEnhanced = enhance(errorHandler(PlanConfigDetails))
const PlanConfigDetailsWithLoaderAndAuth = requiresAuthentication(PlanConfigDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlanConfigDetailsWithLoaderAndAuth))