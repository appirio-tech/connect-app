import React, {PropTypes} from 'react'
import {Editor, EditorState, RichUtils} from 'draft-js'
import {stateToHTML} from 'draft-js-export-html'
import cn from 'classnames'
import './draftjs.scss'
import { Avatar } from 'appirio-tech-react-components'
// import { Icons } from 'appirio-tech-react-components'

const styles = [
  {className: 'bold', style: 'BOLD'},
  {className: 'italic', style: 'ITALIC'},
  {className: 'underline', style: 'UNDERLINE'}
]

const blocks = [
  {className: 'ordered-list', style: 'ordered-list-item'},
  {className: 'unordered-list', style: 'unordered-list-item'},
//      {className: 'code', style: 'code-block'},
  {className: 'quote', style: 'blockquote'}
]

// const getIcon = (style) => {
//   switch (style.toLowerCase()) {
//   case 'bold':
//     return Icons.IconTcTextBold
//   case 'italic':
//     return Icons.IconTcTextItalic
//   case 'underline':
//     return Icons.IconTcTextUnderline
//   case 'ordered-list-item':
//     return Icons.IconTextListNumbers
//   case 'unordered-list-item':
//     return Icons.IconTextListBullet
//   case 'code-block': // FIXME
//     return Icons.IconTextListNumbers
//   case 'blockquote':
//     return Icons.IconTextQuote
//   }
// }
class NewPost extends React.Component {

  constructor(props) {
    super(props)
    this.state = {editorState: EditorState.createEmpty(), expandedEditor: false}
    this.onChange = (editorState) => this.setState({editorState})

    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.toggleBlockType = this.toggleBlockType.bind(this)
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
    this.onClickOutside = this.onClickOutside.bind(this)
  }

  componentDidMount() {
    document.removeEventListener('click', this.onClickOutside)
    document.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside(evt) {
    let currNode = evt.target
    let isEditor = false
    let isCloseButton = false
    const title = this.refs.title.value
    const content = stateToHTML(this.state.editorState.getCurrentContent())

    do {
      if(currNode.className
        && currNode.className.indexOf) {
        if (currNode.className.indexOf('btn-close') > -1) {
          isCloseButton = true
        }
        if (currNode.className.indexOf('new-post-composer') > -1) {
          isEditor = true
          break
        }
      }

      currNode = currNode.parentNode

      if(!currNode)
        break
    } while(currNode.tagName)

    // if any of title and content, is non empty, do not proceed
    if (!isEditor
      && !isCloseButton
      && ((title && title.length > 0) || (content && content !== '<p><br></p>'))) {
      return
    }

    if(!isEditor || isCloseButton) {
      this.setState({ expandedEditor: false })
    } else {
      this.setState({ expandedEditor: true })
    }
  }

  handleKeyCommand(command) {
    const {editorState} = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  render() {
    const {currentUser} = this.props
    const {editorState} = this.state
    const currentStyle = editorState.getCurrentInlineStyle()
    const selection = editorState.getSelection()
    let authorName = currentUser.firstName
    if (authorName && currentUser.lastName) {
      authorName += ' ' + currentUser.lastName
    }
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()


    const onPost = () => {
      // if post creation is already in progress
      if (this.props.isCreating) {
        return
      }
      const title = this.refs.title.value
      const content = stateToHTML(editorState.getCurrentContent())
      if (title && content) {
        this.props.onPost({title, content})
        this.setState({editorState: EditorState.createEmpty()})
        this.refs.title.value = ''
      }
    }

    const composerClasses = cn(
      'modal',
      'action-card',
      'new-post-composer',
      {
        expanded : this.state.expandedEditor
      }
    )

    return (
      <div className={ composerClasses }>
        {/* No need to handle click event of the close button as its already
         handled in onClickOutside handler */}
        <a href="javascript:" className="btn-close" />
        <div className="modal-title title-muted">
          NEW STATUS POST
        </div>
        <div className="modal-row">
          <div className="portrait">
            <Avatar avatarUrl={ currentUser.photoURL } userName={ authorName } />
          </div>
          <div className="object">
            <input
              ref="title"
              className="new-post-title"
              type="text"
              placeholder="Share the latest project updates with the team"
            />
            <div className="draftjs-editor tc-textarea">
              <Editor
                ref="editor"
                editorState={editorState}
                onChange={this.onChange}
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
                <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={onPost} disabled={ this.props.isCreating }>
                  { this.props.isCreating ? 'Posting...' : 'Post'  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


NewPost.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onPost: PropTypes.func.isRequired,
  isCreating: PropTypes.bool
}

export default NewPost
