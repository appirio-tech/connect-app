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
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import MetaDataPanel from '../components/MetaDataPanel'
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
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
      // isLoading,
      isAdmin,
      match,
    } = this.props
    const productTemplates = templates.productTemplates
    let templateId = match.params.templateId
    templateId = templateId ? parseInt(templateId) : null
    const productTemplate = _.find(productTemplates, t => t.id === templateId)
    return (
      <div>
        <MetaDataPanel
          templates={templates}
          isAdmin={isAdmin}
          metadataType="productTemplate"
          metadata={productTemplate}
          loadProjectsMetadata={loadProjectsMetadata}
          deleteProjectsMetadata={deleteProductTemplate}
          createProjectsMetadata={createProductTemplate}
          updateProjectsMetadata={updateProjectsMetadata}
          isNew={!templateId}
        />
      </div>
    )
  }
}



ProductTemplateDetails.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProductTemplate: PropTypes.func.isRequired,
  createProductTemplate: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    templates,
    isLoading: templates.isLoading,
    isRemoving: templates.isRemoving,
    error: templates.error,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

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
const enhance = spinnerWhileLoading(props => !props.isLoading && !props.isRemoving)
const ProductTemplateDetailsWithLoaderEnhanced = enhance(errorHandler(ProductTemplateDetails))
const ProductTemplateDetailsWithLoaderAndAuth = requiresAuthentication(ProductTemplateDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductTemplateDetailsWithLoaderAndAuth))