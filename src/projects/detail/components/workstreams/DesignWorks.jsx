/**
 * DesignWorks section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import DesignOption from './DesignOption'
import BackIcon from '../../../../assets/icons/arrows-16px-1_tail-left.svg'
import CloseIcon from '../../../../assets/icons/x-mark-black.svg'
import './DesignWork.scss'

class DesignWorks extends React.Component {
  constructor(props) {
    super(props)
    const { milestone } = props
    const { details } = milestone || {}
    const { content } = details || {}
    const { designs = [] } = content || {}
    this.state = {
      designOptions: [...designs]
    }

    this.addDesignOption = this.addDesignOption.bind(this)
    this.deleteDesignOption = this.deleteDesignOption.bind(this)
    this.updateField = this.updateField.bind(this)
    this.submitForm = this.submitForm.bind(this)
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
    this.setState((prevState) => ({
      designOptions: [
        ...prevState.designOptions,
        {
          title: '',
          submissionId: '',
          previewUrl: '',
          links: []
        }
      ]
    }))
  }

  /**
   * Delete Design Option
   */
  deleteDesignOption(index) {
    this.setState((prevState) => ({
      designOptions: _.filter(prevState.designOptions, (designOption, order) => {
        return order !== index
      })
    }))
  }

  updateField(index, field, value) {
    this.setState((prevState) => {
      prevState.designOptions[index][field] = value
      return ({
        designOptions: prevState.designOptions
      })
    })
  }

  submitForm(data) {
    const { milestone, updateWorkMilestone, work, timelineId, milestoneId } = this.props
    const { details } = milestone || {}
    const { content } = details || {}
    const { designs = [] } = content || {}

    const existDesignIndex = _.findIndex(designs, { submissionId: data.submissionId })
    if (existDesignIndex >= 0) {
      designs[existDesignIndex] = {
        ...designs[existDesignIndex],
        ...data
      }
    } else {
      designs.push(data)
    }
    let newMilestone = {
      ...milestone,
      details: {
        ...details,
        content: {
          ...content,
          designs
        }
      }
    }

    newMilestone = _.omit(newMilestone, ['startDate', 'endDate', 'timelineId', 'statusHistory'])
    updateWorkMilestone(work.id, timelineId, milestoneId, newMilestone)
  }

  render() {
    const { onBack } = this.props
    const { designOptions } = this.state

    return (
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
          <button styleName="complete-btn" className="tc-btn tc-btn-warning tc-btn-sm action-btn " onClick={() => {}}>Complete</button>
        </div>
        {
          !_.isEmpty(designOptions) &&
          designOptions.map((design, index) => {
            return (
              <DesignOption
                key={index}
                index={index}
                content={design}
                onDeleteOption={this.deleteDesignOption}
                onUpdateField={this.updateField}
                onSubmitForm={this.submitForm}
              />
            )
          })
        }
        <div styleName="add-design-option-wrapper">
          <button styleName="add-design-option-btn" className="tc-btn tc-btn-primary tc-btn-sm action-btn " onClick={this.addDesignOption}>Add design option</button>
        </div>
      </div>
    )
  }
}

DesignWorks.propTypes = {
  onBack: PT.func,
  milestone: PT.object,
  updateWorkMilestone: PT.func
}

export default withRouter(DesignWorks)
