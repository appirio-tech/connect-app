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
  createPriceConfig,
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

class PriceConfigDetails extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { match } = this.props
    if (!this.props.templates && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
    if (match.params.version && match.params.key && !this.props.templates.versionMetadata && !this.props.isLoading) {
      this.props.getProjectMetadataWithVersion('priceConfig', match.params.key, match.params.version)
    }
    if (match.params.key && !this.props.versionOptionsLoading) {
      this.props.getVersionOptionList('priceConfig', match.params.key)
    }
  }

  render() {
    const {
      loadProjectsMetadata,
      getProjectMetadataWithVersion,
      deleteProjectsMetadataSpecial,
      createPriceConfig,
      updateProjectsMetadata,
      getRevisionList,
      templates,
      isAdmin,
      match,
    } = this.props
    let priceConfig
    const key = match.params.key
    if (match.params.version) {
      priceConfig = templates.versionMetadata
    }else{
      const priceConfigs = templates.priceConfigs
      priceConfig = _.find(priceConfigs, t => t.key === key)
    }

    return (
      <div>
        { !this.props.versionOptionsLoading && (
          <MetaDataPanel
            templates={templates}
            isAdmin={isAdmin}
            metadataType="priceConfig"
            metadata={priceConfig}
            getRevisionList={getRevisionList}
            loadProjectsMetadata={loadProjectsMetadata}
            getProjectMetadataWithVersion={getProjectMetadataWithVersion}
            deleteProjectsMetadata={deleteProjectsMetadataSpecial}
            createProjectsMetadata={createPriceConfig}
            updateProjectsMetadata={updateProjectsMetadata}
            routerParams={match.params}
            isNew={!key}
          />
        )}
      </div>
    )
  }
}



PriceConfigDetails.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadataSpecial: PropTypes.func.isRequired,
  createPriceConfig: PropTypes.func.isRequired,
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
  createPriceConfig,
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
const PriceConfigDetailsWithLoaderEnhanced = enhance(errorHandler(PriceConfigDetails))
const PriceConfigDetailsWithLoaderAndAuth = requiresAuthentication(PriceConfigDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PriceConfigDetailsWithLoaderAndAuth))