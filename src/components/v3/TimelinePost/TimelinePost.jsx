import React from 'react'
import ProjectProgress from '../ProjectProgress'
import MilestonePost from '../MilestonePost'
import MilestonePostMessage from '../MilestonePostMessage'
import MilestonePostFile from '../MilestonePostFile'
import MilestonePostDownload from '../MilestonePostDownload'
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

    this.state = {
      activeMenu: ''
    }
  }

  componentDidMount() {
    !!this.props.navLinks && this.props.navLinks.map((item) => {
      item.isActive && this.setState({ activeMenu: item.id })
    })
  }

  render() {
    const { postContent } = this.props
    let contentList = []
    !!this.props && this.props.postContent
      ? contentList = postContent.content
      : contentList = []


    return (
      <div styleName={'timeline-post '}>
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
          <h4 styleName="post-title" dangerouslySetInnerHTML={{ __html: postContent.title }} />
          <div styleName="post-con" dangerouslySetInnerHTML={{ __html: postContent.postMsg }} />
          {
            !!contentList && contentList.map((content, i) => {

              return (
                <div key={i}>

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
                      <MilestonePost label={content.label} milestonePostLink={content.mileStoneLink} isCompleted={content.isCompleted} inProgress={content.inProgress} image={content.image} />
                    </div>)
                  }

                  {/* Specification type content  */}
                  {!!content && !!content.type && content.type === 'specification' &&
                    (<div styleName="invoice-wrap">
                      <Specification isCompleted={content.isCompleted} inProgress={content.inProgress} finish={this.props.finish} />
                    </div>)
                  }

                  {/* milestone file type content  */}
                  {!!content && !!content.type && content.type === 'file' &&
                    (<div styleName="file-wrap">
                      <MilestonePostFile label={content.label} milestonePostFile={content.milestoneFile} milestonePostFileInfo={content.milestoneFileInfo}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                      />
                    </div>)
                  }

                  {/* milestone download file type content  */}
                  {!!content && !!content.type && content.type === 'download' &&
                    (<div styleName="file-wrap">
                      <MilestonePostDownload label={content.label} milestonePostFile={content.milestoneFile} isCompleted={content.isCompleted} inProgress={content.inProgress} />
                    </div>)
                  }

                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'add-a-link' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostSpecification label={content.label} milestonePostLink={content.mileStoneLink}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                      />
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
                      <SubmissionEditLink label={content.label} maxTitle={content.maxTitle} isHaveTitle={content.isHaveTitle} isHaveUrl={content.isHaveUrl} isHaveDate={content.isHaveDate} isHaveType={content.isHaveType} isHaveSubmissionId={content.isHaveSubmissionId} isHavePlannedText={content.isHavePlannedText} isHaveActiveText={content.isHaveActiveText} isHaveCompletedText={content.isHaveCompletedText}/>
                    </div>)
                  }

                  {!!content && !!content.type && content.type === 'edit-text' &&
                    (<div styleName="progress-wrap">
                      <SubmissionEditText isSubmitted={this.isSubmitted} isCancel={this.isCancel} isCompleted={content.isCompleted} inProgress={content.inProgress} finish={this.props.finish}/>
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
  finish: () => {}
}

TimelinePost.propTypes = {
  postContent: PT.shape({
    postId: PT.string,
    isCompleted: PT.boolean,
    month: PT.string,
    date: PT.string,
    title: PT.string,
    postMsg: PT.string,
    finish: PT.func
  })
}

export default TimelinePost
