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
  deleteProductCategory,
  createProductCategory,
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

class ProductCategoryDetails extends React.Component {

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
      deleteProductCategory,
      createProductCategory,
      updateProjectsMetadata,
      templates,
      // isLoading,
      isAdmin,
      match,
    } = this.props
    const productCategories = templates.productCategories
    const key = match.params.key
    const productCategory = _.find(productCategories, t => t.key === key)
    return (
      <div>
        <MetaDataPanel
          templates={templates}
          isAdmin={isAdmin}
          metadataType="productCategory"
          metadata={productCategory}
          loadProjectsMetadata={loadProjectsMetadata}
          deleteProjectsMetadata={deleteProductCategory}
          createProjectsMetadata={createProductCategory}
          updateProjectsMetadata={updateProjectsMetadata}
          isNew={!key}
        />
      </div>
    )
  }
}



ProductCategoryDetails.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProductCategory: PropTypes.func.isRequired,
  createProductCategory: PropTypes.func.isRequired,
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
  deleteProductCategory,
  createProductCategory,
  updateProjectsMetadata,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const enhance = spinnerWhileLoading(props => !props.isLoading && !props.isRemoving)
const ProductCategoryDetailsWithLoaderEnhanced = enhance(errorHandler(ProductCategoryDetails))
const ProductCategoryDetailsWithLoaderAndAuth = requiresAuthentication(ProductCategoryDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoryDetailsWithLoaderAndAuth))