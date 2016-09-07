import React from 'react'
import _ from 'lodash'
import { PROJECT_STATUS_DRAFT, PROJECT_ROLE_CUSTOMER } from '../../../config/constants'
import { connect } from 'react-redux'
import NewPost from '../../../components/Feed/NewPost'
import Feed from '../../../components/Feed/Feed'
// import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectSpecification from '../../../components/ProjectSpecification/ProjectSpecification'
import { loadDashboardFeeds, createProjectTopic, loadFeedComments } from '../../actions/projectTopics'
import moment from 'moment'
import update from 'react-addons-update'

class FeedContainer extends React.Component {

  constructor(props) {
    super(props)
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)
    this.onLoadMoreComments = this.onLoadMoreComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
    this.init = this.init.bind(this)

    this.state = {
      loadingFeedComments: { },
      feeds : []
    }
  }

  componentWillMount() {
    this.props.loadDashboardFeeds(this.props.project.id)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  init(props) {
    const { allMembers } = props
    this.setState({
      feeds: props.feeds.map((feed) => {
        let item = { ...feed }
        item.user = _.find(allMembers, mem => mem.userId === item.userId)
        item.html = item.body

        item.comments = item.posts ? item.posts : []
        item.comments.forEach((comment) => {
          comment.author = _.find(allMembers, mem => mem.userId === comment.userId)
        })
        return item
      })
    })
  }

  onNewPost({title, content}) {
    const { project, currentUser } = this.props
    const { feeds } = this.state
    const newTopic = {
      title: title,
      body: content,
      tag: !feeds || feeds.length === 0 ? 'PRIMARY' : '',
      userId: parseInt(currentUser.id),
      date: moment().format(),
      allowComments: true
    }
    this.props.createProjectTopic(project.id, newTopic)
  }


  onNewCommentChange(feedId, content) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          return {...item, newComment: content}
        }
        return item
      })
    })
  }

  onLoadMoreComments(feedId) {
    const { feeds } = this.state
    const feed = _.find(feeds, feed => feed.id === feedId)
    if (feed.posts && feed.posts.length < feed.totalComments) {
      const loadFromIndex = feed.posts.length
      this.setState(update(this.state, {
        loadingFeedComments: { feedId : { $set : true}}
      }))
      this.props.loadFeedComments(feedId, loadFromIndex)
    }
  }

  onAddNewComment(feedId) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          return {
            ...item,
            newComment: '',
            totalComments: item.totalComments + 1,
            comments: [...item.comments, {
              id: new Date().getTime(),
              date: new Date(),
              author: this.state.currentUser,
              content: item.newComment
            }]
          }
        }
        return item
      })
    })
  }

  render() {
    const {currentUser, project, allMembers, currentMemberRole } = this.props
    const { loadingFeedComments, feeds } = this.state
    const showDraftSpec = project.status === PROJECT_STATUS_DRAFT && currentMemberRole === PROJECT_ROLE_CUSTOMER

    const renderFeed = (item) => {
      return (
        <div className="feed-action-card" key={item.id}>
          <Feed
            {...item}
            currentUser={currentUser.profile}
            isLoadingMoreComments={ loadingFeedComments[item.id] }
            onNewCommentChange={this.onNewCommentChange.bind(this, item.id)}
            onAddNewComment={this.onAddNewComment.bind(this, item.id)}
            onLoadMoreComments={this.onLoadMoreComments.bind(this, item.id)}
          >
            {item.sendForReview && <div className="panel-buttons">
              <button className="tc-btn tc-btn-primary tc-btn-md">Send for review</button>
            </div>}
          </Feed>
          {item.spec && <ProjectSpecification project={ project } currentMemberRole={ currentMemberRole } />  }
        </div>
      )
    }
    return (
      <div>
        <NewPost currentUser={currentUser.profile} onPost={this.onNewPost} />
        { feeds.map(renderFeed) }
      </div>
    )
  }
}


const mapStateToProps = ({ projectTopics, members, loadUser }) => {
  return {
    currentUser: loadUser.user,
    feeds      : projectTopics.topics,
    isLoading  : projectTopics.isLoading,
    error      : projectTopics.error,
    allMembers : _.values(members.members)
  }
}
const mapDispatchToProps = { loadDashboardFeeds, createProjectTopic, loadFeedComments }

// const enhance = spinnerWhileLoading(props => !props.isLoading)
// const EnhancedFeedContainer = enhance(FeedContainer)

export default connect(mapStateToProps, mapDispatchToProps)(FeedContainer)
