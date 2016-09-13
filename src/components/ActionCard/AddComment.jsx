import React, {PropTypes} from 'react'
import Panel from '../Panel/Panel'
import cn from 'classnames'
import { Avatar } from 'appirio-tech-react-components'

export default class AddComment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isFocused: false
    }
    this.onAdd = this.onAdd.bind(this)
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
  
  render() {
    const { className, avatarUrl, authorName, onChange, content, placeholder } = this.props
    const { isFocused } = this.state
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
                onChange={(e) => onChange(e.target.value, e)}
              />
              {!isCollapsed && <div className="textarea-footer">
                <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.onAdd}>Post</button>
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