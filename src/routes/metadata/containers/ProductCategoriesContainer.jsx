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
  sortProductCategories
} from '../../../actions/templates'
import ProductCategoriesGridView from '../components/ProductCategoriesGridView'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import CoderBroken from '../../../assets/icons/coder-broken.svg'

import './MetaDataContainer.scss'
import { hasPermission } from '../../../helpers/permissions'
import { PERMISSIONS } from '../../../config/permissions'

const withLoader = spinnerWhileLoading(props => !props.isLoading && props.productCategories)
const ProductCategoriesGridViewWithLoader = withLoader(ProductCategoriesGridView)

class ProductCategoriesContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = { criteria : { sort: 'updatedAt desc' } }

    this.sortHandler = this.sortHandler.bind(this)
  }

  componentWillMount() {
    if (!this.props.productCategories && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  sortHandler(fieldName) {
    this.props.sortProductCategories(fieldName)
    this.setState({ criteria : { sort: fieldName } })
  }

  render() {
    const {
      productCategories,
      isLoading,
      currentUser,
      error,
    } = this.props
    const { criteria } = this.state
    if (!hasPermission(PERMISSIONS.ACCESS_METADATA)) {
      return (
        <section className="content content-error">
          <div className="container">
            <div className="page-error">
              <CoderBroken className="icon-coder-broken" />
              <span>You don't have permission to access Metadata Management</span>
            </div>
          </div>
        </section>
      )
    }
    return (
      <div>
        <ProductCategoriesGridViewWithLoader
          currentUser={currentUser}
          isLoading={isLoading}
          totalCount={productCategories ? productCategories.length : 0}
          pageNum={1}
          pageSize={productCategories ? productCategories.length : 0}
          productCategories={productCategories}
          criteria={criteria}
          sortHandler={this.sortHandler}
          error={error}
        />
      </div>
    )
  }
}



ProductCategoriesContainer.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => ({
  productCategories: templates.productCategories,
  isLoading: templates.isLoading,
  error: templates.error,
  currentUser: loadUser.user,
})

const mapDispatchToProps = {
  loadProjectsMetadata,
  sortProductCategories,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const ProductCategoriesContainerWithErrorHandler = errorHandler(ProductCategoriesContainer)
const ProductCategoriesContainerWithErrorHandlerAndAuth = requiresAuthentication(ProductCategoriesContainerWithErrorHandler)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesContainerWithErrorHandlerAndAuth))
