import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import cn from 'classnames'

import MilestonePostSpecification from '../../MilestonePostSpecification'
import SubmissionEditLink from '../../SubmissionEditLink'
import MilestonePostMessage from '../../MilestonePostMessage'
import ProjectProgress from '../../../ProjectProgress'
import MilestonePost from '../../MilestonePost'

import {
  MILESTONE_STATUS,
  MIN_CHECKPOINT_REVIEW_DESIGNS,
} from '../../../../../../config/constants'

import './MilestoneTypeCheckpointReview.scss'

class MilestoneTypeCheckpointReview extends React.Component {
  constructor(props) {
    super(props)

    this.checkActionHandler = this.checkActionHandler.bind(this)

    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)
    this.addDesignLink = this.addDesignLink.bind(this)
    this.cancelAddingLink = this.cancelAddingLink.bind(this)
    this.finishAddingLink = this.finishAddingLink.bind(this)
    this.requestExtensionClicked = this.requestExtensionClicked.bind(this)
    this.requestExtensionCancel = this.requestExtensionCancel.bind(this)
    this.requestExtensionOK1 = this.requestExtensionOK1.bind(this)
    this.moveToReviewingState = this.moveToReviewingState.bind(this)

    this.state = {
      selectedItemCount: 0,
      contentList: [],
      selectedLinks: [],
      rejectedItems: [],
      isInReview: false,
      isReviewed: false,
      isAddingNewLink: false,
      isShowRequestingMessage1: false,
      isShowRequestingMessage2: false,
      isShowRequestingMessage3: false,
      isFinishMilestoneReview: false
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.updateSelected = this.updateSelected.bind(this)
    this.showCompleteReviewConfirmation = this.showCompleteReviewConfirmation.bind(this)
    this.hideCompleteReviewConfirmation = this.hideCompleteReviewConfirmation.bind(this)
    this.completeReview = this.completeReview.bind(this)
  }

  /**
   * This function gets triggered when the checked state of checkboxes change
   */
  checkActionHandler(isChecked, index) {
    const contentListItems = this.state.contentList
    const selectedLinks = []
    const rejectedItems = []
    index > -1 ? contentListItems[index].isSelected = isChecked : ''
    contentListItems.map((item, i) => {
      if (i === index) {
        item.isSelected = isChecked
      }
      const isSelected = item.isSelected
      isSelected
        ? selectedLinks.push(item)
        : rejectedItems.push(item)
    })
    this.setState({
      selectedItemCount: selectedLinks.length,
      isRejectedExpanded: false,
      contentList: contentListItems,
      selectedLinks,
      rejectedItems
    })
  }

  showCompleteReviewConfirmation() {
    const { selectedLinks } = this.state
    const minSelectedDesigns = this.getMinSelectedDesigns()

    if (selectedLinks.length < minSelectedDesigns) {
      this.setState({ isSelectWarningVisible: true })
    } else {
      this.setState({ isShowRequestingMessage3: true })
    }
  }

  hideCompleteReviewConfirmation() {
    this.setState({ isShowRequestingMessage3: false })
  }

  completeReview() {
    const { milestone, completeMilestone } = this.props
    const { selectedLinks } = this.state
    const links = _.get(milestone, 'details.content.links', [])

    // when we change status to completed, we also save which links were selected
    completeMilestone(milestone.id, {
      details: _.merge({}, milestone.details, {
        content: {
          links: links.map((link, index) => ({
            ...link,
            isSelected: _.includes(selectedLinks, index)
          }))
        }
      })
    })
  }

  getMinSelectedDesigns() {
    const { milestone } = this.props
    const links = _.get(milestone, 'details.content.links', [])

    return Math.min(links.length, MIN_CHECKPOINT_REVIEW_DESIGNS)
  }

  componentWillMount() {
    this.checkActionHandler()
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
    const isAddingNewLink = true
    this.setState({isAddingNewLink})
  }

  /**
   * cancel adding link
   */
  cancelAddingLink() {
    const isAddingNewLink = false
    this.setState({isAddingNewLink})
  }

  /**
   * button request extension clicked
   */
  requestExtensionClicked() {
    this.setState({isShowRequestingMessage1: true})
  }

  /**
   * button cancel request extension clicked
   */
  requestExtensionCancel() {
    this.setState({
      isShowRequestingMessage1: false,
      isShowRequestingMessage2: false})
  }

  /**
   * button cancel request extension clicked
   */
  requestExtensionOK1() {
    this.setState({
      isShowRequestingMessage1: false,
      isShowRequestingMessage2: true})
  }

  /** call if adding link and there is no links yet */
  finishAddingLink(value) {
    const contentList = this.state.contentList
    contentList.push({
      label: value.title,
      link: value.URL,
      linkType: 'timeline-marvelapp',
      type: 'submission-selection-entry',
      isSelected: false
    })
    this.cancelAddingLink()
    this.setState({contentList})
  }

  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestone } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    values.type = 'marvelapp'

    if (typeof linkIndex === 'number') {
      links.splice(linkIndex, 1, values)
    } else {
      links.push(values)
    }

    updateMilestone(milestone.id, {
      details: {
        content: {
          links
        }
      }
    })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }

    const { milestone, updateMilestone } = this.props
    const links = [..._.get(milestone, 'details.content.links', [])]

    links.splice(linkIndex, 1)

    updateMilestone(milestone.id, {
      details: {
        content: {
          links
        }
      }
    })
  }

  moveToReviewingState() {
    const { milestone, updateMilestone } = this.props

    updateMilestone(milestone.id, {
      details: _.merge({}, milestone.details, {
        content: {
          isInReview: true,
        }
      })
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
    const { milestone, theme } = this.props
    const { selectedLinks, isAddingNewLink, isSelectWarningVisible, isRejectedExpanded } = this.state

    const links = _.get(milestone, 'details.content.links', [])
    const isInReview = _.get(milestone, 'details.content.isInReview', false)

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
    const minCheckedDesigns = this.getMinSelectedDesigns()

    const endDate = moment(milestone.endDate)
    const startDate = moment(milestone.startDate)
    const daysLeft = endDate.diff(moment(), 'days')
    const hoursLeft = endDate.diff(moment(), 'hours')
    const totalDays = endDate.diff(startDate, 'days')

    const progressText = daysLeft > 0
      ? `${daysLeft} days until designs are completed`
      : 'Add links for designs'

    const progressPercent = daysLeft > 0
      ? (totalDays - daysLeft) / totalDays * 100
      : 100

    return (
      <div
        styleName={cn('milestone-post-specification', theme, {
          completed: isCompleted,
          'in-progress': isActive
        })}
      >
        {isActive && (
          <div>
            <span styleName="dot" />

            {!isInReview &&  (
              <div styleName="separation-sm">
                <ProjectProgress
                  labelDayStatus={progressText}
                  progressPercent={progressPercent}
                  theme="light"
                  readyForReview
                >
                  <button
                    onClick={this.moveToReviewingState}
                    className="tc-btn tc-btn-primary"
                    disabled={links.length === 0}
                  >
                    Ready for review
                  </button>
                </ProjectProgress>
              </div>)
            }

            {isInReview && (
              <header styleName="milestone-heading">
                Select the top {minCheckedDesigns} design variants for our next round
              </header>)
            }

            {links.map((link, index) => (
              <div styleName="content-link-wrap separation-sm" key={index}>
                <div styleName="add-specification-wrap separation-sm">
                  <MilestonePost
                    itemId={index}
                    milestonePostLink={link.url}
                    milestonePostTitle={link.title}
                    milestoneType={link.type}
                    isUpdating={milestone.isUpdating}
                    isActive={isActive}
                    {...!isInReview ? {
                      deletePost: this.removeUrl,
                      updatePost: this.updatedUrl,
                    } : {
                      isSelected: _.includes(selectedLinks, index),
                      onSelectChange: this.updateSelected,
                    }}
                  />
                </div>
              </div>
            ))}

            {isAddingNewLink && (
              <div styleName="separation-sm">
                <SubmissionEditLink
                  label="New design link"
                  maxTitle={64}
                  defaultValues={{
                    title: `Design ${links.length + 1}`,
                    url: '',
                  }}
                  okButtonTitle={'Add link'}
                  callbackCancel={this.cancelAddingLink}
                  callbackOK={this.updatedUrl}
                />
              </div>
            )}

            {!isInReview && !isAddingNewLink && (
              <div styleName="separation-sm">
                <MilestonePostSpecification
                  label={'Add a design link'}
                  fakeName={`Design ${links.length + 1}`}
                  onClick={this.addDesignLink}
                />
              </div>
            )}

            {this.state.isShowRequestingMessage1 && (
              <div styleName="separation-sm">
                <MilestonePostMessage
                  label={'Milestone extension request'}
                  backgroundColor={'#FFF4F4'}
                  message={'Be careful, requesting extensions will change the project overall milestone. Proceed with caution and only if there are not enough submissions to satisfy our delivery policy.'}
                  isShowSelection
                  button1Title={'Cancel'}
                  button2Title={'Request extension'}
                  cancelCallback={this.requestExtensionCancel}
                  warningCallBack={this.requestExtensionOK1}
                />
              </div>
            )}

            {this.state.isShowRequestingMessage2 && (
              <div styleName="separation-sm">
                <MilestonePostMessage
                  label={'Milestone extension requested'}
                  backgroundColor={'#CEE6FF'}
                  message={'Due to unusually high load on our network we had less than the minimum number or design submissions. In order to provide you with the appropriate number of design options we’ll have to extend the milestone with 48h. This time would be enough to increase the capacity and make sure your project is successful.<br /><br />Please make a decision in the next 24h. After that we will automatically extend the project to make sure we deliver success to you.'}
                  isShowSelection={false}
                  button2Title={'Decline extension'}
                  button3Title={'Approve extension'}
                  warningCallBack={this.requestExtensionCancel}
                  okCallback={this.requestExtensionCancel}
                />
              </div>
            )}

            {this.state.isShowRequestingMessage3 && (
              <div styleName="separation-sm">
                <MilestonePostMessage
                  label={'Complete milestone review'}
                  backgroundColor={'#FFF4F4'}
                  message={'Warning! Complete the review only if you have the permission from the customer. We do not want to close the review early without the ability to get feedback from our customers and let them select the winning 5 designs for next round.'}
                  isShowSelection={false}
                  button1Title={'Cancel'}
                  button2Title={'Complete review'}
                  cancelCallback={this.hideCompleteReviewConfirmation}
                  warningCallBack={this.completeReview}
                />
              </div>
            )}

            {isSelectWarningVisible && (
              <div styleName="message-bar hide-progress-bar" className="flex center">
                <i>Please select all {minCheckedDesigns} designs to complete the review</i>
              </div>
            )}

            {
              !isCompleted &&
              !this.state.isShowRequestingMessage1 &&
              !this.state.isShowRequestingMessage2 &&
              !this.state.isShowRequestingMessage3 &&
            (
              <div styleName="action-bar hide-progress-bar" className="flex center">
                <button
                  className={'tc-btn tc-btn-primary'}
                  onClick={this.showCompleteReviewConfirmation}
                  disabled={!isInReview}
                >
                  Complete review ({
                    daysLeft >= 0
                      ? `${hoursLeft}h remaining`
                      : `${-daysLeft}h delay`
                  })
                </button>
                <button
                  className={'tc-btn tc-btn-warning'}
                  onClick={this.requestExtensionClicked}
                >
                  Request Extension
                </button>
              </div>
            )}

          </div>
        )}

        {isCompleted && (
          <div>
            <header styleName={'milestone-heading selected-theme'}>
              Selected designs
            </header>
            {_.filter(links, { isSelected: true }).map((link, index) => (
              <div styleName="content-link-wrap separation-sm" key={index}>
                <div styleName="add-specification-wrap separation-sm">
                  <MilestonePost
                    itemId={index}
                    milestonePostLink={link.url}
                    milestonePostTitle={link.title}
                    milestoneType={link.type}
                    isSelected={link.isSelected}
                  />
                </div>
              </div>
            ))}

            <header
              styleName={'milestone-heading rejected-theme sepeartion-md  no-line ' + (this.state.isRejectedExpanded ? 'open' : 'close')}
              onClick={this.toggleRejectedSection}
            >
              Rejected designs
            </header>
            {isRejectedExpanded && _.reject(links, { isSelected: true }).map((link, index) => (
              <div styleName="content-link-wrap separation-sm" key={index}>
                <div styleName="add-specification-wrap separation-sm">
                  <MilestonePost
                    itemId={index}
                    milestonePostLink={link.url}
                    milestonePostTitle={link.title}
                    milestoneType={link.type}
                    isSelected={link.isSelected}
                  />
                </div>
              </div>
            ))}

            {/* TODO implement all sources for designs */}
            {/* <div styleName="separation-sm">
              <MilestonePost
                label={'All design source files (567MB .zip)'}
                milestonePostFile={'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas'}
                isCompleted={isCompleted}
                inProgress={isActive}
                milestoneType={'download'}
              />
            </div> */}
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
