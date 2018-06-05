import React from 'react'
import PT from 'prop-types'
import './SubmissionEditLink.scss'
import MilestonePostEditLink from '../MilestonePostEditLink'
import MilestonePostEditLinkDropDown from '../MilestonePostEditLinkDropDown'
import MilestonePostEditDate from '../MilestonePostEditDate'
import MilestonePostEditTextArea from '../MilestonePostEditTextArea'

/**use for create custom form */
class SubmissionEditLink extends React.Component {
  constructor(props) {
    super(props)
    this.value = {
      title: props.titleValueDefault,
      URL: props.urlValueDefault,
      type: 'ZIP FILE',
      plannedText: ''
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.changeURL = this.changeURL.bind(this)
    this.changeType = this.changeType.bind(this)
    this.changePlannedText = this.changePlannedText.bind(this)
    
    this.okBtnClicked = this.okBtnClicked.bind(this)
  }
  /**event when change title input */
  changeTitle(value) {
    this.value.title = value
  }
  /**event when change url input */
  changeURL(value) {
    this.value.URL = value
  }
  /**event when change type input */
  changeType(value) {
    this.value.type = value
  }
  /**event when change planned text input */
  changePlannedText(value) {
    this.value.plannedText = value
  }
  /**finish form */
  okBtnClicked() {
    this.props.callbackOK(this.value)
  }

  render() {
    const props = this.props
    const okButtonTitle = props.okButtonTitle
    const isHaveTitle = props.isHaveTitle ? props.isHaveTitle : false
    const isHaveDate = props.isHaveDate ? props.isHaveDate : false
    const isHaveUrl = props.isHaveUrl ? props.isHaveUrl : false
    const isHaveType = props.isHaveType ? props.isHaveType : false
    const isHaveSubmissionId = props.isHaveSubmissionId ? props.isHaveSubmissionId : false
    const isHavePlannedText = props.isHavePlannedText ? props.isHavePlannedText : false
    const isHaveActiveText = props.isHaveActiveText ? props.isHaveActiveText : false
    const isHaveCompletedText = props.isHaveCompletedText ? props.isHaveCompletedText : false

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
              <MilestonePostEditLink titleExtraStyle={titleExtraStyleTitle} valueDefault={this.value.title} title={'Title'}  maxTitle={props.maxTitle} onChange={this.changeTitle}/>
            </div>
          )
        }
        {
          isHaveUrl && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink titleExtraStyle={titleExtraStyleURL} valueDefault={this.value.URL} title={'URL'} onChange={this.changeURL}/>
            </div>
          )
        }
        {
          isHaveDate && (
            <div styleName="invoice-wrap">
              <MilestonePostEditDate titleExtraStyle={titleExtraStyleStart} />
            </div>
          )
        }
        {
          isHaveType && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLinkDropDown titleExtraStyle={titleExtraStyleType} title={'Type'} value={this.value.type} onChange={this.changeType}/>
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
          isHavePlannedText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink titleExtraStyle={titleExtraStylePlannedText} title={'Planned text'} onChange={this.changePlannedText}/>
            </div>
          )
        }
        {
          isHaveActiveText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditTextArea title={'Active text'}/>
            </div>
          )
        }
        {
          isHaveCompletedText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditTextArea title={'Completed text'}/>
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
