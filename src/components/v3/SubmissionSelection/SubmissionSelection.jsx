import React from 'react'
import PT from 'prop-types'
import './SubmissionSelection.scss'
import MilestonePostLink from '../MilestonePostLink'
import MilestonePostSpecification from '../MilestonePostSpecification'
import SubmissionEditLink from '../SubmissionEditLink'
import MilestonePostMessage from '../MilestonePostMessage'
import ProjectProgress from '../ProjectProgress'
import MilestonePost from '../MilestonePost'


class SubmissionSelection extends React.Component {
  constructor(props) {
    super(props)

    this.checkActionHandler = this.checkActionHandler.bind(this)
    this.completeReview = this.completeReview.bind(this)
    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)
    this.addDesignLink = this.addDesignLink.bind(this)
    this.cancelAddingLink = this.cancelAddingLink.bind(this)
    this.finishAddingLink = this.finishAddingLink.bind(this)
    this.requestExtensionClicked = this.requestExtensionClicked.bind(this)
    this.requestExtensionCancel = this.requestExtensionCancel.bind(this)
    this.completeMilestoneReview = this.completeMilestoneReview.bind(this)
    this.requestExtensionOK1 = this.requestExtensionOK1.bind(this)
    this.moveToReviewingState = this.moveToReviewingState.bind(this)

    const contentListItems = this.props.postContent ? this.props.postContent.submissions.slice(0) : []
    this.state = {
      selectedItemCount: 0,
      showWarning: false,
      contentList: contentListItems,
      selectedItems: [],
      rejectedItems: [],
      isWillReview: false,
      isReviewed: false,
      isAddingNewLink: false,
      isShowRequestingMessage1: false,
      isShowRequestingMessage2: false,
      isFinishMilestoneReview: false
    }
  }

  /**
   * This function gets triggered when the checked state of checkboxes change
   */
  checkActionHandler(isChecked, index) {
    const contentListItems = this.state.contentList
    const selectedItems = []
    const rejectedItems = []
    index > -1 ? contentListItems[index].isSelected = isChecked : ''
    contentListItems.map((item, i) => {
      if (i === index) {
        item.isSelected = isChecked
      }
      const isSelected = item.isSelected
      isSelected
        ? selectedItems.push(item)
        : rejectedItems.push(item)
    })
    this.setState({
      selectedItemCount: selectedItems.length,
      showWarning: selectedItems.length < 5 && selectedItems.length > 0,
      isRejectedExpanded: false,
      contentList: contentListItems,
      selectedItems,
      rejectedItems
    })
  }

  /**
   * complete review actions
   */
  completeReview() {
    if (this.state.selectedItemCount >= 5) {
      this.setState({
        isReviewed: true
      })
    }
  }

  componentWillMount() {
    this.checkActionHandler()
  }

  /**
   * toggles open closed states of rejected section
   */
  toggleRejectedSection() {
    this.setState({
      isRejectedExpanded: !this.state.isRejectedExpanded
    })
  }

  /**
   * add design link
   */
  addDesignLink() {
    const isAddingNewLink = true
    this.setState({isAddingNewLink})
  }

  /**
   * cancel adding link
   */
  cancelAddingLink() {
    const isAddingNewLink = false
    this.setState({isAddingNewLink})
  }

  /**
   * button request extension clicked
   */
  requestExtensionClicked() {
    this.setState({isShowRequestingMessage1: true})
  }

  /**
   * button cancel request extension clicked
   */
  requestExtensionCancel() {
    this.setState({
      isShowRequestingMessage1: false,
      isShowRequestingMessage2: false})
  }

  /**
   * button cancel request extension clicked
   */
  requestExtensionOK1() {
    this.setState({
      isShowRequestingMessage1: false,
      isShowRequestingMessage2: true})
  }

  /** call if adding link and there is no links yet */
  finishAddingLink(value) {
    const contentList = this.state.contentList
    contentList.push({
      label: value.title,
      link: value.URL,
      linkType: 'timeline-marvelapp',
      type: 'submission-selection-entry',
      isSelected: false
    })
    this.cancelAddingLink()
    this.setState({contentList})
  }

  /**complete milestone review */
  completeMilestoneReview() {
    this.props.finish()
    const isFinishMilestoneReview = true
    this.setState({isFinishMilestoneReview})
  }

  /**
   * move to reviewing state
   */
  moveToReviewingState() {
    this.setState({isWillReview: true})
  }

  render() {
    const props = this.props
    const postContent = this.props.postContent
    const trueValue = true
    return (
      <div styleName={'milestone-post-specification '
        + (props.theme ? props.theme : '')
        + (props.isCompleted ? ' completed ' : '')
        + (props.inProgress ? 'in-progress ' : '')
      }
      >

        {this.state.isWillReview && (<span styleName="dot" />)}

        {!this.state.isWillReview &&  (
          <div styleName={'seperation-sm ' 
          + (this.state.isWillReview ? 'hide-progress-bar' : '')}
          >
            <ProjectProgress labelDayStatus={'6 days until designs are completed'} progressPercent="12" theme={'light'}
              isCompleted={props.isCompleted} inProgress={props.inProgress} readyForReview={trueValue} isHaveDot={!this.state.isWillReview} finish={this.moveToReviewingState}
            />
          </div>)}

        <div styleName={this.state.isReviewed ? 'hide' : 'show'}>
          {/* all items list for section */}
          {this.state.isWillReview && (<header styleName="milestone-heading">
            {postContent.checkpointHeading}
          </header>)}
          {
            this.state.contentList && this.state.contentList.length > 0 && this.state.contentList.map((content, i) => {
              return (
                <div styleName="content-link-wrap seperation-sm" key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostLink label={content.label} link={content.link} icon={content.linkType} index={i} checkActionHandler={this.checkActionHandler} isHideCheckBox={!this.state.isWillReview}/>
                    </div>)
                  }
                </div>
              )
            })
          }

          {this.state.isAddingNewLink && (<div styleName="seperation-sm">
            <SubmissionEditLink label={'New design link'} maxTitle={64} titleValueDefault={`Design ${this.state.contentList.length+1}`} isHaveTitle={trueValue} isHaveUrl={trueValue} okButtonTitle={'Add link'} callbackCancel={this.cancelAddingLink} callbackOK={this.finishAddingLink}/>
          </div>
          )}

          {!this.state.isAddingNewLink && !props.isCompleted && (
            <div styleName="seperation-sm">
              <MilestonePostSpecification label={'Add a design link'} fakeName={`Design ${this.state.contentList.length+1}`} onClick={this.addDesignLink} />
            </div>
          )}

          {this.state.isShowRequestingMessage1 && (
            <div styleName="seperation-sm">
              <MilestonePostMessage label={'Milestone extension request'} backgroundColor={'#FFF4F4'} message={'Be careful, requesting extensions will change the project overall milestone. Proceed with caution and only if there are not enough submissions to satisfy our delivery policy.'} isShowSelection={trueValue} button1Title={'Cancel'} button2Title={'Request extension'} cancelCallback={this.requestExtensionCancel} warningCallBack={this.requestExtensionOK1}/>
            </div>
          )}
        
          {this.state.isShowRequestingMessage2 && (
            <div styleName="seperation-sm">
              <MilestonePostMessage label={'Milestone extension requested'} backgroundColor={'#CEE6FF'} message={'Due to unusually high load on our network we had less than the minimum number or design submissions. In order to provide you with the appropriate number of design options we’ll have to extend the milestone with 48h. This time would be enough to increase the capacity and make sure your project is successful.<br /><br />Please make a decision in the next 24h. After that we will automatically extend the project to make sure we deliver success to you.'} isShowSelection={false} button2Title={'Decline extension'} button3Title={'Approve extension'} warningCallBack={this.requestExtensionCancel} okCallback={this.requestExtensionCancel}/>
            </div>
          )}
          

          {this.state.showWarning && (
            <div styleName="message-bar hide-progress-bar" className="flex center">
              <i>Please select all 5 designs to complete the review</i>
            </div>
          )}
          { !props.isCompleted && (
            <div styleName="action-bar hide-progress-bar" className="flex center">
              {(
                <button styleName={'tc-btn ' + (this.state.selectedItemCount < 5 ? 'disable ': '')} className={'tc-btn tc-btn-primary'} onClick={this.completeReview} >Complete review (48h remaining)</button>
              )}
              {!this.state.isShowRequestingMessage1 && !this.state.isShowRequestingMessage2 && (
                <button styleName="tc-btn" className={'tc-btn tc-btn-warning'} onClick={this.requestExtensionClicked} >Request Extension</button>
              )}
            </div>
          )}
        </div>


        <div styleName={this.state.isReviewed ? 'show' : 'hide'}>
          {/* selected item list */}
          <header styleName={'milestone-heading selected-theme'}>
            {postContent.selectedHeading}
          </header>
          {
            this.state.selectedItems && this.state.selectedItems.length > 0 && this.state.selectedItems.map((content, i) => {
              return (
                <div styleName="content-link-wrap seperation-sm" key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostLink label={content.label} link={content.link}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        icon={content.linkType}
                        index={i}
                        isReadonly
                        isSelected={content.isSelected}
                      />
                    </div>)
                  }
                </div>
              )
            })
          }

          {/* rejected item list */}
          <header styleName={'milestone-heading rejected-theme sepeartion-md  no-line ' + (this.state.isRejectedExpanded ? 'open' : 'close')}
            onClick={this.toggleRejectedSection}
          >
            {postContent.rejectedHeading}
          </header>
          {
            this.state.rejectedItems && this.state.rejectedItems.length > 0 && this.state.rejectedItems.map((content, i) => {
              return (
                <div styleName={'content-link-wrap seperation-sm ' + (this.state.isRejectedExpanded ? 'open' : 'close') } key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostLink label={content.label} link={content.link}
                        icon={content.linkType}
                        isSelected={content.isSelected}
                        index={i}
                        isReadonly
                      />
                    </div>)
                  }
                </div>
              )
            })
          }
        </div>
        
        {this.state.isReviewed && !this.state.isFinishMilestoneReview && (
          <div styleName="seperation-sm">
            <MilestonePostMessage label={'Complete milestone review'} backgroundColor={'#FFF4F4'} message={'Warning! Complete the review only if you have the permission from the customer. We do not want to close the review early without the ability to get feedback from our customers and let them select the winning 5 designs for next round.'} isShowSelection={false} button1Title={'Cancel'} button2Title={'Complete review'} cancelCallback={this.completeMilestoneReview} warningCallBack={this.completeMilestoneReview}/>
          </div>
        )}
        
        {props.isCompleted && (<div styleName="seperation-sm">
          <MilestonePost label={'All design source files (567MB .zip)'} milestonePostFile={'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas'} isCompleted={props.isCompleted} inProgress={props.inProgress} milestoneType={'download'}/>
        </div>)}

      </div>
    )
  }
}

SubmissionSelection.defaultProps = {
  finish: () => {},
}

SubmissionSelection.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  finish: PT.func
}

export default SubmissionSelection
