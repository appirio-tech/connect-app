import React, { PropTypes } from 'react'
import _ from 'lodash'
import {
  PROJECT_STATUS_DRAFT,
  PROJECT_ROLE_CUSTOMER,
  PROJECT_ROLE_COPILOT,
  PROJECT_ROLE_MANAGER,
  PROJECT_FEED_TYPE_PRIMARY,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  CODER_BOT_USER_FNAME,
  CODER_BOT_USER_LNAME
} from '../../../config/constants'
import { connect } from 'react-redux'
import NewPost from '../../../components/Feed/NewPost'
import Feed from '../../../components/Feed/Feed'
import ProjectSpecification from '../../../components/ProjectSpecification/ProjectSpecification'
import { loadDashboardFeeds, createProjectTopic, loadFeedComments, addFeedComment } from '../../actions/projectTopics'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'

const FEED_COMMENTS_PAGE_SIZE = 3

class FeedContainer extends React.Component {

  constructor(props) {
    super(props)
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)
    this.onLoadMoreComments = this.onLoadMoreComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
    this.init = this.init.bind(this)

    this.state = {
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
        const item = { ...feed }
        item.user = _.find(allMembers, mem => mem.userId === item.userId)
        if (!item.user) {
          //TODO: throwing an error
          return null
        }

        if ([DISCOURSE_BOT_USERID, CODER_BOT_USERID].indexOf(item.userId) > -1) {
          item.user = {
            firstName: CODER_BOT_USER_FNAME,
            lastName: CODER_BOT_USER_LNAME
          }
          item.allowComments = false
        } else {
          item.allowComments = true
        }

        item.html = item.body
        if (item.posts.length === 0 && item.postIds && !item.isLoadingComments) {
          const commentIds = item.postIds.slice(-FEED_COMMENTS_PAGE_SIZE)
          item.comments = []
          this.props.loadFeedComments(item.id, PROJECT_FEED_TYPE_PRIMARY, commentIds)
        } else {
          item.comments = item.posts// ? item.posts.slice(-FEED_COMMENTS_PAGE_SIZE).filter((post) => post.type === 'post') : []
          item.posts.forEach((comment) => {
            comment.content = comment.body
            if ([DISCOURSE_BOT_USERID, CODER_BOT_USERID].indexOf(comment.userId) > -1) {
              comment.author = {
                firstName: CODER_BOT_USER_FNAME,
                lastName: CODER_BOT_USER_LNAME
              }
            } else {
              comment.author = _.find(allMembers, mem => mem.userId === comment.userId)
            }
          })
          // -1 for the first post which is actual treated as body of the feed
          item.totalComments = item.totalPosts - 1
          item.hasMoreComments = item.comments.length < item.totalComments
        }

        // reset newComment property
        item.newComment = ''
        return item
      }).filter((item) => item)
    })
  }

  onNewPost({title, content}) {
    const { project } = this.props
    const newFeed = {
      title,
      body: content,
      tag: PROJECT_FEED_TYPE_PRIMARY
      // userId: parseInt(currentUser.id),
      // date: moment().format(),
      // allowComments: true
    }
    this.props.createProjectTopic(project.id, newFeed)
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
    const feedIndex = _.findIndex(feeds, feed => feed.id === feedId)
    const feed = feeds[feedIndex]
    const renderedComments = feed.comments.length
    const availableComments = feed.posts.length - 1
    if (renderedComments < availableComments) {
      const nextPage = feed.posts.slice(-renderedComments-FEED_COMMENTS_PAGE_SIZE, -renderedComments)
      feed.comments = nextPage.concat(feed.comments)
      feed.hasMoreComments = feed.comments.length < feed.totalComments
      this.forceUpdate()
    } else {
      if (feed.comments && feed.comments.length < feed.totalComments) {
        const commentIds = feed.postIds.slice(-renderedComments-FEED_COMMENTS_PAGE_SIZE, -renderedComments)

        this.props.loadFeedComments(feedId, PROJECT_FEED_TYPE_PRIMARY, commentIds)
      }
    }
  }

  onAddNewComment(feedId, content) {
    const { currentUser } = this.props
    const newComment = {
      date: new Date(),
      userId: parseInt(currentUser.id),
      content
    }
    this.props.addFeedComment(feedId, PROJECT_FEED_TYPE_PRIMARY, newComment)
  }

  render() {
    const {currentUser, project, currentMemberRole, isLoading, isCreatingFeed } = this.props
    const { feeds } = this.state
    const showDraftSpec = project.status === PROJECT_STATUS_DRAFT && currentMemberRole === PROJECT_ROLE_CUSTOMER
    const renderComposer = currentMemberRole === PROJECT_ROLE_COPILOT || currentMemberRole === PROJECT_ROLE_MANAGER

    const renderFeed = (item) => {
      if ((item.spec || item.sendForReview) && !showDraftSpec) {
        return null
      }

      return (
        <div className="feed-action-card" key={item.id}>
          <Feed
            {...item}
            allowComments={ item.allowComments && !!currentMemberRole}
            currentUser={currentUser}
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
        { renderComposer && <NewPost currentUser={currentUser} onPost={this.onNewPost} isCreating={ isCreatingFeed } /> }
        { !isLoading && feeds.map(renderFeed) }
        { isLoading && <LoadingIndicator />}
      </div>
    )
  }
}


FeedContainer.propTypes = {
  isLoading : PropTypes.bool.isRequired
}


const mapStateToProps = ({ projectTopics, members, loadUser }) => {
  return {
    currentUser    : loadUser.user,
    feeds          : _.values(projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY]),
    isLoading      : projectTopics.isLoading,
    isCreatingFeed : projectTopics.isCreatingFeed,
    error          : projectTopics.error,
    allMembers     : _.values(members.members)
  }
}
const mapDispatchToProps = {
  loadDashboardFeeds,
  createProjectTopic,
  loadFeedComments,
  addFeedComment
}

// const enhance = spinnerWhileLoading(props => !props.isLoading)
// const EnhancedFeedContainer = enhance(FeedContainer)

export default connect(mapStateToProps, mapDispatchToProps)(FeedContainer)
