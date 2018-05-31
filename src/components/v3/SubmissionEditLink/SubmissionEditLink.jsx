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
      URL: ''
    }
    this.changeTitle = this.changeTitle.bind(this)
    this.changeURL = this.changeURL.bind(this)
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

    let spaceTitle = ''
    let spaceURL = ''
    let spaceType = ''
    let spaceStart = ''
    let spacePlanned = ''
    let spaceActive = ''
    let spaceCompleted = ''
    let spaceSubmission = ''

    let paddingTitle = ''
    let paddingURL = ''
    let paddingType = ''
    let paddingStart = ''
    let paddingPlanned = ''
    let paddingActive = ''
    let paddingCompleted = ''
    let paddingSubmission = ''
    if (isHaveSubmissionId || isHavePlannedText || isHaveActiveText || isHaveCompletedText) {
      spaceTitle = '18px'
      spaceURL = '18px'
      spaceType = '22px'
      spaceStart = '22px'
      spacePlanned = '28px'
      spaceActive = ''
      spaceCompleted = ''
      spaceSubmission = '15px'

      paddingTitle = '60px'
      paddingURL = '60px'
      paddingType = '56px'
      paddingStart = '56px'
      paddingPlanned = '5px'
      paddingActive = ''
      paddingCompleted = ''
      paddingSubmission = '-15px'
    }

    return (
      
      <div styleName={'milestone-post-specification ' + (props.inProgress ? 'in-progress ' : '')}>
        <div styleName="label-title">{props.label}</div>
        {
          isHaveTitle && (
            <div>
              <MilestonePostEditLink paddingLeft={paddingTitle} titleSpace={spaceTitle} valueDefault={this.value.title} title={'Title'}  maxTitle={props.maxTitle} onChange={this.changeTitle}/>
            </div>
          )
        }
        {
          isHaveUrl && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink paddingLeft={paddingURL}  titleSpace={spaceURL} title={'URL'} onChange={this.changeURL}/>
            </div>
          )
        }
        {
          isHaveDate && (
            <div styleName="invoice-wrap">
              <MilestonePostEditDate paddingLeft={paddingStart} titleSpace={spaceStart} />
            </div>
          )
        }
        {
          isHaveType && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLinkDropDown paddingLeft={paddingType} titleSpace={spaceType} title={'Type'} value={'ZIP File'}/>
            </div>
          )
        }
        {
          isHaveSubmissionId && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink paddingLeft={paddingSubmission} titleSpace={spaceSubmission} title={'Submission ID'}/>
            </div>
          )
        }
        {
          isHavePlannedText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditLink paddingLeft={paddingPlanned} titleSpace={spacePlanned} title={'Planned text'}/>
            </div>
          )
        }
        {
          isHaveActiveText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditTextArea paddingLeft={paddingActive} titleSpace={spaceActive} title={'Active text'}/>
            </div>
          )
        }
        {
          isHaveCompletedText && (
            <div styleName="invoice-wrap">
              <MilestonePostEditTextArea paddingLeft={paddingCompleted} titleSpace={spaceCompleted} title={'Completed text'}/>
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
  inProgress: true
}

SubmissionEditLink.propTypes = {
  okButtonTitle: PT.string,
  callbackCancel: PT.func,
  callbackOK: PT.func,
  titleValueDefault: PT.string,
  inProgress: PT.bool
}

export default SubmissionEditLink
