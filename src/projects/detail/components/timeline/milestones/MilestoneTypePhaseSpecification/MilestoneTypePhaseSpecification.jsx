import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import SubmissionEditLink from '../../SubmissionEditLink'
import MilestonePost from '../../MilestonePost'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypePhaseSpecification.scss'

class MilestoneTypePhaseSpecification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { milestone } = this.props
    const { isEditing } = this.state

    if (
      isEditing && milestone.isUpdating &&
      !nextProps.milestone.isUpdating && !nextProps.error
    ) {
      this.closeEditForm()
    }
  }

  /**add link to this */
  openEditForm() {
    this.setState({isEditing: true})
  }

  /**close edit ui */
  closeEditForm() {
    this.setState({ isEditing: false })
  }

  /**update link */
  updatedUrl(values) {
    const { milestone, updateMilestone } = this.props

    updateMilestone(milestone.id, {
      details: {
        content: {
          specificationUrl: values.url,
        }
      }
    })
  }

  removeUrl() {
    if (window.confirm('Are you sure you want to remove specification URL?')) {
      this.updatedUrl({ url: '' })
    }
  }

  completeMilestone() {
    const { milestone, completeMilestone } = this.props

    completeMilestone(milestone.id)
  }

  render() {
    const { milestone, theme } = this.props

    const specificationUrl = _.get(milestone, 'details.content.specificationUrl')
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE

    return (
      <div
        styleName={cn('milestone-post', {
          [theme]: !!theme,
        })}
      >
        {!specificationUrl && !this.state.isEditing && (
          <div styleName="top-space button-add-layer">
            <button
              className="tc-btn tc-btn-default tc-btn-sm action-btn"
              onClick={this.openEditForm}
            >
              {'Add specification document link'}
            </button>
          </div>)
        }

        {!!specificationUrl && (
          <MilestonePost
            milestonePostLink={specificationUrl}
            milestoneType={'specification'}
            deletePost={this.removeUrl}
            updatePost={this.updatedUrl}
            isUpdating={milestone.isUpdating}
            isActive={isActive}
          />
        )}

        {this.state.isEditing && (
          <div styleName="top-space">
            <SubmissionEditLink
              callbackCancel={this.closeEditForm}
              defaultValues={{ url: specificationUrl }}
              callbackOK={this.updatedUrl}
              label={'Specification document link'}
              okButtonTitle={!specificationUrl ? 'Add link' : 'Save changes'}
            />
          </div>)
        }

        {!!specificationUrl && isActive && (
          <div styleName="top-space button-layer">
            <button
              className="tc-btn tc-btn-primary tc-btn-sm action-btn"
              onClick={this.completeMilestone}
            >
              Mark as completed
            </button>
          </div>)
        }
      </div>
    )
  }
}

MilestoneTypePhaseSpecification.defaultProps = {
  theme: null,
}

MilestoneTypePhaseSpecification.propTypes = {
  theme: PT.string,
  milestone: PT.object.isRequired,
}

export default MilestoneTypePhaseSpecification
