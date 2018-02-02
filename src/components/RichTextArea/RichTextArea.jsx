import React from 'react'
import PropTypes from 'prop-types'
import Editor, {composeDecorators} from 'draft-js-plugins-editor'
import {EditorState, RichUtils} from 'draft-js'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import cn from 'classnames'
import createLinkPlugin from 'draft-js-link-plugin'
import createImagePlugin from 'draft-js-image-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
import imageUploadPlugin from './ImageUploadPlugin'
import handleDropPlugin from './HandleDropPlugin'
import AddLinkButton from './AddLinkButton'
import {getCurrentEntity} from '../../helpers/draftJSHelper'
import markdownToState from '../../helpers/markdownToState'
import stateToMarkdown from '../../helpers/stateToMarkdown'
import 'draft-js-link-plugin/lib/plugin.css'
import EditorIcons from './EditorIcons'
import './RichTextArea.scss'
import 'draft-js-mention-plugin/lib/plugin.css'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'

const linkPlugin = createLinkPlugin()
const blockDndPlugin = createBlockDndPlugin()

const decorator = composeDecorators(
  blockDndPlugin.decorator
)
const allowImages = false
const plugins = [linkPlugin, blockDndPlugin]
if (allowImages){
  const imagePlugin = createImagePlugin({ decorator })
  plugins.push(handleDropPlugin)
  plugins.push(imagePlugin)
  plugins.push(imageUploadPlugin)
}



const styles = [
  {className: 'bold', style: 'BOLD'},
  {className: 'italic', style: 'ITALIC'},
  {className: 'underline', style: 'UNDERLINE'}
]

const blocks = [
  {className: 'ordered-list', style: 'ordered-list-item'},
  {className: 'unordered-list', style: 'unordered-list-item'},
  {className: 'quote', style: 'blockquote'},
  {className: 'code', style: 'code-block'}
]

class RichTextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editorExpanded: false, editorState: EditorState.createEmpty(), titleValue: '', suggestions: [], allSuggestions:[]}
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onEditorChange = this.onEditorChange.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.toggleBlockType = this.toggleBlockType.bind(this)
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
    this.onClickOutside = this.onClickOutside.bind(this)
    this.onPost = this.onPost.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.clearState = this.clearState.bind(this)
    this.getEditorState = this.getEditorState.bind(this)
    this.setEditorState = this.setEditorState.bind(this)
    this.setUploadState = this.setUploadState.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onAddMention = this.onAddMention.bind(this)
    this.mentionPlugin = createMentionPlugin({mentionPrefix: '@'})
    this.plugins = plugins.slice(0)
    this.plugins.push(this.mentionPlugin)
  }

  componentDidMount() {
    document.removeEventListener('click', this.onClickOutside)
    document.addEventListener('click', this.onClickOutside)
  }

  componentWillMount() {
    const suggestions = Object.values(this.props.allMembers).map((e) => { return {name: e.firstName + ' ' + e.lastName, handle: e.handle, userId: e.userId, link:'/users/'+e.handle} })
    this.setState({
      editorExpanded: this.props.editMode,
      titleValue: this.props.title || '',
      editorState: this.props.content ? EditorState.createWithContent(markdownToState(this.props.content)) : EditorState.createEmpty(),
      currentMDContent: this.props.content,
      oldMDContent: this.props.oldContent,
      suggestions,
      allSuggestions:suggestions
    })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.isCreating !== this.props.isCreating && !nextProps.isCreating && !nextProps.hasError) {
      this.clearState()
    } else if ((nextProps.isGettingComment !== this.props.isGettingComment && !nextProps.isGettingComment)
      || (nextProps.messageId !== this.props.messageId)) {
      const editorState = EditorState.push(this.state.editorState, nextProps.content ? markdownToState(nextProps.content) : EditorState.createEmpty().getCurrentContent())
      this.setState({
        editorExpanded: nextProps.editMode,
        titleValue: nextProps.title || '',
        editorState,
        currentMDContent: nextProps.content,
        oldMDContent: nextProps.oldContent
      })
    }
  }

  clearState() {
    this.setState({
      editorExpanded: this.props.editMode,
      titleValue: '',
      editorState: EditorState.push(this.state.editorState, EditorState.createEmpty().getCurrentContent()),
      currentMDContent: null,
      oldMDContent: null
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
      return 'handled'
    }
    return 'not-handled'
  }

  toggleBlockType(blockType) {
    if (!this.state.editorState.getSelection().getHasFocus()) {
      return
    }
    this.onEditorChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  toggleInlineStyle(inlineStyle) {
    if (!this.state.editorState.getSelection().getHasFocus()) {
      return
    }
    this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  onEditorChange(editorState) {
    this.setState({
      editorState
    })
    if (!this.refs.richEditor) {
      return
    }
    const prevMDContent = this.state.currentMDContent
    const mdContent = editorState.getCurrentContent().hasText() ? stateToMarkdown(editorState.getCurrentContent()) : ''
    this.setState({
      currentMDContent: mdContent
    })
    if (this.props.onPostChange && prevMDContent !== mdContent) {
      this.props.onPostChange(this.state.titleValue, mdContent)
    }
  }

  onTitleChange() {
    this.setState({titleValue: this.refs.title.value})
    if (this.props.onPostChange) {
      this.props.onPostChange(this.refs.title.value, this.state.currentMDContent)
    }
  }

  onPost() {
    // if post creation is already in progress
    if (this.props.isCreating) {
      return
    }
    const title = this.state.titleValue

    const content = this.state.currentMDContent

    if ((this.props.disableTitle || title) && content) {
      this.props.onPost({title, content})
    }
  }
  onSearchChange({value}){
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.state.allSuggestions)
    })
  }
  onAddMention() {
  }
  cancelEdit() {
    this.props.cancelEdit()
  }
  getEditorState() {
    return this.state.editorState
  }
  setEditorState(editorState) {
    this.onEditorChange(editorState)
  }
  setUploadState(uploading) {
    this.setState({uploading})
  }
  render() {
    const {MentionSuggestions} = this.mentionPlugin
    const {className, avatarUrl, authorName, titlePlaceholder, contentPlaceholder, editMode, isCreating, isGettingComment, disableTitle} = this.props
    const {editorExpanded, editorState, titleValue, oldMDContent, currentMDContent, uploading} = this.state
    let canSubmit = (disableTitle || titleValue.trim())
        && editorState.getCurrentContent().hasText()
    if (editMode && canSubmit) {
      canSubmit = (!disableTitle && titleValue !== this.props.oldTitle) || oldMDContent !== currentMDContent
    }
    const currentStyle = editorState.getCurrentInlineStyle()
    const blockType = RichUtils.getCurrentBlockType(editorState)
    const currentEntity = getCurrentEntity(editorState)
    const disableForCodeBlock = blockType === 'code-block'

    const Entry = (props) => {
      const {
        mention,
        theme,
        searchValue, // eslint-disable-line no-unused-vars
        isFocused, // eslint-disable-line no-unused-vars
        ...parentProps
      } = props

      return (
        <div {...parentProps}>
          <div className={theme.mentionSuggestionsEntryContainer}>
            <div className={theme.mentionSuggestionsEntryContainerRight}>
              <div className={theme.mentionSuggestionsEntryText}>
                {mention.get('name') +' - '+mention.get('handle')}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={cn(className, 'rich-editor', {expanded: editorExpanded || editMode})} ref="richEditor">
        {(isCreating || isGettingComment) &&
         <div className="editing-layer" />
        }
        {uploading &&
         <div className="editing-layer">
           <div>Uploading image {uploading}%</div>
         </div>
        }
        <a href="javascript:" className="btn-close" />
        <div className="modal-row">
          <div className="portrait">
            <Avatar avatarUrl={avatarUrl} userName={authorName} />
          </div>
          <div className={cn('object', {comment: disableTitle}, 'commentEdit')}>
            <input
              ref="title" value={titleValue}
              className={cn('new-post-title', {'hide-title': disableTitle})}
              type="text"
              onChange={this.onTitleChange}
              placeholder={titlePlaceholder || 'Title of the post'}
            />
            <div className="draftjs-editor tc-textarea">
              {!isGettingComment &&
                <div>
                  <Editor
                    ref="editor"
                    placeholder={contentPlaceholder}
                    editorState={editorState}
                    onChange={this.onEditorChange}
                    handleKeyCommand={this.handleKeyCommand}
                    plugins={this.plugins}
                    setUploadState={this.setUploadState}
                  />
                  <MentionSuggestions
                    onSearchChange={this.onSearchChange.bind(this)}
                    suggestions={this.state.suggestions}
                    onAddMention={this.onAddMention}
                    entryComponent={Entry}
                  />
                </div>
              }
              <div className="textarea-footer">
                <div className="textarea-buttons">
                  {styles.map((item) => (
                    <button
                      key={item.style}
                      disabled={disableForCodeBlock}
                      onMouseDown={(e) => {
                        this.toggleInlineStyle(item.style)
                        e.preventDefault()
                      }}
                    >
                      {
                        EditorIcons.render(item.className, currentStyle.has(item.style))
                      }
                    </button>
                  ))}
                  <div className="separator"/>
                  {blocks.map((item) => (
                    <button
                      disabled={item.style !== 'code-block' && disableForCodeBlock}
                      key={item.style}
                      onMouseDown={(e) => {
                        this.toggleBlockType(item.style)
                        e.preventDefault()
                      }}
                    >
                      {
                        EditorIcons.render(item.className, item.style === blockType)
                      }
                    </button>
                  ))}
                  <AddLinkButton
                    type={'link'}
                    getEditorState={this.getEditorState}
                    setEditorState={this.setEditorState}
                    disabled={disableForCodeBlock}
                    active={currentEntity && 'LINK' === currentEntity.getType()}
                  />
                  <div className="separator"/>
                  { allowImages &&
                    <AddLinkButton
                      type={'image'}
                      getEditorState={this.getEditorState}
                      setEditorState={this.setEditorState}
                      disabled={disableForCodeBlock}
                    />
                  }
                </div>
                <div className="tc-btns">
                  { editMode && !isCreating &&
                <button className="tc-btn tc-btn-link tc-btn-sm" onClick={this.cancelEdit}>
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
  content: PropTypes.string,
  allMembers: PropTypes.object
}

export default RichTextArea
