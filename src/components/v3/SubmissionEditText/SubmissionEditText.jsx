import React from 'react'
import PT from 'prop-types'
import './SubmissionEditText.scss'
import MilestonePostEditText from '../MilestonePostEditText'
import MilestonePostMessage from '../MilestonePostMessage'
import MilestonePost from '../MilestonePost'

import Modal from 'react-modal'

class SubmissionEditText extends React.Component {
  constructor(props) {
    super(props)

    this.addActionHandler = this.addActionHandler.bind(this)
    this.removeActionHandler = this.removeActionHandler.bind(this)
    this.cancelRequestFixes = this.cancelRequestFixes.bind(this)
    this.updateContent = this.updateContent.bind(this)
    this.sumitRequestFixes = this.sumitRequestFixes.bind(this)
    this.requestFix = this.requestFix.bind(this)
    this.acceptDesign = this.acceptDesign.bind(this)
    this.cancelAcceptDesign = this.cancelAcceptDesign.bind(this)
    this.confirmedAcceptDesign = this.confirmedAcceptDesign.bind(this)
    this.state = {
      contentList: [],
      addingContent: '',
      isRequestFixes: false,
      showPopupAcceptDesign: false,
      inProgress: props.inProgress,
      isCompleted: props.isCompleted

    }
  }

  /**
   * This function gets triggered when click to add button
   */
  addActionHandler() {
    const contentList = this.state.contentList
    contentList.push({content: '' || '', autoHeight: 0})
    this.setState({contentList})
  }

  /**
   * This function gets triggered when click to remove button
   */
  removeActionHandler(content, index) {
    const contentList = this.state.contentList
    contentList.splice(index, 1)
    this.setState({contentList})
  }

  /**
   * This function gets triggered when click to cancel button
   */
  cancelRequestFixes() {
    const contentList = []
    this.setState({contentList})
    this.setState({isRequestFixes: false})
  }

  /**
   * This function gets triggered when edit text ox
   */
  updateContent(content, index, autoHeight) {
    const contentList = this.state.contentList
    contentList[index].content = content
    contentList[index].autoHeight = autoHeight
    this.setState({contentList})
  }

  sumitRequestFixes() {
    this.setState({isRequestFixes: false})
    const props = this.props
    props.isSubmitted()
  }

  requestFix() {
    this.setState({isRequestFixes: true})
  }

  acceptDesign() {
    this.setState({showPopupAcceptDesign: true})
  }

  cancelAcceptDesign() {
    this.setState({showPopupAcceptDesign: false})
  }

  confirmedAcceptDesign() {
    this.cancelAcceptDesign()
    this.setState({
      inProgress: false,
      isCompleted: true
    })
    this.props.finish()
  }

  render() {
    const props = this.props
    // const postContent = this.props.postContent
    const trueValue = true
    
    return (
      <div styleName={'milestone-post-specification '
      + (props.theme ? props.theme : '')
      + (this.state.inProgress ? 'in-progress ' : '')}
      >
        <MilestonePostMessage label={'Design acceptance'} backgroundColor={'#CEE6FF'}
          isCompleted={false} inProgress={false} message={'Do you need any refinement on winner’s design before we deliver you the final source files? Some refinement or final fixes outside the projet scope may cost you additional payment'} isShowSelection={false} cancelCallback={this.requestFix} okCallback={this.acceptDesign} button1Title={!this.state.isRequestFixes && !this.state.isCompleted ? 'Request fixes' : ''} button3Title={!this.state.isCompleted ? 'Accept design' : ''}
        />
        {(
          <div>
            {
              this.state.contentList && this.state.contentList.length > 0 && this.state.contentList.map((contentObj, i) => {
                return ((!this.state.isRequestFixes && contentObj.content !== '') || this.state.isRequestFixes) && (
                  <div>
                    <div styleName="invoice-wrap">
                      <MilestonePostEditText update={this.updateContent} action={this.removeActionHandler} index={i} content={contentObj.content} autoHeight={contentObj.autoHeight} isComplete={!this.state.isRequestFixes} isAutoExpand={trueValue}/>
                    </div>
                  </div>
                )
              })
            }
            {
              this.state.isRequestFixes && (
                <div>
                  <div styleName="invoice-wrap">
                    <MilestonePostEditText action={this.addActionHandler} isAdd={trueValue} isAutoExpand={trueValue}/>
                  </div>
                </div>
              )
            }
            {
              this.state.isRequestFixes && (
                <div styleName="group-bottom">
                  <button onClick={this.cancelRequestFixes} className="tc-btn tc-btn-default"><strong>{'Cancel'}</strong></button>
                  <button onClick={this.sumitRequestFixes} className="tc-btn tc-btn-primary"><strong>{'Submit request'}</strong></button>
                </div>
              )
            }
          </div>
        )}

        {props.isCompleted && (<div styleName="invoice-wrap">
          <MilestonePost label={'All design source files (567MB .zip)'} milestonePostFile={'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas'} isCompleted={props.isCompleted} inProgress={props.inProgress} milestoneType={'download'}/>
        </div>)}

        <Modal
          isOpen={this.state.showPopupAcceptDesign}
          className="delete-post-dialog"
          overlayClassName="delete-post-dialog-overlay"
          onRequestClose={ this.cancelDelete }
          contentLabel=""
        >
          <div style={ {textAlign: 'center', marginTop:'-20px'}} className="modal-title">{'Design phase competition'}</div>
          <div className="modal-body">{'This selection is final and cannot be undone. Once you confirm your selection we will close the design phase and can proceed to the next one. Clicking on the Confirm selection button would make the source files available for download.'}</div>
          <div style={ {marginTop:'25px', marginBottom:'-20px'}}  className="button-area flex center action-area">
            <button style={{whiteSpace: 'nowrap'}} onClick={this.cancelAcceptDesign} className="tc-btn tc-btn-default action-btn btn-cancel">{'Cancel'}</button>
            <button style={{whiteSpace: 'nowrap'}} onClick={this.confirmedAcceptDesign} className="tc-btn tc-btn-primary action-btn ">{'Confirm selection'}</button>
          </div>
        </Modal>

      </div>
    )
  }
}

SubmissionEditText.defaultProps = {
  isSubmitted: () => {},
  inProgress: true,
  isCompleted: false,
  finish: () => {}
}

SubmissionEditText.propTypes = {
  isSubmitted: PT.func,
  inProgress: PT.bool,
  isCompleted: PT.bool,
  finish: PT.func
}

export default SubmissionEditText
