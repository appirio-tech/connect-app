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
  createForm,
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

class FormDetails extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { match } = this.props
    if (!match.params.version && !this.props.templates && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
    if (match.params.version && match.params.key && !this.props.templates.versionMetadata && !this.props.isLoading) {
      this.props.getProjectMetadataWithVersion('form', match.params.key, match.params.version)
    }
    if (match.params.key && !this.props.versionOptionsLoading) {
      this.props.getVersionOptionList('form', match.params.key)
    }
  }

  render() {
    const {
      loadProjectsMetadata,
      getProjectMetadataWithVersion,
      deleteProjectsMetadataSpecial,
      createForm,
      updateProjectsMetadata,
      getRevisionList,
      templates,
      isAdmin,
      match,
    } = this.props
    let form
    const key = match.params.key
    if (match.params.version ) {
      form = templates.versionMetadata
    }else{
      const forms = templates.forms
      form = _.find(forms, t => t.key === key)
    }
    return (
      <div>
        { !this.props.versionOptionsLoading && (
          <MetaDataPanel
            templates={templates}
            isAdmin={isAdmin}
            metadataType="form"
            metadata={form}
            getRevisionList={getRevisionList}
            loadProjectsMetadata={loadProjectsMetadata}
            getProjectMetadataWithVersion={getProjectMetadataWithVersion}
            deleteProjectsMetadata={deleteProjectsMetadataSpecial}
            createProjectsMetadata={createForm}
            updateProjectsMetadata={updateProjectsMetadata}
            routerParams={match.params}
            isNew={!key}
          />
        )}
      </div>
    )
  }
}



FormDetails.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadataSpecial: PropTypes.func.isRequired,
  createForm: PropTypes.func.isRequired,
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
  createForm,
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
const enhance = spinnerWhileLoading(props => !props.isLoading && !props.isRemoving)
const FormDetailsWithLoaderEnhanced = enhance(errorHandler(FormDetails))
const FormDetailsWithLoaderAndAuth = requiresAuthentication(FormDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormDetailsWithLoaderAndAuth))