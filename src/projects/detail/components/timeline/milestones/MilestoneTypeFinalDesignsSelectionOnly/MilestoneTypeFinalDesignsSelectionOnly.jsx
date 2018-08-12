/**
 * Milestone type 'final-designs`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import MilestonePostMessage from '../../MilestonePostMessage'
import WinnerSelectionBar from '../../WinnerSelectionBar'
import MilestoneDescription from '../../MilestoneDescription'

import {
  MILESTONE_STATUS,
  MIN_WINNER_DESIGNS,
} from '../../../../../../config/constants'

import './MilestoneTypeFinalDesignsSelectionOnly.scss'

class MilestoneTypeFinalDesignsSelectionOnly extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLinks: [],
      places: [-1, -1, -1],
      isShowExtensionRequestMessage: false,
      isShowExtensionConfirmMessage: false,
      isShowCompleteConfirmMessage: false,
      isShowCustomerCompleteConfirmMessage: false,
    }

    this.showCompleteSelectionConfirmation = this.showCompleteSelectionConfirmation.bind(this)
    this.hideCompleteSelectionConfirmation = this.hideCompleteSelectionConfirmation.bind(this)
    this.showCustomerCompleteSelectionConfirmation = this.showCustomerCompleteSelectionConfirmation.bind(this)
    this.hideCustomerCompleteSelectionConfirmation = this.hideCustomerCompleteSelectionConfirmation.bind(this)
    this.completeSelection = this.completeSelection.bind(this)
    this.showExtensionRequestMessage = this.showExtensionRequestMessage.bind(this)
    this.hideExtensionRequestMessage = this.hideExtensionRequestMessage.bind(this)
    this.requestExtension = this.requestExtension.bind(this)
    this.approveExtension = this.approveExtension.bind(this)
    this.declineExtension = this.declineExtension.bind(this)
    this.onBonusChange = this.onBonusChange.bind(this)
    this.onPlaceChange = this.onPlaceChange.bind(this)
  }

  isCanBeCompleted() {
    const { places } = this.state
    const minSelectedDesigns = this.getMinSelectedDesigns()

    return places.filter((place) => place > -1).length >= minSelectedDesigns
  }

  showCompleteSelectionConfirmation() {
    if (this.isCanBeCompleted()) {
      this.setState({ isShowCompleteConfirmMessage: true })
    } else {
      this.setState({ isSelectWarningVisible: true })
    }
  }

  hideCompleteSelectionConfirmation() {
    this.setState({ isShowCompleteConfirmMessage: false })
  }

  showCustomerCompleteSelectionConfirmation() {
    if (this.isCanBeCompleted()) {
      this.setState({ isShowCustomerCompleteConfirmMessage: true })
    } else {
      this.setState({ isSelectWarningVisible: true })
    }
  }

  hideCustomerCompleteSelectionConfirmation() {
    this.setState({ isShowCustomerCompleteConfirmMessage: false })
  }

  completeSelection() {
    const { milestone, completeMilestone } = this.props
    const { places, selectedLinks } = this.state
    const links = _.get(milestone, 'details.prevMilestoneContent.links', [])

    if (!this.isCanBeCompleted()) {
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
            isSelected: _.includes(selectedLinks, index),
            selectedPlace: places.indexOf(index) + 1,
          })).sort((link1, link2) => (
            !!link1.selectedPlace && !link2.selectedPlace && -1 ||
            !link1.selectedPlace && !!link2.selectedPlace && 1 ||
            !!link1.selectedPlace && !!link2.selectedPlace && (link1.selectedPlace - link2.selectedPlace) ||
            !!link1.isSelected && !link2.isSelected && -1 ||
            !link1.isSelected && !!link2.isSelected && 1 ||
            0
          ))
        }
      }
    })
  }

  getMinSelectedDesigns() {
    const { milestone } = this.props
    const links = _.get(milestone, 'details.prevMilestoneContent.links', [])

    return Math.min(links.length, MIN_WINNER_DESIGNS)
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

  onBonusChange(linkIndex, isSelected) {
    const { selectedLinks } = this.state

    if (isSelected) {
      this.setState({
        selectedLinks: [...selectedLinks, linkIndex],
      })
    } else {
      this.setState({
        selectedLinks: _.filter(selectedLinks, (selectedLinkIndex) =>
          selectedLinkIndex !== linkIndex
        )
      })
    }
  }

  onPlaceChange(linkIndex, place, isSelected) {
    const { places, isSelectWarningVisible } = this.state
    let newPlaces = [...places]

    if (isSelected) {
      // remove link from the place if have some
      newPlaces = newPlaces.map((index) => linkIndex === index ? -1 : index)
      // put to the new place
      newPlaces.splice(place - 1, 1, linkIndex)
    } else {
      newPlaces.splice(place - 1, 1, -1)
    }

    this.setState({
      places: newPlaces,
    }, () => {
      // hide warning if don't need anymore
      if (isSelectWarningVisible && this.isCanBeCompleted()) {
        this.setState({
          isSelectWarningVisible: false,
        })
      }
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
      selectedLinks,
      isSelectWarningVisible,
      isShowCustomerCompleteConfirmMessage,
      isShowExtensionRequestMessage,
      isShowCompleteConfirmMessage,
      isShowExtensionConfirmMessage,
      places,
    } = this.state
    
    const links = _.get(milestone, 'details.prevMilestoneContent.links', [])
    const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
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
            <div>
              <DotIndicator>
                <div styleName="top-space">
                  <header styleName="milestone-heading">
                    Select the top {minCheckedDesigns} winning designs
                  </header>
                </div>
              </DotIndicator>

              {links.map((link, index) => (
                <DotIndicator hideLine key={index}>
                  <div styleName="top-space">
                    <WinnerSelectionBar
                      label={link.title}
                      link={link.url}
                      type={link.type}
                      index={index}
                      onPlaceChange={this.onPlaceChange}
                      onBonusChange={this.onBonusChange}
                      isSelectedBonus={_.includes(selectedLinks, index)}
                      selectedPlace={places.indexOf(index) + 1}
                      placesChosen={places}
                      maxPlace={links.length}
                    />
                  </div>
                </DotIndicator>
              ))}
            </div>

            {isSelectWarningVisible && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <div styleName="message-bar" className="flex center">
                    <i>Please select all {minCheckedDesigns} places to complete the review</i>
                  </div>
                </div>
              </DotIndicator>
            )}

            {
              !isCompleted &&
              !isShowExtensionRequestMessage &&
              !isShowExtensionConfirmMessage &&
              !isShowCompleteConfirmMessage &&
              !isShowCustomerCompleteConfirmMessage &&
              (!currentUser.isCustomer) &&
            (
              <DotIndicator hideLine>
                <div styleName="action-bar" className="flex center">
                  {(!currentUser.isCustomer) && (
                    <button
                      className={'tc-btn tc-btn-primary'}
                      onClick={!currentUser.isCustomer ? this.showCompleteSelectionConfirmation : this.showCustomerCompleteSelectionConfirmation}
                    >
                      Complete Selection ({
                        daysLeft >= 0
                          ? `${hoursLeft}h remaining`
                          : `${-daysLeft}h delay`
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
                    label={'Design phase completion'}
                    theme="warning"
                    message={'Warning! Complete the selection only if you have the permission from the customer. We do not want to close the milestone early without the ability to get feedback from our customers and let them select the winning 5 designs for next round.'}
                    isShowSelection={false}
                    buttons={[
                      { title: 'Cancel', onClick: this.hideCompleteSelectionConfirmation, type: 'default' },
                      { title: 'Complete selection', onClick: this.completeSelection, type: 'warning' },
                    ]}
                  />
                </div>
              </DotIndicator>
            )}

            {isShowCustomerCompleteConfirmMessage && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label="Design phase completion"
                    theme="primary"
                    message="This selection is final and cannot be undone. Once you confirm your selection we will close the design phase and can proceed to the next one. Clicking on the Confirm selection button would make the source files available for download."
                    isShowSelection={false}
                    buttons={[
                      { title: 'Cancel', onClick: this.hideCustomerCompleteSelectionConfirmation, type: 'default' },
                      { title: 'Complete selection', onClick: this.completeSelection, type: 'primary' },
                    ]}
                  />
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
              <header styleName={'milestone-heading selected-theme'}>
                Final designs
              </header>
            </div>

            {_.get(milestone, 'details.content.links', []).filter((link) => 
              (link.selectedPlace || link.isSelected)).map((link, index) => (
              <div styleName="top-space" key={index}>
                <WinnerSelectionBar
                  label={link.title}
                  link={link.url}
                  type={link.type}
                  isSelectedBonus={link.isSelected}
                  selectedPlace={link.selectedPlace}
                  placesChosen={places}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

MilestoneTypeFinalDesignsSelectionOnly.defaultProps = {
  theme: null,
}

MilestoneTypeFinalDesignsSelectionOnly.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  extendMilestone: PT.func.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
}

export default MilestoneTypeFinalDesignsSelectionOnly
