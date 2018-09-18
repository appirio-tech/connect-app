/**
 * MilestoneExtensionRequest HOC
 * 
 * Provides the next props for component:
 * - extensionRequestDialog - dialog to requests extension
 * - extensionRequestButton - button to open request extension dialog
 * - extensionRequestConfirmation - dialog to confirm requested extension
 */

import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import MilestonePostMessage from '../MilestonePostMessage'

export const withMilestoneExtensionRequest = (Component) => {
  class MilestoneExtensionRequest extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        isShowExtensionRequestMessage: false,
      }

      this.showExtensionRequestMessage = this.showExtensionRequestMessage.bind(this)
      this.hideExtensionRequestMessage = this.hideExtensionRequestMessage.bind(this)
      this.requestExtension = this.requestExtension.bind(this)
      this.approveExtension = this.approveExtension.bind(this)
      this.declineExtension = this.declineExtension.bind(this)
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
      const { updateMilestoneContent, currentUser } = this.props
  
      const extensionDuration = parseInt(value, 10)

      if( !currentUser.isCustomer) {
        updateMilestoneContent({
          extensionRequest: {
            duration: extensionDuration,
          }
        }, {
          waitingForCustomer: true,
        })
      } else {
        updateMilestoneContent({
          extensionRequest: {
            duration: extensionDuration,
          }
        })
      }
    }
  
    declineExtension() {
      const { updateMilestoneContent } = this.props
  
      updateMilestoneContent({
        extensionRequest: null,
      }, {
        waitingForCustomer: false,
      })
    }
  
    approveExtension() {
      const { extendMilestone, milestone } = this.props
      const content = _.get(milestone, 'details.content')
      const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

      const details = milestone.details || {}
      details.metadata = {
        ..._.get(details, 'metadata', {}),
        waitingForCustomer: false
      }

      extendMilestone(extensionRequest.duration, {
        details: {
          ...details,
          content: {
            ...content,
            extensionRequest: null,
          }
        }
      })
    }

    render() {
      const { milestone } = this.props
      const { isShowExtensionRequestMessage } = this.state

      const extensionRequest = _.get(milestone, 'details.content.extensionRequest')

      const extensionRequestDialog = isShowExtensionRequestMessage ? (
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
      ) : null

      const extensionRequestButton = !extensionRequest ? (
        <button
          className={'tc-btn tc-btn-warning'}
          onClick={this.showExtensionRequestMessage}
        >
          Request Extension
        </button>
      ) : null

      const extensionRequestConfirmation = extensionRequest ? (
        <MilestonePostMessage
          label="Milestone extension requested"
          theme="primary"
          message={`Due to unusually high load on our network we had less than the minimum number or design submissions. In order to provide you with the appropriate number of design options we’ll have to extend the milestone with ${extensionRequest.duration * 24}h. This time would be enough to increase the capacity and make sure your project is successful.<br /><br />Please make a decision in the next 24h. After that we will automatically extend the project to make sure we deliver success to you.`}
          buttons={[
            { title: 'Decline extension', onClick: this.declineExtension, type: 'warning' },
            { title: 'Approve extension', onClick: this.approveExtension, type: 'primary' },
          ]}
        />
      ) : null

      return (
        <Component 
          {...{
            ...this.props,
            extensionRequestDialog,
            extensionRequestButton,
            extensionRequestConfirmation,
          }} 
        />
      )
    }
  }

  MilestoneExtensionRequest.propTypes = {
    currentUser: PT.object.isRequired,
    extendMilestone: PT.func.isRequired,
    milestone: PT.object.isRequired,
    updateMilestoneContent: PT.func.isRequired,
  }

  return MilestoneExtensionRequest
}