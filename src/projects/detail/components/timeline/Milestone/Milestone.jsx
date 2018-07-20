import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import cn from 'classnames'

import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import Form from '../Form'
import MilestoneTypePhaseSpecification from '../milestones/MilestoneTypePhaseSpecification'
import MilestoneTypeProgress from '../milestones/MilestoneTypeProgress'
import MilestoneTypeCheckpointReview from '../milestones/MilestoneTypeCheckpointReview'
import MilestoneTypeFinalDesigns from '../milestones/MilestoneTypeFinalDesigns'
import MilestoneTypeDelivery from '../milestones/MilestoneTypeDelivery'
import MilestoneTypeFinalFixes from '../milestones/MilestoneTypeFinalFixes'
import DotIndicator from '../DotIndicator'

import { MILESTONE_STATUS } from '../../../../../config/constants'

import './Milestone.scss'

class Milestone extends React.Component {
  constructor(props) {
    super(props)

    this.deletePost = this.deletePost.bind(this)
    this.hoverHeader = this.hoverHeader.bind(this)
    this.unHoverHeader = this.unHoverHeader.bind(this)
    this.toggleEditLink = this.toggleEditLink.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.updateMilestoneWithData = this.updateMilestoneWithData.bind(this)
    this.updateMilestoneContent = this.updateMilestoneContent.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
    this.extendMilestone = this.extendMilestone.bind(this)
    this.submitFinalFixesRequest = this.submitFinalFixesRequest.bind(this)

    this.state = {
      activeMenu: '',
      isHoverHeader: false,
      isEditing: false,
    }
  }

  componentDidMount() {
    const contentList = []
    this.setState(contentList)
    !!this.props.navLinks && this.props.navLinks.map((item) => {
      item.isActive && this.setState({ activeMenu: item.id })
    })
  }

  componentWillReceiveProps(nextProps) {
    const { isUpdating } = this.props
    const { isEditing } = this.state

    if (isEditing && isUpdating && !nextProps.isUpdating && !nextProps.error) {
      this.closeEditForm()
    }
  }

  deletePost(index) {
    const contentList = this.state.contentList
    contentList.splice(index, 1)
    this.setState(contentList)
  }

  hoverHeader() {
    this.setState({isHoverHeader: true})
  }

  unHoverHeader() {
    this.setState({isHoverHeader: false})
  }

  toggleEditLink() {
    this.setState({isEditing: true})
  }

  closeEditForm() {
    this.setState({isEditing: false})
  }

  updateMilestoneWithData(values) {
    const { milestoneId, updateMilestone } = this.props
    updateMilestone(milestoneId, values)
  }

  updateMilestoneContent(contentProps) {
    const { updateMilestone, milestone } = this.props

    const updatedMilestone = {
      details: {
        ...milestone.details,
        content: {
          ..._.get(milestone, 'details.content', {}),
          ...contentProps,
        },
      }
    }

    updateMilestone(milestone.id, updatedMilestone)
  }

  completeMilestone(updatedProps) {
    const { completeMilestone, milestone } = this.props

    completeMilestone(milestone.id, updatedProps)
  }

  extendMilestone(extendDuration, updatedProps) {
    const { extendMilestone, milestone } = this.props

    extendMilestone(milestone.id, extendDuration, updatedProps)
  }

  submitFinalFixesRequest(finalFixRequests) {
    const { submitFinalFixesRequest, milestone } = this.props

    submitFinalFixesRequest(milestone.id, finalFixRequests)
  }

  getDescription() {
    const { milestone } = this.props

    return milestone[`${milestone.status}Text`]
  }

  render() {
    const {
      milestone,
      currentUser,
    } = this.props
    const { isEditing } = this.state

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
    const startDate = moment(milestone.startDate)
    const month = startDate.format('MMM')
    const date = startDate.format('D')
    const title = milestone.name
    const isUpdating = milestone.isUpdating
    const editableData = {
      title: milestone.type,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      plannedText: milestone.plannedText,
      activeText: milestone.activeText,
      blockedText: milestone.blockedText,
      completedText: milestone.completedText,
    }

    return (
      <div styleName={'timeline-post '}>
        {(<div styleName={'background ' + ((this.state.isHoverHeader && !this.state.isEditing) ? 'hover ': '')} />)}
        <div styleName="col-date">
          <div styleName="month">{month}</div>
          <div styleName="day">{date}</div>
        </div>
        <div
          styleName={cn('col-timeline-post-con', {
            completed: isCompleted,
            'in-progress': isActive,
          })}
        >
          <i styleName={'status-ring'} />

          {!isEditing && (
            <dir
              onMouseEnter={this.hoverHeader}
              onMouseLeave={this.unHoverHeader}
              styleName="post-title-container"
            >
              <h4 styleName="post-title">{title}</h4>
              {this.state.isHoverHeader && !isUpdating && (
                <div onClick={this.toggleEditLink} styleName={ 'post-edit' } >
                  <span styleName="tooltiptext">Edit milestone properties</span>
                </div>)}
            </dir>)
          }

          {isEditing && !isUpdating && (
            <Form
              callbackCancel={this.closeEditForm}
              callbackOK={this.updateMilestoneWithData}
              label={'Milestone Properties'}
              defaultValues={editableData}
              okButtonTitle={'Update milestone'}
            />
          )}

          {!isEditing && (
            <div
              styleName="post-con"
              dangerouslySetInnerHTML={{ __html: this.getDescription() }}
            />)
          }

          {isUpdating && <DotIndicator><LoadingIndicator /></DotIndicator>}

          {!isEditing && !isUpdating && milestone.type === 'phase-specification' && (
            <MilestoneTypePhaseSpecification
              milestone={milestone}
              updateMilestoneContent={this.updateMilestoneContent}
              completeMilestone={this.completeMilestone}
              currentUser={currentUser}
            />
          )}

          {!isEditing && !isUpdating && (milestone.type === 'community-work' || milestone.type === 'community-review') && (
            <MilestoneTypeProgress
              milestone={milestone}
              updateMilestoneContent={this.updateMilestoneContent}
              completeMilestone={this.completeMilestone}
              currentUser={currentUser}
            />
          )}

          {!isEditing && !isUpdating && milestone.type === 'checkpoint-review' && (
            <MilestoneTypeCheckpointReview
              milestone={milestone}
              updateMilestoneContent={this.updateMilestoneContent}
              extendMilestone={this.extendMilestone}
              completeMilestone={this.completeMilestone}
              currentUser={currentUser}
            />
          )}

          {!isEditing && !isUpdating && milestone.type === 'final-designs' && (
            <MilestoneTypeFinalDesigns
              milestone={milestone}
              updateMilestoneContent={this.updateMilestoneContent}
              extendMilestone={this.extendMilestone}
              completeMilestone={this.completeMilestone}
              currentUser={currentUser}
            />
          )}

          {!isEditing && !isUpdating && milestone.type === 'final-fixes' && (
            <MilestoneTypeFinalFixes
              milestone={milestone}
              updateMilestoneContent={this.updateMilestoneContent}
              completeMilestone={this.completeMilestone}
              submitFinalFixesRequest={this.submitFinalFixesRequest}
              currentUser={currentUser}
            />
          )}

          {!isEditing && !isUpdating && milestone.type === 'delivery' && (
            <MilestoneTypeDelivery
              milestone={milestone}
              updateMilestoneContent={this.updateMilestoneContent}
              completeMilestone={this.completeMilestone}
              submitFinalFixesRequest={this.submitFinalFixesRequest}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    )
  }
}

Milestone.defaultProps = {
  finish: () => {},
}

Milestone.propTypes = {
  postContent: PT.shape({
    isCompleted: PT.boolean,
    month: PT.string,
    date: PT.string,
    title: PT.string,
    postMsg: PT.string,
    finish: PT.func,
    content: PT.array
  })
}

export default Milestone
