/**
 * WorkItemsContainer container
 * displays content of the workstreams list section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import AddColor from '../../../assets/icons/icon-add-color.svg'
import WorkItemList from '../components/workstreams/WorkItemList'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'
import { loadWorkitems, deleteWorkitem, startDeleteWorkitem } from '../../actions/works'
import { updateTemplateForWorkItem } from '../../../helpers/challenges'
import './WorkItemsContainer.scss'

class WorkItemsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { match: { params: { projectId, workstreamId, workId } }, loadWorkitems, workitems } = this.props
    if (!workitems) {
      loadWorkitems(projectId, workstreamId, workId)
    }
  }

  render() {
    const {
      showAddChallengeTask,
      workitems,
      isLoadingWorkItem,
      isDeletingWorkItem,
    } = this.props

    return (
      <div styleName="container">
        <span styleName="title">Challenges &amp; Tasks</span>
        {!isLoadingWorkItem && workitems && (
          <WorkItemList {...this.props} />)}
        {isLoadingWorkItem && (<LoadingIndicator />)}
        <button
          styleName="icon-add"
          className="tc-btn tc-btn-primary tc-btn-md"
          onClick={showAddChallengeTask}
          disabled={isLoadingWorkItem || isDeletingWorkItem || !workitems}
        >
          <AddColor /> <span>Add Challenge/Task</span>
        </button>
      </div>
    )
  }
}

WorkItemsContainer.defaultProps = {
  showAddChallengeTask: () => {}
}

WorkItemsContainer.PropTypes = {
  showAddChallengeTask: PT.func,
  isLoadingWorkItem: PT.bool.isRequired,
  isDeletingWorkItem: PT.bool.isRequired,
}

const mapStateToProps = ({works, templates}) => {
  const workitems = works.workitems
  if (workitems) {
    const productTemplates = _.get(templates, 'productTemplates', [])
    updateTemplateForWorkItem(workitems, productTemplates)
  }
  let isDeletingWorkItem = false
  const workItemsIsDeleting = works.workItemsIsDeleting
  for(const workItemIsDeleting in workItemsIsDeleting) {
    if (workItemsIsDeleting[workItemIsDeleting]) {
      isDeletingWorkItem = true
      break
    }
  }
  return {
    workitems,
    workItemsIsDeleting: works.workItemsIsDeleting,
    isLoadingWorkItem: works.isLoadingWorkItem,
    isDeletingWorkItem
  }
}

const mapDispatchToProps = {
  loadWorkitems,
  deleteWorkitem,
  startDeleteWorkitem
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkItemsContainer))
