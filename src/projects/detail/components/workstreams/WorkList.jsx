/**
 * WorkList stages section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import WorkListHeader from './WorkListHeader'
import WorkListCard from './WorkListCard'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import { getActiveWorkFilter, getDeliveredWorkFilter } from '../../../../helpers/workstreams'
import { MILESTONE_STATUS } from '../../../../config/constants'

import './WorkList.scss'


class WorkList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      listType: 'active'
    }
    this.getWorks = this.getWorks.bind(this)
  }

  componentWillMount() {
    const { workstream } = this.props
    // reupdate list type when reshow component
    if (workstream.listType) {
      this.setState({ listType: workstream.listType })
    }
  }

  /**
    * get works base on list type
    *
    * @return {Array} array of work
  */
  getWorks() {
    const {workstream} = this.props
    if (this.state.listType === 'active') {
      return _.filter(workstream.works, getActiveWorkFilter)
    } else if (this.state.listType === 'delivered') {
      return _.filter(workstream.works, getDeliveredWorkFilter)
    }
    return workstream.works
  }

  /**
   * get milestone data from work id
   *
   * @return {Object} get milestone data object
   */
  getMilestoneData(workId) {
    const { timelines } = this.props

    const timeline = _.get(timelines[workId], 'timeline')
    const activeMilestone = timeline && _.find(timeline.milestones, {
      status: MILESTONE_STATUS.ACTIVE,
    })

    return {
      timeline,
      activeMilestone,
    }
  }

  render() {
    const {
      workstream,
      addWorkForWorkstream,
      inputDesignWorks,
      startDesignReview,
    } = this.props
    const {listType} = this.state
    return (
      <div styleName="container">
        <WorkListHeader
          listType={listType}
          workstream={workstream}
          onChangeListType={(listType) => {
            this.setState({listType})
            workstream.listType = listType
          }}
        />
        {workstream.isLoadingWorks && (<LoadingIndicator />)}
        {!workstream.isLoadingWorks && (
          <div styleName="content">
            {this.getWorks().map((work) => {
              const milestoneData = this.getMilestoneData(work.id)
              return (
                <WorkListCard
                  key={`work-${work.id}`}
                  work={work}
                  workstream={workstream}
                  timeline={milestoneData.timeline}
                  activeMilestone={milestoneData.activeMilestone}
                  inputDesignWorks={inputDesignWorks}
                  startDesignReview={startDesignReview}
                />
              )
            })}
          </div>
        )}
        {!workstream.isLoadingWorks && (
          <button
            styleName="add-work"
            className="tc-btn tc-btn-primary tc-btn-sm"
            onClick={() => addWorkForWorkstream(workstream.id)}
          >Add Work</button>
        )}
      </div>
    )
  }
}

WorkList.defaultProps = {
}

WorkList.propTypes = {
  workstream: PT.shape({
    works: PT.arrayOf(PT.shape({
      id: PT.number.isRequired,
      name: PT.string.isRequired,
      status: PT.string.isRequired,
      description: PT.string,
    })).isRequired,
    isLoadingWorks: PT.bool.isRequired,
  }).isRequired,
  addWorkForWorkstream: PT.func.isRequired,
  timelines: PT.object.isRequired,
  inputDesignWorks: PT.func.isRequired,
  startDesignReview: PT.func.isRequired
}

export default withRouter(WorkList)
