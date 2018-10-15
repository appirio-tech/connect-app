/**
 * Milestone type 'delivery`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'
import MilestonePostMessage from '../../MilestonePostMessage'
import MilestonePostEditText from '../../MilestonePostEditText'
import MilestoneDescription from '../../MilestoneDescription'
import { getMilestoneStatusText } from '../../../../../../helpers/milestoneHelper'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypeDelivery.scss'

/*
  Acceptance dialogue messages based on the milestone type
*/
const acceptDialogue = {
  'delivery-dev': {
    title: 'Code acceptance',
    text: 'Do you need any refinement on winner’s code before we deliver you the final source files? Some refinement or final fixes outside the project scope may cost you additional payment',
    button: 'Accept code',
  },
  'delivery-design': {
    title: 'Design acceptance',
    text: 'Do you need any refinement on winner’s design before we deliver you the final source files? Some refinement or final fixes outside the project scope may cost you additional payment',
    button: 'Accept design',
  },
  // TODO this is a temporary fallback for already created milestones in DEV backend
  // this is just to keep already created milestones working and can be removed when we don't touch such projects anymore
  delivery: {
    title: 'Work acceptance',
    text: 'Do you need any refinement on winner’s work before we deliver you the final source files? Some refinement or final fixes outside the project scope may cost you additional payment',
    button: 'Accept work',
  },
}

class MilestoneTypeDelivery extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isShowFinalFixesRequestForm: false,
      // initially we have one final fix field with empty value
      finalFixRequests: [{ value: '' }],
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.showFinalFixesRequestForm = this.showFinalFixesRequestForm.bind(this)
    this.hideFinalFixesRequestForm = this.hideFinalFixesRequestForm.bind(this)
    this.acceptDesign = this.acceptDesign.bind(this)
    this.onFinalFixAdd = this.onFinalFixAdd.bind(this)
    this.onFinalFixRemove = this.onFinalFixRemove.bind(this)
    this.onFinalFixChange = this.onFinalFixChange.bind(this)
    this.submitFinalFixesRequest = this.submitFinalFixesRequest.bind(this)
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

  /**update link */
  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    values.type = 'zip'
    values.isDownloadable = true

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

  showFinalFixesRequestForm() {
    this.setState({
      isShowFinalFixesRequestForm: true,
    })
  }

  hideFinalFixesRequestForm() {
    this.setState({
      isShowFinalFixesRequestForm: false,
    })
  }

  acceptDesign() {
    const { updateMilestoneContent } = this.props

    updateMilestoneContent({
      isAccepted: true,
      isDeclined: false
    }, {
      waitingForCustomer: false,
    })
  }

  onFinalFixAdd() {
    const { finalFixRequests } = this.state

    this.setState({
      finalFixRequests: [...finalFixRequests, {
        value: '',
      }]
    })
  }

  onFinalFixChange(index, value) {
    const { finalFixRequests } = this.state

    const newFinalFixRequests = [...finalFixRequests]
    newFinalFixRequests.splice(index, 1, { value })

    this.setState({
      finalFixRequests: newFinalFixRequests
    })
  }

  onFinalFixRemove(index) {
    const { finalFixRequests } = this.state

    const newFinalFixRequests = [...finalFixRequests]
    newFinalFixRequests.splice(index, 1)

    this.setState({
      finalFixRequests: newFinalFixRequests
    })
  }

  submitFinalFixesRequest() {
    const { submitFinalFixesRequest } = this.props
    const { finalFixRequests } = this.state

    submitFinalFixesRequest(
      // submit only non-empty requests
      finalFixRequests.filter((finalFixRequest) => !!finalFixRequest.value)
    )
  }

  completeMilestone() {
    const { completeMilestone } = this.props

    completeMilestone()
  }

  render() {
    const { milestone, theme, currentUser, previousMilestone } = this.props
    const { isShowFinalFixesRequestForm, finalFixRequests } = this.state
    const isAccepted = _.get(milestone, 'details.content.isAccepted', false)
    const isDeclined = _.get(milestone, 'details.content.isDeclined', false)
    const isFinalFixesSubmitted = _.get(milestone, 'details.content.isFinalFixesSubmitted', false)
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
    //console.log(" ", milestone.details.content, " : ", isAccepted, " : ", milestone.name)

    const canSubmitFinalFixes = _.some(finalFixRequests, (finalFixRequest) => !!finalFixRequest.value)

    const isFinalFixPresent = previousMilestone === 'final-fix'
    let links = ''
    const deliveryButtons = [{ title: acceptDialogue[milestone.type].button, onClick: this.acceptDesign, type: 'primary' }]
    if(isFinalFixPresent) {
      deliveryButtons.push({ title: 'Request fixes', onClick: this.showFinalFixesRequestForm, type: 'default' })
    }
    if(isFinalFixesSubmitted) {
      links = _.get(milestone, 'details.prevMilestoneContent.links', [])
      if(isCompleted) {
        // if it's completed
        // check if there is new updated/edited delivery link
        const currentLinks = _.get(milestone, 'details.content.links', [])
        // use the previous link (final fix) if there is none
        if (currentLinks.length > 0) {
          links = currentLinks
        }
      }
    } else {
      links = _.get(milestone, 'details.content.links', [])
    }

    const shouldhaveSecondDot =
    isActive &&
    (!isAccepted &&
      !isDeclined &&
      !isShowFinalFixesRequestForm &&
      (currentUser.isCopilot || currentUser.isManager) &&
      !currentUser.isAdmin &&
      !isFinalFixesSubmitted)

    const shouldHaveThirdDot =
      isActive &&
      (!isAccepted &&
        !isDeclined &&
        !isShowFinalFixesRequestForm &&
        (currentUser.isCustomer || currentUser.isAdmin) &&
        !isFinalFixesSubmitted)

    const shouldHaveFourthDot =
      isActive &&
      (isShowFinalFixesRequestForm &&
        !isFinalFixesSubmitted)

    const shouldHaveFifthDot =
      isActive &&
      (isAccepted &&
        !currentUser.isCustomer)

    const shouldHaveSixthDot = isCompleted

    const shouldShowFirstLineDot =
    shouldhaveSecondDot ||
    shouldHaveThirdDot ||
    shouldHaveFourthDot ||
    shouldHaveFifthDot ||
    shouldHaveSixthDot

    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideFirstLine={!shouldShowFirstLineDot} hideDot>
          <MilestoneDescription description={getMilestoneStatusText(milestone)} />
        </DotIndicator>

        {/*
          Active status
         */}
        {isActive && (
          <div>
            {
              !isAccepted &&
              !isDeclined &&
              !isShowFinalFixesRequestForm &&
              (currentUser.isCopilot || currentUser.isManager) &&
              !currentUser.isAdmin &&
              !isFinalFixesSubmitted &&
              (
                <DotIndicator>
                  <div styleName="top-space">
                    <MilestonePostMessage
                      label="Design acceptance"
                      theme="primary"
                      message="The customer has yet to respond to the final deliverable acceptance. Please communicate with them if there’s a problem and they need help to make the final decision. Once they respond you’ll see a link to upload the final deliverables here."
                      isShowSelection={false}
                      buttons={[]}
                    />
                  </div>
                </DotIndicator>
              )
            }
            {
              !isAccepted &&
              !isDeclined &&
              !isShowFinalFixesRequestForm &&
              (currentUser.isCustomer || currentUser.isAdmin) &&
              !isFinalFixesSubmitted &&
            (
              <DotIndicator>
                <div styleName="top-space">
                  <MilestonePostMessage
                    label={acceptDialogue[milestone.type].title}
                    theme="primary"
                    message={acceptDialogue[milestone.type].text}
                    isShowSelection={false}
                    buttons={deliveryButtons}
                  />
                </div>
              </DotIndicator>
            )}

            {isShowFinalFixesRequestForm && !isFinalFixesSubmitted && (
              <div>
                {finalFixRequests.map((finalFixRequest, index) => (
                  <div styleName="top-space" key={index}>
                    <MilestonePostEditText
                      index={index}
                      value={finalFixRequest.value}
                      onRemove={index < finalFixRequests.length - 1 ? this.onFinalFixRemove : null}
                      onAdd={index === finalFixRequests.length - 1 ? this.onFinalFixAdd : null}
                      onChange={this.onFinalFixChange}
                      isAutoExpand
                    />
                  </div>
                ))}
                <DotIndicator>
                  <div styleName="top-space button-add-layer">
                    <button
                      className="tc-btn tc-btn-default tc-btn-sm action-btn"
                      onClick={this.hideFinalFixesRequestForm}
                    >
                      Cancel
                    </button>
                    <button
                      className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                      onClick={this.submitFinalFixesRequest}
                      disabled={!canSubmitFinalFixes}
                    >
                      Submit request
                    </button>
                  </div>
                </DotIndicator>
              </div>
            )}

            {(isAccepted) && (
              <div>
                {!currentUser.isCustomer && (
                  <DotIndicator>
                    <LinkList
                      links={links}
                      onAddLink={this.updatedUrl}
                      onRemoveLink={this.removeUrl}
                      onUpdateLink={this.updatedUrl}
                      fields={[{ name: 'url'}]}
                      addButtonTitle="Add link"
                      formAddTitle="Adding a link"
                      formAddButtonTitle="Add a link"
                      formUpdateTitle="Editing a link"
                      formUpdateButtonTitle="Save changes"
                      isUpdating={milestone.isUpdating}
                      canAddLink
                    />
                    <div styleName="top-space">
                      <div styleName="button-layer">
                        <button
                          className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                          onClick={this.completeMilestone}
                          disabled={links.length === 0}
                        >
                          Mark as completed
                        </button>
                      </div>
                    </div>
                  </DotIndicator>
                )}
              </div>
            )}


          </div>
        )}

        {/*
          Completed status
         */}
        {isCompleted && (
          <div>
            {currentUser.isCustomer ? (
              <LinkList links={links}/>
            ) : (
              <LinkList
                links={links}
                onUpdateLink={this.updatedUrl}
                fields={[{ name: 'url'}]}
                formUpdateTitle="Editing a link"
                formUpdateButtonTitle="Save changes"
                isUpdating={milestone.isUpdating}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

MilestoneTypeDelivery.defaultProps = {
  theme: null,
}

MilestoneTypeDelivery.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
}

export default MilestoneTypeDelivery
