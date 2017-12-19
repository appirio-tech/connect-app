import React from 'react'
import ReactDOM from 'react-dom'
import {EditorState, RichUtils, SelectionState} from 'draft-js'
import addImage from 'draft-js-image-plugin/lib/modifiers/addImage'
import linkifyIt from 'linkify-it'
import tlds from 'tlds'
import {hasEntity, getCurrentEntity} from '../../helpers/draftJSHelper'
import EditorIcons from './EditorIcons'
import Alert from 'react-s-alert'

const linkify = linkifyIt()
linkify.tlds(tlds)

const theme = {
  modalStyles: {
    modalWrapper: 'modalWrapper',
    modalInput: 'modalInput',
    modalButton: 'modalButton',
    modalButtonWrapper: 'modalButtonWrapper',
    modalError: 'modalError'
  }
}

class LinkModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      url: props && props.url || '',
      error: null
    }
    this.onUrlChange = this.onUrlChange.bind(this)
    this.cancelError = this.cancelError.bind(this)
    this.onLink = this.onLink.bind(this)
    this.onUnlink = this.onUnlink.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.textInput).focus()
  }

  onUrlChange (event) {
    event.stopPropagation()
    const url = event.target.value
    if (url === '') { this.cancelError() }
    this.setState({url})
  }

  cancelError () {
    this.setState({error: null})
  }

  onLink (event) {
    event.preventDefault()
    const url = this.state.url
    const match = linkify.match(url)

    if (match === null) {
      this.setState({error: 'Invalid Link'})
      ReactDOM.findDOMNode(this.refs.textInput).focus()
      return
    }

    const matchedUrl = match[0].url
    this.setState({url: matchedUrl}, () => {
      ReactDOM.findDOMNode(this.refs.textInput).value = matchedUrl
    })
    if (this.props.type === 'LINK') {
      const editorState = this.props.getEditorState()
      const contentState = editorState.getCurrentContent()
      const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {url: matchedUrl})
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

      let newState = RichUtils.toggleLink(
        editorState,
        editorState.getSelection(),
        entityKey
      )
      newState = EditorState.forceSelection(
        newState, editorState.getSelection()
      )
      this.props.setEditorState(newState)
    } else if (this.props.type === 'IMAGE') {
      this.props.setEditorState(addImage(this.props.getEditorState(), matchedUrl))
    }
    this.props.closeModal()
  }

  onUnlink (event) {
    const editorState = this.props.getEditorState()
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      this.props.setEditorState(RichUtils.toggleLink(editorState, selection, null))
    }
    this.onCancel(event)
  }

  onCancel (event) {
    event.preventDefault()
    this.cancelError()
    this.props.closeModal()
  }

  onKeyDown (event) {
    if (event.key === 'Enter') {
      this.onLink(event)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      this.props.closeModal()
    }
  }

  render () {
    const { theme, showUnlink } = this.props
    const { error } = this.state
    let toolbarBackgroundStyle = { background: error ? '#e83f26' : '#fff' }
    let toolbarErrorStyle = {
      height: error ? '28px' : '0',
      paddingBottom: error ? '12px' : '0'
    }

    return (
      <div style={toolbarBackgroundStyle} className={theme.modalStyles.modalWrapper}>
        <input
          className={theme.modalStyles.modalInput}
          ref="textInput"
          type="text"
          onChange={this.onUrlChange}
          value={this.state.url}
          onKeyDown={this.onKeyDown}
          placeholder="Enter a link and press enter"
        />
        <span className={theme.modalStyles.modalButtonWrapper} >
          <button
            className={theme.modalStyles.modalButton}
            onClick={this.onLink}
            type="button"
          >
            <svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" /><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </button>

          {showUnlink &&
          <button
            className={theme.modalStyles.modalButton}
            onClick={this.onUnlink}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <g fill="currentColor" fillRule="evenodd"><path d="M15.027 11l.974.972V11z" /><path d="M22 12c0-2.754-2.24-5-5-5h-4v2h4c1.71-.095 3.1 1.3 3 3 .1 1.121-.484 2.087-1 3l1 1a5 5 0 0 0 2-4M7 7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2H7c-1.71.1-3.1-1.291-3-3-.1-1.71 1.29-3.1 3-3h3L8 7H7zM13 15.099v1.9h4c.37 0 .729-.046 1.076-.123l-1.777-1.777H13z" /><path d="M8 11v2h8v-2z" /><path d="M4.269 3l-1.27 1.27 12.658 12.657-.117-.107L19.73 21l1.269-1.27z" /></g>
            </svg>
          </button>
          }

          <button
            className={theme.modalStyles.modalButton}
            onClick={this.onCancel}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <g fill="currentColor" fillRule="evenodd"><path d="M16.95 5.636l1.414 1.414L7.05 18.364 5.636 16.95z" /><path d="M16.95 18.364l1.414-1.414L7.05 5.636 5.636 7.05z" /></g>
            </svg>
          </button>
        </span>
        {
          this.state.error &&
            <p style={toolbarErrorStyle} className={theme.modalStyles.modalError}>
              {this.state.error}
            </p>
        }
      </div>
    )
  }
}

class AddLinkModal extends React.Component {
  render () {
    const editorState = this.props.getEditorState()
    const entitySelected = hasEntity('LINK', editorState)
    const entity = getCurrentEntity(editorState)
    let entityData = null

    if (entitySelected && entity) {
      entityData = entity.getData()
    }
    let url = entityData ? entityData.url : null

    return (
      <div className={"addLinkModal"}>
        <LinkModal
          url={url}
          showUnlink={entitySelected}
          type={'LINK'}
          {...this.props}
        />
      </div>
    )
  }
}

class AddImageModal extends React.Component {
  render () {
    return (
      <div className={"addLinkModal"}>
        <LinkModal
          type={'IMAGE'}
          {...this.props}
        />
      </div>
    )
  }
}

export default class AddLinkButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = {modalVisible: false}
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.toggleAddLink = this.toggleAddLink.bind(this)
  }

  toggleAddLink() {
    const editorState = this.props.getEditorState()
    const selection = editorState.getSelection()
    if (selection.isCollapsed()) {
      Alert.error('Please select some piece of text .')
    }
    if (!selection.getHasFocus()) {
      return
    }
    if (this.props.type === 'link' && selection.isCollapsed()) {
      const currentEntity = getCurrentEntity(editorState)
      if (currentEntity && currentEntity.getType() === 'LINK') {
        return
      }

      const key = selection.getAnchorKey()
      const block = editorState
        .getCurrentContent()
        .getBlockForKey(key)
      const text = block.getText()
      const match = linkify.match(text)

      if (!match || !match.length) {
        return
      }

      const contentState = editorState.getCurrentContent()
      const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {url: match[0].url})
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

      const selectionState = SelectionState.createEmpty(key)
      const updatedSelection = selectionState.merge({
        anchorOffset: 0,
        focusOffset: block.getLength()
      })

      const newState = RichUtils.toggleLink(
        editorState,
        updatedSelection,
        entityKey
      )
      this.props.setEditorState(newState)
      return
    }

    this.show()
  }

  show() {
    this.setState({modalVisible: true})
  }

  hide() {
    this.setState({modalVisible: false})
  }

  render () {
    const { type, getEditorState, setEditorState, disabled, active } = this.props
    const { modalVisible } = this.state

    return (
      <div className={"addLinkButton"}>
        <button
          disabled={disabled}
          onMouseDown={(e) => {
            this.toggleAddLink()
            e.preventDefault()
          }}
        >
          {
            EditorIcons.render(type, active || modalVisible)
          }
        </button>
        {
          modalVisible && type === 'link' &&
          <AddLinkModal
            getEditorState={getEditorState}
            setEditorState={setEditorState}
            theme={theme}
            closeModal={this.hide}
          />
        }
        {
          modalVisible && type === 'image' &&
          <AddImageModal
            getEditorState={getEditorState}
            setEditorState={setEditorState}
            theme={theme}
            closeModal={this.hide}
          />
        }
      </div>
    )
  }
}
