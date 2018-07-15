import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import MilestonePostEditLink from '../MilestonePostEditLink'
import MilestonePostEditLinkDropDown from '../MilestonePostEditLinkDropDown'
import MilestonePostEditDate from '../MilestonePostEditDate'
import MilestonePostEditTextArea from '../MilestonePostEditTextArea'

import './SubmissionEditLink.scss'

/**use for create custom form */
class SubmissionEditLink extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      values: props.defaultValues,
    }

    // create handler for each value
    // instead of using `(value) => this.onValueChange(key, value)` in render() function
    // to avoid recreating functions on each render during typing
    this.handlers = {}
    _.keys(props.defaultValues).forEach((key) => {
      this.handlers[key] = this.onValueChange.bind(this, key)
    })

    this.okBtnClicked = this.okBtnClicked.bind(this)
  }

  /** finish form */
  okBtnClicked() {
    this.props.callbackOK(this.state.values)
  }

  /** some value is changed */
  onValueChange(key, value) {
    this.setState({
      values: {
        ...this.state.values,
        [key]: value,
      }
    })
  }

  render() {
    const { defaultValues } = this.props
    const { values } = this.state
    const props = this.props
    const okButtonTitle = props.okButtonTitle
    const isHaveTitle = defaultValues && defaultValues.hasOwnProperty('title')
    const isHaveDate = defaultValues && defaultValues.hasOwnProperty('startDate') || defaultValues && defaultValues.hasOwnProperty('endDate')
    const isHaveUrl = defaultValues && defaultValues.hasOwnProperty('url')
    const isHaveType = props.isHaveType ? props.isHaveType : false
    const isHaveSubmissionId = props.isHaveSubmissionId ? props.isHaveSubmissionId : false
    const isHavePlannedText = defaultValues && defaultValues.hasOwnProperty('plannedText')
    const isHaveActiveText = defaultValues && defaultValues.hasOwnProperty('activeText')
    const isHaveBlockedText = defaultValues && defaultValues.hasOwnProperty('blockedText')
    const isHaveCompletedText = defaultValues && defaultValues.hasOwnProperty('completedText')

    let titleExtraStyleTitle = ''
    let titleExtraStyleURL = ''
    let titleExtraStyleType = ''
    let titleExtraStyleStart = ''
    let titleExtraStylePlannedText = ''
    let titleExtraStyleSumissionId = ''

    if (isHaveSubmissionId || isHavePlannedText || isHaveActiveText || isHaveCompletedText) {
      titleExtraStyleTitle = 'pos_18_60'
      titleExtraStyleURL = 'pos_18_60'
      titleExtraStyleType = 'pos_22_56'
      titleExtraStyleStart = 'pos_22_56'
      titleExtraStylePlannedText = 'pos_28_5'
      titleExtraStyleSumissionId = 'pos_20_-15'
    }

    return (

      <div styleName={'milestone-post-specification ' + (props.inProgress ? 'in-progress ' : '')}>
        <div styleName="label-title">{props.label}</div>
        {
          isHaveTitle && (
            <div>
              <MilestonePostEditLink
                titleExtraStyle={titleExtraStyleTitle}
                valueDefault={values.title}
                title={'Title'}
                maxTitle={props.maxTitle}
                onChange={this.handlers.title}
              />
            </div>
          )
        }
        {
          isHaveUrl && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink
                titleExtraStyle={titleExtraStyleURL}
                valueDefault={values.url}
                title={'URL'}
                onChange={this.handlers.url}
              />
            </div>
          )
        }
        {
          isHaveDate && (
            <div styleName="invoice-wrap">
              <MilestonePostEditDate
                titleExtraStyle={titleExtraStyleStart}
                startDateValueDefault={values.startDate}
                endDateValueDefault={values.endDate}
                onStartDateChange={this.handlers.startDate}
                onEndDateChange={this.handlers.endDate}
              />
            </div>
          )
        }
        {
          isHaveType && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLinkDropDown titleExtraStyle={titleExtraStyleType} title={'Type'} value={this.state.type} onChange={this.changeType}/>
            </div>
          )
        }
        {
          isHaveSubmissionId && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink titleExtraStyle={titleExtraStyleSumissionId} title={'Submission ID'}/>
            </div>
          )
        }
        {
          isHavePlannedText &&  (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink
                title={'Planned text'}
                titleExtraStyle={titleExtraStylePlannedText}
                onChange={this.handlers.plannedText}
                valueDefault={values.plannedText}
              />
            </div>
          )
        }
        {
          isHaveActiveText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditTextArea
                title={'Active text'}
                onChange={this.handlers.activeText}
                valueDefault={values.activeText}
              />
            </div>
          )
        }
        {
          isHaveBlockedText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditTextArea
                title={'Blocked text'}
                onChange={this.handlers.blockedText}
                valueDefault={values.blockedText}
              />
            </div>
          )
        }
        {
          isHaveCompletedText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditTextArea
                title={'Completed text'}
                onChange={this.handlers.completedText}
                valueDefault={values.completedText}
              />
            </div>
          )
        }
        <div styleName="group-bottom">
          <button onClick={props.callbackCancel} className="tc-btn tc-btn-default"><strong>{'Cancel'}</strong></button>
          <button onClick={this.okBtnClicked} className="tc-btn tc-btn-primary"><strong>{okButtonTitle}</strong></button>
        </div>
      </div>
    )
  }
}

SubmissionEditLink.defaultProps = {
  okButtonTitle: 'Ok',
  callbackCancel: () => {},
  callbackOK: () => {},
  titleValueDefault: '',
  inProgress: true,
  urlValueDefault: '',
  maxTitle: 0
}

SubmissionEditLink.propTypes = {
  okButtonTitle: PT.string,
  callbackCancel: PT.func,
  callbackOK: PT.func,
  titleValueDefault: PT.string,
  inProgress: PT.bool,
  urlValueDefault: PT.string,
  maxTitle: PT.number
}

export default SubmissionEditLink
