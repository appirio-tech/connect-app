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
import spinnerWhileLoading from '../../../components/LoadingSpinner'

const FEED_COMMENTS_PAGE_SIZE = 3

const SYSTEM_USER = {
  firstName: CODER_BOT_USER_FNAME,
  lastName: CODER_BOT_USER_LNAME,
  photoURL: require('../../../assets/images/avatar-coder.png')
}
const isSystemUser = (userId) => [DISCOURSE_BOT_USERID, CODER_BOT_USERID].indexOf(userId) > -1


class FeedView extends React.Component {

  constructor(props) {
    super(props)
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)
    this.onLoadMoreComments = this.onLoadMoreComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
    this.state = { feeds : [] }
  }

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  init(props) {
    const { allMembers, feeds } = props
    this.setState({
      feeds: feeds.map((feed) => {
        const item = _.pick(feed, ['id', 'date', 'read', 'tag', 'title', 'totalPosts', 'userId', 'reference', 'referenceId', 'postIds', 'isAddingComment'])
        if (isSystemUser(item.userId)) {
          item.user = SYSTEM_USER
          item.allowComments = false
        } else {
          item.user = allMembers[item.userId]
          item.allowComments = true
        }
        item.unread = !feed.read
        item.html = feed.posts[0].body
        // skip over the first post since that is the topic post
        item.totalComments = feed.totalPosts-1
        item.comments = _.map(_.slice(feed.posts, 1), (p) => {
          if (p.type === 'post') {
            return {
              content: p.body,
              unread: !p.read,
              date: p.date,
              author: isSystemUser(p.userId) ? SYSTEM_USER : allMembers[p.userId]
            }
          } else {
            item.totalComments--
          }
        }).filter(i => i)
        item.newComment = ''
        item.hasMoreComments = false // FIXME
        return item
      }).filter(item => item)
    })
  }

  onNewPost({title, content}) {
    const { project } = this.props
    const newFeed = {
      title,
      body: content,
      tag: PROJECT_FEED_TYPE_PRIMARY
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

  render () {
    const {currentUser, project, currentMemberRole, isCreatingFeed } = this.props
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
        { renderComposer &&
          <NewPost
            currentUser={currentUser}
            onPost={this.onNewPost}
            isCreating={ isCreatingFeed }
            heading="NEW STATUS POST"
            titlePlaceholder="Share the latest project updates with the team"
          />
        }
        { feeds.map(renderFeed) }
      </div>
    )
  }
}
const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedFeedView = enhance(FeedView)


class FeedContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.loadDashboardFeeds(this.props.project.id)
  }

  render() {
    return <EnhancedFeedView {...this.props} />
  }
}

FeedContainer.PropTypes = {
  currentMemberRole: PropTypes.string,
  project: PropTypes.object.isRequired
}

const mapStateToProps = ({ projectTopics, members, loadUser }) => {
  return {
    currentUser    : loadUser.user,
    feeds          : projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].topics,
    feedTotalCount : projectTopics.feeds[PROJECT_FEED_TYPE_PRIMARY].totalCount,
    isLoading      : projectTopics.isLoading,
    isCreatingFeed : projectTopics.isCreatingFeed,
    error          : projectTopics.error,
    allMembers     : members.members
  }
}
const mapDispatchToProps = {
  loadDashboardFeeds,
  createProjectTopic,
  loadFeedComments,
  addFeedComment
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedContainer)
