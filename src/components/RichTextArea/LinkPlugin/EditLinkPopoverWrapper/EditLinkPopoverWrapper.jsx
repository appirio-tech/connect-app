import React from 'react'
import { isEqual, last } from 'lodash'
import { RichUtils, SelectionState, EditorState } from 'draft-js'
import {
  getSelectionBlock,
  getEntityAt,
  updateLink,
  removeLink,
  applyLink,
  insertLink,
  getEntityForKey,
  applyMultiLineLink,
  updateMultilineLink,
  getEntityOffsets,
  removeHighlight
} from '../utils/utils'
import EditLinkPopover from '../EditLinkPopover/EditLinkPopover'

/**
 * A wrapper component that detects editor state changes and shows/hides the popover as required
 */
export default class EditLinkPopoverWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      editing: false,
      entity: null,
      entityKey: null,
      focusUrl: false,
      focusText: false,
      autoPopover: false,
      popoverOnTop: false
    }

    this.lastEditorState = null
    this.lastCreatedEntity = null
    this.lastEditorStateCheckpoint = null
    this.lastOpenState = null
    this.lastSelectionState = null

    this.openTimeout = null
    this.updatingLink = false

    this.multiLineEditing = false
    this.multiLineEntities = []
    this.multiLineSelections = []

    this.onKeyup = this.onKeyup.bind(this)
    this.onKeydown = this.onKeydown.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const { editorState, open } = newProps

    if (open && this.lastOpenState !== open) {
      // If link button is clicked from the toolbar
      this.storeLastValues(open, editorState)
      this.onExternalEditCommand(editorState)
    } else if (!open && editorState !== this.lastEditorState) {
      // If editor state changed
      const lastCreatedEntity = this.lastCreatedEntity

      this.storeLastValues(open, editorState)
      this.onEditorStateChange(editorState, lastCreatedEntity)
    } else {
      this.storeLastValues(open, editorState)
    }
  }

  // We have to store the last values to detect the significant changes.
  storeLastValues(open, editorState) {
    const contentState = editorState.getCurrentContent()
    this.lastCreatedEntity = contentState.getLastCreatedEntityKey()

    this.lastOpenState = open
    this.lastEditorState = editorState
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('keyup', this.onKeyup)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('keyup', this.onKeyup)
  }

  onKeyup(evt) {
    // Escape should close the popover without committing any changes
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.hideEditWithoutSaving()
      this.setState({
        autoPopover: false,
        popoverOnTop: false
      })
    } else if (evt.key === 'Backspace') {
      // Backspace should close the popover as it may delete the created link entity
      this.setState({
        autoPopover: false,
        popoverOnTop: false
      })
    } else if (evt.key === 'Enter') {
      // When we press enter, the auto popover can block the view of new line. So, push it above the link
      this.setState({
        popoverOnTop: true
      })
    }
  }

  onKeydown(evt) {
    // When ctrl + k or cmd + k is pressed while some text is selected, open popover
    if (
      (evt.ctrlKey || evt.metaKey) &&
      evt.key &&
      evt.key.toLowerCase() === 'k'
    ) {
      // Some browsers use ctrl + k for triggering a google search. Prevent it.
      evt.preventDefault()

      const { editorState, open } = this.props
      const selectionState = editorState.getSelection()
      const hasFocus = selectionState.getHasFocus()
      const textSelected = !selectionState.isCollapsed()

      // All the post editors will receive the event. So, check focus.
      if (hasFocus && textSelected) {
        this.storeLastValues(open, editorState)
        this.onExternalEditCommand(editorState)
      }
    }
  }

  /**
   * Invoked when user types / deletes the content or moves the cursor around
   * @param {Object} editorState the current editor state
   * @param {string} prevLastCreatedEntityKey The key for the entity created before the last one
   */
  onEditorStateChange(editorState, prevLastCreatedEntityKey) {
    const selectionState = editorState.getSelection()

    // If cursor moved
    if (
      this.isSelectionChanged(selectionState) &&
      selectionState.getHasFocus()
    ) {
      const contentState = editorState.getCurrentContent()

      const startBlock = getSelectionBlock(selectionState, contentState)
      const endBlock = getSelectionBlock(selectionState, contentState, true)

      const selectionStart = selectionState.getStartOffset()
      const selectionEnd = selectionState.getEndOffset()

      const startEntity = getEntityAt(startBlock, contentState, selectionStart)
      const endEntity = getEntityAt(
        endBlock,
        contentState,
        selectionState.isCollapsed() ? selectionEnd : selectionEnd - 1
      )

      // If the cursor is on a link or whole/part of the link is selected
      if (
        startEntity &&
        endEntity === startEntity &&
        startEntity.getType() === 'LINK'
      ) {
        this.editExistingLink(
          startBlock.getEntityAt(selectionStart),
          contentState
        )
      } else if (selectionState.isCollapsed()) {
        const lastCreatedEntityKey = contentState.getLastCreatedEntityKey()
        const lastCreatedEntity = getEntityForKey(
          contentState,
          lastCreatedEntityKey
        )

        const entityData = lastCreatedEntity && lastCreatedEntity.getData()
        const entityType = lastCreatedEntity && lastCreatedEntity.getType()
        const newEntityCreated =
          lastCreatedEntityKey &&
          prevLastCreatedEntityKey !== lastCreatedEntityKey

        // If a new link entity created, auto show the popover
        if (
          newEntityCreated &&
          entityType === 'LINK' &&
          entityData &&
          entityData.url
        ) {
          this.openAutoPopover(lastCreatedEntityKey, contentState)

          // If enter is pressed, the cursor would be in the start of the line. So, text till cursor will be empty ('')
          const isEnter = !endBlock.getText().slice(0, selectionEnd)
          if (!isEnter) {
            this.setState({
              popoverOnTop: false
            })
          }
        } else {
          this.hideEdit()
        }
      } else {
        this.hideEdit()
      }
    }
  }

  /**
   * Invoked when the link button from the toolbar is clicked
   * @param {Object} editorState The current editor state
   */
  onExternalEditCommand(editorState) {
    this.lastEditorStateCheckpoint = editorState
    editorState = RichUtils.toggleInlineStyle(editorState, 'LINKHIGHLIGHT')

    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()

    const startBlock = getSelectionBlock(selectionState, contentState)
    const endBlock = getSelectionBlock(selectionState, contentState, true)

    const selectionStart = selectionState.getStartOffset()
    const selectionEnd = selectionState.getEndOffset()

    const startEntity = getEntityAt(startBlock, contentState, selectionStart)
    const endEntity = getEntityAt(endBlock, contentState, selectionEnd - 1)

    // Cursor in single link. Should remove the link
    if (
      startEntity &&
      endEntity === startEntity &&
      startEntity.getType() === 'LINK'
    ) {
      const { url, text } = startEntity.getData()
      this.onRemove({ url, text })
      this.hideEdit()
      this.props.onClose()
    } else {
      // Cursor not on a link.

      // Selection is on a single line
      if (selectionState.getStartKey() === selectionState.getEndKey()) {
        const textSelected = !selectionState.isCollapsed()

        // Apply placeholder links
        const { updatedState, entityKey, contentStateWithEntity } = textSelected
          ? applyLink(editorState, contentState, selectionState) // apply link to selected text
          : insertLink(editorState, contentState, selectionState) // insert link at curosr position

        this.setEditorState(updatedState)

        // Wait for the editor to accept the updatedState
        setTimeout(() => {
          const selectionState = updatedState.getSelection()
          const contentState = updatedState.getCurrentContent()
          const startBlock = getSelectionBlock(selectionState, contentState)
          const selectionStart = selectionState.getStartOffset()

          const entity = getEntityAt(
            startBlock,
            contentStateWithEntity,
            selectionStart
          )
          this.setState({
            isOpen: true,
            entity,
            entityKey,
            editing: true,
            [textSelected ? 'focusUrl' : 'focusText']: true
          })
        })
      } else {
        //  Selection is multiline
        const {
          entityKeys,
          updatedState,
          selectionStates
        } = applyMultiLineLink(editorState, contentState, selectionState)

        this.setEditorState(updatedState)

        // Wait for the editor to accept the updatedState
        setTimeout(() => {
          const contentState = updatedState.getCurrentContent()

          this.multiLineEditing = true
          this.multiLineEntities = entityKeys.map(key =>
            getEntityForKey(contentState, key)
          )
          this.multiLineSelections = selectionStates

          const entity = last(this.multiLineEntities)
          this.setState({
            isOpen: true,
            entity,
            entityKey: last(entityKeys),
            editing: true,
            focusUrl: true
          })
        })
      }
    }
  }

  /**
   * Opens the auto popover when a new link is created automatically
   * @param {string} lastCreatedEntityKey the key of the last created entity
   * @param {Object} contentState the content state of the editor
   */
  openAutoPopover(lastCreatedEntityKey, contentState) {
    const { enableAutoPopover } = this.props
    if (enableAutoPopover) {
      const autoShowing = true
      this.editExistingLink(lastCreatedEntityKey, contentState, autoShowing)
    }
  }

  /**
   * Opens the popover for the link under cursor (OR) Opens the popover for the last created link
   * @param {string} entityKey key of the link entity being edited
   * @param {Object} contentState the content state of the editor
   * @param {boolean} autoPopover Is the popover opening automatically
   */
  editExistingLink(entityKey, contentState, autoPopover) {
    this.clearOpenTimeout()

    // to avoid flickering where draftjs cursor position goes to last position when focused
    this.openTimeout = setTimeout(() => {
      const entity = getEntityForKey(contentState, entityKey)
      this.updatingLink = true

      this.setState({
        isOpen: true,
        focusText: true,
        entity,
        entityKey,
        autoPopover
      })
    }, 150)
  }

  clearOpenTimeout() {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout)
      this.openTimeout = null
    }
  }

  hideEditWithoutSaving() {
    if (this.lastEditorStateCheckpoint) {
      this.setEditorState(this.lastEditorStateCheckpoint)
    }
    this.hideEdit()
  }

  hideEdit() {
    this.clearOpenTimeout()

    if (this.props.open) {
      this.props.onClose()
    }

    this.multiLineEditing = false
    this.lastEditorStateCheckpoint = null
    this.updatingLink = false
    this.setState({
      isOpen: false,
      editing: false,
      focusText: false,
      focusUrl: false
    })
  }

  isSelectionChanged(selectionState) {
    const currentSelection = this.getSelectionProps(selectionState)
    if (!isEqual(this.lastSelectionState, currentSelection)) {
      this.lastSelectionState = currentSelection
      return true
    }

    return false
  }

  getSelectionProps(selectionState) {
    return (
      selectionState && {
        selectionStartKey: selectionState.getStartKey(),
        selectionEndKey: selectionState.getEndKey(),
        selectionStartOffset: selectionState.getStartOffset(),
        selectionEndOffset: selectionState.getEndOffset(),
        hasFocus: selectionState.getHasFocus()
      }
    )
  }

  onRemove(data) {
    const { editorState } = this.props
    const { entityKey } = this.state
    const updatedEditorState = removeLink(editorState, entityKey, data)

    this.setEditorState(updatedEditorState)
    this.setState({
      entity: null,
      entityKey: null,
      autoPopover: false,
      popoverOnTop: false
    })
    this.hideEdit()
  }

  onUpdate(entityData) {
    const { editorState } = this.props
    let updatedEditorState = editorState
    if (this.multiLineEditing) {
      updatedEditorState = updateMultilineLink(
        this.lastEditorStateCheckpoint,
        entityData,
        this.multiLineEntities,
        this.multiLineSelections
      )
    } else {
      const { entityKey } = this.state
      updatedEditorState = updateLink(
        editorState,
        editorState.getCurrentContent(),
        entityKey,
        entityData
      )
    }

    this.setEditorState(updatedEditorState)

    this.hideEdit()
    this.setState({
      autoPopover: false,
      popoverOnTop: false
    })

    const currentEditorState = updatedEditorState
    const afterRemoval = removeHighlight(currentEditorState)
    if (currentEditorState !== afterRemoval) {
      this.setEditorState(afterRemoval)
    }
  }

  onEdit() {
    const { editorState } = this.props
    this.lastEditorStateCheckpoint = editorState

    const { entityKey } = this.state
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const block = getSelectionBlock(selectionState, contentState)

    const [startOffset, endOffset] = getEntityOffsets(block, entityKey)
    const selection = SelectionState.createEmpty(block.key).merge({
      anchorOffset: startOffset,
      focusOffset: endOffset
    })

    this.props.setEditorState(
      RichUtils.toggleInlineStyle(
        EditorState.forceSelection(editorState, selection),
        'LINKHIGHLIGHT'
      )
    )
  }

  setEditorState(state) {
    if (state) {
      this.props.setEditorState(state)
    }
  }

  onOutsideClick() {
    this.hideEditWithoutSaving()
    this.setState({
      autoPopover: false,
      popoverOnTop: false
    })
  }

  render() {
    const {
      isOpen,
      entity,
      entityKey,
      editing,
      focusText,
      focusUrl,
      popoverOnTop,
      autoPopover
    } = this.state

    const { enableAutoPopoverPositioning } = this.props

    const { el, url, text } = entity ? entity.getData() : {}
    return isOpen || autoPopover ? (
      <EditLinkPopover
        anchorEl={el && el()}
        url={url}
        text={text}
        entityKey={entityKey}
        onEdit={() => this.onEdit()}
        onRemove={() => this.onRemove({ url, text })}
        onUpdate={entityData => this.onUpdate(entityData)}
        onOutsideClick={() => this.onOutsideClick()}
        close={() => this.hideEdit()}
        editing={editing}
        focusText={focusText}
        focusUrl={focusUrl}
        multiLineEdit={this.multiLineEditing}
        popoverOnTop={popoverOnTop && enableAutoPopoverPositioning}
      />
    ) : null
  }
}
