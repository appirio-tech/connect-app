import React from 'react'
import _ from 'lodash'
import { PROJECT_STATUS_DRAFT, PROJECT_ROLE_CUSTOMER } from '../../../config/constants'
import { connect } from 'react-redux'
import NewPost from '../../../components/Feed/NewPost'
import Feed from '../../../components/Feed/Feed'
// import spinnerWhileLoading from '../../../components/LoadingSpinner'
import ProjectSpecification from '../../../components/ProjectSpecification/ProjectSpecification'
import { loadDashboardFeeds, createProjectTopic } from '../../actions/projectTopics'
import moment from 'moment'

class FeedContainer extends React.Component {

  constructor(props) {
    super(props)
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)
    this.onLoadMoreComments = this.onLoadMoreComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
  }

  componentWillMount() {
    console.log('calling loadDashboardFeeds...' + this.props.project.id)
    this.props.loadDashboardFeeds(this.props.project.id)
  }

  onNewPost({title, content}) {
    const { project, feeds } = this.props
    const newTopic = { title, body: content, tag: !feeds || feeds.length === 0 ? 'PRIMARY' : ''}
    this.props.createProjectTopic(project.id, newTopic)
    // this.setState({
    //   feeds: [
    //     newTopic,
    //     ...this.state.feeds
    //   ]
    // })
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
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          return {...item, isLoadingMoreComments: true}
        }
        return item
      })
    })
    setTimeout(() => {
      this.setState({
        feeds: this.state.feeds.map((item) => {
          if (item.id === feedId) {
            return {
              ...item,
              isLoadingMoreComments: false,
              hasMoreComments: item.comments.length + 2 < item.totalComments,
              comments: [
                {
                  id: new Date().getTime(),
                  date: moment().add('-1', 'd').format(),
                  author: {
                    userId: 2,
                    firstName: 'Patrick',
                    lastName: 'Monahan',
                    photoURL: require('../../../styles/i/avatar-patrick.png')
                  },
                  content: 'Lorem ipsum'

                },
                {
                  id: new Date().getTime() + 1,
                  date: moment().add('-1', 'd').format(),
                  author: {
                    userId: 1,
                    firstName: 'Christina',
                    lastName: 'Underwood',
                    photoURL: require('../../../styles/i/profile1.jpg')
                  },
                  content: 'Lorem ipsum dolor it somor'
                },
                ...item.comments
              ]
            }
          }
          return item
        })
      })
    }, 700)
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
    const {currentUser, project, feeds, allMembers, currentMemberRole } = this.props
    const showDraftSpec = project.status === PROJECT_STATUS_DRAFT && currentMemberRole === PROJECT_ROLE_CUSTOMER

    const renderFeed = (_item) => {
      // FIXME - @vikas this breaks when component is re-mounted since you are
      // directly changing the props object. This should be done outside of the
      // render method maybe in componentWillReceiveProps to update the state
      // For now i am going to clone item
      const item = _.cloneDeep(_item)
      item.user = _.find(allMembers, mem => mem.userId === item.userId)
      item.html = item.body

      item.comments = item.posts ? item.posts : []
      item.comments.forEach((comment) => {
        console.log(comment.author)
        comment.author = _.find(allMembers, mem => mem.userId === comment.author)
        console.log(comment.author)
      })
      if ((item.spec || item.sendForReview) && !showDraftSpec) {
        return null
      }
      // debugger
      return (
        <div className="feed-action-card" key={item.id}>
          <Feed
            {...item}
            currentUser={currentUser.profile}
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
const mapDispatchToProps = { loadDashboardFeeds, createProjectTopic }

// const enhance = spinnerWhileLoading(props => !props.isLoading)
// const EnhancedFeedContainer = enhance(FeedContainer)

export default connect(mapStateToProps, mapDispatchToProps)(FeedContainer)
