import React from 'react'
import cn from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import FeedComments from './FeedComments'
import CommentEditToggle from '../ActionCard/CommentEditToggle'
import RichTextArea from '../RichTextArea/RichTextArea'

import XMarkIcon from '../../assets/icons/x-mark.svg'
import FullscreenIcon from '../../assets/icons/ui-fullscreen.svg'

import './Feed.scss'

class Feed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editTopicMode: false,
      headerHeight: null, // keeps header height for fullscreen mode
    }
    this.onEditTopic = this.onEditTopic.bind(this)
    this.cancelEditTopic = this.cancelEditTopic.bind(this)
    this.onTopicChange = this.onTopicChange.bind(this)
    this.onSaveTopic = this.onSaveTopic.bind(this)
    this.updateHeaderHeight = this.updateHeaderHeight.bind(this)
  }

  componentDidMount() {
    const { isFullScreen } = this.props

    if (isFullScreen) {
      window.addEventListener('resize', this.updateHeaderHeight)
      this.updateHeaderHeight()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeaderHeight)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({editTopicMode: nextProps.editTopicMode})
  }

  componentDidUpdate(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.updateHeaderHeight()
    }
  }

  onEditTopic() {
    this.setState({editTopicMode: true})
    this.props.onEditTopic()
  }

  cancelEditTopic() {
    this.setState({editTopicMode: false})
    this.props.onTopicChange(this.props.topicMessage.id, null, null, false)
  }

  onTopicChange(title, content) {
    this.props.onTopicChange(this.props.topicMessage.id, title, content, true)
  }

  onSaveTopic({title, content}) {
    this.props.onSaveTopic(this.props.topicMessage.id, title, content)
  }

  updateHeaderHeight() {
    const { isFullScreen } = this.props

    if (isFullScreen && this.refs.header) {
      const headerHeight = this.refs.header.clientHeight

      if (this.state.headerHeight !== headerHeight) {
        this.setState({ headerHeight })
      }
    }
  }

  render() {
    const {
      id, user, currentUser, topicMessage, totalComments, hasMoreComments, onLoadMoreComments, isLoadingComments,
      allowComments, comments, children, onNewCommentChange, onAddNewComment, isAddingComment, onSaveMessageChange,
      onEditMessage, onSaveMessage, isSavingTopic, onDeleteMessage, onDeleteTopic, isDeletingTopic, error, allMembers,
      onEnterFullscreenClick, onExitFullscreenClick, isFullScreen,
    } = this.props
    const { editTopicMode, headerHeight } = this.state
    let authorName = user ? user.firstName : 'Unknown'
    if (authorName && user && user.lastName) {
      authorName += ' ' + user.lastName
    }

    let topicHeader = null
    if (topicMessage) {
      const self = user && user.userId === currentUser.userId
      const title = this.props.newTitle === null || this.props.newTitle === undefined ? this.props.title : this.props.newTitle
      const content = topicMessage.newContent === null || topicMessage.newContent === undefined ? topicMessage.rawContent : topicMessage.newContent

      topicHeader = (
        <header styleName="feed-header" ref="header">
          {editTopicMode ? (
            <div styleName="header-edit">
              <RichTextArea
                editMode
                messageId={topicMessage.id}
                isGettingComment={topicMessage.isGettingComment}
                content={content}
                title={title}
                oldTitle={this.props.title}
                onPost={this.onSaveTopic}
                onPostChange={this.onTopicChange}
                isCreating={isSavingTopic}
                hasError={error}
                cancelEdit={this.cancelEditTopic}
                disableContent
                editingTopic = {editTopicMode}
              />
            </div>
          ) : (
            <div styleName="header-view">
              <div styleName="header-view-inner">
                <div styleName="header-info">
                  <div styleName="title">{title}</div>
                  <div styleName="header-details">
                    <span>{moment(topicMessage.date).format('MMM D YYYY')}</span>
                    <span>{comments.length} post{comments.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div styleName="header-actions">
                  {self && !isFullScreen && (
                    <CommentEditToggle
                      forTopic
                      hideDelete={comments.length < 2}
                      onEdit={this.onEditTopic}
                      onDelete={onDeleteTopic}
                    />
                  )}
                  {!!onEnterFullscreenClick && <button styleName="fullscreen" onClick={onEnterFullscreenClick}><FullscreenIcon /></button>}
                  {!!onExitFullscreenClick && <button styleName="fullscreen fullscreen-exit" onClick={onExitFullscreenClick}><XMarkIcon /></button>}
                </div>
              </div>
            </div>
          )}
        </header>
      )
    }

    return (
      <div
        styleName={cn('feed-container', { 'is-fullscreen': isFullScreen })}
        id={`feed-${id}`}
        style={{ paddingTop: headerHeight ? headerHeight : 0 }}
      >
        {topicHeader}
        <FeedComments
          allowComments={allowComments}
          totalComments={totalComments}
          hasMoreComments={hasMoreComments}
          onLoadMoreComments={onLoadMoreComments}
          onNewCommentChange={onNewCommentChange}
          onAddNewComment={onAddNewComment}
          isLoadingComments={isLoadingComments}
          currentUser={currentUser}
          avatarUrl={currentUser.photoURL}
          comments={comments}
          isAddingComment={isAddingComment}
          onEditMessage={onEditMessage}
          onSaveMessageChange={onSaveMessageChange}
          onSaveMessage={onSaveMessage}
          onDeleteMessage={onDeleteMessage}
          allMembers={allMembers}
          isFullScreen={isFullScreen}
          headerHeight={headerHeight}
        />
        {children}
        {isDeletingTopic &&
          <div className="deleting-layer">
            <div>Deleting post ...</div>
          </div>
        }
      </div>
    )
  }
}

Feed.defaultProps = {
  title: '',
  date:'',
  allowComments: false,
  isFullScreen: false,
}

Feed.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string,
  date: PropTypes.string,
  topicMessage: PropTypes.any,
  allowComments: PropTypes.bool,
  hasMoreComments: PropTypes.bool,
  comments: PropTypes.array,
  children: PropTypes.any,
  onLoadMoreComments: PropTypes.func.isRequired,
  onNewCommentChange: PropTypes.func,
  onAddNewComment: PropTypes.func.isRequired,
  onSaveMessageChange: PropTypes.func,
  onSaveMessage: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  onTopicChange: PropTypes.func,
  onSaveTopic: PropTypes.func,
  onDeleteTopic: PropTypes.func,
  isAddingComment: PropTypes.bool,
  isSavingTopic: PropTypes.bool,
  onEnterFullscreenClick: PropTypes.func,
  isFullScreen: PropTypes.bool,
}

export default Feed
