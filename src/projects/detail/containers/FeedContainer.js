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
import update from 'react-addons-update'
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator'

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

        item.html = item.posts.length > 0 ? item.posts[0].body : null
        item.comments = item.posts ? item.posts.slice(1).filter((post) => post.type === 'post') : []
        item.comments.forEach((comment) => {
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
    const feed = _.find(feeds, feed => feed.id === feedId)
    if (feed.posts && feed.posts.length < feed.totalComments) {
      const loadFromIndex = feed.posts.length
      this.setState(update(this.state, {
        loadingFeedComments: { feedId : { $set : true}}
      }))
      this.props.loadFeedComments(feedId, loadFromIndex)
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
    const { loadingFeedComments, feeds } = this.state
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
        { renderComposer && <NewPost currentUser={currentUser.profile} onPost={this.onNewPost} isCreating={ isCreatingFeed } /> }
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
