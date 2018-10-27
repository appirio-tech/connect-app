/**
 * Milestone type 'checkpoint-review`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'
import MilestonePostMessage from '../../MilestonePostMessage'
import ProjectProgress from '../../../ProjectProgress'
import MilestoneDescription from '../../MilestoneDescription'
import { withMilestoneExtensionRequest } from '../../MilestoneExtensionRequest'
import { getMilestoneStatusText, getDaysLeft, getTotalDays, getProgressPercent, getHoursLeft } from '../../../../../../helpers/milestoneHelper'

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
      isLinksProvided: _.get(props.milestone, 'details.prevMilestoneType') === 'add-links',
      isSelectWarningVisible: false,
      isShowCompleteConfirmMessage: false,
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.updateSelected = this.updateSelected.bind(this)
    this.showCompleteReviewConfirmation = this.showCompleteReviewConfirmation.bind(this)
    this.hideCompleteReviewConfirmation = this.hideCompleteReviewConfirmation.bind(this)
    this.completeReview = this.completeReview.bind(this)
    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)
    this.moveToReviewingState = this.moveToReviewingState.bind(this)
    this.shouldDisableCompleteReviewButton = this.shouldDisableCompleteReviewButton.bind(this)
  }

  getLinksForReview() {
    const { milestone } = this.props
    const { isLinksProvided } = this.state

    if (isLinksProvided) {
      return _.get(milestone, 'details.prevMilestoneContent.links', [])
    }

    return _.get(milestone, 'details.content.links', [])
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
    const links = this.getLinksForReview()

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
    const links = this.getLinksForReview()

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
    }, {
      waitingForCustomer: true,
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

  shouldDisableCompleteReviewButton(links, selectedLinks) {
    const linksLength = links.length
    const selectedLinksLength = selectedLinks.length
    if (linksLength < 5 && selectedLinksLength === linksLength) {
      return false
    } else if (linksLength >= 5 && selectedLinksLength >= 5) {
      return false
    } else {
      return true
    }
  }

  render() {
    const {
      milestone,
      theme,
      currentUser,
      extensionRequestDialog,
      extensionRequestButton,
      extensionRequestConfirmation,
    } = this.props
    const {
      isLinksProvided,
      selectedLinks,
      isSelectWarningVisible,
      isRejectedExpanded,
      isShowCompleteConfirmMessage,
    } = this.state

    // if links are provided we directly go to review
    const isInReview = isLinksProvided || _.get(milestone, 'details.content.isInReview', false)
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    const links = isCompleted
      ? _.get(milestone, 'details.content.links', [])
      : this.getLinksForReview()
    const rejectedLinks = _.reject(links, { isSelected: true })

    const minCheckedDesigns = this.getMinSelectedDesigns()

    const daysLeft = getDaysLeft(milestone)
    const totalDays = getTotalDays(milestone)
    const hoursLeft = getHoursLeft(milestone)

    const progressText = daysLeft >= 0
      ? `${daysLeft} days until designs are completed`
      : `${-daysLeft} days designs are delayed`

    const progressPercent = getProgressPercent(totalDays, daysLeft)
    const waitingForCustomer = _.get(milestone, 'details.metadata.waitingForCustomer', true)
    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideDot>
          <MilestoneDescription description={getMilestoneStatusText(milestone)} />
        </DotIndicator>

        {/*
          Active status
         */}
        {isActive && (
          <div>
            {(daysLeft < 0 || !isInReview) && (
              <DotIndicator hideDot={isInReview}>
                <div styleName="top-space">
                  <ProjectProgress
                    labelDayStatus={progressText}
                    progressPercent={progressPercent}
                    theme={daysLeft < 0 ? 'warning' : 'light'}
                    readyForReview
                  >
                    {!currentUser.isCustomer && !isInReview && (
                      <button
                        onClick={this.moveToReviewingState}
                        className="tc-btn tc-btn-primary"
                        disabled={links.length === 0}
                      >
                        Ready for review
                      </button>
                    )}
                  </ProjectProgress>
                </div>
              </DotIndicator>
            )}

            {!isInReview && !currentUser.isCustomer && (
              <DotIndicator hideLine>
                <LinkList
                  links={links}
                  onAddLink={this.updatedUrl}
                  onRemoveLink={this.removeUrl}
                  onUpdateLink={this.updatedUrl}
                  fields={[{
                    name: 'title',
                    value: `Design ${links.length + 1}`,
                    maxLength: 64,
                  }, {
                    name: 'url'
                  }]}
                  addButtonTitle="Add design link"
                  formAddTitle="Add design link"
                  formAddButtonTitle="Add link"
                  formUpdateTitle="Editing a link"
                  formUpdateButtonTitle="Save changes"
                  isUpdating={milestone.isUpdating}
                  fakeName={`Design ${links.length + 1}`}
                  canAddLink
                />
              </DotIndicator>
            )}

            {isInReview && (
              <div styleName="top-space">
                <DotIndicator>
                  <header styleName="milestone-heading">
                    Select the top {minCheckedDesigns} design variants for our next round
                  </header>
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
              </div>
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

            {!!extensionRequestDialog && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  {extensionRequestDialog}
                </div>
              </DotIndicator>
            )}

            {!!extensionRequestConfirmation && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  {extensionRequestConfirmation}
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
              !extensionRequestDialog &&
              !isShowCompleteConfirmMessage &&
              (!currentUser.isCustomer || isInReview) &&
            (
              <DotIndicator hideLine>
                <div styleName="action-bar" className="flex center">
                  {(!currentUser.isCustomer || isInReview) && (
                    <button
                      className={'tc-btn tc-btn-primary'}
                      onClick={!currentUser.isCustomer ? this.showCompleteReviewConfirmation : this.completeReview}
                      disabled={this.shouldDisableCompleteReviewButton(links, selectedLinks) && !isInReview}
                    >
                      Complete review ({hoursLeft}h)
                    </button>
                  )}
                  {!currentUser.isCustomer && !waitingForCustomer && extensionRequestButton}
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

MilestoneTypeCheckpointReview.defaultProps = {
  theme: null,
}

MilestoneTypeCheckpointReview.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
  extensionRequestDialog: PT.node,
  extensionRequestButton: PT.node,
  extensionRequestConfirmation: PT.node,
}

export default withMilestoneExtensionRequest(MilestoneTypeCheckpointReview)
