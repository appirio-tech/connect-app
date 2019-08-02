/**
 * WorkstreamsContainer container
 * displays content of the workstreams list section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import WorkstreamsEmpty from '../components/workstreams/WorkstreamsEmpty'
import WorkstreamsStages from '../components/workstreams/WorkstreamsStages'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

class CreateView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      isManageUser,
      workstreams,
      addWorkForWorkstream,
    } = this.props

    if (workstreams.length) {
      return  (<WorkstreamsStages workstreams={workstreams} addWorkForWorkstream={addWorkForWorkstream} />)
    }
    return (<WorkstreamsEmpty isManageUser={isManageUser} />)
  }
}

const spinner = spinnerWhileLoading(props => !props.isLoadingWorkstreams)
const EnhancedCreateView = spinner(CreateView)


class WorkstreamsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { project, workstreams } = this.props
    if (!workstreams || workstreams.length <= 0) {
      this.props.loadProjectWorkstreams(project)
    }
  }

  render() {
    return (
      <EnhancedCreateView
        {...this.props}
      />
    )
  }
}

WorkstreamsContainer.defaultProps = {
  addWorkForWorkstream: () => {}
}

WorkstreamsContainer.PropTypes = {
  loadProjectWorkstreams: PT.func.isRequired,
  isLoadingWorkstreams: PT.bool.isRequired,
  workstreams: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
    status: PT.string.isRequired,
    description: PT.string,
  })).isRequired,
  addWorkForWorkstream: PT.func.isRequired,
}


export default withRouter(WorkstreamsContainer)
