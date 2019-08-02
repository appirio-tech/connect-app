/**
 * WorkNewContainer container
 * displays content of the create work form
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import WorkViewEdit from '../components/workstreams/WorkViewEdit'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import './WorkNewContainer.scss'


class WorkNewContainer extends React.Component {
  constructor(props) {
    super(props)

    this.submitForm = this.submitForm.bind(this)
  }

  /**
   * Call request to submit edit form
   * @param {Object} model form value
   */
  submitForm(model) {
    const { match: { params: { projectId } }, createWork, workstreamId } = this.props
    createWork(projectId, workstreamId, model)
  }

  render() {
    const {isCreatingWorkInfo} = this.props
    return (
      <div styleName="container">
        <WorkViewEdit
          {...this.props}
          isNewWork
          work={{}}
          submitForm={this.submitForm}
        />
        {isCreatingWorkInfo && (<div styleName="loading-wrapper">
          <LoadingIndicator />
        </div>)}
      </div>
    )
  }
}

WorkNewContainer.PropTypes = {
  workstreamId: PT.number.isRequired,
  onBack: PT.func.isRequired,
  createWork: PT.func.isRequired,
  isCreatingWorkInfo: PT.bool.isRequired,
}


export default withRouter(WorkNewContainer)
