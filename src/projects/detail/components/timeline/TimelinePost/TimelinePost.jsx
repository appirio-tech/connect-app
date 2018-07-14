import React from 'react'

import LoadingIndicator from '../../../../../components/LoadingIndicator/LoadingIndicator'
import ProjectProgress from '../../ProjectProgress'
import MilestonePost from '../MilestonePost'
import MilestonePostMessage from '../MilestonePostMessage'
import MilestonePostSpecification from '../MilestonePostSpecification'
import SubmissionSelection from '../SubmissionSelection'
import SubmissionEditLink from '../SubmissionEditLink'
import SubmissionEditText from '../SubmissionEditText'
import WinnerSelection from '../WinnerSelection'
import Specification from '../Specification'

import PT from 'prop-types'
import './TimelinePost.scss'

class TimelinePost extends React.Component {
  constructor(props) {
    super(props)

    this.deletePost = this.deletePost.bind(this)
    this.hoverHeader = this.hoverHeader.bind(this)
    this.unHoverHeader = this.unHoverHeader.bind(this)
    this.toggleEditLink = this.toggleEditLink.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.updateMilestoneWithData = this.updateMilestoneWithData.bind(this)

    const { postContent } = this.props
    this.state = {
      activeMenu: '',
      isHoverHeader: false,
      isEditing: false,
      title: postContent.title,
      postMsg: postContent.postMsg
    }
  }

  componentDidMount() {
    const { postContent } = this.props
    const contentList = postContent.content || []
    this.setState(contentList)
    !!this.props.navLinks && this.props.navLinks.map((item) => {
      item.isActive && this.setState({ activeMenu: item.id })
    })
  }

  componentWillReceiveProps(nextProps) {
    const { isUpdating } = this.props
    const { isEditing } = this.state

    if (isEditing && isUpdating && !nextProps.isUpdating && !nextProps.error) {
      this.closeEditForm()
    }
  }

  deletePost(index) {
    const contentList = this.state.contentList
    contentList.splice(index, 1)
    this.setState(contentList)
  }

  hoverHeader() {
    this.setState({isHoverHeader: true})
  }

  unHoverHeader() {
    this.setState({isHoverHeader: false})
  }

  toggleEditLink() {
    this.setState({isEditing: true})
  }

  closeEditForm() {
    this.setState({isEditing: false})
  }

  updateMilestoneWithData(values) {
    const { milestoneId, updateMilestone } = this.props
    updateMilestone(milestoneId, values)
  }

  render() {
    const { postContent, editableData, isUpdating } = this.props
    let contentList = []
    contentList = this.state.contentList ? this.state.contentList : postContent.content || []
    const trueValue = true
    return (
      <div styleName={'timeline-post '}>
        {(<div styleName={'background ' + ((this.state.isHoverHeader && !this.state.isEditing) ? 'hover ': '')} />)}
        <div styleName="col-date">
          <div styleName="month">{postContent.month}</div>
          <div styleName="day">{postContent.date}</div>
        </div>
        <div styleName={'col-timeline-post-con '
          + (postContent.isCompleted ? 'completed ' : '')
          + (postContent.inProgress ? 'in-progress ' : '')
        }
        >
          <i styleName={'status-ring'} />
          {!this.state.isEditing && (<dir onMouseEnter={this.hoverHeader} onMouseLeave={this.unHoverHeader} styleName="post-title-container">
            <h4 styleName="post-title" dangerouslySetInnerHTML={{ __html: this.state.title }} />
            {this.state.isHoverHeader && (
              <div onClick={this.toggleEditLink} styleName={ 'post-edit' } >
                <span styleName="tooltiptext">Edit milestone properties</span>
              </div>)}
          </dir>)}

          {this.state.isEditing && !isUpdating && (
            <SubmissionEditLink
              callbackCancel={this.closeEditForm}
              callbackOK={this.updateMilestoneWithData}
              label={'Milestone Properties'}
              defaultValues={editableData}
              inProgress={trueValue}
              okButtonTitle={'Update milestone'}
            />
          )}

          {isUpdating && <LoadingIndicator />}

          {(<div styleName={'post-con ' + (this.state.isEditing ? 'isHide' : '')} dangerouslySetInnerHTML={{ __html: this.state.postMsg }} />)}
          {
            !!contentList && contentList.map((content, i) => {

              return (
                <div styleName={(this.state.isEditing ? 'isHide' : '')} key={i}>

                  {/* milestone progressbar type content  */}
                  {!!content && !!content.type && content.type === 'progressBar' &&
                    (<div styleName="progress-wrap">
                      <ProjectProgress labelDayStatus={content.label} progressPercent="12" theme={content.theme}
                        isCompleted={content.isCompleted} inProgress={content.inProgress} readyForReview={content.readyForReview}
                      />
                    </div>)
                  }

                  {/* milestone invoice type content  */}
                  {!!content && !!content.type && content.type === 'invoice' &&
                    (<div styleName="invoice-wrap">
                      <MilestonePost label={content.label} milestonePostLink={content.mileStoneLink} isCompleted={content.isCompleted} inProgress={content.inProgress} image={content.image} milestoneType={'only-text'} deletePost={() => {this.deletePost(i)}}/>
                    </div>)
                  }

                  {/* Specification type content  */}
                  {!!content && !!content.type && content.type === 'specification' &&
                    (<div styleName="invoice-wrap">
                      <Specification isCompleted={content.isCompleted} inProgress={content.inProgress} finish={this.props.finish} buttonFinishTitle={content.buttonFinishTitle}/>
                    </div>)
                  }

                  {/* Specification cell type content  */}
                  {!!content && !!content.type && content.type === 'specification-cell' &&
                    (<div styleName="invoice-wrap">
                      <MilestonePost label={content.label} milestonePostLink={content.mileStoneLink} isCompleted={content.isCompleted} inProgress={content.inProgress} image={content.image} milestoneType={'specification'} deletePost={() => {this.deletePost(i)}} />
                    </div>)
                  }

                  {/* milestone file type content  */}
                  {!!content && !!content.type && content.type === 'file' &&
                    (<div styleName="file-wrap">
                      <MilestonePost  label={content.label} milestonePostFile={content.milestoneFile} milestonePostFileInfo={content.milestoneFileInfo} isCompleted={content.isCompleted} inProgress={content.inProgress} milestoneType={'file'} deletePost={() => {this.deletePost(i)}} />
                    </div>)
                  }

                  {/* milestone download file type content  */}
                  {!!content && !!content.type && content.type === 'download' &&
                    (<div styleName="file-wrap">
                      <MilestonePost label={content.label} milestonePostFile={content.milestoneFile} isCompleted={content.isCompleted} inProgress={content.inProgress} milestoneType={'download'} deletePost={() => {this.deletePost(i)}} />
                    </div>)
                  }

                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'add-a-link' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostSpecification label={content.label} milestonePostLink={content.mileStoneLink} isCompleted={content.isCompleted} inProgress={content.inProgress} />
                    </div>)
                  }

                  {/* milestone submission-selection type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection' &&
                    (<div styleName="add-specification-wrap">
                      <SubmissionSelection finish={this.props.finish} label={content.label} postContent={content}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        selectedHeading={content.selectedHeading} rejectedHeading={content.rejectedHeading}
                      />
                    </div>)
                  }

                  {/* milestone winner-selection type content  */}
                  {!!content && !!content.type && content.type === 'winner-selection' &&
                    (<div styleName="add-specification-wrap">
                      <WinnerSelection finish={this.props.finish} label={content.label} postContent={content} isCompleted={content.isCompleted} inProgress={content.inProgress} selectedHeading={content.selectedHeading} rejectedHeading={content.rejectedHeading} />
                    </div>)
                  }

                  {/* milestone message type content  */}
                  {!!content && !!content.type && content.type === 'message' &&
                    (<div styleName="progress-wrap">
                      <MilestonePostMessage label={content.label} backgroundColor={content.backgroundColor}
                        isCompleted={content.isCompleted} inProgress={content.inProgress} message={content.message} isShowSelection={content.isShowSelection} button1Title={content.button1Title} button2Title={content.button2Title} button3Title={content.button3Title}
                      />
                    </div>)
                  }

                  {/* milestone message type content  */}
                  {!!content && !!content.type && content.type === 'edit-link' &&
                    (<div styleName="progress-wrap">
                      <SubmissionEditLink label={content.label} okButtonTitle={content.okButtonTitle} maxTitle={content.maxTitle} isHaveTitle={content.isHaveTitle} isHaveUrl={content.isHaveUrl} isHaveDate={content.isHaveDate} isHaveType={content.isHaveType} isHaveSubmissionId={content.isHaveSubmissionId} isHavePlannedText={content.isHavePlannedText} isHaveActiveText={content.isHaveActiveText} isHaveCompletedText={content.isHaveCompletedText}/>
                    </div>)
                  }

                  {!!content && !!content.type && content.type === 'edit-text' &&
                    (<div styleName="progress-wrap">
                      <SubmissionEditText isCompleted={content.isCompleted} inProgress={content.inProgress} finish={this.props.finish}/>
                    </div>)
                  }
                </div>)
            })
          }
        </div>
      </div>
    )
  }
}

TimelinePost.defaultProps = {
  finish: () => {},
}

TimelinePost.propTypes = {
  postContent: PT.shape({
    postId: PT.string,
    isCompleted: PT.boolean,
    month: PT.string,
    date: PT.string,
    title: PT.string,
    postMsg: PT.string,
    finish: PT.func,
    content: PT.array
  })
}

export default TimelinePost
