import React from 'react'
import PropTypes from 'prop-types'
import RichTextArea from '../RichTextArea/RichTextArea'

export default class AddComment extends React.Component {

  constructor(props) {
    super(props)
    this.onPost = this.onPost.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.refs.richTextArea && nextProps.threadId !== this.props.threadId) {
      this.refs.richTextArea.clearState()
    }
  }

  onPost({ content, attachmentIds }) {
    this.props.onAdd(content, attachmentIds)
  }

  onChange(title, content) {
    this.props.onChange && this.props.onChange(content)
  }

  render() {
    const { className, avatarUrl, authorName, placeholder, isAdding, hasError, allMembers, projectMembers } = this.props

    return (
      <RichTextArea ref="richTextArea"
        className={className}
        disableTitle
        contentPlaceholder={placeholder || 'New reply...'}
        onPost={this.onPost}
        onPostChange={this.onChange}
        isCreating={isAdding}
        hasError={hasError}
        avatarUrl={avatarUrl}
        authorName={authorName}
        allMembers={allMembers}
        projectMembers={projectMembers}
        canUploadAttachment
      />
    )
  }
}

AddComment.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  content: PropTypes.string,
  avatarUrl: PropTypes.string,
  authorName: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  hasError: PropTypes.bool,
  isAdding: PropTypes.bool,
  allMembers: PropTypes.object,
  projectMembers: PropTypes.object
}
