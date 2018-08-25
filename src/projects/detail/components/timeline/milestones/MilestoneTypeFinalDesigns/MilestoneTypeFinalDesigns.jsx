/**
 * Milestone type 'final-designs`
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
import WinnerSelectionBar from '../../WinnerSelectionBar'
import MilestoneDescription from '../../MilestoneDescription'
import { withMilestoneExtensionRequest } from '../../MilestoneExtensionRequest'

import {
  MILESTONE_STATUS,
  MIN_WINNER_DESIGNS,
} from '../../../../../../config/constants'

import './MilestoneTypeFinalDesigns.scss'

class MilestoneTypeFinalDesigns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedLinks: [],
      places: [-1, -1, -1],
      isInReview: false,
      isShowCompleteConfirmMessage: false,
      isShowCustomerCompleteConfirmMessage: false,
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.showCompleteReviewConfirmation = this.showCompleteReviewConfirmation.bind(this)
    this.hideCompleteReviewConfirmation = this.hideCompleteReviewConfirmation.bind(this)
    this.showCustomerCompleteReviewConfirmation = this.showCustomerCompleteReviewConfirmation.bind(this)
    this.hideCustomerCompleteReviewConfirmation = this.hideCustomerCompleteReviewConfirmation.bind(this)
    this.completeReview = this.completeReview.bind(this)
    this.moveToReviewingState = this.moveToReviewingState.bind(this)
    this.onBonusChange = this.onBonusChange.bind(this)
    this.onPlaceChange = this.onPlaceChange.bind(this)
  }

  isCanBeCompleted() {
    const { places } = this.state
    const minSelectedDesigns = this.getMinSelectedDesigns()

    return places.filter((place) => place > -1).length >= minSelectedDesigns
  }

  showCompleteReviewConfirmation() {
    if (this.isCanBeCompleted()) {
      this.setState({ isShowCompleteConfirmMessage: true })
    } else {
      this.setState({ isSelectWarningVisible: true })
    }
  }

  hideCompleteReviewConfirmation() {
    this.setState({ isShowCompleteConfirmMessage: false })
  }

  showCustomerCompleteReviewConfirmation() {
    if (this.isCanBeCompleted()) {
      this.setState({ isShowCustomerCompleteConfirmMessage: true })
    } else {
      this.setState({ isSelectWarningVisible: true })
    }
  }

  hideCustomerCompleteReviewConfirmation() {
    this.setState({ isShowCustomerCompleteConfirmMessage: false })
  }

  completeReview() {
    const { milestone, completeMilestone } = this.props
    const { places, selectedLinks } = this.state
    const links = _.get(milestone, 'details.content.links', [])

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
    const links = _.get(milestone, 'details.content.links', [])

    return Math.min(links.length, MIN_WINNER_DESIGNS)
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
      extensionRequestDialog,
      extensionRequestButton,
      extensionRequestConfirmation,
    } = this.props
    const {
      selectedLinks,
      isSelectWarningVisible,
      isShowCustomerCompleteConfirmMessage,
      isShowCompleteConfirmMessage,
      places,
    } = this.state

    const links = _.get(milestone, 'details.content.links', [])
    const isInReview = _.get(milestone, 'details.content.isInReview', false)

    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
    const minCheckedDesigns = this.getMinSelectedDesigns()
    const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0)

    const startDate = moment(milestone.actualStartDate || milestone.startDate)
    const endDate = moment(milestone.startDate).add(milestone.duration - 1, 'days')
    const daysLeft = endDate.diff(today, 'days')
    const totalDays = endDate.diff(startDate, 'days')
    const hoursLeft = endDate.diff(moment(), 'hours')

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
                      addButtonTitle="Add a design link"
                      formAddTitle="Adding a link"
                      formAddButtonTitle="Add a link"
                      formUpdateTitle="Editing a link"
                      formUpdateButtonTitle="Save changes"
                      isUpdating={milestone.isUpdating}
                      fakeName={`Design ${links.length + 1}`}
                      canAddLink
                    />
                  </DotIndicator>
                )}
              </div>
            )}

            {isInReview && (
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
            )}

            {isSelectWarningVisible && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <div styleName="message-bar" className="flex center">
                    <i>Please select all {minCheckedDesigns} places to complete the review</i>
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

            {
              !isCompleted &&
              !extensionRequestConfirmation &&
              !extensionRequestDialog &&
              !isShowCompleteConfirmMessage &&
              !isShowCustomerCompleteConfirmMessage &&
              (!currentUser.isCustomer || isInReview) &&
            (
              <DotIndicator hideLine>
                <div styleName="action-bar" className="flex center">
                  {(!currentUser.isCustomer || isInReview) && (
                    <button
                      className={'tc-btn tc-btn-primary'}
                      onClick={!currentUser.isCustomer ? this.showCompleteReviewConfirmation : this.showCustomerCompleteReviewConfirmation}
                      disabled={!isInReview}
                    >
                      Complete review ({
                        daysLeft >= 0
                          ? `${hoursLeft}h remaining`
                          : `${-daysLeft}h delay`
                      })
                    </button>
                  )}
                  {!currentUser.isCustomer && extensionRequestButton}
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

            {isShowCustomerCompleteConfirmMessage && (
              <DotIndicator hideLine>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label="Design phase competition"
                    theme="primary"
                    message="This selection is final and cannot be undone. Once you confirm your selection we will close the design phase and can proceed to the next one. Clicking on the Confirm selection button would make the source files available for download."
                    isShowSelection={false}
                    buttons={[
                      { title: 'Cancel', onClick: this.hideCustomerCompleteReviewConfirmation, type: 'default' },
                      { title: 'Complete selection', onClick: this.completeReview, type: 'primary' },
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

            {links.filter((link) => (link.selectedPlace || link.isSelected)).map((link, index) => (
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

MilestoneTypeFinalDesigns.defaultProps = {
  theme: null,
}

MilestoneTypeFinalDesigns.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
  extensionRequestDialog: PT.node,
  extensionRequestButton: PT.node,
  extensionRequestConfirmation: PT.node,
}

export default withMilestoneExtensionRequest(MilestoneTypeFinalDesigns)
