import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import AddComment from '../ActionCard/AddComment'
import Comment from '../ActionCard/Comment'
import cn from 'classnames'
import {markdownToHTML} from '../../helpers/markdownToState'
import MediaQuery from 'react-responsive'
import NewPostMobile, { NEW_POST_STEP } from './NewPostMobile'
import { SCREEN_BREAKPOINT_MD, POSTS_BUNDLE_TIME_DIFF } from '../../config/constants'

import './FeedComments.scss'

function formatCommentDate(date) {
  const today = moment()

  let formated = date.format('MMM D')

  // if another year
  if (!date.isSame(today, 'year')) {
    formated += `, ${date.format('YYYY')}`

    // if today
  } else if (date.isSame(today, 'day')) {
    formated = 'Today'

  // if yesterday
  } else if (date.isSame(today.subtract(1, 'day'), 'day')) {
    formated = 'Yesterday'
  }

  return formated
}

class FeedComments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showAll: false,
      isNewCommentMobileOpen: false,
      stickyRowNext: null,
      stickyRowPrev: null,
      headerHeight: null,
    }

    this.toggleNewCommentMobile = this.toggleNewCommentMobile.bind(this)
    this.setStickyRowRef = this.setStickyRowRef.bind(this)
    this.updateStickyRow = this.updateStickyRow.bind(this)

    this.stickyRowRefs = {}
  }

  onSaveMessageChange(messageId, content, editMode) {
    this.props.onSaveMessageChange && this.props.onSaveMessageChange(messageId, content, editMode)
  }

  toggleNewCommentMobile() {
    this.setState({ isNewCommentMobileOpen: !this.state.isNewCommentMobileOpen })
  }

  setStickyRowRef(ref, key) {
    const { isFullScreen } = this.props

    if (isFullScreen) {
      if (ref) {
        this.stickyRowRefs[key] = ref
      } else {
        delete this.stickyRowRefs[key]
      }
    }
  }

  updateStickyRow() {
    const containerOffset = this.refs.container.offsetTop
    const scrollY = window.scrollY
    // space between previous and next date during scrolling in px
    const margin = 4

    const rows = _.keys(this.stickyRowRefs)
      .map((key) => {
        const ref = this.stickyRowRefs[key]

        return ({
          key,
          ref,
          offsetTop: ref.offsetTop,
          height: ref.clientHeight,
          relativeTop: ref.offsetTop - containerOffset - scrollY,
        })
      })
      .sort((row1, row2) => row1.offsetTop - row2.offsetTop)

    const isRowNext = (row) => row.relativeTop > - row.height / 2 && row.relativeTop <= row.height / 2 + margin
    const isRowPrev = (row) => row.relativeTop <= - row.height / 2

    let stickyRowNext = null

    rows.forEach((row, rowIndex) => {
      const nextRow = rowIndex + 1 < rows.length ? rows[rowIndex + 1] : null

      if (isRowNext(row) && (!nextRow || !isRowNext(nextRow))) {
        stickyRowNext = {
          key: row.key,
          row,
          style: {
            transform: `translateY(${row.relativeTop + row.height / 2}px)`,
            opacity: Math.max((row.height / 2 - row.relativeTop + margin) / (row.height + margin), 0)
          }
        }
      }
    })

    let stickyRowPrev = null

    rows.forEach((row, rowIndex) => {
      const nextRow = rowIndex + 1 < rows.length ? rows[rowIndex + 1] : null

      if (isRowPrev(row) && (!nextRow || !isRowPrev(nextRow))) {
        stickyRowPrev = {
          key: row.key,
          row,
          style: stickyRowNext ? {
            transform: `translateY(${stickyRowNext.row.relativeTop - row.height / 2 - margin}px)`,
            opacity: Math.max((stickyRowNext.row.relativeTop + row.height / 2 - margin) / (row.height + margin), 0)
          } : {}
        }
      }
    })

    this.setState({
      stickyRowPrev,
      stickyRowNext,
    })
  }

  componentDidMount() {
    const { isFullScreen, commentId, hasMoreComments, isLoadingComments, onLoadMoreComments } = this.props

    if (isFullScreen) {
      window.addEventListener('scroll', this.updateStickyRow)
      window.addEventListener('resize', this.updateStickyRow)
      this.updateStickyRow()
    }

    const isCommentLoaded = this.props.comments.findIndex(comment => comment.id === parseInt(commentId))
    if (isCommentLoaded === -1 && hasMoreComments) {
      this.setState({showAll: true}, () => {
        this.updateStickyRow()
      })

      if (!isLoadingComments) {
        onLoadMoreComments()
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateStickyRow)
    window.removeEventListener('resize', this.updateStickyRow)
  }

  componentWillReceiveProps(nextProps) {
    const { isFullScreen, headerHeight } = this.props

    if (isFullScreen && headerHeight !== nextProps.headerHeight) {
      this.updateStickyRow()
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.comments, this.props.comments)) {
      this.updateStickyRow()
    }
  }

  render() {
    const {
      currentUser, onLoadMoreComments, isLoadingComments, hasMoreComments, onAddNewComment,
      onNewCommentChange, error, avatarUrl, isAddingComment, allowComments, onSaveMessage, onDeleteMessage, allMembers,
      totalComments, isFullScreen, headerHeight, projectMembers, commentAnchorPrefix
    } = this.props
    let { comments } = this.props
    comments = _.sortBy(comments, 'createdBy')
    comments = comments.reverse()
    const { isNewCommentMobileOpen, stickyRowNext, stickyRowPrev } = this.state
    let authorName = currentUser.firstName
    if (authorName && currentUser.lastName) {
      authorName += ' ' + currentUser.lastName
    }
    const handleLoadMoreClick = () => {
      this.setState({showAll: true}, () => {
        this.updateStickyRow()
      })

      // TODO - handle the case when a topic has more than 20 comments
      // since those will have to retrieved from the server
      if (!isLoadingComments) {
        onLoadMoreComments()
      }
    }

    // show more posts buttons for mobile devices
    const moreCommentsCount = totalComments - comments.length
    const showMoreMobile = moreCommentsCount > 0 ? (
      <button
        className="tc-btn tc-btn-link tc-btn-sm"
        onClick={handleLoadMoreClick}
      >
        View {moreCommentsCount} more {totalComments > 1 ? 'posts' : 'post'}
      </button>
    ) : (
      <div styleName="no-comments">No posts yet</div>
    )

    // commentsRows is the list of comments, and various splitters between them
    // like dates, new posts splitters and so on
    // we are building this list below
    const commentRows = []
    // match row keys to their indexes in commentRows for quick search
    const rowKeyToIndex = {}

    let bundleCreatedAt = false
    let isBundleEdited = false
    let bundleIndex = -1

    // to be able to mark the head comment in a bundle as edited if any of the comments in the bundle is edited
    comments && _.forEach(comments, (item, idx) => {
      const createdAt = moment(item.createdAt)
      const prevComment = comments[idx - 1]
      const prevCreatedAt = prevComment && moment(prevComment.createdAt)
      const isSameDay = prevCreatedAt && prevCreatedAt.isSame(createdAt, 'day')
      const isSameAuthor = _.get(prevComment, 'author.userId') === item.author.userId
      const isFirstUnread = prevComment && !prevComment.unread && item.unread

      const timeDiffComment = bundleCreatedAt && createdAt.diff(bundleCreatedAt)
      const shouldBundle = isSameDay && isSameAuthor && !isFirstUnread && timeDiffComment && timeDiffComment <= POSTS_BUNDLE_TIME_DIFF

      if (shouldBundle) {
        isBundleEdited = isBundleEdited || item.edited
        item.noInfo = true
      } else {
        const bundleStart = comments[bundleIndex]
        if (bundleStart) {
          bundleStart.edited = isBundleEdited
        }
        bundleIndex = idx
        isBundleEdited = item.edited
        bundleCreatedAt = createdAt
        item.noInfo = false
      }

      if (idx === (comments.length - 1)) {
        const bundleStart = comments[bundleIndex]
        if (bundleStart) {
          bundleStart.edited = isBundleEdited
        }
      }
    })

    // building commentRows list
    comments && _.forEach(comments, (item, idx) => {
      const createdAt = moment(item.createdAt)
      const prevComment = comments[idx - 1]
      const prevCreatedAt = prevComment && moment(prevComment.createdAt)
      const isSameDay = prevCreatedAt && prevCreatedAt.isSame(createdAt, 'day')
      const isFirstUnread = prevComment && !prevComment.unread && item.unread

      if (!isSameDay) {
        const rowKey = `date-splitter-${createdAt.valueOf()}`
        rowKeyToIndex[rowKey] = commentRows.length

        commentRows.push(
          <div
            key={rowKey}
            styleName={cn('date-splitter', { 'unread-splitter': isFirstUnread })}
            ref={(ref) => this.setStickyRowRef(ref, rowKey)}
          >
            <span styleName="date">{formatCommentDate(createdAt)}</span>
            <span styleName="unread">New posts</span>
          </div>
        )
      } else if (isFirstUnread) {
        const rowKey = `date-splitter-${createdAt.valueOf()}`
        rowKeyToIndex[rowKey] = commentRows.length

        commentRows.push(
          <div
            styleName="unread-splitter"
            key={rowKey}
            ref={(ref) => this.setStickyRowRef(ref, rowKey)}
          >
            <span styleName="unread">New posts</span>
          </div>
        )
      }

      const rowKey = `comment-${item.id}`
      rowKeyToIndex[rowKey] = commentRows.length

      // remove user link in comment
      let itemContent = item.content
      let mardowLink = itemContent.match(/\[(.*?)\]\(.*?\)/)
      while (mardowLink && mardowLink[0] && _.includes(mardowLink[0], '/users/')) {
        itemContent = itemContent.replace(mardowLink[0], `**${mardowLink[1]}**`)
        mardowLink = itemContent.match(/\[(.*?)\]\(.*?\)/)
      }

      commentRows.push(
        <Comment
          key={rowKey}
          message={item}
          author={item.author}
          date={item.createdAt}
          edited={item.edited}
          active={item.unread}
          self={item.author && item.author.userId === currentUser.userId}
          onChange={this.onSaveMessageChange.bind(this, item.id)}
          onSave={onSaveMessage}
          onDelete={onDeleteMessage}
          isSaving={item.isSavingComment}
          hasError={item.error}
          allMembers={allMembers}
          projectMembers={projectMembers}
          noInfo={item.noInfo}
          canDelete={idx !== comments.length - 1} // cannot delete the first post which is now shown as a last one
          commentAnchorPrefix={commentAnchorPrefix}
        >
          <div dangerouslySetInnerHTML={{__html: markdownToHTML(itemContent)}} />
        </Comment>
      )
    })

    let stickyRowNextComponent = null
    if (stickyRowNext) {
      const rowIndex = rowKeyToIndex[stickyRowNext.key]

      if (!_.isUndefined(rowIndex)) {
        const rowElement = commentRows[rowIndex]

        if (!_.isUndefined(rowElement)) {
          stickyRowNextComponent = React.cloneElement(rowElement, {
            style: stickyRowNext.style,
          })
        }
      }
    }

    let stickyRowPrevComponent = null
    if (stickyRowPrev) {
      const rowIndex = rowKeyToIndex[stickyRowPrev.key]

      if (!_.isUndefined(rowIndex)) {
        const rowElement = commentRows[rowIndex]

        if (!_.isUndefined(rowElement)) {
          stickyRowPrevComponent = React.cloneElement(rowElement, {
            style: stickyRowPrev.style,
          })
        }
      }
    }

    return (
      <div styleName={cn('container', { 'is-fullscreen': isFullScreen })} ref="container">
        <div styleName="sticky-container" style={{ top: headerHeight ? headerHeight : 0 }}>
          {stickyRowNextComponent}
        </div>
        <div styleName="sticky-container" style={{ top: headerHeight ? headerHeight : 0 }}>
          {stickyRowPrevComponent}
        </div>
        <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
          {(matches) => (matches ? (
            <div>
              <div styleName="comments">
                {commentRows}
                {hasMoreComments &&
                  <div styleName="load-more" key="load-more">
                    <a href="javascript:" onClick={ handleLoadMoreClick } styleName="load-btn">
                      {isLoadingComments ? 'Loading...' : 'load earlier posts'}
                    </a>
                  </div>
                }
              </div>
              {allowComments &&
                <div styleName="add-comment" key="add-comment">
                  <AddComment
                    placeholder="Write a post"
                    onAdd={onAddNewComment}
                    onChange={onNewCommentChange}
                    avatarUrl={avatarUrl}
                    authorName={authorName}
                    isAdding={isAddingComment}
                    hasError={error}
                    allMembers={allMembers}
                    projectMembers={projectMembers}
                  />
                </div>
              }
            </div>
          ) : (
            <div>
              <div styleName="comments">
                {commentRows}
              </div>
              <div styleName="mobile-actions">
                <div>{!!hasMoreComments && showMoreMobile}</div>
                {allowComments &&
                  <button
                    className="tc-btn tc-btn-link tc-btn-sm"
                    onClick={this.toggleNewCommentMobile}
                  >
                    Write a post
                  </button>
                }
              </div>
              {isNewCommentMobileOpen &&
                <NewPostMobile
                  step={NEW_POST_STEP.COMMENT}
                  statusTitle="NEW STATUS"
                  commentTitle="WRITE POST"
                  statusPlaceholder="Share the latest project updates with the team"
                  commentPlaceholder="Write your post about the status here"
                  submitText="Post"
                  nextStepText="Add a post"
                  onClose={this.toggleNewCommentMobile}
                  onPost={({ content }) => onAddNewComment(content)}
                  isCreating={isAddingComment}
                  hasError={error}
                  onNewPostChange={this.onNewCommentChange}
                />
              }
            </div>
          ))}
        </MediaQuery>
      </div>
    )
  }
}
FeedComments.defaultProps = {
  comments: [],
}
FeedComments.propTypes = {
  comments: PropTypes.array,
  commentAnchorPrefix: PropTypes.string,
}

export default FeedComments
