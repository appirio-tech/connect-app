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
  sortMilestoneTemplates
} from '../../../actions/templates'
import MilestoneTemplatesGridView from '../components/MilestoneTemplatesGridView'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import CoderBroken from '../../../assets/icons/coder-broken.svg'

import './MetaDataContainer.scss'
import { hasPermission } from '../../../helpers/permissions'
import { PERMISSIONS } from '../../../config/permissions'

const withLoader = spinnerWhileLoading(props => !props.isLoading && props.milestoneTemplates)
const MilestoneTemplatesGridViewWithLoader = withLoader(MilestoneTemplatesGridView)

class MilestoneTemplatesContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = { criteria : { sort: 'updatedAt desc' } }

    this.sortHandler = this.sortHandler.bind(this)
  }

  componentWillMount() {
    if (!this.props.milestoneTemplates && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  sortHandler(fieldName) {
    this.props.sortMilestoneTemplates(fieldName)
    this.setState({ criteria : { sort: fieldName } })
  }

  render() {
    const {
      milestoneTemplates,
      productTemplates,
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
        <MilestoneTemplatesGridViewWithLoader
          currentUser={currentUser}
          isLoading={isLoading}
          totalCount={milestoneTemplates ? milestoneTemplates.length : 0}
          pageNum={1}
          pageSize={milestoneTemplates ? milestoneTemplates.length : 0}
          milestoneTemplates={milestoneTemplates}
          productTemplates={productTemplates}
          criteria={criteria}
          sortHandler={this.sortHandler}
          error={error}
        />
      </div>
    )
  }
}



MilestoneTemplatesContainer.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => ({
  productTemplates: templates.productTemplates,
  milestoneTemplates: templates.milestoneTemplates,
  isLoading: templates.isLoading,
  error: templates.error,
  currentUser: loadUser.user,
})

const mapDispatchToProps = {
  loadProjectsMetadata,
  sortMilestoneTemplates,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const MilestoneTemplatesContainerWithErrorHandler = errorHandler(MilestoneTemplatesContainer)
const MilestoneTemplatesContainerWithErrorHandlerAndAuth = requiresAuthentication(MilestoneTemplatesContainerWithErrorHandler)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MilestoneTemplatesContainerWithErrorHandlerAndAuth))
