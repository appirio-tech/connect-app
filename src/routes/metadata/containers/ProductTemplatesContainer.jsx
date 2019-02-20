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
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
import _ from 'lodash'
import CoderBroken from '../../../assets/icons/coder-broken.svg'

import './MetaDataContainer.scss'

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
        <ProductTemplatesGridView
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
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  sortProductTemplates: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    templates: templates.productTemplates,
    isLoading: templates.isLoading,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

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
const enhance = spinnerWhileLoading(props => !props.isLoading || props.templates)
const ProductTemplatesContainerWithLoaderEnhanced = enhance(errorHandler(ProductTemplatesContainer))
const ProductTemplatesContainerWithLoaderAndAuth = requiresAuthentication(ProductTemplatesContainerWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductTemplatesContainerWithLoaderAndAuth))
