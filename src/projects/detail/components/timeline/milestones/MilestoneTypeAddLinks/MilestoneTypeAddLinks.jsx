/**
 * Milestone type 'add-links`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'
import MilestonePostMessage from '../../MilestonePostMessage'
import ProjectProgress from '../../../ProjectProgress'
import MilestoneDescription from '../../MilestoneDescription'

import {
  MILESTONE_STATUS
} from '../../../../../../config/constants'

import './MilestoneTypeAddLinks.scss'

class MilestoneTypeAddLinks extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      addedLinks: [],
      isShowExtensionRequestMessage: false,
      isShowExtensionConfirmMessage: false,
      isShowCompleteConfirmMessage: false,
      isLinkAdded: true,
    }

    this.addUrl = this.addUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.showCompleteAddLinksConfirmation = this.showCompleteAddLinksConfirmation.bind(this)
    this.hideCompleteAddLinksConfirmation = this.hideCompleteAddLinksConfirmation.bind(this)
    this.complete = this.complete.bind(this)
    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)
    this.showExtensionRequestMessage = this.showExtensionRequestMessage.bind(this)
    this.hideExtensionRequestMessage = this.hideExtensionRequestMessage.bind(this)
    this.requestExtension = this.requestExtension.bind(this)
    this.approveExtension = this.approveExtension.bind(this)
    this.declineExtension = this.declineExtension.bind(this)
  }

  showCompleteAddLinksConfirmation() {
    this.setState({ isShowCompleteConfirmMessage: true })
  }

  hideCompleteAddLinksConfirmation() {
    this.setState({ isShowCompleteConfirmMessage: false })
  }

  complete() {
    //$TODO add call to send data to next milestone
    const { addedLinks } = this.state
    const { milestone, completeMilestone } = this.props

    // when we change status to completed, we also save which links were selected
    completeMilestone({
      details: {
        ...milestone.details,
        content: {
          ..._.get(milestone, 'details.content', {}),
          links: addedLinks
        }
      }
    })
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
      isShowExtensionRequestMessage: true
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

  addUrl(values) {
    const { addedLinks } = this.state
    values.type = 'marvelapp'

    this.setState({
      addedLinks: [...addedLinks, values],
      isLinkAdded: false
    })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }
    const { addedLinks } = this.state
    addedLinks.splice(linkIndex, 1)
    this.setState({
      addedLinks,
      isLinkAdded: false
    })
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
      addedLinks,
      isShowExtensionRequestMessage,
      isShowCompleteConfirmMessage,
      isShowExtensionConfirmMessage,
      isLinkAdded,
    } = this.state

    const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED

    const endDate = moment(milestone.endDate)
    const startDate = moment(milestone.startDate)
    const daysLeft = endDate.diff(moment(), 'days')
    const totalDays = endDate.diff(startDate, 'days')

    const progressText = daysLeft >= 0
      ? `${daysLeft} days until designs are completed`
      : `${daysLeft} days designs are delayed`

    const progressPercent = daysLeft > 0
      ? (totalDays - daysLeft) / totalDays * 100
      : 100

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
            <div>
              <div styleName="top-space">
                <DotIndicator>
                  <ProjectProgress
                    labelDayStatus={progressText}
                    progressPercent={progressPercent}
                    theme="light"
                    readyForReview
                  />
                </DotIndicator>
              </div>

              {!currentUser.isCustomer && (
                <DotIndicator hideLine>
                  <LinkList
                    links={addedLinks}
                    onAddLink={this.addUrl}
                    onRemoveLink={this.removeUrl}
                    onUpdateLink={this.addUrl}
                    fields={[{
                      name: 'title',
                      value: `Design ${addedLinks.length + 1}`,
                      maxLength: 64,
                    }, {
                      name: 'url'
                    }]}
                    addButtonTitle="Add a design link"
                    formAddTitle="Adding a link"
                    formAddButtonTitle="Add a link"
                    formUpdateTitle="Editing a link"
                    formUpdateButtonTitle="Save changes"
                    isUpdating={isLinkAdded}
                    fakeName={`Design ${addedLinks.length + 1}`}
                    canAddLink
                  />
                </DotIndicator>
              )}
            </div>

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
                    label={'Complete Adding Links'}
                    theme="warning"
                    message={'Warning! Complete the milestone only if you are done with adding links. You will not be able to add links once completed.'}
                    isShowSelection={false}
                    buttons={[
                      { title: 'Cancel', onClick: this.hideCompleteAddLinksConfirmation, type: 'default' },
                      { title: 'Complete', onClick: this.complete, type: 'warning' },
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
              (!currentUser.isCustomer) &&
            (
              <DotIndicator hideLine>
                <div styleName="action-bar" className="flex center">
                  {(!currentUser.isCustomer) && (
                    <button
                      className={'tc-btn tc-btn-primary'}
                      onClick={!currentUser.isCustomer ? this.showCompleteAddLinksConfirmation : this.complete}
                    >
                      Complete 
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

      </div>
    )
  }
}

MilestoneTypeAddLinks.defaultProps = {
  theme: null,
}

MilestoneTypeAddLinks.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  extendMilestone: PT.func.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
}

export default MilestoneTypeAddLinks
