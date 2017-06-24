

import React, {PropTypes} from 'react'
import {Editor, EditorState, RichUtils} from 'draft-js'
import {stateToMarkdown} from 'draft-js-export-markdown'
import {stateToHTML} from 'draft-js-export-html'
import {stateFromHTML} from 'draft-js-import-html'
import { Avatar } from 'appirio-tech-react-components'
import cn from 'classnames'
import './RichTextArea.scss'

const styles = [
  {className: 'bold', style: 'BOLD'},
  {className: 'italic', style: 'ITALIC'}
]

const blocks = [
  {className: 'ordered-list', style: 'ordered-list-item'},
  {className: 'unordered-list', style: 'unordered-list-item'},
  {className: 'quote', style: 'blockquote'}
]

class RichTextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editorExpanded: false, editorState: EditorState.createEmpty(), titleValue: ''}
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onEditorChange = this.onEditorChange.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.toggleBlockType = this.toggleBlockType.bind(this)
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
    this.onClickOutside = this.onClickOutside.bind(this)
    this.onPost = this.onPost.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.clearState = this.clearState.bind(this)
  }

  componentDidMount() {
    document.removeEventListener('click', this.onClickOutside)
    document.addEventListener('click', this.onClickOutside)

    this.setState({
      editorExpanded: this.props.editMode,
      titleValue: this.props.title || ''
    })

    if (this.props.content) {
      const htmlState = stateFromHTML(this.props.content)
      this.setState({
        editorState: EditorState.createWithContent(htmlState),
        currentHtmlContent: stateToHTML(htmlState)
      })
    } else {
      this.setState({
        editorState: EditorState.createEmpty()
      })
    }

    if (this.props.oldContent) {
      this.setState({oldHtmlContent: stateToHTML(stateFromHTML(this.props.oldContent))})
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCreating !== this.props.isCreating && !nextProps.isCreating && !nextProps.hasError) {
      this.clearState()
    }
  }

  clearState() {
    this.setState({
      editorExpanded: this.props.editMode,
      titleValue: '',
      editorState: EditorState.createEmpty()
    })
  }

  onClickOutside(evt) {
    if (this.props.editMode) {
      return
    }

    let currNode = evt.target
    let isEditor = false
    let isCloseButton = false
    const title = this.state.titleValue
    const hasContent = (title && title.trim().length > 0) || this.state.editorState.getCurrentContent().hasText()

    do {
      if (currNode.className
        && currNode.className.indexOf
        && currNode.className.indexOf('btn-close') > -1) {
        isCloseButton = true
      }

      if (currNode === this.refs.richEditor) {
        isEditor = true
        break
      }

      currNode = currNode.parentNode

      if (!currNode)
        break
    } while(currNode.tagName)

    // if editor has content, do not proceed
    if (!isEditor && !isCloseButton && hasContent) {
      return
    }
    this.setState({editorExpanded: isEditor && !isCloseButton})
  }

  handleKeyCommand(command) {
    const {editorState} = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onEditorChange(newState)
      return true
    }
    return false
  }

  toggleBlockType(blockType) {
    this.onEditorChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  toggleInlineStyle(inlineStyle) {
    this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  onEditorChange(editorState) {
    const htmlContent = editorState.getCurrentContent().hasText() ? stateToHTML(editorState.getCurrentContent()) : ''
    this.setState({
      editorState,
      currentHtmlContent: htmlContent
    })
    if (this.props.onPostChange) {
      this.props.onPostChange(this.state.titleValue, htmlContent)
    }
  }

  onTitleChange() {
    this.setState({titleValue: this.refs.title.value})
    if (this.props.onPostChange) {
      this.props.onPostChange(this.refs.title.value, this.state.currentHtmlContent)
    }
  }

  onPost() {
    // if post creation is already in progress
    if (this.props.isCreating) {
      return
    }
    const title = this.state.titleValue
    const content = stateToMarkdown(this.state.editorState.getCurrentContent())
    if ((this.props.disableTitle || title) && content) {
      this.props.onPost({title, content})
    }
  }

  cancelEdit() {
    this.props.cancelEdit()
  }

  render() {
    const {className, avatarUrl, authorName, titlePlaceholder, contentPlaceholder, editMode, isCreating, disableTitle} = this.props
    const {editorExpanded, editorState, titleValue, oldHtmlContent, currentHtmlContent} = this.state
    let canSubmit = (disableTitle || titleValue.trim())
        && editorState.getCurrentContent().hasText()
    if (editMode && canSubmit) {
      canSubmit = (!disableTitle && titleValue !== this.props.oldTitle) || oldHtmlContent !== currentHtmlContent
    }
    const currentStyle = editorState.getCurrentInlineStyle()
    const selection = editorState.getSelection()
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()

    return (
      <div className={cn(className, 'rich-editor', {expanded: editorExpanded || editMode})} ref="richEditor">
        {isCreating &&
         <div className="editing-layer">
         </div> 
        }
        <a href="javascript:" className="btn-close" />
        <div className="modal-row">
          <div className="portrait">
            <Avatar avatarUrl={avatarUrl} userName={authorName} />
          </div>
          <div className={cn('object', {comment: disableTitle})}>
            <input
              ref="title" value={titleValue}
              className={cn('new-post-title', {'hide-title': disableTitle})}
              type="text"
              onChange={this.onTitleChange}
              placeholder={titlePlaceholder || 'Title of the post'}
            />
            <div className="draftjs-editor tc-textarea">
              <Editor
                ref="editor"
                placeholder={contentPlaceholder}
                editorState={editorState}
                onChange={this.onEditorChange}
                handleKeyCommand={this.handleKeyCommand}
              />
              <div className="textarea-footer">
                <div className="textarea-buttons">
                  {/* TODO use Icon components */}
                  {styles.map((item) =>
                    <button
                      key={item.style}
                      className={cn(item.className, {active: currentStyle.has(item.style)})}
                      onMouseDown={(e) => {
                        this.toggleInlineStyle(item.style)
                        e.preventDefault()
                      }}
                    />)}
                  <div className="separator"/>
                  {/* TODO use Icon components */}
                  {blocks.map((item) =>
                    <button
                      key={item.style}
                      className={cn(item.className, {active: item.style === blockType})}
                      onMouseDown={(e) => {
                        this.toggleBlockType(item.style)
                        e.preventDefault()
                      }}
                    />)}
                  {/*<div className="separator"/>
                  <button className="attach"/>*/}
                </div>
                <div className="tc-btns">
                { editMode && !isCreating &&
                <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.cancelEdit}>
                  Cancel
                </button>
                }
                { editMode &&
                <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.onPost} disabled={!canSubmit }>
                  { isCreating ? 'Saving...' : 'Save changes' }
                </button>
                }
                { !editMode &&
                <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.onPost} disabled={!canSubmit }>
                  { isCreating ? 'Posting...' : 'Post' }
                </button>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

RichTextArea.propTypes = {
  onPost: PropTypes.func.isRequired,
  onPostChange: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func,
  isCreating: PropTypes.bool,
  disableTitle: PropTypes.bool,
  editMode:PropTypes.bool,
  hasError: PropTypes.bool,
  avatarUrl: PropTypes.string,
  authorName: PropTypes.string,
  className: PropTypes.string,
  titlePlaceholder: PropTypes.string,
  contentPlaceholder: PropTypes.string,
  oldTitle: PropTypes.string,
  oldContent: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string
}

export default RichTextArea
