import React from 'react'
import PT from 'prop-types'
import './Specification.scss'
import SubmissionEditLink from '../SubmissionEditLink'
import MilestonePost from '../MilestonePost'

class Specification extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      milestonePostLink: '',
      isShowEditText: false
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.closeEditUrl = this.closeEditUrl.bind(this)
    this.addUrl = this.addUrl.bind(this)
    this.resetUrl = this.resetUrl.bind(this)
    this.isNoContent = this.isNoContent.bind(this)
    this.onComplete = this.onComplete.bind(this)
    this.isEmpty = this.isEmpty.bind(this)
  }
  /**close edit ui */
  closeEditUrl() {
    this.setState({isShowEditText: false})
  }
  /**update link */
  updatedUrl(value) {
    this.closeEditUrl()
    if (value.URL) {
      this.setState({milestonePostLink: value.URL})
    }
  }
  /**add link to this */
  addUrl() {
    this.setState({isShowEditText: true})
  }
  /**reset the link */
  resetUrl() {
    this.setState({milestonePostLink: ''})
  }
  /**link is empty */
  isEmpty() {
    return this.state.milestonePostLink === ''
  }
  /**is no section in ui */
  isNoContent() {
    return this.state.milestonePostLink === '' && !this.state.isShowEditText
  }
  /**finish specification form */
  onComplete() {
    this.closeEditUrl()
    this.props.finish()
  }

  render() {
    const props = this.props
    const trueValue = true
    return (
      <div styleName={'milestone-post ' 
      + (props.theme ? props.theme : '')
      + (props.isCompleted ? 'completed ' : '')
      + ((props.inProgress && this.isNoContent()) ? 'in-progress-hide ' : '')
      + (props.inProgress  ? 'in-progress ' : '')
      }
      >
        {
          props.inProgress !== null && props.inProgress !== undefined && !this.isNoContent() && (
            <span styleName="dot">{ props.inProgress}</span>
          )
        }

        {this.state.milestonePostLink === '' && !this.state.isShowEditText && (<div styleName="top-space button-add-layer">
          <button className="tc-btn tc-btn-default tc-btn-sm action-btn" onClick={this.addUrl}>{'Add specification document link'}</button>
        </div>)}

        {this.state.milestonePostLink !== '' && (
          <MilestonePost isHideDot={trueValue} milestonePostLink={this.state.milestonePostLink} isCompleted={props.isCompleted} inProgress={props.inProgress} milestoneType={'specification'} deletePost={this.resetUrl} />
        )}

        {this.state.isShowEditText && (<div styleName="top-space">
          <SubmissionEditLink callbackCancel={this.closeEditUrl} callbackOK={this.updatedUrl} label={'Specification document link'} isHaveUrl={trueValue} inProgress={false} okButtonTitle={this.isEmpty() ? 'Add link' : 'Save changes'} />
        </div>)}

        {this.state.milestonePostLink !== '' && !props.isCompleted && (<div styleName="top-space button-layer">
          <button className="tc-btn tc-btn-primary tc-btn-sm action-btn" onClick={this.onComplete}>{props.buttonFinishTitle}</button>
        </div>)}

      </div>
    )
  }
}

Specification.defaultProps = {
  finish: () => {},
  buttonFinishTitle: 'Mark as completed'
}

Specification.propTypes = {
  isCompleted: PT.bool,
  inProgress: PT.bool,
  finish: PT.func,
  buttonFinishTitle: PT.string
}

export default Specification
