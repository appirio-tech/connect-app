import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import MilestonePostSpecification from '../../MilestonePostSpecification'
import Form from '../../Form'
import MilestonePostMessage from '../../MilestonePostMessage'
import ProjectProgress from '../../../ProjectProgress'
import LinkRow from '../../LinkRow'

import {
  MILESTONE_STATUS,
  MIN_CHECKPOINT_REVIEW_DESIGNS,
} from '../../../../../../config/constants'

import './MilestoneTypeCheckpointReview.scss'

class MilestoneTypeCheckpointReview extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLinks: [],
      isInReview: false,
      isAddingNewLink: false,
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
    this.addDesignLink = this.addDesignLink.bind(this)
    this.cancelAddingLink = this.cancelAddingLink.bind(this)
    this.showExtensionRequestMessage = this.showExtensionRequestMessage.bind(this)
    this.hideExtensionRequestMessage = this.hideExtensionRequestMessage.bind(this)
    this.requestExtension = this.requestExtension.bind(this)
    this.approveExtension = this.approveExtension.bind(this)
    this.declineExtension = this.declineExtension.bind(this)
    this.moveToReviewingState = this.moveToReviewingState.bind(this)
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
    const links = _.get(milestone, 'details.content.links', [])

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
    const links = _.get(milestone, 'details.content.links', [])

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

  /**
   * add design link
   */
  addDesignLink() {
    this.setState({ isAddingNewLink: true })
  }

  /**
   * cancel adding link
   */
  cancelAddingLink() {
    this.setState({ isAddingNewLink: false })
  }

  showExtensionRequestMessage() {
    this.setState({ isShowExtensionRequestMessage: true })
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
        isDeclined: false,
        isApproved: false,
      }
    })
  }

  declineExtension() {
    const { updateMilestoneContent, milestone } = this.props
    const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

    updateMilestoneContent({
      extensionRequest: {
        ...extensionRequest,
        isDeclined: true,
        isApproved: false,
      }
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
          extensionRequest: {
            ...extensionRequest,
            isApproved: true,
            isDeclined: false,
          }
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

  moveToReviewingState() {
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      isInReview: true,
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

  render() {
    const {
      milestone,
      theme,
      currentUser,
    } = this.props
    const {
      selectedLinks,
      isAddingNewLink,
      isSelectWarningVisible,
      isRejectedExpanded,
      isShowExtensionRequestMessage,
      isShowCompleteConfirmMessage,
      isShowExtensionConfirmMessage,
    } = this.state

    const links = _.get(milestone, 'details.content.links', [])
    const isInReview = _.get(milestone, 'details.content.isInReview', false)
    const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
    const minCheckedDesigns = this.getMinSelectedDesigns()

    const endDate = moment(milestone.endDate)
    const startDate = moment(milestone.startDate)
    const daysLeft = endDate.diff(moment(), 'days')
    const hoursLeft = endDate.diff(moment(), 'hours')
    const totalDays = endDate.diff(startDate, 'days')

    const progressText = daysLeft >= 0
      ? `${daysLeft} days until designs are completed`
      : `${daysLeft} days designs are delayed`

    const progressPercent = daysLeft > 0
      ? (totalDays - daysLeft) / totalDays * 100
      : 100

    return (
      <div styleName={cn('milestone-post', theme)}>
        {/*
          Active status
         */}
        {isActive && (
          <div>
            {!isInReview &&  (
              <div>
                <div styleName="top-space">
                  <DotIndicator>
                    <ProjectProgress
                      labelDayStatus={progressText}
                      progressPercent={progressPercent}
                      theme="light"
                      readyForReview
                    >
                      {!currentUser.isCustomer && (
                        <button
                          onClick={this.moveToReviewingState}
                          className="tc-btn tc-btn-primary"
                          disabled={links.length === 0}
                        >
                          Ready for review
                        </button>
                      )}
                    </ProjectProgress>
                  </DotIndicator>
                </div>

                {!currentUser.isCustomer && (
                  <DotIndicator hideLine>
                    {links.map((link, index) => (
                      <div styleName="top-space" key={index}>
                        <LinkRow
                          itemId={index}
                          milestonePostLink={link.url}
                          milestonePostTitle={link.title}
                          milestoneType={link.type}
                          deletePost={this.removeUrl}
                          updatePost={this.updatedUrl}
                        />
                      </div>
                    ))}

                    {isAddingNewLink && (
                      <div styleName="top-space">
                        <Form
                          label="New design link"
                          maxTitle={64}
                          defaultValues={{
                            title: `Design ${links.length + 1}`,
                            url: '',
                          }}
                          okButtonTitle="Add link"
                          callbackCancel={this.cancelAddingLink}
                          callbackOK={this.updatedUrl}
                        />
                      </div>
                    )}

                    {!isAddingNewLink && (
                      <div styleName="top-space">
                        <MilestonePostSpecification
                          label="Add a design link"
                          fakeName={`Design ${links.length + 1}`}
                          onClick={this.addDesignLink}
                        />
                      </div>
                    )}
                  </DotIndicator>
                )}
              </div>
            )}

            {isInReview && (
              <div>
                <DotIndicator>
                  <header styleName="milestone-heading">
                    Select the top {minCheckedDesigns} design variants for our next round
                  </header>
                </DotIndicator>

                <DotIndicator hideLine>
                  {links.map((link, index) => (
                    <div styleName="top-space" key={index}>
                      <LinkRow
                        itemId={index}
                        milestonePostLink={link.url}
                        milestonePostTitle={link.title}
                        milestoneType={link.type}
                        isSelected={_.includes(selectedLinks, index)}
                        onSelectChange={this.updateSelected}
                      />
                    </div>
                  ))}
                </DotIndicator>
              </div>
            )}

            {isShowExtensionRequestMessage && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label={'Milestone extension request'}
                    backgroundColor={'#FFF4F4'}
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

            {
              !!extensionRequest &&
              !extensionRequest.isApproved &&
              !extensionRequest.isDeclined &&
            (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label={'Milestone extension requested'}
                    backgroundColor={'#CEE6FF'}
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
                    backgroundColor={'#FFF4F4'}
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

            {isSelectWarningVisible && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <div styleName="message-bar" className="flex center">
                    <i>Please select all {minCheckedDesigns} designs to complete the review</i>
                  </div>
                </div>
              </DotIndicator>
            )}

            {
              !isCompleted &&
              !isShowExtensionRequestMessage &&
              !isShowExtensionConfirmMessage &&
              !isShowCompleteConfirmMessage &&
              (!currentUser.isCustomer || isInReview) &&
              (!extensionRequest || extensionRequest.isApproved || extensionRequest.isDeclined) &&
            (
              <DotIndicator hideLine>
                <div styleName="action-bar" className="flex center">
                  {(!currentUser.isCustomer || isInReview) && (
                    <button
                      className={'tc-btn tc-btn-primary'}
                      onClick={!currentUser.isCustomer ? this.showCompleteReviewConfirmation : this.completeReview}
                      disabled={!isInReview}
                    >
                      Complete review ({
                        daysLeft >= 0
                          ? `${hoursLeft}h remaining`
                          : `${-hoursLeft}h delay`
                      })
                    </button>
                  )}
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
            {_.filter(links, { isSelected: true }).map((link, index) => (
              <div styleName="top-space" key={index}>
                <LinkRow
                  itemId={index}
                  milestonePostLink={link.url}
                  milestonePostTitle={link.title}
                  milestoneType={link.type}
                  isSelected={link.isSelected}
                />
              </div>
            ))}

            <div styleName="top-space">
              <header
                styleName={'milestone-heading rejected-theme no-line ' + (isRejectedExpanded ? 'open' : 'close')}
                onClick={this.toggleRejectedSection}
              >
                Rejected designs
              </header>
            </div>
            {isRejectedExpanded && _.reject(links, { isSelected: true }).map((link, index) => (
              <div styleName="top-space" key={index}>
                <LinkRow
                  itemId={index}
                  milestonePostLink={link.url}
                  milestonePostTitle={link.title}
                  milestoneType={link.type}
                  isSelected={link.isSelected}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

MilestoneTypeCheckpointReview.defaultProps = {
}

MilestoneTypeCheckpointReview.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
}

export default MilestoneTypeCheckpointReview
