import React from 'react'
import PropTypes from 'prop-types'
import Editor, {composeDecorators} from 'draft-js-plugins-editor'
import {EditorState, RichUtils} from 'draft-js'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import cn from 'classnames'
import createLinkPlugin from './LinkPlugin/LinkPlugin'
import createImagePlugin from 'draft-js-image-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
import imageUploadPlugin from './ImageUploadPlugin'
import handleDropPlugin from './HandleDropPlugin'
import AddLinkButton from './AddLinkButton'
import {getCurrentEntity} from '../../helpers/draftJSHelper'
import markdownToState from '../../helpers/markdownToState'
import stateToMarkdown from '../../helpers/stateToMarkdown'
import EditorIcons from './EditorIcons'
import './RichTextArea.scss'
import 'draft-js-mention-plugin/lib/plugin.css'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import _ from 'lodash'
import { getAvatarResized } from '../../helpers/tcHelpers'
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'
import EditLinkPopoverWrapper from './LinkPlugin/EditLinkPopoverWrapper/EditLinkPopoverWrapper'

import {
  FILE_PICKER_API_KEY,
  FILE_PICKER_CNAME, FILE_PICKER_FROM_SOURCES,
  FILE_PICKER_SUBMISSION_CONTAINER_NAME,
  PROJECT_ATTACHMENTS_FOLDER
} from '../../config/constants'
import * as filepicker from 'filestack-js'
import BtnRemove from '../../assets/icons/ui-16px-1_trash-simple.svg'
import { createTopicAttachment } from '../../api/messages'
import { withRouter } from 'react-router-dom'

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

const fileUploadClient = filepicker.init(FILE_PICKER_API_KEY, {
  cname: FILE_PICKER_CNAME
})

class RichTextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorExpanded: false,
      editorState: EditorState.createEmpty(),
      titleValue: '',
      suggestions: [],
      allSuggestions:[],
      isPrivate: false
    }

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
    this.openFileUpload = this.openFileUpload.bind(this)
    this.processUploadedFiles = this.processUploadedFiles.bind(this)
    this.getDownloadAttachmentFilename = this.getDownloadAttachmentFilename.bind(this)
    this.removeRawFile = this.removeRawFile.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.mentionPlugin = createMentionPlugin({mentionPrefix: '@'})
    this.plugins = plugins.slice(0)
    this.plugins.push(this.mentionPlugin)
  }

  componentDidMount() {
    document.removeEventListener('click', this.onClickOutside)
    document.addEventListener('click', this.onClickOutside)
  }

  componentWillMount() {
    const suggestions = _.map(_.values(this.props.projectMembers), (e) => { return {name: e.firstName + ' ' + e.lastName, handle: e.handle, userId: e.userId, link:'/users/'+e.handle} })
    const projectId = this.props.match.params.projectId
    this.setState({
      editorExpanded: this.props.editMode,
      titleValue: this.props.title || '',
      editorState: this.props.content ? EditorState.createWithContent(markdownToState(this.props.content)) : EditorState.createEmpty(),
      currentMDContent: this.props.content,
      oldMDContent: this.props.oldContent,
      suggestions,
      allSuggestions:suggestions,
      isAddLinkOpen: false,
      isAttachmentUploaderOpen: false,
      rawFiles: [],
      attachmentsStorePath: `${PROJECT_ATTACHMENTS_FOLDER}/${projectId}/`,
      files: _.cloneDeep(this.props.attachments || [])
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
        oldMDContent: nextProps.oldContent,
        files: _.cloneDeep(nextProps.attachments || [])
      })
    }
  }

  clearState() {
    this.setState({
      editorExpanded: this.props.editMode,
      titleValue: '',
      editorState: EditorState.push(this.state.editorState, EditorState.createEmpty().getCurrentContent()),
      currentMDContent: null,
      oldMDContent: null,
      isPrivate: false
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
        && currNode.className.indexOf('btn-close') > -1
      ) {
        isCloseButton = true
      }

      if (currNode.className
        && currNode.className.indexOf
        && currNode.className.indexOf('btn-close-creat') > -1
      ) {
        isCloseButton = true

        this.setState({
          titleValue: '',
          editorState: EditorState.createEmpty(),
          currentMDContent: null,
          oldMDContent: null
        })
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

    const editorExpanded = isEditor && !isCloseButton
    const isPrivate = isEditor && !isCloseButton ? this.state.isPrivate : false

    // to avoid unnecessary re-rendering on every click, only update state if any of the values is updated
    if (editorExpanded !== this.state.editorExpanded || isPrivate !== this.state.isPrivate) {
      this.setState({
        editorExpanded,
        isPrivate,
      })
    }
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
    const { isCreating, disableTitle, disableContent, onPost, canUploadAttachment } = this.props
    const { titleValue: title, currentMDContent: content, isPrivate, rawFiles, files } = this.state
    // if post creation is already in progress
    if (isCreating) {
      return
    }

    if (canUploadAttachment && rawFiles.length > 0) {
      const promises = rawFiles.map(f => createTopicAttachment(_.omit(f, ['title'])))
      Promise.all(promises)
        .then(results => {
          const rawFilesattachmentIds = results.map(content => content.result.id)
          const filesattachmentIds = files.map(f => f.id)
          const attachmentIds = [
            ...filesattachmentIds,
            ...rawFilesattachmentIds
          ]
          if ((disableTitle || title) && (disableContent || content)) {
            onPost({ title, content, isPrivate, attachmentIds })
          }
        })
    } else {
      if ((disableTitle || title) && (disableContent || content)) {
        onPost({ title, content, isPrivate, attachmentIds: files.map(f => f.id) })
      }
    }
  }
  onSearchChange({value}){
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.state.allSuggestions)
    })
  }
  onAddMention() {
  }
  onEditLink(value) {
    this.setState({
      isAddLinkOpen: value
    })
  }
  cancelEdit() {
    this.setState({
      rawFiles: []
    })
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
  openFileUpload() {
    if (fileUploadClient) {
      if (this.state.isAttachmentUploaderOpen) return
      const picker = fileUploadClient.picker({
        storeTo: {
          location: 's3',
          path: this.state.attachmentsStorePath,
          container: FILE_PICKER_SUBMISSION_CONTAINER_NAME,
          region: 'us-east-1'
        },
        maxFiles: 4,
        fromSources: FILE_PICKER_FROM_SOURCES,
        uploadInBackground: false,
        onFileUploadFinished: (files) => {
          this.processUploadedFiles(files)
        },
        onOpen: () => {
          this.setState({isAttachmentUploaderOpen: true})
        },
        onClose: () => {
          this.setState({isAttachmentUploaderOpen: false})
        }
      })

      picker.open()
    }
  }
  processUploadedFiles(fpFiles) {
    fpFiles = _.isArray(fpFiles) ? fpFiles : [fpFiles]
    let rawFiles = fpFiles.map(f => ({
      filename: f.key,
      bucket: f.container,
      title: f.filename
    }))
    if (this.state.rawFiles){
      rawFiles = this.state.rawFiles.concat(rawFiles)
    }

    this.setState({ rawFiles, editorExpanded: true })
  }
  removeRawFile(index) {
    const rawFiles = _.cloneDeep(this.state.rawFiles)
    rawFiles.splice(index, 1)
    this.setState({
      editorExpanded: true,
      rawFiles
    })
  }
  removeFile(index) {
    const files = _.cloneDeep(this.state.files)
    files.splice(index, 1)
    this.setState({
      editorExpanded: true,
      files
    })
  }
  getDownloadAttachmentFilename(attachmentOriginalFilename) {
    const regex = new RegExp(`^${_.escapeRegExp(this.state.attachmentsStorePath)}.[a-zA-Z0-9]*.(.*.)`, 'g')
    const match = regex.exec(attachmentOriginalFilename)
    return match[1]
  }
  render() {
    const {MentionSuggestions} = this.mentionPlugin
    const {className, avatarUrl, authorName, titlePlaceholder, contentPlaceholder, editMode, isCreating,
      isGettingComment, disableTitle, disableContent, expandedTitlePlaceholder, editingTopic, hasPrivateSwitch, canUploadAttachment } = this.props
    const {editorExpanded, editorState, titleValue, oldMDContent, currentMDContent, uploading, isPrivate, isAddLinkOpen, rawFiles, files} = this.state
    let canSubmit = (disableTitle || titleValue.trim())
        && (disableContent || editorState.getCurrentContent().hasText())
    if (editMode && canSubmit) {
      canSubmit = (!disableTitle && titleValue !== this.props.oldTitle) || (!disableContent && oldMDContent !== currentMDContent)
                  || rawFiles.length > 0
    }
    const currentStyle = editorState.getCurrentInlineStyle()
    const blockType = RichUtils.getCurrentBlockType(editorState)
    const currentEntity = getCurrentEntity(editorState)
    const selectionState = editorState.getSelection()
    const disableForCodeBlock = blockType === 'code-block'
    const editButtonText = editingTopic ? 'Update title' : 'Update post'

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
      <div className={cn(className, 'rich-editor', {expanded: editorExpanded || editMode}, {'is-private': isPrivate})} ref="richEditor">
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
          {avatarUrl &&
            <div className="portrait">
              <Avatar size={40} avatarUrl={getAvatarResized(avatarUrl, 40)} userName={authorName} />
            </div>
          }
          <div className={cn('object', {comment: disableTitle}, 'commentEdit')}>
            <input
              ref="title" value={titleValue}
              className={cn('new-post-title', {'hide-title': disableTitle})}
              type="text"
              onChange={this.onTitleChange}
              placeholder={editorExpanded ? expandedTitlePlaceholder : titlePlaceholder || 'Title of the post'}
            />
            <div className="draftjs-editor tc-textarea">
              {!disableContent && !isGettingComment &&
                <div>
                  <Editor
                    ref="editor"
                    placeholder={contentPlaceholder}
                    editorState={editorState}
                    onChange={this.onEditorChange}
                    handleKeyCommand={this.handleKeyCommand}
                    plugins={this.plugins}
                    setUploadState={this.setUploadState}
                    spellCheck
                  />
                  <MentionSuggestions
                    onSearchChange={this.onSearchChange.bind(this)}
                    suggestions={this.state.suggestions}
                    onAddMention={this.onAddMention}
                    entryComponent={Entry}
                  />
                  <EditLinkPopoverWrapper
                    editorState={ editorState }
                    open={ isAddLinkOpen }
                    onClose={ () => this.onEditLink(false) }
                    setEditorState={ this.setEditorState }
                    enableAutoPopover
                    enableAutoPopoverPositioning={false}
                  />
                </div>
              }
              <div className="textarea-footer">
                <div className="textarea-footer-inner">
                  <div className="textarea-footer-inner-top">
                    {!disableContent &&
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
                          onEditLink={() => this.onEditLink(true)}
                          active={currentEntity && 'LINK' === currentEntity.getType() && selectionState.isCollapsed()}
                        />
                        { allowImages && <div className="separator"/> }
                        { allowImages &&
                          <AddLinkButton
                            type={'image'}
                            getEditorState={this.getEditorState}
                            setEditorState={this.setEditorState}
                            disabled={disableForCodeBlock}
                          />
                        }
                      </div>
                    }
                    <div className="tc-btns">
                      {canUploadAttachment && <div className="tc-attachment-button" onClick={this.openFileUpload}>
                        <a>Attach a file</a>
                      </div>}
                      {hasPrivateSwitch &&
                        <SwitchButton
                          name="private-post"
                          onChange={(evt) => this.setState({isPrivate: evt.target.checked})}
                          checked={isPrivate}
                          label="Private"
                        />
                      }
                      {!editMode &&
                        <button className="tc-btn tc-btn-default tc-btn-sm btn-close-creat">Cancel</button>
                      }
                      {editMode && !isCreating &&
                      <button className="tc-btn tc-btn-default tc-btn-sm" onClick={this.cancelEdit}>
                        Cancel
                      </button>
                      }
                      { editMode &&
                    <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.onPost} disabled={!canSubmit }>
                      { isCreating ? 'Saving...' : editButtonText }
                    </button>
                      }
                      { !editMode &&
                    <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.onPost} disabled={!canSubmit }>
                      { isCreating ? 'Posting...' : 'Post' }
                    </button>
                      }
                    </div>
                  </div>
                  {canUploadAttachment && <div className="attachment-files">
                    <ul>
                      {
                        files.map((f, index) => (
                          <li key={`file-${index}`}>
                            {this.getDownloadAttachmentFilename(f.originalFileName)}
                            <div className="button-group">
                              <div className="buttons link-buttons">
                                <button onClick={() => {this.removeFile(index)}} type="button">
                                  <BtnRemove className="btn-edit"/>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      }
                      {
                        rawFiles.map((f, index) => (
                          <li key={`file-${index}`}>
                            {f.title}
                            <div className="button-group">
                              <div className="buttons link-buttons">
                                <button onClick={() => {this.removeRawFile(index)}} type="button">
                                  <BtnRemove className="btn-edit"/>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </div>}
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
  expandedTitlePlaceholder: PropTypes.string,
  onPost: PropTypes.func.isRequired,
  onPostChange: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func,
  isCreating: PropTypes.bool,
  disableTitle: PropTypes.bool,
  disableContent: PropTypes.bool,
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
  allMembers: PropTypes.object,
  projectMembers: PropTypes.object,
  editingTopic: PropTypes.bool,
  hasPrivateSwitch: PropTypes.bool,
  canUploadAttachment: PropTypes.bool,
  attachments: PropTypes.array
}

export default withRouter(RichTextArea)
