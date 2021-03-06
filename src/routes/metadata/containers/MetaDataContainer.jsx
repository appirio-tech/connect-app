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
import MetaDataFormsGridView from '../components/MetaDataFormsGridView'
import MetaDataPlanConfigsGridView from '../components/MetaDataPlanConfigsGridView'
import MetaDataPriceConfigsGridView from '../components/MetaDataPriceConfigsGridView'
import MetaDataMilestoneTemplatesGridView from '../components/MetaDataMilestoneTemplatesGridView'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
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

    if (metadataType === 'forms') {
      const forms = templates.forms
      return (
        <div>
          <MetaDataFormsGridView
            currentUser={currentUser}
            isLoading={templates.isLoading}
            totalCount={forms ? forms.length : 0}
            pageNum={1}
            forms={forms}
            criteria={{ sort: 'createdAt' }}
          />
        </div>
      )
    }
    if (metadataType === 'planConfigs') {
      const planConfigs = templates.planConfigs
      return (
        <div>
          <MetaDataPlanConfigsGridView
            currentUser={currentUser}
            isLoading={templates.isLoading}
            totalCount={planConfigs ? planConfigs.length : 0}
            pageNum={1}
            projectTypes={planConfigs}
            criteria={{ sort: 'createdAt' }}
          />
        </div>
      )
    }
    if (metadataType === 'priceConfigs') {
      const priceConfigs = templates.priceConfigs
      return (
        <div>
          <MetaDataPriceConfigsGridView
            currentUser={currentUser}
            isLoading={templates.isLoading}
            totalCount={priceConfigs ? priceConfigs.length : 0}
            pageNum={1}
            projectTypes={priceConfigs}
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
  metadataType: PropTypes.string.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectsMetadata: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => ({
  templates,
  currentUser: loadUser.user,
})

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
