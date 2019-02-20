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
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
import _ from 'lodash'
import CoderBroken from '../../../assets/icons/coder-broken.svg'

import './MetaDataContainer.scss'

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
      isAdmin,
      currentUser,
      error,
    } = this.props
    const { criteria } = this.state
    // TODO uncomment temporary let non-admin user see metadata (they still couldn't save because server will reject)
    // if (!isAdmin) {
    //   return (
    //     <section className="content content-error">
    //       <div className="container">
    //         <div className="page-error">
    //           <CoderBroken className="icon-coder-broken" />
    //           <span>You don't have permission to access Metadata Management</span>
    //         </div>
    //       </div>
    //     </section>
    //   )
    // }
    return (
      <div>
        <ProductCategoriesGridView
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
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    productCategories: templates.productCategories,
    isLoading: templates.isLoading,
    error: templates.error,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

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
const enhance = spinnerWhileLoading(props => !props.isLoading || props.templates)
const ProductCategoriesContainerWithLoaderEnhanced = enhance(errorHandler(ProductCategoriesContainer))
const ProductCategoriesContainerWithLoaderAndAuth = requiresAuthentication(ProductCategoriesContainerWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesContainerWithLoaderAndAuth))
