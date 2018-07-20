import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import Form from '../../Form'
import LinkRow from '../../LinkRow'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypePhaseSpecification.scss'

class MilestoneTypePhaseSpecification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingLink: false
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { milestone } = this.props
    const { isAddingLink } = this.state

    if (
      isAddingLink && milestone.isUpdating &&
      !nextProps.milestone.isUpdating && !nextProps.error
    ) {
      this.closeEditForm()
    }
  }

  /**add link to this */
  openEditForm() {
    this.setState({isAddingLink: true})
  }

  /**close edit ui */
  closeEditForm() {
    this.setState({ isAddingLink: false })
  }

  /**update link */
  updatedUrl(values) {
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      specificationUrl: values.url,
    })
  }

  removeUrl() {
    if (window.confirm('Are you sure you want to remove specification URL?')) {
      this.updatedUrl({ url: '' })
    }
  }

  completeMilestone() {
    const { completeMilestone } = this.props

    completeMilestone()
  }

  render() {
    const { milestone, theme, currentUser, completeMilestone } = this.props
    const { isAddingLink } = this.state

    const specificationUrl = _.get(milestone, 'details.content.specificationUrl')
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    return (
      <div styleName={cn('milestone-post', theme)}>
        {/*
          Active state
         */}
        {isActive && (
          <div>

            {!!specificationUrl && (
              <div styleName="top-space">
                <LinkRow
                  milestonePostLink={specificationUrl}
                  milestoneType={'specification'}
                  deletePost={this.removeUrl}
                  updatePost={this.updatedUrl}
                />
              </div>
            )}

            {isAddingLink && (
              <DotIndicator>
                <div styleName="top-space">
                  <Form
                    callbackCancel={this.closeEditForm}
                    defaultValues={{ url: specificationUrl }}
                    callbackOK={this.updatedUrl}
                    label="Specification document link"
                    okButtonTitle="Add link"
                  />
                </div>
              </DotIndicator>
            )}

            {!specificationUrl && !isAddingLink && (
              <div styleName="top-space">
                <DotIndicator>
                  <div styleName="button-add-layer">
                    <button
                      className="tc-btn tc-btn-default tc-btn-sm action-btn"
                      onClick={this.openEditForm}
                    >
                      Add specification document link
                    </button>
                  </div>
                </DotIndicator>
              </div>
            )}


            {!currentUser.isCustomer && !!specificationUrl && (
              <div styleName="top-space">
                <DotIndicator>
                  <div styleName="button-layer">
                    <button
                      className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                      onClick={this.completeMilestone}
                    >
                      Mark as completed
                    </button>
                  </div>
                </DotIndicator>
              </div>
            )}
          </div>
        )}

        {/*
          Completed state
         */}
        {isCompleted && (
          <div>
            {!!specificationUrl && (
              <div styleName="top-space">
                <LinkRow
                  milestonePostLink={specificationUrl}
                  milestoneType="specification"
                />
              </div>
            )}
          </div>
        )}

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
