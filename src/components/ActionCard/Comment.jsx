import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import UserTooltip from '../User/UserTooltip'
import RichTextArea from '../RichTextArea/RichTextArea'
import { Link } from 'react-router-dom'
import CommentEditToggle from './CommentEditToggle'
import _ from 'lodash'

import './Comment.scss'

class Comment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {editMode: false}
    this.onSave = this.onSave.bind(this)
    this.onChange = this.onChange.bind(this)
    this.edit = this.edit.bind(this)
    this.delete = this.delete.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
  }

  componentWillMount() {
    this.setState({editMode: this.props.message && this.props.message.editMode || this.props.isSaving})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({editMode: nextProps.message && nextProps.message.editMode || nextProps.isSaving})
  }

  onSave({content}) {
    this.props.onSave(this.props.message, content)
  }

  onChange(title, content) {
    this.props.onChange(content, true)
  }

  edit() {
    this.setState({editMode: true})
    this.props.onChange(null, true)
  }

  delete() {
    this.props.onDelete(this.props.message.id)
  }

  cancelEdit() {
    this.setState({editMode: false})
    this.props.onChange(null, false)
  }

  render() {
    const {message, author, date, edited, children, noInfo, self, isSaving, hasError, readonly, allMembers} = this.props
    const messageAnchor = `comment-${message.id}`
    const messageLink = window.location.pathname.substr(0, window.location.pathname.indexOf('#')) + `#${messageAnchor}`
    const authorName = author ? (author.firstName + ' ' + author.lastName) : 'Connect user'
    const avatarUrl = _.get(author, 'photoURL', null)
    const isDeleting = message && message.isDeletingComment

    if (this.state.editMode) {
      const content = message.newContent === null || message.newContent === undefined ? message.rawContent : message.newContent
      return (
        <div styleName="comment-editor">
          <RichTextArea
            disableTitle
            editMode
            messageId={message.id}
            isGettingComment={message.isGettingComment}
            content={content}
            oldContent={message.rawContent}
            onPost={this.onSave}
            onPostChange={this.onChange}
            isCreating={isSaving}
            hasError={hasError}
            avatarUrl={avatarUrl}
            authorName={authorName}
            cancelEdit={this.cancelEdit}
            allMembers={allMembers}
          />
        </div>
      )
    }

    return (
      <div styleName={cn('container', { self, 'is-deleting': isDeleting })} id={messageAnchor}>
        <div styleName="avatar">
          {!noInfo && <UserTooltip usr={author} id={`${messageAnchor}-${author.userId}`} previewAvatar size={40} />}
        </div>
        <div styleName="body">
          {!noInfo &&
            <div styleName="header">
              <div styleName="info">
                <span styleName="author">
                  {authorName}
                </span>
                <span styleName="time">
                  <Link to={messageLink}>{date}</Link>
                </span>
                {edited && <span styleName="edited">edited</span>}
              </div>
            </div>
          }
          {self && !readonly &&
            <aside styleName="controls">
              <CommentEditToggle
                onEdit={this.edit}
                onDelete={this.delete}
              />
            </aside>
          }
          <div styleName="text">
            {children}
          </div>
          {isDeleting &&
            <div styleName="deleting-layer">
              <div>Deleting post ...</div>
            </div>
          }
        </div>
      </div>
    )
  }
}

Comment.propTypes = {
  /**
   * The author (user object)
   */
  author: PropTypes.object.isRequired,
  /**
   * The comment date (formatted)
   */
  date: PropTypes.string.isRequired,
  /**
   * Flag if add orange left border
   */
  active: PropTypes.bool,
  /**
   * Flag if background is blue
   */
  self: PropTypes.bool,
  /**
   * The comment text
   */
  children: PropTypes.any.isRequired,
  /**
   * The message object
   */
  message: PropTypes.any,
  /**
   * The onEdit function
   */
  onEdit: PropTypes.func,
  /**
   * The onSave function
   */
  onSave: PropTypes.func,
  /**
   * The onChange function
   */
  onChange: PropTypes.func,
  /**
   * The onDelete function
   */
  onDelete: PropTypes.func,
  /**
   * The has error flag
   */
  hasError: PropTypes.bool,
  /**
   * The is saving flag
   */
  isSaving: PropTypes.bool,
  /**
   * The readonly flag
   */
  readonly: PropTypes.bool,
  allMembers: PropTypes.object.isRequired,

  /**
   * If true only comment text is shown without additional info
   */
  noInfo: PropTypes.bool,
}

export default Comment
