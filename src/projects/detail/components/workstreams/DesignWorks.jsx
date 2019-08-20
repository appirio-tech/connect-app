/**
 * DesignWorks section
 */
import React from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import DesignOption from './DesignOption'
import CompleteMilestoneButtonContainer from '../work-timeline/CompleteMilestoneButtonContainer'
import BackIcon from '../../../../assets/icons/arrows-16px-1_tail-left.svg'
import CloseIcon from '../../../../assets/icons/x-mark-black.svg'
import './DesignWorks.scss'

class DesignWorks extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      /**
       * design options which are currently saved on the server
       * with populated utility props
       */
      designOptions: this.initDesignOptions(),

      /**
       * the `__id` of currently updating/deleting design option
       */
      processingDesignOptionId: null,

      /**
       * updated list of design options, which should be applied
       * if request to the server is successful
       */
      updatedDesignOptions: null,
    }

    this.addDesignOption = this.addDesignOption.bind(this)
    this.deleteDesignOption = this.deleteDesignOption.bind(this)
    this.saveDesignOption = this.saveDesignOption.bind(this)
  }

  initDesignOptions() {
    const { milestone } = this.props

    return _.get(milestone, 'details.content.designs', []).map((design) => ({
      ...design,
      // add unique id to each design so we can properly render the list of them
      __id: _.uniqueId('design_'),
    }))
  }

  componentWillReceiveProps(nextProps) {
    // if finished processing of update/delete request to the server
    if (this.props.isUpdatingMilestoneInfo && !nextProps.isUpdatingMilestoneInfo) {
      // if request is successful, we can update the current data from on the server in
      // `designOptions` to the new value of `updatedDesignOptions`
      if (!nextProps.error && this.state.updatedDesignOptions) {
        const updatedDesignOptions = this.state.updatedDesignOptions.map((designOption) => {
          // if we saved the new design option, then remove `__isNew` property for it
          if (designOption.__id === this.state.processingDesignOptionId &&
            designOption.__isNew
          ) {
            return _.omit(designOption, '__isNew')
          }
          return designOption
        })
        this.setState({
          designOptions: updatedDesignOptions,
          updatedDesignOptions: null,
        })
      }

      // mark that not design option is processed now
      this.setState({
        processingDesignOptionId: null,
      })
    }
  }

  /**
   * Get url of dashboard
   */
  getDashboardUrl() {
    const { match } = this.props
    return `/projects/${match.params.projectId}`
  }

  /**
   * Add new Design Option
   */
  addDesignOption() {
    const { designOptions } = this.state
    const updatedDesignOptions = [
      ...designOptions,
      {
        __id: _.uniqueId('design_'),
        __isNew: true,
        title: '',
        submissionId: '',
        previewUrl: '',
        links: []
      }
    ]

    this.setState({
      designOptions: updatedDesignOptions
    })
  }

  /**
   * Delete Design Option
   */
  deleteDesignOption(optionId) {
    const {
      milestone,
      updateWorkMilestone,
      workId,
      timelineId,
      milestoneId,
    } = this.props
    const { designOptions } = this.state

    const optionIndex = _.findIndex(designOptions, { __id: optionId })
    const optionToDelete = designOptions[optionIndex]

    const updatedDesignOptions = [
      ...designOptions.slice(0, optionIndex),
      ...designOptions.slice(optionIndex + 1),
    ]

    // only if we delete NOT new option, we should update changes on the server
    if (!optionToDelete.__isNew) {
      const updatedProps = {
        details: {
          ..._.get(milestone, 'details', {}),
          content: {
            ..._.get(milestone, 'details.content', {}),
            designs: updatedDesignOptions,
          }
        }
      }

      this.setState({
        processingDesignOptionId: optionId,
        updatedDesignOptions,
      })
      updateWorkMilestone(workId, timelineId, milestoneId, updatedProps)

    // if we delete a new option, just remove it from the list
    } else {
      this.setState({
        designOptions: updatedDesignOptions,
      })
    }
  }

  /**
   * Save Design Option
   */
  saveDesignOption(optionId, data) {
    const {
      milestone,
      updateWorkMilestone,
      workId,
      timelineId,
      milestoneId,
    } = this.props
    const { designOptions } = this.state

    const updatedDesignOptions = [...designOptions]
    const optionIndex = _.findIndex(designOptions, { __id: optionId })

    if (optionIndex !== -1) {
      updatedDesignOptions.splice(optionIndex, 1, data)
    }

    const updatedProps = {
      details: {
        ..._.get(milestone, 'details', {}),
        content: {
          ..._.get(milestone, 'details.content', {}),
          designs: updatedDesignOptions.map((designOption) => (
            // remove utility properties when saving data to the server
            _.omit(designOption, ['__isNew', '__id'])
          )),
        }
      }
    }

    this.setState({
      processingDesignOptionId: optionId,
      updatedDesignOptions,
    })

    updateWorkMilestone(workId, timelineId, milestoneId, updatedProps)
  }

  render() {
    const {
      onBack,
      workId,
      timelineId,
      milestoneId,
      isUpdatingMilestoneInfo,
      error,
    } = this.props
    const {
      designOptions,
      processingDesignOptionId,
    } = this.state
    const isAddingNew = _.find(designOptions, { __isNew: true })

    return (
      <div styleName="wrapper">
        <div styleName="container">
          <div styleName="header">
            <div onClick={onBack} styleName="left-control">
              <i styleName="icon" title="back"><BackIcon /></i>
              <span styleName="back-icon-text">Back</span>
            </div>
            <div styleName="title">ADD DESIGN LINKS</div>
            <div styleName="right-control">
              <i onClick={() => {
                this.props.history.push(this.getDashboardUrl())
                onBack()
              }} styleName="icon-close"
              >
                <CloseIcon />
              </i>
            </div>
          </div>

          <div styleName="complete-wrapper">
            <div styleName="complete-message">Add all the designs for the review. After all the designs are added, click the "Complete" button, so customer may start reviewing them.</div>
            <div styleName="complete-btn">
              <CompleteMilestoneButtonContainer
                workId={workId}
                timelineId={timelineId}
                milestoneId={milestoneId}
                onComplete={onBack}
              />
            </div>
          </div>

          {designOptions.map((design) => (
            <DesignOption
              key={design.__id}
              id={design.__id}
              defaultData={design}
              onDelete={this.deleteDesignOption}
              onSave={this.saveDesignOption}
              isUpdating={isUpdatingMilestoneInfo && processingDesignOptionId === design.__id}
              isUpdatingAnyOption={isUpdatingMilestoneInfo}
              error={error}
            />
          ))}

          {!isAddingNew && (
            <div styleName="add-design-option-wrapper">
              <button
                styleName="add-design-option-btn"
                className="tc-btn tc-btn-primary tc-btn-sm action-btn "
                onClick={this.addDesignOption}
              >
                Add design option
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

DesignWorks.propTypes = {
  isUpdatingMilestoneInfo: PT.bool.isRequired,
  error: PT.any,
  milestone: PT.object.isRequired,
  updateWorkMilestone: PT.func.isRequired,
  onBack: PT.func.isRequired,
  workId: PT.number.isRequired,
  timelineId: PT.number.isRequired,
  milestoneId: PT.number.isRequired,
}

export default withRouter(DesignWorks)
