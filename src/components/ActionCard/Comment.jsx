import React, {PropTypes} from 'react'
import cn from 'classnames'
import Panel from '../Panel/Panel'
import { Avatar } from 'appirio-tech-react-components'
import RichTextArea from '../RichTextArea/RichTextArea'
import CommentEditToggle from './CommentEditToggle'

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
    this.setState({editMode: this.props.message && this.props.message.editMode})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({editMode: nextProps.message && nextProps.message.editMode})
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
    const {message, avatarUrl, authorName, date, edited, children, active, self, isSaving, hasError, readonly} = this.props

    if (this.state.editMode) {
      const content = message.newContent === null || message.newContent === undefined ? message.rawContent : message.newContent
      return (
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
        />
      )
    }

    return (
      <Panel.Body active={active} className="comment-panel-body">
        <div className="portrait">
          <Avatar avatarUrl={avatarUrl} userName={authorName} />
        </div>
        <div className={cn('object comment', {self})}>
          <div className="card-profile">
            <div className="card-author">
              {authorName}
            </div>
            <div className="card-time">
              {date} {edited && '• Edited'}
            </div>
            {self && !readonly &&
              <CommentEditToggle
                onEdit={this.edit}
                onDelete={this.delete}
              />
            }
          </div>
          <div className="comment-body draftjs-post">
            {children}
          </div>
          {message && message.isDeletingComment &&
            <div className="deleting-layer">
              <div>Deleting post ...</div>
            </div> 
          }
        </div>
      </Panel.Body>
    )
  }
}

Comment.propTypes = {
  /**
   * The user avatar url
   */
  avatarUrl: PropTypes.string,
  /**
   * The author name
   */
  authorName: PropTypes.string.isRequired,
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
  readonly: PropTypes.bool
}

export default Comment
