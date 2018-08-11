/**
 * Milestone type 'checkpoint-review`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'
import MilestonePostMessage from '../../MilestonePostMessage'
import MilestoneDescription from '../../MilestoneDescription'

import {
  MILESTONE_STATUS,
  MIN_CHECKPOINT_REVIEW_DESIGNS,
} from '../../../../../../config/constants'

import './MilestoneTypeCheckpointReviewOnly.scss'

class MilestoneTypeCheckpointReviewOnly extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLinks: [],
      isInReview: false,
      isSelectWarningVisible: false,
      isShowExtensionRequestMessage: false,
      isShowExtensionConfirmMessage: false,
      isShowCompleteConfirmMessage: false,
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.updateSelected = this.updateSelected.bind(this)
    this.showCompleteReviewConfirmation = this.showCompleteReviewConfirmation.bind(this)
    this.hideCompleteReviewConfirmation = this.hideCompleteReviewConfirmation.bind(this)
    this.completeReview = this.completeReview.bind(this)
    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)
    this.showExtensionRequestMessage = this.showExtensionRequestMessage.bind(this)
    this.hideExtensionRequestMessage = this.hideExtensionRequestMessage.bind(this)
    this.requestExtension = this.requestExtension.bind(this)
    this.approveExtension = this.approveExtension.bind(this)
    this.declineExtension = this.declineExtension.bind(this)
  }

  showCompleteReviewConfirmation() {
    const { selectedLinks } = this.state
    const minSelectedDesigns = this.getMinSelectedDesigns()

    if (selectedLinks.length < minSelectedDesigns) {
      this.setState({ isSelectWarningVisible: true })
    } else {
      this.setState({ isShowCompleteConfirmMessage: true })
    }
  }

  hideCompleteReviewConfirmation() {
    this.setState({ isShowCompleteConfirmMessage: false })
  }

  completeReview() {
    const { milestone, completeMilestone } = this.props
    const { selectedLinks } = this.state
    const minSelectedDesigns = this.getMinSelectedDesigns()
    const links = _.get(milestone, 'details.prevMilestoneContent.links', [])

    if (selectedLinks.length < minSelectedDesigns) {
      this.setState({ isSelectWarningVisible: true })
      return
    }

    // when we change status to completed, we also save which links were selected
    completeMilestone({
      details: {
        ...milestone.details,
        content: {
          ..._.get(milestone, 'details.content', {}),
          links: links.map((link, index) => ({
            ...link,
            isSelected: _.includes(selectedLinks, index)
          }))
        }
      }
    })
  }

  getMinSelectedDesigns() {
    const { milestone } = this.props
    const links = _.get(milestone, 'details.prevMilestoneContent.links', [])

    return Math.min(links.length, MIN_CHECKPOINT_REVIEW_DESIGNS)
  }

  /**
   * toggles open closed states of rejected section
   */
  toggleRejectedSection() {
    this.setState({
      isRejectedExpanded: !this.state.isRejectedExpanded
    })
  }

  showExtensionRequestMessage() {
    this.setState({
      isShowExtensionRequestMessage: true,
      isSelectWarningVisible: false,
    })
  }

  hideExtensionRequestMessage() {
    this.setState({ isShowExtensionRequestMessage: false })
  }

  requestExtension(value) {
    const { updateMilestoneContent } = this.props

    const extensionDuration = parseInt(value, 10)

    updateMilestoneContent({
      extensionRequest: {
        duration: extensionDuration,
      }
    })
  }

  declineExtension() {
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      extensionRequest: null,
    })
  }

  approveExtension() {
    const { extendMilestone, milestone } = this.props
    const content = _.get(milestone, 'details.content')
    const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

    extendMilestone(extensionRequest.duration, {
      details: {
        ...milestone.details,
        content: {
          ...content,
          extensionRequest: null,
        }
      }
    })
  }

  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    values.type = 'marvelapp'

    if (typeof linkIndex === 'number') {
      links.splice(linkIndex, 1, values)
    } else {
      links.push(values)
    }

    updateMilestoneContent({
      links
    })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }

    const { milestone, updateMilestoneContent } = this.props
    const links = [..._.get(milestone, 'details.content.links', [])]

    links.splice(linkIndex, 1)

    updateMilestoneContent({
      links
    })
  }

  updateSelected(isSelected, linkIndex) {
    const { selectedLinks, isSelectWarningVisible } = this.state
    const minSelectedDesigns = this.getMinSelectedDesigns()

    if (isSelected) {
      this.setState({
        selectedLinks: [...selectedLinks, linkIndex],
      })

      // remove warning if selected enough
      if (isSelectWarningVisible && selectedLinks.length + 1 >= minSelectedDesigns) {
        this.setState({
          isSelectWarningVisible: false
        })
      }
    } else {
      this.setState({
        selectedLinks: _.filter(selectedLinks, (selectedLinkIndex) =>
          selectedLinkIndex !== linkIndex
        )
      })
    }
  }

  getDescription() {
    const { milestone } = this.props

    return milestone[`${milestone.status}Text`]
  }

  render() {
    const {
      milestone,
      theme,
      currentUser,
    } = this.props
    const {
      selectedLinks,
      isSelectWarningVisible,
      isRejectedExpanded,
      isShowExtensionRequestMessage,
      isShowCompleteConfirmMessage,
      isShowExtensionConfirmMessage,
    } = this.state

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    const links = isCompleted
      ? _.get(milestone, 'details.content.links', [])
      : _.get(milestone, 'details.prevMilestoneContent.links', [])
    const rejectedLinks = _.reject(links, { isSelected: true })
    const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

    const minCheckedDesigns = this.getMinSelectedDesigns()

    const endDate = moment(milestone.endDate)
    const daysLeft = endDate.diff(moment(), 'days')
    const hoursLeft = endDate.diff(moment(), 'hours')

    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideDot>
          <MilestoneDescription description={this.getDescription()} />
        </DotIndicator>

        {/*
          Active status
         */}
        {isActive && (
          <div>
            <DotIndicator>
              <div styleName="top-space">
                <header styleName="milestone-heading">
                  Select the top {minCheckedDesigns} design variants for our next round
                </header>
              </div>
            </DotIndicator>

            <DotIndicator hideLine>
              <LinkList
                links={links.map((link, index) => ({
                  ...link,
                  isSelected: _.includes(selectedLinks, index),
                }))}
                onSelectChange={this.updateSelected}
              />
            </DotIndicator>

            {isSelectWarningVisible && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <div styleName="message-bar" className="flex center">
                    <i>Please select all {minCheckedDesigns} designs to complete the review</i>
                  </div>
                </div>
              </DotIndicator>
            )}

            {isShowExtensionRequestMessage && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label={'Milestone extension request'}
                    theme="warning"
                    message={'Be careful, requesting extensions will change the project overall milestone. Proceed with caution and only if there are not enough submissions to satisfy our delivery policy.'}
                    isShowSelection
                    buttons={[
                      { title: 'Cancel', onClick: this.hideExtensionRequestMessage, type: 'default' },
                      { title: 'Request extension', onClick: this.requestExtension, type: 'warning' },
                    ]}
                  />
                </div>
              </DotIndicator>
            )}

            {!!extensionRequest && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label={'Milestone extension requested'}
                    theme="primary"
                    message={`Due to unusually high load on our network we had less than the minimum number or design submissions. In order to provide you with the appropriate number of design options we’ll have to extend the milestone with ${extensionRequest.duration * 24}h. This time would be enough to increase the capacity and make sure your project is successful.<br /><br />Please make a decision in the next 24h. After that we will automatically extend the project to make sure we deliver success to you.`}
                    buttons={[
                      { title: 'Decline extension', onClick: this.declineExtension, type: 'warning' },
                      { title: 'Approve extension', onClick: this.approveExtension, type: 'primary' },
                    ]}
                  />
                </div>
              </DotIndicator>
            )}

            {isShowCompleteConfirmMessage && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label={'Complete milestone review'}
                    theme="warning"
                    message={'Warning! Complete the review only if you have the permission from the customer. We do not want to close the review early without the ability to get feedback from our customers and let them select the winning 5 designs for next round.'}
                    isShowSelection={false}
                    buttons={[
                      { title: 'Cancel', onClick: this.hideCompleteReviewConfirmation, type: 'default' },
                      { title: 'Complete review', onClick: this.completeReview, type: 'warning' },
                    ]}
                  />
                </div>
              </DotIndicator>
            )}

            {
              !isCompleted &&
              !isShowExtensionRequestMessage &&
              !isShowExtensionConfirmMessage &&
              !isShowCompleteConfirmMessage &&
            (
              <DotIndicator hideLine>
                <div styleName="action-bar" className="flex center">
                  <button
                    className={'tc-btn tc-btn-primary'}
                    onClick={!currentUser.isCustomer ? this.showCompleteReviewConfirmation : this.completeReview}
                  >
                    Complete review ({
                      daysLeft >= 0
                        ? `${hoursLeft}h remaining`
                        : `${-hoursLeft}h delay`
                    })
                  </button>
                  {!currentUser.isCustomer && !extensionRequest && (
                    <button
                      className={'tc-btn tc-btn-warning'}
                      onClick={this.showExtensionRequestMessage}
                    >
                      Request Extension
                    </button>
                  )}
                </div>
              </DotIndicator>
            )}
          </div>
        )}

        {/*
          Completed status
         */}
        {isCompleted && (
          <div>
            <div styleName="top-space">
              <header styleName="milestone-heading selected-theme">
                Selected designs
              </header>
            </div>
            <LinkList links={_.filter(links, { isSelected: true })} />

            {rejectedLinks.length > 0 && (
              <div>
                <div styleName="top-space">
                  <header
                    styleName={'milestone-heading rejected-theme no-line ' + (isRejectedExpanded ? 'open' : 'close')}
                    onClick={this.toggleRejectedSection}
                  >
                    Rejected designs
                  </header>
                </div>
                {isRejectedExpanded && (
                  <LinkList links={rejectedLinks} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

MilestoneTypeCheckpointReviewOnly.defaultProps = {
  theme: null,
}

MilestoneTypeCheckpointReviewOnly.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  extendMilestone: PT.func.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
}

export default MilestoneTypeCheckpointReviewOnly
