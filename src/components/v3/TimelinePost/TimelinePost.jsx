import React from 'react'
import ProjectProgress from '../ProjectProgress'
import MilestonePost from '../MilestonePost'
import MilestonePostSpecification from '../MilestonePostSpecification'
import SubmissionSelection from '../SubmissionSelection'
import WinnerSelection from '../WinnerSelection'
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
          + (postContent.isCompleted ? 'completed' : '')
          + (postContent.inProgress ? 'in-progress' : '')
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
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                      />
                    </div>)
                  }

                  {/* milestone invoice type content  */}
                  {!!content && !!content.type && content.type === 'invoice' &&
                    (<div styleName="invoice-wrap">
                      <MilestonePost label={content.label} milestonePostLink={content.mileStoneLink}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                      />
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
                      <SubmissionSelection label={content.label} postContent={content}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        selectedHeading={content.selectedHeading} rejectedHeading={content.rejectedHeading}
                      />
                    </div>)
                  }
                  

                  {/* milestone winner-selection type content  */}
                  {!!content && !!content.type && content.type === 'winner-selection' &&
                    (<div styleName="add-specification-wrap">
                      <WinnerSelection label={content.label} postContent={content}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        selectedHeading={content.selectedHeading} rejectedHeading={content.rejectedHeading}
                      />
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

TimelinePost.propTypes = {
  postContent: PT.shape({
    postId: PT.string,
    isCompleted: PT.boolean,
    month: PT.string,
    date: PT.string,
    title: PT.string,
    postMsg: PT.string
  })
}

export default TimelinePost
