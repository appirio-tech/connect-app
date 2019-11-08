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
  sortPlanConfigs
} from '../../../actions/templates'
import PlanConfigsGridView from '../components/PlanConfigsGridView'
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

const withLoader = spinnerWhileLoading(props => !props.isLoading && props.planConfigs)
const PlanConfigsGridViewWithLoader = withLoader(PlanConfigsGridView)

class PlanConfigsContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = { criteria : { sort: 'updatedAt desc' } }

    this.sortHandler = this.sortHandler.bind(this)
  }

  componentWillMount() {
    if (!this.props.planConfigs && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  sortHandler(fieldName) {
    this.props.sortPlanConfigs(fieldName)
    this.setState({ criteria : { sort: fieldName } })
  }

  render() {
    const {
      planConfigs,
      isLoading,
      isAdmin,
      currentUser,
      error,
    } = this.props
    const { criteria } = this.state
    // TODO remove: temporary let non-admin user see metadata (they still couldn't save because server will reject)
    if (!isAdmin && isAdmin) {
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
        <PlanConfigsGridViewWithLoader
          currentUser={currentUser}
          isLoading={isLoading}
          totalCount={planConfigs ? planConfigs.length : 0}
          pageNum={1}
          pageSize={planConfigs ? planConfigs.length : 0}
          planConfigs={planConfigs}
          criteria={criteria}
          sortHandler={this.sortHandler}
          error={error}
        />
      </div>
    )
  }
}

PlanConfigsContainer.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
}

const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    planConfigs: templates.planConfigs,
    isLoading: templates.isLoading,
    error: templates.error,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

const mapDispatchToProps = {
  loadProjectsMetadata,
  sortPlanConfigs,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const PlanConfigsContainerWithErrorHandler = errorHandler(PlanConfigsContainer)
const PlanConfigsContainerWithErrorHandlerAndAuth = requiresAuthentication(PlanConfigsContainerWithErrorHandler)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlanConfigsContainerWithErrorHandlerAndAuth))
