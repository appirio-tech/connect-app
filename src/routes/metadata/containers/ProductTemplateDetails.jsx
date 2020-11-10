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
  deleteProductTemplate,
  updateProjectsMetadata,
  createProductTemplate,
} from '../../../actions/templates'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import MetaDataPanel from '../components/MetaDataPanel'
import _ from 'lodash'

import './MetaDataContainer.scss'

class ProductTemplateDetails extends React.Component {

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
      deleteProductTemplate,
      createProductTemplate,
      updateProjectsMetadata,
      templates,
      isLoading,
      match,
    } = this.props
    const productTemplates = templates.productTemplates
    let templateId = match.params.templateId
    templateId = templateId ? parseInt(templateId) : null
    const productTemplate = _.find(productTemplates, t => t.id === templateId)
    return (
      <div>
        {isLoading && (<LoadingIndicator />)}
        <div className={isLoading ? 'hide' : ''}>
          <MetaDataPanel
            templates={templates}
            metadataType="productTemplate"
            metadata={productTemplate}
            loadProjectsMetadata={loadProjectsMetadata}
            deleteProjectsMetadata={deleteProductTemplate}
            createProjectsMetadata={createProductTemplate}
            updateProjectsMetadata={updateProjectsMetadata}
            isNew={!templateId}
          />
        </div>
      </div>
    )
  }
}



ProductTemplateDetails.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProductTemplate: PropTypes.func.isRequired,
  createProductTemplate: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => ({
  templates,
  isLoading: templates.isLoading,
  isRemoving: templates.isRemoving,
  error: templates.error,
  currentUser: loadUser.user,
})

const mapDispatchToProps = {
  loadProjectsMetadata,
  deleteProductTemplate,
  createProductTemplate,
  updateProjectsMetadata,
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
      (props.templates && props.templates.productTemplates)) &&
    !props.isRemoving
)
const ProductTemplateDetailsWithLoaderEnhanced = enhance(errorHandler(ProductTemplateDetails))
const ProductTemplateDetailsWithLoaderAndAuth = requiresAuthentication(ProductTemplateDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductTemplateDetailsWithLoaderAndAuth))
