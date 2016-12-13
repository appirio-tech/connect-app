import React, {PropTypes} from 'react'
import Panel from '../Panel/Panel'
import cn from 'classnames'
import Avatar from '../Avatar/Avatar'

export default class AddComment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isFocused: false,
      canSubmit: false
    }
    this.onAdd = this.onAdd.bind(this)
    this.onTextAreaChange = this.onTextAreaChange.bind(this)
  }

  onAdd(e) {
    if (!this.props.content) {
      e.preventDefault()
      this.refs.input.focus()
      return
    }
    this.props.onAdd(this.props.content)
    this.refs.input.focus()
  }

  onTextAreaChange(evt) {
    const val = evt.target.value
    this.setState({canSubmit: val && val.trim().length})
    this.props.onChange(val, evt)
  }

  render() {
    const { className, avatarUrl, authorName, content, placeholder, isAdding } = this.props
    const { isFocused, canSubmit } = this.state
    const isCollapsed = !isFocused && !content

    return (
      <Panel.Body className={cn(className, {'comment-form-collapsed': isCollapsed})}>
        <div className="portrait">
          <Avatar avatarUrl={ avatarUrl } userName={ authorName } />
        </div>
        <div className="object">
          <div className="comment-form">
            <div className={cn('tc-textarea', {'has-footer': !isCollapsed})}>
              <textarea
                placeholder={placeholder || 'New reply...'}
                ref="input"
                value={content}
                onFocus={() => this.setState({isFocused: true})}
                onBlur={() => this.setState({isFocused: false})}
                onChange={this.onTextAreaChange}
              />
              {!isCollapsed && <div className="textarea-footer">
                <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.onAdd} disabled={ isAdding || !canSubmit }>
                 { isAdding ? 'Posting...' : 'Post' }
                </button>
              </div>}
            </div>
          </div>
        </div>
      </Panel.Body>
    )
  }
}

AddComment.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  content: PropTypes.string,
  avatarUrl: PropTypes.string
}
