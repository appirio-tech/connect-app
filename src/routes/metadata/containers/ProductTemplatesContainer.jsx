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
  sortProductTemplates,
} from '../../../actions/templates'
import ProductTemplatesGridView from '../components/ProductTemplatesGridView'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import CoderBroken from '../../../assets/icons/coder-broken.svg'

import './MetaDataContainer.scss'
import { hasPermission } from '../../../helpers/permissions'
import { PERMISSIONS } from '../../../config/permissions'

const withLoader = spinnerWhileLoading(props => !props.isLoading && props.productTemplates)
const ProductTemplatesGridViewWithLoader = withLoader(ProductTemplatesGridView)
class ProductTemplatesContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = { criteria : { sort: 'updatedAt desc' } }

    this.sortHandler = this.sortHandler.bind(this)
  }

  componentWillMount() {
    if (!this.props.templates && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  sortHandler(fieldName) {
    this.props.sortProductTemplates(fieldName)
    this.setState({ criteria : { sort: fieldName } })
  }

  render() {
    const {
      templates,
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
        <ProductTemplatesGridViewWithLoader
          currentUser={currentUser}
          isLoading={isLoading}
          totalCount={templates ? templates.length : 0}
          pageNum={1}
          pageSize={templates ? templates.length : 0}
          productTemplates={templates}
          criteria={criteria}
          sortHandler={this.sortHandler}
          error={error}
        />
      </div>
    )
  }
}



ProductTemplatesContainer.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  sortProductTemplates: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => ({
  templates: templates.productTemplates,
  isLoading: templates.isLoading,
  currentUser: loadUser.user,
  error: templates.error,
})

const mapDispatchToProps = {
  loadProjectsMetadata,
  sortProductTemplates,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const ProductTemplatesContainerWithErrorHandler = errorHandler(ProductTemplatesContainer)
const ProductTemplatesContainerWithErrorHandlerAndAuth = requiresAuthentication(ProductTemplatesContainerWithErrorHandler)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductTemplatesContainerWithErrorHandlerAndAuth))
