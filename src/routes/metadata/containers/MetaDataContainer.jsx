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
  getProductTemplate,
  saveProductTemplate,
  deleteProjectsMetadata,
  createProjectsMetadata,
  updateProjectsMetadata
} from '../../../actions/templates'
import MetaDataPanel from '../components/MetaDataPanel'
import MetaDataProjectTemplatesGridView from '../components/MetaDataProjectTemplatesGridView'
import MetaDataProductTemplatesGridView from '../components/MetaDataProductTemplatesGridView'
import MetaDataProjectTypesGridView from '../components/MetaDataProjectTypesGridView'
import MetaDataMilestoneTemplatesGridView from '../components/MetaDataMilestoneTemplatesGridView'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
import _ from 'lodash'

import './MetaDataContainer.scss'

class MetaDataContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    if (this.props.templates && !this.props.templates.projectTemplates && !this.props.templates.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  render() {
    const {
      loadProjectsMetadata,
      deleteProjectsMetadata,
      createProjectsMetadata,
      updateProjectsMetadata,
      templates,
      isAdmin,
      currentUser,
      metadataType,
      match,
    } = this.props

    if (metadataType === 'projectTemplates') {
      const projectTemplates = templates.projectTemplates
      return (
        <div>
          <MetaDataProjectTemplatesGridView
            currentUser={currentUser}
            isLoading={templates.isLoading}
            totalCount={projectTemplates ? projectTemplates.length : 0}
            pageNum={1}
            projectTemplates={projectTemplates}
            criteria={{ sort: 'createdAt' }}
          />
        </div>
      )
    }
    if (metadataType === 'projectTemplate') {
      const projectTemplates = templates.projectTemplates
      let templateId = match.params.templateId
      templateId = templateId ? parseInt(templateId) : null
      const projectTemplate = _.find(projectTemplates, pt => pt.id === templateId)
      return (
        <div>
          <MetaDataPanel
            templates={templates}
            isAdmin={isAdmin}
            metadataType={metadataType}
            metadata={projectTemplate}
            loadProjectsMetadata={loadProjectsMetadata}
            deleteProjectsMetadata={deleteProjectsMetadata}
            createProjectsMetadata={createProjectsMetadata}
            updateProjectsMetadata={updateProjectsMetadata}
          />
        </div>
      )
    }
    if (metadataType === 'productTemplates') {
      const productTemplates = templates.productTemplates
      return (
        <div>
          <MetaDataProductTemplatesGridView
            currentUser={currentUser}
            isLoading={templates.isLoading}
            totalCount={productTemplates ? productTemplates.length : 0}
            pageNum={1}
            productTemplates={productTemplates}
            criteria={{ sort: 'createdAt' }}
          />
        </div>
      )
    }
    if (metadataType === 'projectTypes') {
      const projectTypes = templates.projectTypes
      return (
        <div>
          <MetaDataProjectTypesGridView
            currentUser={currentUser}
            isLoading={templates.isLoading}
            totalCount={projectTypes ? projectTypes.length : 0}
            pageNum={1}
            projectTypes={projectTypes}
            criteria={{ sort: 'createdAt' }}
          />
        </div>
      )
    }

    if (metadataType === 'milestoneTemplates') {
      const milestoneTemplates = templates.milestoneTemplates
      return (
        <div>
          <MetaDataMilestoneTemplatesGridView
            currentUser={currentUser}
            isLoading={templates.isLoading}
            totalCount={milestoneTemplates ? milestoneTemplates.length : 0}
            pageNum={1}
            milestoneTemplates={milestoneTemplates}
            criteria={{ sort: 'createdAt' }}
          />
        </div>
      )
    }

    return <div>None</div>
  }
}



MetaDataContainer.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  metadataType: PropTypes.string.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectsMetadata: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    templates,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

const mapDispatchToProps = {
  loadProjectsMetadata,
  getProductTemplate,
  saveProductTemplate,
  deleteProjectsMetadata,
  createProjectsMetadata,
  updateProjectsMetadata,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const enhance = spinnerWhileLoading(props => !props.templates.isLoading || props.templates.projectTemplates)
const MetaDataContainerWithLoaderEnhanced = enhance(errorHandler(MetaDataContainer))
const MetaDataContainerWithLoaderAndAuth = requiresAuthentication(MetaDataContainerWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MetaDataContainerWithLoaderAndAuth))
