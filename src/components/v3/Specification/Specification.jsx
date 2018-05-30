import React from 'react'
import PT from 'prop-types'
import './Specification.scss'
import SubmissionEditLink from '../SubmissionEditLink' 

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

  closeEditUrl() {
    this.setState({isShowEditText: false})
  }

  updatedUrl(value) {
    this.closeEditUrl()
    if (value.URL) {
      this.setState({milestonePostLink: value.URL})
    }
  }

  addUrl() {
    this.setState({isShowEditText: true})
  }

  resetUrl() {
    this.setState({milestonePostLink: ''})
  }
  
  isEmpty() {
    return this.state.milestonePostLink === ''
  }
  
  isNoContent() {
    return this.state.milestonePostLink === '' && !this.state.isShowEditText
  }
  
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

        {this.state.milestonePostLink !== '' && (<div styleName="label-layer">
          <span styleName={ 'label-specification span-one' }>{'Specification'}</span>
          <div styleName="group-right hide-sm">
            <a href={this.state.milestonePostLink} styleName="milestone-text" dangerouslySetInnerHTML={{ __html: this.state.milestonePostLink }} />
          </div>
          <span onClick={this.addUrl} styleName={ 'label-specification span-two' } />
          <span onClick={this.resetUrl} styleName={ 'label-specification span-three' } />
        </div>)}

        {this.state.isShowEditText && (<div styleName="top-space">
          <SubmissionEditLink callbackCancel={this.closeEditUrl} callbackOK={this.updatedUrl} label={'Edit specification document link'} isHaveUrl={trueValue} inProgress={false} okButtonTitle={this.isEmpty() ? 'Add link' : 'Save changes'}/>
        </div>)}

        {this.state.milestonePostLink !== '' && !props.isCompleted && (<div styleName="top-space button-layer">
          <button className="tc-btn tc-btn-primary tc-btn-sm action-btn" onClick={this.onComplete}>{'Mark as completed'}</button>
        </div>)}

      </div>
    )
  }
}

Specification.defaultProp = {
  finish: () => {}
}

Specification.propTypes = {
  isCompleted: PT.bool,
  inProgress: PT.bool,
  finish: PT.func
}

export default Specification
