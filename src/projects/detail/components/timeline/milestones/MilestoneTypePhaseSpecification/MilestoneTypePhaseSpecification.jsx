/**
 * Milestone type 'phase-specification`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'
import MilestoneDescription from '../../MilestoneDescription'
import MilestoneDelayNotification from '../../MilestoneDelayNotification'
import { withMilestoneExtensionRequest } from '../../MilestoneExtensionRequest'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import { getMilestoneStatusText } from '../../../../../../helpers/milestoneHelper'
import './MilestoneTypePhaseSpecification.scss'

class MilestoneTypePhaseSpecification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showExtensionRequestSection: true,
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
    this.onFormAddOpen = this.onFormAddOpen.bind(this)
    this.onFormAddCancel = this.onFormAddCancel.bind(this)
  }

  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    values.title = 'Specification'
    values.type = 'document'

    if (typeof linkIndex === 'number') {
      links.splice(linkIndex, 1, values)
    } else {
      links.push(values)
    }

    updateMilestoneContent({
      links
    })
  }

  onFormAddOpen() {
    this.setState({ showExtensionRequestSection: false })
  }

  onFormAddCancel() {
    this.setState({ showExtensionRequestSection: true })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove specification link?')) {
      return
    }

    const { milestone, updateMilestoneContent } = this.props
    const links = [..._.get(milestone, 'details.content.links', [])]

    links.splice(linkIndex, 1)

    updateMilestoneContent({
      links
    })
  }

  completeMilestone() {
    const { completeMilestone } = this.props

    completeMilestone()
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

    const links = _.get(milestone, 'details.content.links', [])
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
    // can add only one specification link
    const canAddLink = links.length < 1
    const { showExtensionRequestSection } = this.state
    return (
      <div styleName={cn('milestone-post', theme)}>
        <DotIndicator hideFirstLine={currentUser.isCustomer} hideDot>
          <MilestoneDescription description={getMilestoneStatusText(milestone)} />
        </DotIndicator>

        {/*
          Active state
         */}
        {isActive && (
          <div>
            <MilestoneDelayNotification milestone={milestone} hideDot={!currentUser.isCustomer || extensionRequestConfirmation}/>

            {!currentUser.isCustomer && (
              <DotIndicator hideDot={showExtensionRequestSection}>
                <LinkList
                  links={links}
                  onAddLink={this.updatedUrl}
                  onRemoveLink={this.removeUrl}
                  onUpdateLink={this.updatedUrl}
                  fields={[{ name: 'url' }]}
                  addButtonTitle="Add specification link"
                  formAddTitle="Add specification link"
                  formAddButtonTitle="Add link"
                  formUpdateTitle="Editing a link"
                  formUpdateButtonTitle="Save changes"
                  isUpdating={milestone.isUpdating}
                  canAddLink={canAddLink}
                  onFormAddOpen={this.onFormAddOpen}
                  onFormAddCancel={this.onFormAddCancel}
                />
              </DotIndicator>
            )}

            {!!extensionRequestDialog && (
              <DotIndicator>
                <div styleName="top-space">
                  {extensionRequestDialog}
                </div>
              </DotIndicator>
            )}

            {!!extensionRequestConfirmation && (
              <DotIndicator hideDot={!currentUser.isCustomer} hideLine={currentUser.isCustomer}>
                <div styleName="top-space">
                  {extensionRequestConfirmation}
                </div>
              </DotIndicator>
            )}

            {
              !currentUser.isCustomer &&
              !extensionRequestDialog && showExtensionRequestSection &&
            (
              <DotIndicator>
                <div styleName="top-space">
                  <div styleName="button-layer">
                    <button
                      className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                      onClick={this.completeMilestone}
                    >
                      Mark as completed
                    </button>
                    {!currentUser.isCustomer && extensionRequestButton}
                  </div>
                </div>
              </DotIndicator>
            )}
          </div>
        )}

        {/*
          Completed state
         */}
        {isCompleted && links.length > 0 && (
          <div>
            <DotIndicator hideDot>
              <LinkList links={links} />
            </DotIndicator>
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
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
  extensionRequestDialog: PT.node,
  extensionRequestButton: PT.node,
  extensionRequestConfirmation: PT.node,
}

export default withMilestoneExtensionRequest(MilestoneTypePhaseSpecification)
